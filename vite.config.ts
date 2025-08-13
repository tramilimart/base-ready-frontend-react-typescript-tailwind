import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    open: true,
  },
  
  build: {
    rollupOptions: {
      output: {
        // Add hash to chunk filenames for cache busting
        chunkFileNames: 'assets/[name].[hash].js',
        // Add hash to entry filenames for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        // Add hash to asset filenames (CSS, images, etc.)
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
})
