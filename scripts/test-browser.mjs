import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const server = spawn(process.execPath, ['scripts/preview-static.mjs'], {
  env: { ...process.env, CAMPFIRE_PREVIEW_PORT: '4175', CAMPFIRE_PREVIEW_ROOT: process.env.CAMPFIRE_PREVIEW_ROOT || '.output/public' },
  stdio: ['ignore', 'inherit', 'inherit', 'ipc'], windowsHide: true
})
let runner
const interrupt = () => { runner?.kill(); server.kill(); process.exitCode = 130 }
process.once('SIGINT', interrupt)
process.once('SIGTERM', interrupt)
let timer
try {
  await Promise.race([
    once(server, 'message'),
    once(server, 'exit').then(([code]) => { throw new Error(`Preview exited before readiness (${code})`) }),
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Preview startup timed out')), 15000) })
  ])
  clearTimeout(timer)
  runner = spawn(process.execPath, [require.resolve('@playwright/test/cli'), 'test', ...process.argv.slice(2)], {
    env: { ...process.env, CAMPFIRE_E2E_EXTERNAL: '1' }, stdio: 'inherit', windowsHide: true
  })
  const [code] = await once(runner, 'exit')
  process.exitCode = code ?? 1
} finally {
  clearTimeout(timer)
  if (server.connected) {
    const closed = once(server, 'exit')
    server.send('shutdown')
    const fallback = setTimeout(() => server.kill(), 3000)
    await closed
    clearTimeout(fallback)
  } else server.kill()
}
