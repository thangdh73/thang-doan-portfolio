"""
PP Reference Retrieval API - single Vercel Python function.

Routes (dispatched from /api/pp/*):
  GET  /api/pp/search?q=<query>&k=<n>       full-text search (FTS5/BM25)
  GET  /api/pp/fetch?path=<doc>&frm=<i>&to=<i>  chunk texts of one document
  GET  /api/pp/docs                          list indexed documents
  GET  /api/pp/openapi.json                  OpenAPI schema (for GPT Actions)
  POST /api/pp/mcp                           MCP Streamable HTTP (JSON-RPC)

Auth: PP_API_KEY env var. Accepted as 'Authorization: Bearer <key>',
'X-Api-Key: <key>' header, or '?key=<key>' query parameter.
openapi.json is public (contains no data).
"""
import json, os, re, sqlite3
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "pp_index.db")
PROTOCOL_VERSION = "2025-03-26"
SERVER_INFO = {"name": "pp-reference-retrieval", "version": "1.0.0"}

TOOLS = [
    {
        "name": "search_references",
        "description": ("Full-text search over Thang's petrophysical reference "
                        "library (78 documents: shaly-sand courses, SPE cut-off "
                        "papers, Passey thin-bed, IRM uncertainty handbook, field "
                        "studies, calibration spreadsheets). Returns best-matching "
                        "passages with source document and page. Use quoted "
                        "phrases for exact terms, e.g. \"Waxman-Smits\"."),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search terms (FTS5 syntax: AND OR NOT, \"quoted phrases\")"},
                "max_results": {"type": "integer", "description": "Max passages to return (default 8)"},
            },
            "required": ["query"],
        },
    },
    {
        "name": "fetch_pages",
        "description": ("Fetch the text of consecutive chunks (pages/parts/sheets) "
                        "of one document, identified by its 'path' as returned by "
                        "search_references. Use to read context around a hit."),
        "inputSchema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Document path from search results"},
                "frm": {"type": "integer", "description": "First chunk number (1-based, default 1)"},
                "to": {"type": "integer", "description": "Last chunk number (default frm+4, max 20 chunks)"},
            },
            "required": ["path"],
        },
    },
    {
        "name": "list_documents",
        "description": "List all indexed documents (path, title, type, chunk count).",
        "inputSchema": {"type": "object", "properties": {}},
    },
]

def db():
    return sqlite3.connect(f"file:{os.path.abspath(DB_PATH)}?mode=ro", uri=True)

def do_search(query, k=8):
    k = max(1, min(int(k or 8), 25))
    try:
        rows = db().execute(
            "SELECT title, path, loc, snippet(chunks, 0, '[', ']', ' ... ', 40) "
            "FROM chunks WHERE chunks MATCH ? ORDER BY rank LIMIT ?", (query, k)).fetchall()
    except sqlite3.OperationalError:
        safe = " ".join(f'"{t}"' for t in re.findall(r"[\w\-\.]+", query))
        rows = db().execute(
            "SELECT title, path, loc, snippet(chunks, 0, '[', ']', ' ... ', 40) "
            "FROM chunks WHERE chunks MATCH ? ORDER BY rank LIMIT ?", (safe, k)).fetchall()
    return [{"title": t, "path": p, "loc": l, "snippet": s} for t, p, l, s in rows]

def do_fetch(path, frm=1, to=None):
    frm = max(1, int(frm or 1))
    to = int(to) if to else frm + 4
    to = min(to, frm + 19)
    rows = db().execute(
        "SELECT loc, content FROM chunks WHERE path = ? LIMIT ? OFFSET ?",
        (path, to - frm + 1, frm - 1)).fetchall()
    return [{"loc": l, "text": c} for l, c in rows]

def do_docs():
    rows = db().execute("SELECT path, title, type, n_chunks FROM docs ORDER BY path").fetchall()
    return [{"path": p, "title": t, "type": ty, "chunks": n} for p, t, ty, n in rows]

def openapi(host):
    base = f"https://{host}" if host else "https://example.vercel.app"
    return {
        "openapi": "3.1.0",
        "info": {"title": "PP Reference Retrieval", "version": "1.0.0",
                 "description": "Search and fetch passages from a private petrophysical reference library."},
        "servers": [{"url": base}],
        "components": {"securitySchemes": {"ApiKeyAuth": {"type": "apiKey", "in": "header", "name": "X-Api-Key"}}},
        "security": [{"ApiKeyAuth": []}],
        "paths": {
            "/api/pp/search": {"get": {
                "operationId": "searchReferences",
                "summary": "Full-text search of the reference library",
                "parameters": [
                    {"name": "q", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "k", "in": "query", "required": False, "schema": {"type": "integer", "default": 8}}],
                "responses": {"200": {"description": "Matching passages"}}}},
            "/api/pp/fetch": {"get": {
                "operationId": "fetchPages",
                "summary": "Fetch chunk texts of one document",
                "parameters": [
                    {"name": "path", "in": "query", "required": True, "schema": {"type": "string"}},
                    {"name": "frm", "in": "query", "required": False, "schema": {"type": "integer", "default": 1}},
                    {"name": "to", "in": "query", "required": False, "schema": {"type": "integer"}}],
                "responses": {"200": {"description": "Chunk texts"}}}},
            "/api/pp/docs": {"get": {
                "operationId": "listDocuments",
                "summary": "List indexed documents",
                "parameters": [],
                "responses": {"200": {"description": "Document inventory"}}}},
        },
    }

