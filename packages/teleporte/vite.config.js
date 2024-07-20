import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.js'),
      name: 'teleporte',
      fileName: 'teleporte',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [vue(), dts({ insertTypesEntry: true, rollupTypes: true })],
  resolve: {
    alias: {
      'teleporte-test-utils': resolve(__dirname, './test/utils.js'),
    },
  },
  test: {
    environment: 'jsdom',
  },
})
