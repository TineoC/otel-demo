import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  build: {
    commonjsOptions: {
      include: [/node_modules/],           // make sure it applies to your deps
      transformMixedEsModules: true        // in case some files mix CJS+ESM
    }
  }
})
