import * as path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './index.html',
  build: {
    input: {
      app: './index.html',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  //set cookies with proxy
  server: {
    proxy: {
      '/dev': {
        target: 'https://staging-api-shop.rankerdao.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/dev/, ''),
      },
    },
  },
});
