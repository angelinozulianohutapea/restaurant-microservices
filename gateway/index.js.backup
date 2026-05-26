const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ======================================
// ORDER SERVICES
// ======================================
const orderServers = [

  'http://order-service-1:3001',

  'http://order-service-2:3005'

];

let i = 0;

// ======================================
// HEALTH CHECK
// ======================================
app.get('/', (req, res) => {

  res.send('Gateway berjalan');

});

// ======================================
// USER REGISTER
// ======================================
app.post('/user/register', async (req, res) => {

  try {

    const response = await axios.post(

      'http://user:3000/register',

      req.body

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'User service down'

    });

  }

});

// ======================================
// USER LOGIN
// ======================================
app.post('/user/login', async (req, res) => {

  try {

    const response = await axios.post(

      'http://user:3000/login',

      req.body

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'User service down'

    });

  }

});

// ======================================
// GET USERS
// ======================================
app.get('/users', async (req, res) => {

  try {

    const response = await axios.get(

      'http://user:3000/users'

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'User service down'

    });

  }

});

// ======================================
// MENU
// ======================================
app.get('/menu', async (req, res) => {

  try {

    const response = await axios.get(

      'http://menu:3002/menu'

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'Menu service down'

    });

  }

});

// ======================================
// ADD MENU
// ======================================
app.post('/menu', async (req, res) => {

  try {

    const response = await axios.post(

      'http://menu:3002/menu',

      req.body

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'Menu service down'

    });

  }

});

// ======================================
// CREATE ORDER
// LOAD BALANCE + FAILOVER
// ======================================
app.post('/order', async (req, res) => {

  const target =

    orderServers[
      i++ % orderServers.length
    ];

  try {

    const response = await axios.post(

      target + '/order',

      req.body

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.log(
      'SERVER GAGAL:',
      target
    );

    // FAILOVER
    const backup =

      orderServers[
        i++ % orderServers.length
      ];

    try {

      const response = await axios.post(

        backup + '/order',

        req.body

      );

      res.json(
        response.data
      );

    } catch (err2) {

      console.error(
        err2.message
      );

      res.status(500).json({

        error: 'Semua order service down'

      });

    }

  }

});

// ======================================
// GET ORDERS
// ======================================
app.get('/orders', async (req, res) => {

  try {

    const target =
      orderServers[0];

    const response = await axios.get(

      target + '/orders'

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'Order service down'

    });

  }

});

// ======================================
// PAYMENT
// ======================================
app.post('/payment', async (req, res) => {

  try {

    const response = await axios.post(

      'http://payment:3003/payment',

      req.body

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'Payment service down'

    });

  }

});

// ======================================
// GET PAYMENTS
// ======================================
app.get('/payments', async (req, res) => {

  try {

    const response = await axios.get(

      'http://payment:3003/payments'

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'Payment service down'

    });

  }

});

// ======================================
// CREATE LOG
// ======================================
app.post('/log', async (req, res) => {

  try {

    await axios.post(

      'http://monitoring:3004/log',

      req.body

    );

    res.json({

      message: 'Log berhasil dikirim'

    });

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'Monitoring service down'

    });

  }

});

// ======================================
// GET LOGS
// ======================================
app.get('/log', async (req, res) => {

  try {

    const response = await axios.get(

      'http://monitoring:3004/log'

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'Monitoring service down'

    });

  }

});

// ======================================
// GET STATS
// ======================================
app.get('/stats', async (req, res) => {

  try {

    const response = await axios.get(

      'http://monitoring:3004/stats'

    );

    res.json(
      response.data
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: 'Stats service down'

    });

  }

});

// ======================================
// START SERVER
// ======================================
app.listen(8080, () => {

  console.log(
    'Gateway running on 8080'
  );

});