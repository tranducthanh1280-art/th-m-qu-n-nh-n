import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    port: 3000
  },
  build: {
    // Tăng giới hạn cảnh báo kích thước file từ 500kb lên 2000kb
    // Các thư viện như docx và genai có kích thước khá lớn nên cần điều chỉnh này.
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['lucide-react', 'recharts', 'docx', 'file-saver'],
          'vendor-ai': ['@google/genai']
        }
      }
    }
  }
});