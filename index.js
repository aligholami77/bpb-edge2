const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const TARGET = 'https://holy-silence-fb62.ali-dd6.workers.dev/eyJqdW5rIjoiYzZYblkxN0drIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOlsicHlpcC55Z2tray5kcGRucy5vcmciXX0=?ed=2560';

app.use('/', async (req, res) => {
  const url = TARGET;
  
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (key.toLowerCase() !== 'host') {
      headers[key] = value;
    }
  }

  const fetchRes = await fetch(url, {
    method: req.method,
    headers: headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
    duplex: 'half'
  });

  res.status(fetchRes.status);
  fetchRes.headers.forEach((value, key) => res.set(key, value));
  fetchRes.body.pipeTo(new WritableStream({
    write(chunk) { res.write(chunk); },
    close() { res.end(); }
  }));
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
