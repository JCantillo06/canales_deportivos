const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let PORT = 3000;
const STREAMX_AGENDA_URL = 'https://streamx723.sbs/json/agenda550.json';

let cachedAgenda = null;
let lastFetchTime = 0;

// Fetch remote JSON from StreamX with browser headers
function fetchRemoteJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://streamx723.sbs/'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error('Invalid JSON received'));
        }
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

// Background updater
async function refreshCache() {
  try {
    const data = await fetchRemoteJson(STREAMX_AGENDA_URL);
    if (Array.isArray(data) && data.length > 0) {
      cachedAgenda = data;
      lastFetchTime = Date.now();
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Agenda actualizada (${data.length} eventos en vivo/programados).`);
    }
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] ⚠️ Aviso al actualizar agenda:`, err.message);
  }
}

// Initial fetch
refreshCache();
setInterval(refreshCache, 60000);

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // API Endpoint
  if (pathname === '/api/agenda' || pathname === '/json/agenda550.json') {
    if (!cachedAgenda || (Date.now() - lastFetchTime > 30000)) {
      await refreshCache();
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(cachedAgenda || []));
    return;
  }

  // Static files
  let filePath = pathname === '/' ? '/index.html' : pathname;
  const fullPath = path.join(__dirname, filePath);

  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(fullPath).pipe(res);
  });
});

function startListening(port) {
  server.listen(port, () => {
    console.log('====================================================');
    console.log(`🚀 Servidor StreamX Deportes Activo!`);
    console.log(`👉 Dirección: http://localhost:${port}`);
    console.log('====================================================');

    // Automatically open browser on Windows
    exec(`start http://localhost:${port}`, (err) => {
      if (err) console.log('Abre tu navegador en: http://localhost:' + port);
    });
  });
}

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`El puerto ${PORT} está en uso, probando puerto ${PORT + 1}...`);
    PORT++;
    startListening(PORT);
  } else {
    console.error('Error en el servidor:', e);
  }
});

startListening(PORT);
