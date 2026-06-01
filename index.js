const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const TARGET = 'https://holy-silence-fb62.ali-dd6.workers.dev/eyJqdW5rIjoiYzZYblkxN0drIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOlsicHlpcC55Z2tray5kcGRucy5vcmciXX0=?ed=2560';

const SKIP_HEADERS = new Set([
  'host', 'connection', 'keep-alive', 'transfer-encoding',
  'te', 'trailer', 'upgrade', 'proxy-authorization', 'proxy-connection'
]);

app.use('/', async (req, res) => {
  try {
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!SKIP_HEADERS.has(key.toLowerCase())) {
        headers[key] = value;
      }
    }

    const fetchRes = await fetch(TARGET, {
      method: req.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
      duplex: 'half'
    });

    res.status(fetchRes.status);
    fetchRes.headers.forEach((value, key) => {
      if (!SKIP_HEADERS.has(key.toLowerCase())) {
        res.set(key, value);
      }
    });

    const reader = fetchRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
