
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Registry service is running!');
});


let servers = {}; // Object keyed by serverId

// Endpoint for a signaling server to register or update its heartbeat.
app.post('/register', (req, res) => {
  const { serverId, ip, port, password } = req.body;
  if (!serverId || !ip || !port || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  // Save/update server info with a heartbeat.
  servers[serverId] = {
    serverId,
    ip,
    port,
    password,
    lastUpdated: Date.now()
  };
  res.json({ success: true });
});

// Endpoint to return a list of active servers.
app.get('/servers', (req, res) => {
  const now = Date.now();
  // Remove servers that haven't updated in 60 seconds.
  for (const id in servers) {
    if (now - servers[id].lastUpdated > 60000) {
      delete servers[id];
    }
  }
  res.json(Object.values(servers));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server registry running on port ${PORT}`);
});
