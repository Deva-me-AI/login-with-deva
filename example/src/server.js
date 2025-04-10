import fs from 'node:fs/promises'
import express from 'express'
import { createServer } from 'vite'

const port = process.env.PORT || 3001
const base = process.env.BASE || '/'
const app = express()


const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  base,
})
app.use(vite.middlewares)

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template = await fs.readFile('./index.html', 'utf-8')
    template = await vite.transformIndexHtml(url, template)
    // Always read fresh template in development
    const render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render

    const rendered = await render(url)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    // @ts-expect-error
    vite?.ssrFixStacktrace(e)
    // @ts-expect-error
    console.log(e.stack)
    // @ts-expect-error
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
