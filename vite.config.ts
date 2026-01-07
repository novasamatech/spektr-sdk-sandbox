import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  publicDir: 'public',
  plugins: [tsconfigPaths({ configNames: ['tsconfig.app.json'] }), tailwindcss(), react(), wasm()],
});
