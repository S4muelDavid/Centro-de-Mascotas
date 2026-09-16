import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    port: 5173,
    open: true
=======
    port: 5173
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
  }
});
