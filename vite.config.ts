import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Specify your desired port here
    host: true, // This makes the server listen on all addresses, including LAN and public addresses
  },
  // preview: {
  //   port: 4173,
  //   host: true,
  //   // Allow all hosts to access the preview server
  //   cors: true,
  //   // Either use a wildcard or list all possible domains
  //   allowedHosts: ['resume-analyzer-n10t.onrender.com', 'localhost', '.onrender.com', '*']
  // },
})
