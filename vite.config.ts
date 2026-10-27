import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'kennedy-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url?.startsWith('/api/')) {
              return next()
            }

            try {
              const {
                handleVoiceStatus,
                handleRealtimeSession,
                handleTTS,
                handleChat,
              } = await import('./server/voice-handlers.js')

              const url = new URL(req.url, 'http://localhost')

              if (url.pathname === '/api/voice-status' && req.method === 'GET') {
                return await handleVoiceStatus(req, res)
              }

              let body = {}
              if (req.method === 'POST') {
                const chunks: Uint8Array[] = []
                for await (const chunk of req) {
                  chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
                }
                const raw = Buffer.concat(chunks).toString('utf-8')
                try {
                  body = raw ? JSON.parse(raw) : {}
                } catch {
                  body = {}
                }
              }

              if (url.pathname === '/api/realtime-session' && req.method === 'POST') {
                return await handleRealtimeSession(req, res, body)
              }

              if (url.pathname === '/api/tts' && req.method === 'POST') {
                return await handleTTS(req, res, body)
              }

              if (url.pathname === '/api/chat' && req.method === 'POST') {
                return await handleChat(req, res, body)
              }

              next()
            } catch (err: any) {
              console.error('[ViteDevApi] Handler error:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message || 'API middleware error' }))
            }
          })
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('plotly')) {
              return 'plotly-vendor'
            }
            if (id.includes('three') || id.includes('gsap')) {
              return 'three-vendor'
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
          },
        },
      },
      chunkSizeWarningLimit: 3500,
    },
  }
})
