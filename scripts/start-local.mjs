import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRenderServer } from '../backend/server/render.mjs';
const port = Number(process.env.PORT || 4182);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
if (!existsSync(fileURLToPath(new URL('../dist-render/client/index.html', import.meta.url)))) {
  throw new Error('Run npm run build:render before npm run dev:local');
}
const server = await createRenderServer({ publicOrigin: `http://localhost:${port}`, secureCookies: false });
server.listen(port, '127.0.0.1', () => console.log(`SYNERA local: http://localhost:${port}/`));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
