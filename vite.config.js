import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split vendor chunks for better caching and smaller initial load
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — rarely changes, cached long-term
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI library chunks
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
            '@radix-ui/react-avatar',
            '@radix-ui/react-toast',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-toggle',
            '@radix-ui/react-progress',
          ],
          // Heavy libraries loaded only when needed
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
          'vendor-utils': ['axios', 'date-fns', 'zod', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
}));
