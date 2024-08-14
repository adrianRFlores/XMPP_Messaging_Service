import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // Polyfill Node.js globals
      global: 'node-polyfills/browser-global',
      process: 'node-polyfills/browser-process',
    },
  },
  optimizeDeps: {
    include: [
      // Include the @xmpp/client module to ensure it's polyfilled
      '@xmpp/client',
    ],
  },
  plugins: [
    react(),
    nodePolyfills({
      // Provide polyfills for Node.js modules
      include: ['node_modules/**'],
    }),
  ],
});
