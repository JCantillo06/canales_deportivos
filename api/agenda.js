const https = require('https');

const STREAMX_AGENDA_URL = 'https://streamx723.sbs/json/agenda550.json';

function fetchRemoteJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
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
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON received'));
        }
      });
    });
    req.on('error', err => reject(err));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const data = await fetchRemoteJson(STREAMX_AGENDA_URL);
    if (Array.isArray(data) && data.length > 0) {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).json(data);
    } else {
      return res.status(200).json([]);
    }
  } catch (err) {
    console.error('Error fetching agenda:', err.message);
    return res.status(502).json({ error: 'Failed to fetch agenda', message: err.message });
  }
};
