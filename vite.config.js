import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
})

// import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })