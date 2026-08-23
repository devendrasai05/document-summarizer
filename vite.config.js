import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import summarizeHandler from './api/summarize.js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  // Expose GROQ_API_KEY to process.env in server runtime
  if (env.GROQ_API_KEY) {
    process.env.GROQ_API_KEY = env.GROQ_API_KEY;
  }

  return {
    plugins: [
      react(),
      {
        name: 'api-serverless-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url ? req.url.split('?')[0] : '';
            if (url === '/api/summarize') {
              if (req.method === 'OPTIONS') {
                res.writeHead(200, {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST,OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type'
                });
                res.end();
                return;
              }

              if (req.method === 'POST') {
                let bodyStr = '';
                req.on('data', chunk => {
                  bodyStr += chunk;
                });
                req.on('end', async () => {
                  try {
                    const parsedBody = bodyStr ? JSON.parse(bodyStr) : {};
                    // Create minimal req/res adapter for Vercel handler
                    const mockReq = {
                      method: 'POST',
                      body: parsedBody,
                      headers: req.headers
                    };
                    const mockRes = {
                      statusCode: 200,
                      headers: {},
                      setHeader(key, val) {
                        this.headers[key] = val;
                        res.setHeader(key, val);
                      },
                      status(code) {
                        this.statusCode = code;
                        return this;
                      },
                      json(data) {
                        res.writeHead(this.statusCode, {
                          'Content-Type': 'application/json',
                          ...this.headers
                        });
                        res.end(JSON.stringify(data));
                      },
                      end(data) {
                        res.writeHead(this.statusCode, this.headers);
                        res.end(data);
                      }
                    };

                    await summarizeHandler(mockReq, mockRes);
                  } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Server Error', message: err.message }));
                  }
                });
                return;
              }
            }
            next();
          });
        }
      }
    ],
    server: {
      port: 3000,
      open: false
    }
  };
});
