import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    'import.meta.env.VITE_KAKAO_JS_KEY': JSON.stringify('94e86b9b6ddf71039ab09c9902d2d79f'),
    'import.meta.env.VITE_OPENWEATHER_API_KEY': JSON.stringify(process.env.OPENWEATHER_API_KEY || ''),
  },
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    cors: true
  },
  publicDir: 'public'
});
