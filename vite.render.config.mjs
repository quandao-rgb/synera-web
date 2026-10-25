import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
const local = relative => fileURLToPath(new URL(relative, import.meta.url));
export default defineConfig({
  root: local('./render/'),
  publicDir: local('./public/'),
  plugins: [react()],
  build: { outDir: local('./dist-render/client/'), emptyOutDir: true },
});
