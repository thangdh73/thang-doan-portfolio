/* AI Golf Swing Coach — page logic (vanilla JS). Talks directly to the SwingCoach engine API. */
(function () {
  "use strict";
  var API = String(window.SWINGCOACH_ENGINE_URL || "").replace(/\/+$/, "");
  // Laptop testing: ?engine=local talks straight to the engine on this PC (use with start-server.ps1).
  if (/[?&]engine=local\b/.test(location.search)) API = "http://127.0.0.1:8600";
  var P_NAMES = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];
  var $ = function (id) { return document.getElementById(id); };
  var state = { job: null, result: null, view: "dtl", P: "P4", imgCache: {} };

  // ---------------------------------------------------------------- helpers
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function code() { return $("access-code").value.trim(); }
  function store(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* storage unavailable: fine */ } }
  function recall(k) { try { return sessionStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({}, opts.headers || {}, { "X-Access-Code": code() });
    return fetch(API + path, opts).then(function (r) {
      if (r.ok) return r;
      return r.json().catch(function () { return {}; }).then(function (j) {
        var err = new Error(j.detail || ("Engine error " + r.status));
        err.status = r.status;
        throw err;
      });
    });
  }
  function fmt(v) { return v == null ? "—" : (Math.round(v * 100) / 100).toString(); }

  // ---------------------------------------------------------------- engine status
  function setStatus(kind, text) {
    var el = $("engine-status");
    el.className = "sc-status sc-status--" + kind;
    el.textContent = text;
  }
  function checkHealth() {
    if (!API || API.indexOf("REPLACE-WITH") >= 0) {
      setStatus("off", "Engine not configured");
      $("offline-note").hidden = false;
      return;
    }
    var ctl = new AbortController();
    var t = setTimeout(function () { ctl.abort(); }, 8000);
    fetch(API + "/health", { signal: ctl.signal }).then(function (r) { return r.json(); }).then(function (j) {
      clearTimeout(t);
      setStatus("on", "Engine online · v" + j.engine + (j.jobs_waiting ? " · " + j.jobs_waiting + " in queue" : ""));
      $("offline-note").hidden = true;
    }).catch(function () {
      clearTimeout(t);
      setStatus("off", "Engine offline");
      $("offline-note").hidden = false;
    });
  }

  // ---------------------------------------------------------------- models
  // Loads the model list for the typed code. Returns a promise of true (loaded) / false.
  function codeMsg(t, ok) { var el = $("code-msg"); el.textContent = t; el.className = "sc-hint" + (ok ? " sc-ok" : t ? " sc-bad" : ""); }
  function loadModels() {
    if (!code()) { codeMsg(""); return Promise.resolve(false); }
    codeMsg("Checking code…");
    return api("/models").then(function (r) { return r.json(); }).then(function (list) {
      var sel = $("model");
      sel.innerHTML = list.map(function (m) {
        return '<option value="' + esc(m.id) + '">' + esc(m.name + " · " + m.club + " (" + m.views.join("+") + ")") + "</option>";
      }).join("") || '<option value="">No model swings in the library</option>';
      codeMsg("Code accepted · " + list.length + " model swing" + (list.length === 1 ? "" : "s") + " loaded", true);
      $("form-msg").textContent = "";
      store("sc_code", code());
      return list.length > 0;
    }).catch(function (e) {
      $("model").innerHTML = '<option value="">Enter code to load…</option>';
      codeMsg(e.status === 401 ? "Access code not recognised." : "Could not reach the engine (is the laptop on and start_engine.bat running?).");
      return false;
    });
  }
  var codeTimer = null;

  // ---------------------------------------------------------------- form
  ["fo", "dtl"].forEach(function (v) {
    var input = $("file-" + v);
    input.addEventListener("change", function () {
      var f = input.files[0];
      $("info-" + v).innerHTML = f ? "<strong>" + esc(f.name) + "</strong> · " + (f.size / 1048576).toFixed(1) + " MB" : "";
    });
    $("speed-" + v).addEventListener("change", function () {
      document.querySelector('.sc-video[data-view="' + v + '"] .sc-fps').hidden = this.value !== "slowmo";
    });
    var zone = input.closest(".upload-zone");
    zone.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
    zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("is-dragover"); });
    zone.addEventListener("dragleave", function () { zone.classList.remove("is-dragover"); });
    zone.addEventListener("drop", function (e) {
      e.preventDefault(); zone.classList.remove("is-dragover");
      if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event("change")); }
    });
  });
  $("access-code").addEventListener("change", loadModels);
  $("access-code").addEventListener("input", function () { clearTimeout(codeTimer); codeTimer = setTimeout(loadModels, 700); });

  $("sc-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("form-msg");
    var fo = $("file-fo").files[0], dtl = $("file-dtl").files[0];
    if (!code()) { msg.textContent = "Enter the access code."; return; }
    if (!fo && !dtl) { msg.textContent = "Choose at least one video."; return; }
    if (!$("model").value) {
      msg.textContent = "Loading model swings…";
      loadModels().then(function (ok) {
        if (ok && $("model").value) { $("sc-form").requestSubmit ? $("sc-form").requestSubmit() : $("go").click(); }
        else { msg.textContent = "Choose a model swing — see the message under the access code."; }
      });
      return;
    }
    msg.textContent = "";
    var fd = new FormData();
    fd.append("model", $("model").value);
    fd.append("club", $("club").value);
    fd.append("handedness", $("handedness").value);
    if (fo) { fd.append("fo", fo); fd.append("fo_speed", $("speed-fo").value); fd.append("fo_fps", $("fps-fo").value); }
    if (dtl) { fd.append("dtl", dtl); fd.append("dtl_speed", $("speed-dtl").value); fd.append("dtl_fps", $("fps-dtl").value); }
    [["outcome", "outcome"], ["outcome_count", "outcome-count"], ["pain", "pain"], ["height", "height"],
     ["wingspan", "wingspan"], ["forearm", "forearm"], ["upper_arm", "upper-arm"]].forEach(function (p) {
      fd.append(p[0], $(p[1]).value);
    });
    upload(fd);
  });

  function showProgress(x, text) {
    $("progress").hidden = false;
    $("bar").style.width = Math.round(x * 100) + "%";
    $("progress-msg").textContent = text;
  }

  function upload(fd) {
    $("go").disabled = true;
    $("results").hidden = true;
    showProgress(0, "Uploading…");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", API + "/analyze");
    xhr.setRequestHeader("X-Access-Code", code());
    xhr.upload.onprogress = function (ev) {
      if (ev.lengthComputable) showProgress(0.15 * ev.loaded / ev.total, "Uploading… " + Math.round(100 * ev.loaded / ev.total) + "%");
    };
    xhr.onload = function () {
      var j = {};
      try { j = JSON.parse(xhr.responseText); } catch (err) { /* keep empty */ }
      if (xhr.status !== 200) { fail(j.detail || "Upload failed (" + xhr.status + ")."); return; }
      state.job = j.job;
      poll();
    };
    xhr.onerror = function () { fail("Could not reach the engine. It may have gone offline."); };
    xhr.send(fd);
  }

  function fail(text) {
    $("go").disabled = false;
    $("progress").hidden = true;
    $("form-msg").textContent = text;
    checkHealth();
  }

  function poll() {
    api("/jobs/" + state.job).then(function (r) { return r.json(); }).then(function (j) {
      if (j.status === "failed") { fail(j.message); return; }
      if (j.status === "done") { showProgress(1, "Done"); loadResult(); return; }
      var text = j.status === "queued" ? "Waiting in queue (position " + j.queue_position + ")…" : (j.message || "Analysing…");
      showProgress(0.15 + 0.85 * (j.progress || 0), text);
      setTimeout(poll, 2000);
    }).catch(function (e) { fail(e.message); });
  }

  // ---------------------------------------------------------------- results
  function loadResult() {
    api("/jobs/" + state.job + "/result").then(function (r) { return r.json(); }).then(function (res) {
      state.result = res;
      state.imgCache = {};
      $("go").disabled = false;
      $("progress").hidden = true;
      renderResult(res);
    }).catch(function (e) { fail(e.message); });
  }

  function card(inner, extra) { return '<div class="lab-panel sc-card' + (extra ? " " + extra : "") + '">' + inner + "</div>"; }
  function sec(n, title, inner) { return '<h3 class="sc-h3">' + n + ". " + esc(title) + "</h3>" + inner; }
  function badge(status, quality) {
    if (status === "unmeasurable") return '<span class="sc-b sc-b--na">unmeasurable</span>';
    var s = '<span class="sc-b sc-b--' + (status === "inside" ? "in" : "out") + '">' + status + "</span>";
    if (quality === "limited") s += ' <span class="sc-b sc-b--lim">limited</span>';
    return s;
  }

  function renderResult(res) {
    var rep = res.report, cmp = res.comparison;
    $("r-model").textContent = res.model_name;
    $("r-meta").textContent = "Engine " + res.engine + " · metric definitions v1 · bands: model value ± tolerance";
    $("r-safety").innerHTML = rep.pain.status === "pain"
      ? card("<strong>Safety:</strong> pain reported. No technical drill is given. Stop the movement that provokes symptoms; get a qualified assessment if pain persists, worsens, or comes with numbness.", "sc-card--warn")
      : "";
    var h = [];
    var c = rep.capture;
    h.push(sec(1, "Capture & comparability", card('<span class="sc-b sc-b--' + (c.grade === "comparable" ? "in" : c.grade === "limited" ? "lim" : "na") + '">' + esc(c.grade) +
      "</span><ul>" + c.lines.concat(c.flags).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>")));
    h.push(sec(2, "Outcome", card(esc(rep.outcome.text) + '<p class="sc-hint">Pain today: ' + esc(rep.pain.label) + "</p>")));
    var pos = "";
    Object.keys(rep.positions).forEach(function (v) {
      pos += '<tr><th scope="row">' + (v === "fo" ? "Face-on" : "Down-the-line") + "</th>" + rep.positions[v].map(function (p) {
        var cls = p.status === "detected" ? "in" : p.status === "estimated" ? "lim" : "na";
        return '<td><span class="sc-b sc-b--' + cls + '">' + esc(p.status) + '</span><br><span class="sc-hint">' + p.t.toFixed(2) + " s</span></td>";
      }).join("") + "</tr>";
    });
    h.push(sec(3, "Positions checked", card('<div class="sc-tablewrap"><table class="sc-table"><tr><th>View</th>' +
      P_NAMES.map(function (P) { return "<th>" + P + "</th>"; }).join("") + "</tr>" + pos + "</table></div>")));
    var obs = rep.observations.length
      ? "<ol>" + rep.observations.map(function (o) { return "<li>" + esc(o.text) + (o.note ? '<p class="sc-hint">' + esc(o.note) + "</p>" : "") + "</li>"; }).join("") +
        '</ol><p class="sc-hint">A value outside the band prompts investigation, not an automatic correction.</p>'
      : "No measured value is outside the model band.";
    var buildCard = rep.build.lines.length
      ? card("<strong>Context · build and swing plane</strong><ul>" + rep.build.lines.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
        '</ul><p class="sc-hint">' + esc(rep.build.caution) + "</p>", "sc-card--info")
      : "";
    h.push(sec(4, "Key observations", card(obs) + buildCard));
    var cz = rep.causes, cause = cz.message ? card('<span class="sc-hint">' + esc(cz.message) + "</span>") : "";
    cz.items.forEach(function (it) {
      cause += card("<strong>" + esc(it.title) + '</strong> <span class="sc-b sc-b--lim">' + esc(it.status) + "</span><p>" + esc(it.text) +
        '</p><p class="sc-hint">Mechanism: ' + esc(it.mechanism) + "<br>Competing explanations: " + esc(it.competing) +
        "<br>Evidence needed: " + esc(it.needs) + (it.caution ? "<br>Note: " + esc(it.caution) : "") + "</p>");
    });
    h.push(sec(5, "Possible causes", cause));
    h.push(sec(6, "Next test", card(esc(rep.next_test))));
    h.push(sec(7, "What would raise confidence", card("<ul>" + rep.confidence.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>")));
    $("r-sections").innerHTML = h.join("");

    renderTempo(cmp);
    renderEE(rep.early_extension, res.views);
    renderAppendix(cmp.rows);
    $("pos-legend").textContent = "";
    var views = res.views;
    document.querySelectorAll(".sc-seg button[data-view]").forEach(function (b) {
      var v = b.dataset.view, ok = views[v].you || views[v].model;
      b.disabled = !ok;
    });
    state.view = views.dtl.you ? "dtl" : views.fo.you ? "fo" : (views.dtl.model ? "dtl" : "fo");
    state.P = "P7";
    $("pos").value = 7;
    showPosition();
    $("results").hidden = false;
    $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderTempo(cmp) {
    var bars = cmp.tempo_bars || [], ti = cmp.tempo_info || {}, out = "";
    var mx = 0;
    bars.forEach(function (b) { if (b) mx = Math.max(mx, b.back + b.down); });
    if (!(bars[0]) && ti.you_ratio && ti.you_ratio.value) {
      var rr = (ti.you && ti.you.ratio_range) || [ti.you_ratio.value, ti.you_ratio.value];
      out += "<p>Your rhythm (backswing : downswing): <strong>" + ti.you_ratio.value.toFixed(1) + " : 1</strong> (range " +
        rr[0].toFixed(1) + "–" + rr[1].toFixed(1) + "). Times need the recording frame rate. Tour reference 3:1.</p>";
    }
    ["You", "Model"].forEach(function (nm, i) {
      var b = bars[i];
      if (!b) { if (mx) out += '<p class="sc-hint">' + nm + ": tempo not available</p>"; return; }
      var w1 = 100 * b.back / mx, w2 = 100 * b.down / mx;
      var tt = b.tt ? " · Tour Tempo " + esc(b.tt.notation) + " (nearest tone " + esc(b.tt.nearest_tone) + ")" : "";
      out += '<div class="sc-tempo__row"><strong class="sc-' + (i ? "model" : "you") + '">' + nm + '</strong><span class="sc-num">' +
        b.back.toFixed(2) + " s + " + b.down.toFixed(2) + " s = " + (b.back + b.down).toFixed(2) + " s · " + (b.back / b.down).toFixed(1) + " : 1" + tt +
        '</span></div><div class="sc-tempo__bar sc-tempo__bar--' + (i ? "model" : "you") + '"><span style="width:' + w1.toFixed(1) +
        '%"></span><span style="left:' + w1.toFixed(1) + "%;width:" + w2.toFixed(1) + '%"></span></div>';
    });
    out += '<p class="sc-hint">Tour Tempo method: light = backswing (first movement → start of downswing), dark = downswing (→ impact). ' +
      "Frames counted at 30 fps (24/8 = 3:1). Tour reference: 3:1 rhythm, 0.8–1.2 s total.</p>";
    $("tempo").innerHTML = out;
  }

  // ---------------------------------------------------------------- early extension
  var EE_LEGEND = "Orange dashed = tush line (back of the hips at address), dot = back of the hips now; green = trunk; " +
    "magenta = trail shoulder–hip–knee–ankle; cyan = arm space (hands to the hip–knee line).";
  function eeCurveSvg(curve, idx, title, unit) {
    var W = 460, H = 200, pad = 36, vals = [0];
    if (idx === 1) vals.push(3);
    ["you", "model"].forEach(function (k) { (curve[k] || []).forEach(function (p) { vals.push(p[idx]); }); });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    if (hi - lo < 1) { hi += 0.5; lo -= 0.5; }
    var X = function (t) { return pad + t * (W - pad - 10); };
    var Y = function (v) { return 20 + (hi - v) / (hi - lo) * (H - 50); };
    var g = '<svg viewBox="0 0 ' + W + " " + H + '" class="sc-eecurve" role="img" aria-label="' + esc(title) + '">' +
      '<text x="' + pad + '" y="13" font-size="12" fill="currentColor">' + esc(title) + " (" + unit + ")</text>" +
      '<line x1="' + pad + '" x2="' + (W - 10) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="rgba(154,165,180,.4)"/>';
    if (idx === 1) g += '<line x1="' + pad + '" x2="' + (W - 10) + '" y1="' + Y(3) + '" y2="' + Y(3) + '" stroke="#f2a65a" stroke-dasharray="4 3"/>' +
      '<text x="' + (W - 12) + '" y="' + (Y(3) - 3) + '" font-size="10" text-anchor="end" fill="#f2a65a">3 % early-move line</text>';
    [[0, "P4 top", "start"], [0.5, "mid-downswing", "middle"], [1, "P7 impact", "end"]].forEach(function (a) {
      g += '<text x="' + X(a[0]) + '" y="' + (H - 8) + '" font-size="10" text-anchor="' + a[2] + '" fill="#9aa5b4">' + a[1] + "</text>";
    });
    [lo, hi].forEach(function (v) { g += '<text x="' + (pad - 4) + '" y="' + (Y(v) + 3) + '" font-size="10" text-anchor="end" fill="#9aa5b4">' + v.toFixed(0) + "</text>"; });
    [["you", "#f2a65a", "You"], ["model", "#7aa7e8", "Model"]].forEach(function (s) {
      var c = curve[s[0]];
      if (!c || !c.length) return;
      g += '<polyline fill="none" stroke-width="2.2" stroke="' + s[1] + '" points="' + c.map(function (p) { return X(p[0]).toFixed(1) + "," + Y(p[idx]).toFixed(1); }).join(" ") + '"/>';
      var l = c[c.length - 1];
      g += '<text x="' + (X(l[0]) - 4) + '" y="' + (Y(l[idx]) + 14) + '" font-size="11" text-anchor="end" fill="' + s[1] + '">' + s[2] + "</text>";
    });
    return g + "</svg>";
  }
  function renderEE(ee, views) {
    var panel = $("ee-panel");
    if (!ee || ee.verdict === "not assessed" || !(views.dtl.you || views.dtl.model)) { panel.hidden = true; return; }
    panel.hidden = false;
    var cls = { clear: "out", mild: "lim", none: "in" }[ee.verdict] || "na";
    $("ee-summary").innerHTML = '<p><span class="sc-b sc-b--' + cls + '">' + esc(ee.verdict.toUpperCase()) + "</span> " + esc(ee.text) + "</p><ul class=\"sc-eerules\">" +
      ee.rules.map(function (r) { return "<li>" + (r.met ? "✔ " : "— ") + esc(r.label) + "</li>"; }).join("") + "</ul>" +
      '<p class="sc-hint">Clear = all three rules met; mild = at least one sign. ' + esc(ee.caution) + "</p>";
    var rows = "";
    ee.signs.forEach(function (sg) {
      if (!sg.rows.length) { rows += "<tr><td><strong>" + esc(sg.label) + '</strong></td><td colspan="6" class="sc-hint">not measured</td></tr>'; return; }
      sg.rows.forEach(function (d, i) {
        var sgn = function (v) { return v == null ? "—" : (d.metric !== "arm_space" && v > 0 ? "+" : "") + fmt(v); };
        var dif = d.you == null || d.model == null ? "—" : ((d.you - d.model) > 0 ? "+" : "") + fmt(d.you - d.model);
        rows += "<tr><td>" + (i === 0 ? "<strong>" + esc(sg.label) + "</strong>" : "") + "</td><td>" + d.n + ". " + esc(d.name) +
          ' <span class="sc-hint">(' + esc(d.unit) + ", " + d.P + ')</span></td><td class="sc-num">' + sgn(d.you) + '</td><td class="sc-num">' + sgn(d.model) +
          '</td><td class="sc-num">' + dif + '</td><td class="sc-num">' + (d.band ? fmt(d.band[0]) + " to " + fmt(d.band[1]) : "—") + "</td><td>" +
          badge(d.status, d.quality) + (d.bad ? ' <span class="sc-b sc-b--out">sign</span>' : "") + "</td></tr>";
      });
    });
    $("ee-table").innerHTML = '<table class="sc-table"><tr><th>Sign</th><th>Measure</th><th>You</th><th>Model</th><th>Difference</th><th>Band</th><th>Result</th></tr>' + rows + "</table>";
    var cv = ee.curve || {}, note = [];
    if (ee.start_you != null) note.push("your hips pass the 3 % line " + Math.round(ee.start_you * 100) + " % of the way down");
    if (ee.start_model != null) note.push("the model's at " + Math.round(ee.start_model * 100) + " %");
    else if (cv.model) note.push("the model's hips never pass it");
    $("ee-curve").innerHTML = (cv.you || cv.model)
      ? '<div class="sc-eecurves">' + eeCurveSvg(cv, 1, "Hips toward the ball since the top", "% torso") + eeCurveSvg(cv, 2, "Forward bend change vs address", "deg") + "</div>" +
        (note.length ? '<p class="sc-hint">Timing: ' + note.join("; ") + ".</p>" : "")
      : "";
    $("ee-legend").textContent = EE_LEGEND;
    showEE("P6");
  }
  function showEE(P) {
    document.querySelectorAll("#ee-seg button").forEach(function (b) {
      b.setAttribute("aria-checked", b.dataset.p === P ? "true" : "false");
      b.classList.toggle("is-active", b.dataset.p === P);
    });
    var key = state.job + "/ee/" + P, img = $("ee-img");
    img.classList.add("is-loading");
    var done = function (url) { img.src = url; img.classList.remove("is-loading"); };
    if (state.imgCache[key]) done(state.imgCache[key]);
    else api("/jobs/" + state.job + "/ee/" + P).then(function (r) { return r.blob(); }).then(function (b) {
      state.imgCache[key] = URL.createObjectURL(b); done(state.imgCache[key]);
    }).catch(function () { img.classList.remove("is-loading"); });
  }
  document.querySelectorAll("#ee-seg button").forEach(function (b) { b.addEventListener("click", function () { showEE(b.dataset.p); }); });

  function renderAppendix(rows) {
    $("appendix").innerHTML = "<tr><th>#</th><th>Measure</th><th>View · P</th><th>You</th><th>Model</th><th>Band</th><th>Result</th><th>Note</th></tr>" +
      rows.map(function (r) {
        return "<tr><td>" + r.n + "</td><td>" + esc(r.name) + ' <span class="sc-hint">(' + esc(r.unit) + ")</span></td><td>" + r.view.toUpperCase() + " · " + r.P +
          '</td><td class="sc-num">' + fmt(r.student) + '</td><td class="sc-num">' + fmt(r.model) + '</td><td class="sc-num">' +
          (r.band ? fmt(r.band[0]) + " to " + fmt(r.band[1]) : "—") + "</td><td>" + badge(r.status, r.quality) + '</td><td class="sc-hint">' + esc(r.note) + "</td></tr>";
      }).join("");
  }

  // ---------------------------------------------------------------- position viewer
  function showPosition() {
    var v = state.view, P = state.P, res = state.result;
    document.querySelectorAll(".sc-seg button[data-view]").forEach(function (b) {
      b.setAttribute("aria-checked", b.dataset.view === v ? "true" : "false");
      b.classList.toggle("is-active", b.dataset.view === v);
    });
    $("pos-label").textContent = P + " · " + (res.p_labels[P] || "");
    $("pos-legend").textContent = v === "dtl" ? res.legend : "";
    var key = state.job + "/" + v + "/" + P, img = $("pos-img");
    img.classList.add("is-loading");
    var done = function (url) { if (state.view === v && state.P === P) { img.src = url; img.classList.remove("is-loading"); } };
    if (state.imgCache[key]) done(state.imgCache[key]);
    else api("/jobs/" + state.job + "/frame/" + v + "/" + P).then(function (r) { return r.blob(); }).then(function (b) {
      state.imgCache[key] = URL.createObjectURL(b);
      done(state.imgCache[key]);
    }).catch(function () { img.classList.remove("is-loading"); });
    var blk = ((res.report && res.report.by_position) || []).filter(function (x) { return x.P === P; })[0];
    if (!blk) {
      $("pos-rows").innerHTML = '<p class="sc-hint">No measurement at this position.</p>';
      $("pos-table").innerHTML = "";
      return;
    }
    var pcls = blk.priority === "Critical" ? "sc-b--out" : blk.priority === "Very high" ? "sc-b--lim" : "sc-b--na";
    $("pos-rows").innerHTML = '<p><span class="sc-b ' + pcls + '">' + esc(blk.priority) + "</span> " + esc(blk.title) + "</p>" +
      '<p class="sc-hint">' + blk.n_outside + " outside of " + blk.n_measured + " measured vs " + esc(res.model_name) +
      ". Band = model value ± tolerance. Coaching order: P7, P6, P5, P1, P4.</p>";
    var items = blk.items.slice().sort(function (a, b) {
      var av = (a.view === "Face-on" ? "fo" : "dtl") === v ? 0 : 1, bv = (b.view === "Face-on" ? "fo" : "dtl") === v ? 0 : 1;
      return av - bv;
    });
    $("pos-table").innerHTML = '<table class="sc-table"><tr><th>Measure</th><th>View</th><th>You</th><th>Model</th><th>Difference</th><th>Band</th><th>Result</th></tr>' +
      items.map(function (it) {
        var d = it.diff == null ? "—" : (it.diff > 0 ? "+" : "") + fmt(it.diff);
        return "<tr><td>" + it.n + ". " + esc(it.name) + ' <span class="sc-hint">(' + esc(it.unit) + ")</span>" +
          (it.note ? '<div class="sc-hint">' + esc(it.note) + "</div>" : "") + "</td><td>" + esc(it.view) +
          '</td><td class="sc-num">' + fmt(it.you) + '</td><td class="sc-num">' + fmt(it.model) + '</td><td class="sc-num">' + d +
          '</td><td class="sc-num">' + (it.band ? fmt(it.band[0]) + " to " + fmt(it.band[1]) : "—") + "</td><td>" + badge(it.status, it.quality) + "</td></tr>";
      }).join("") + "</table>";
  }
  document.querySelectorAll(".sc-seg button[data-view]").forEach(function (b) {
    b.addEventListener("click", function () { state.view = b.dataset.view; showPosition(); });
  });
  $("pos").addEventListener("input", function () { state.P = "P" + this.value; showPosition(); });

  // ---------------------------------------------------------------- actions
  $("download").addEventListener("click", function () {
    api("/jobs/" + state.job + "/report").then(function (r) { return r.blob(); }).then(function (b) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = "swing_report_" + state.job + ".html";
      document.body.appendChild(a); a.click(); a.remove();
    }).catch(function (e) { alertMsg(e.message); });
  });
  function alertMsg(t) { $("form-msg").textContent = t; }
  $("again").addEventListener("click", function () {
    $("results").hidden = true;
    $("sc-form").scrollIntoView({ behavior: "smooth" });
  });

  // ---------------------------------------------------------------- start
  var saved = recall("sc_code");
  if (saved) { $("access-code").value = saved; }
  checkHealth();
  if (saved) loadModels();
  setInterval(checkHealth, 60000);
})();