def mcp_dispatch(body, host):
    rid = body.get("id")
    method = body.get("method", "")
    if method == "initialize":
        client_ver = (body.get("params") or {}).get("protocolVersion", PROTOCOL_VERSION)
        return {"jsonrpc": "2.0", "id": rid, "result": {
            "protocolVersion": client_ver, "capabilities": {"tools": {}},
            "serverInfo": SERVER_INFO}}
    if method.startswith("notifications/"):
        return None                       # 202, no body
    if method == "ping":
        return {"jsonrpc": "2.0", "id": rid, "result": {}}
    if method == "tools/list":
        return {"jsonrpc": "2.0", "id": rid, "result": {"tools": TOOLS}}
    if method == "tools/call":
        p = body.get("params") or {}
        name, args = p.get("name"), p.get("arguments") or {}
        try:
            if name == "search_references":
                data = do_search(args.get("query", ""), args.get("max_results", 8))
            elif name == "fetch_pages":
                data = do_fetch(args.get("path", ""), args.get("frm", 1), args.get("to"))
            elif name == "list_documents":
                data = do_docs()
            else:
                return {"jsonrpc": "2.0", "id": rid,
                        "error": {"code": -32602, "message": f"unknown tool {name}"}}
            return {"jsonrpc": "2.0", "id": rid, "result": {
                "content": [{"type": "text", "text": json.dumps(data, ensure_ascii=False)}],
                "isError": False}}
        except Exception as e:
            return {"jsonrpc": "2.0", "id": rid, "result": {
                "content": [{"type": "text", "text": f"error: {e}"}], "isError": True}}
    return {"jsonrpc": "2.0", "id": rid,
            "error": {"code": -32601, "message": f"method not found: {method}"}}

class handler(BaseHTTPRequestHandler):
    def _authed(self, qs):
        key = os.environ.get("PP_API_KEY", "")
        if not key:
            return True
        auth = self.headers.get("Authorization", "")
        supplied = (auth[7:] if auth.startswith("Bearer ") else
                    self.headers.get("X-Api-Key") or (qs.get("key") or [""])[0])
        return supplied == key

    def _send(self, code, obj, ctype="application/json"):
        payload = json.dumps(obj, ensure_ascii=False).encode() if obj is not None else b""
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Authorization, X-Api-Key, Content-Type, Mcp-Session-Id, MCP-Protocol-Version")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        if payload:
            self.wfile.write(payload)

    def do_OPTIONS(self):
        self._send(204, None)

    def do_GET(self):
        u = urlparse(self.path); qs = parse_qs(u.query)
        route = u.path.rstrip("/").split("/")[-1]
        if route == "openapi.json":
            return self._send(200, openapi(self.headers.get("Host")))
        if not self._authed(qs):
            return self._send(401, {"error": "unauthorized"})
        if route == "search":
            return self._send(200, {"results": do_search((qs.get("q") or [""])[0], (qs.get("k") or [8])[0])})
        if route == "fetch":
            return self._send(200, {"chunks": do_fetch((qs.get("path") or [""])[0],
                                                       (qs.get("frm") or [1])[0], (qs.get("to") or [None])[0])})
        if route == "docs":
            return self._send(200, {"documents": do_docs()})
        if route == "mcp":
            return self._send(405, {"error": "use POST for MCP"})
        return self._send(404, {"error": f"unknown route {u.path}"})

    def do_POST(self):
        u = urlparse(self.path); qs = parse_qs(u.query)
        if not self._authed(qs):
            return self._send(401, {"error": "unauthorized"})
        if u.path.rstrip("/").split("/")[-1] != "mcp":
            return self._send(404, {"error": "POST only on /api/pp/mcp"})
        try:
            n = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(n) or b"{}")
        except Exception:
            return self._send(400, {"jsonrpc": "2.0", "id": None,
                                    "error": {"code": -32700, "message": "parse error"}})
        if isinstance(body, list):
            resps = [r for r in (mcp_dispatch(b, self.headers.get("Host")) for b in body) if r]
            return self._send(200, resps or None) if resps else self._send(202, None)
        resp = mcp_dispatch(body, self.headers.get("Host"))
        return self._send(200, resp) if resp is not None else self._send(202, None)
