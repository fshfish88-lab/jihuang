import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'

const port = Number(process.env.CAMPFIRE_PREVIEW_PORT || 4173)
const basePath = '/jihuang'
const publicRoot = resolve('.output/public')

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
}

async function resolveFile(urlPath) {
  const stripped = urlPath.startsWith(basePath)
    ? urlPath.slice(basePath.length)
    : urlPath
  const decoded = decodeURIComponent(stripped.split('?')[0] || '/')
  const relativePath = decoded.replace(/^[/\\]+/, '')
  const candidate = resolve(publicRoot, relativePath)

  if (candidate !== publicRoot && !candidate.startsWith(`${publicRoot}${sep}`)) {
    return null
  }

  try {
    const fileStat = await stat(candidate)
    if (fileStat.isDirectory()) {
      return join(candidate, 'index.html')
    }
    return candidate
  } catch {
    const htmlCandidate = `${candidate}.html`
    try {
      await stat(htmlCandidate)
      return htmlCandidate
    } catch {
      return join(publicRoot, '404.html')
    }
  }
}

const server = createServer(async (request, response) => {
  try {
    const filePath = await resolveFile(request.url || '/')
    if (!filePath) {
      response.writeHead(403)
      response.end('Forbidden')
      return
    }

    const fileStat = await stat(filePath)
    response.writeHead(filePath.endsWith('404.html') ? 404 : 200, {
      'Cache-Control': 'no-store',
      'Content-Length': fileStat.size,
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
    })
    createReadStream(filePath).pipe(response)
  } catch {
    response.writeHead(500)
    response.end('Preview server error')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Campfire Wiki preview: http://127.0.0.1:${port}${basePath}/`)
})
