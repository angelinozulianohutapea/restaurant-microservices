const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const orderServers = [
  'http://order-service-1:3001',
  'http://order-service-2:3005'
];
let i = 0;

app.get('/', (req, res) => { res.send('Gateway berjalan'); });

app.get('/health/all', async (req, res) => {
  const services = [
    { name: 'user',            url: 'http://user:3000/health',            port: 3000 },
    { name: 'menu',            url: 'http://menu:3002/health',            port: 3002 },
    { name: 'order-service-1', url: 'http://order-service-1:3001/health', port: 3001 },
    { name: 'order-service-2', url: 'http://order-service-2:3005/health', port: 3005 },
    { name: 'payment',         url: 'http://payment:3003/health',         port: 3003 },
    { name: 'monitoring',      url: 'http://monitoring:3004/health',      port: 3004 },
  ];
  const checks = await Promise.allSettled(services.map(s => axios.get(s.url, { timeout: 2000 })));
  const result = services.map((s, idx) => ({
    name: s.name, port: s.port,
    status: checks[idx].status === 'fulfilled' ? 'ONLINE' : 'OFFLINE',
    data: checks[idx].status === 'fulfilled' ? checks[idx].value.data : null,
  }));
  res.json(result);
});

app.post('/user/register', async (req, res) => {
  try { const r = await axios.post('http://user:3000/register', req.body); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'User service down' }); }
});
app.post('/user/login', async (req, res) => {
  try { const r = await axios.post('http://user:3000/login', req.body); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'User service down' }); }
});
app.get('/users', async (req, res) => {
  try { const r = await axios.get('http://user:3000/users'); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'User service down' }); }
});

app.get('/menu', async (req, res) => {
  try { const r = await axios.get('http://menu:3002/menu'); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Menu service down' }); }
});
app.post('/menu', async (req, res) => {
  try { const r = await axios.post('http://menu:3002/menu', req.body); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Menu service down' }); }
});
app.put('/menu/:id', async (req, res) => {
  try { const r = await axios.put(`http://menu:3002/menu/${req.params.id}`, req.body); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Menu service down' }); }
});
app.delete('/menu/:id', async (req, res) => {
  try { const r = await axios.delete(`http://menu:3002/menu/${req.params.id}`); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Menu service down' }); }
});

app.post('/order', async (req, res) => {
  const target = orderServers[i++ % orderServers.length];
  try { const r = await axios.post(target + '/order', req.body); res.json(r.data); }
  catch (err) {
    console.log('SERVER GAGAL:', target);
    const backup = orderServers[i++ % orderServers.length];
    try { const r = await axios.post(backup + '/order', req.body); res.json(r.data); }
    catch (err2) { res.status(500).json({ error: 'Semua order service down' }); }
  }
});
app.get('/orders', async (req, res) => {
  try { const r = await axios.get(orderServers[0] + '/orders'); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Order service down' }); }
});

app.post('/payment', async (req, res) => {
  try { const r = await axios.post('http://payment:3003/payment', req.body); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Payment service down' }); }
});
app.get('/payments', async (req, res) => {
  try { const r = await axios.get('http://payment:3003/payments'); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Payment service down' }); }
});

app.post('/log', async (req, res) => {
  try { await axios.post('http://monitoring:3004/log', req.body); res.json({ message: 'Log berhasil dikirim' }); }
  catch (err) { res.status(500).json({ error: 'Monitoring service down' }); }
});
app.get('/log', async (req, res) => {
  try { const r = await axios.get('http://monitoring:3004/log'); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Monitoring service down' }); }
});
app.get('/stats', async (req, res) => {
  try { const r = await axios.get('http://monitoring:3004/stats'); res.json(r.data); }
  catch (err) { res.status(500).json({ error: 'Stats service down' }); }
});

app.listen(8080, () => { console.log('Gateway running on 8080'); });
