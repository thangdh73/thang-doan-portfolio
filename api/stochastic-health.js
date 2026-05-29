/** Proxy health check to STOCHASTIC_API_URL (set in Vercel project env). */
module.exports = async (req, res) => {
  const base = process.env.STOCHASTIC_API_URL
  if (!base) {
    res.status(503).json({
      status: 'error',
      message: 'STOCHASTIC_API_URL is not set in Vercel environment variables.',
    })
    return
  }
  try {
    const upstream = await fetch(`${base.replace(/\/$/, '')}/health`)
    const body = await upstream.text()
    res.status(upstream.status)
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
    res.send(body)
  } catch (e) {
    res.status(502).json({
      status: 'error',
      message: e instanceof Error ? e.message : 'Upstream health check failed',
    })
  }
}
