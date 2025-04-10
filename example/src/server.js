import fs from 'node:fs/promises'
import express from 'express'
import { createServer } from 'vite'
import { Transform } from 'node:stream'

const port = process.env.PORT || 3001
const base = process.env.BASE || '/'
const app = express()
const ABORT_DELAY = 10000


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


    let didError = false;
    const { pipe, abort } = render({
      onShellError() {
        res.status(500)
        res.set({ 'Content-Type': 'text/html' })
        res.send('<h1>Something went wrong</h1>')
      },
      onShellReady() {
        res.status(didError ? 500 : 200)
        res.set({ 'Content-Type': 'text/html' })

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            console.log("chunk")
            res.write(chunk, encoding)
            callback()
          },
        })

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`)

        res.write(htmlStart)

        transformStream.on('finish', () => {
          res.end(htmlEnd)
        })

        pipe(transformStream)
      },
      // @ts-expect-error
      onError(error) {
        didError = true
        console.error(error)
      },
    })

    setTimeout(() => {
      abort()
    }, ABORT_DELAY)
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
