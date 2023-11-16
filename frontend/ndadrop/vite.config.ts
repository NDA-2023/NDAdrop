import { fileURLToPath, URL } from 'node:url'
import mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({
  // ...(process.env.NODE_ENV === 'development'
  //   ? {
  //     define: {
  //       global: {},
  //     },
  //   }
  //   : {}),
  plugins: [
    vue(),
    mkcert()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    https: true,
  }
}));
