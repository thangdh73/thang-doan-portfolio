/** Proxy /tools/stochastic-volume/api/* → STOCHASTIC_API_URL/api/* */
module.exports = async (req, res) => {
  const base = process.env.STOCHASTIC_API_URL
  if (!base) {
    res.status(503).json({
      error: 'STOCHASTIC_API_URL is not set in Vercel environment variables.',
    })
    return
  }

  const segments = req.query.path
  const subpath = Array.isArray(segments) ? segments.join('/') : segments || ''
  const qs = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  const target = `${base.replace(/\/$/, '')}/api/${subpath}${qs}`

  try {
    const headers = {}
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type']
    }

    const init = {
      method: req.method,
      headers,
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body =
        typeof req.body === 'string'
          ? req.body
          : req.body != null
            ? JSON.stringify(req.body)
            : undefined
      if (body !== undefined) init.body = body
    }

    const upstream = await fetch(target, init)
    const body = await upstream.arrayBuffer()
    res.status(upstream.status)
    const ct = upstream.headers.get('content-type')
    if (ct) res.setHeader('Content-Type', ct)
    res.send(Buffer.from(body))
  } catch (e) {
    res.status(502).json({
      error: e instanceof Error ? e.message : 'Upstream API request failed',
    })
  }
}
