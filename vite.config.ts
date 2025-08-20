import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: false,
    proxy: {},
    setup: ({ middlewares }) => {
      middlewares.use('/api/market', (req, res) => {
        const tryPaths = [
          path.join(process.cwd(), 'data', 'dashboard', 'market.json'),
          path.join(process.cwd(), 'public', 'data', 'dashboard', 'market.json')
        ]
        let body: string | null = null
        for (const p of tryPaths) {
          try {
            body = fs.readFileSync(p, 'utf8')
            break
          } catch {}
        }
        if (body) {
          res.setHeader('Content-Type', 'application/json')
          res.end(body)
        } else {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'market.json not found' }))
        }
      })
    }
  }
})

