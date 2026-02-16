import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  plugins: [react(), cesium()],
  base: isGitHubPages ? "/ethnosphere/" : "/", 
})
