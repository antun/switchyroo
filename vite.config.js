import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  /* root: './src/vue',*/
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/vue', import.meta.url))
    }
  },
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  },
  build: {
    /* cssCodeSplit: false, */
    outDir: './dist/switchyroo/popup',
    rollupOptions: {
      input: {
        main: './src/vue/main.js'
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
})
