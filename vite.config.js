import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // إجبار Vite على استخدام هذا البورت
    strictPort: true, // يمنع Vite من اختيار بورت آخر إذا كان 5173 مشغول
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})