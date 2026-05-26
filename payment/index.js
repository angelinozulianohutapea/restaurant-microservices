const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

// =====================================
// PRIMARY DATABASE
// =====================================
const primaryDB = new Pool({

  host: '10.95.249.151',

  user: 'postgres',

  password: '123',

  database: 'restoran',

  port: 5432

});

// =====================================
// REPLICA DATABASE
// =====================================
const replicaDB = new Pool({

  host: '10.95.249.151',

  user: 'postgres',

  password: '123',

  database: 'restoran',

  port: 5432

});

// =====================================
// SAFE WRITE
// =====================================
async function writeQuery(query, params) {

  try {

    return await primaryDB.query(
      query,
      params
    );

  } catch (err) {

    console.log(
      'PRIMARY DOWN, PAKAI REPLICA'
    );

    return await replicaDB.query(
      query,
      params
    );

  }

}

// =====================================
// HEALTH CHECK
// =====================================
app.get('/health', (req, res) => {

  res.json({

    status: 'UP',

    service: 'payment-service',

    database: 'ACTIVE'

  });

});

// =====================================
// PAYMENT
// =====================================
app.post('/payment', async (req, res) => {

  try {

    const {

      order_id,
      amount,
      payment_method

    } = req.body;

    // VALIDASI
    if (

      !order_id ||
      !amount ||
      !payment_method

    ) {

      return res.status(400).json({

        error: 'Data payment tidak lengkap'

      });

    }

    // TRANSACTION CODE
    const transactionCode =

      'TRX-' +
      Date.now();

    // =====================================
    // INSERT PAYMENT
    // =====================================
    await writeQuery(

      `

      INSERT INTO payments
      (
        order_id,
        payment_method,
        amount,
        payment_status,
        transaction_code
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )

      `,

      [

        order_id,
        payment_method,
        amount,
        'paid',
        transactionCode

      ]

    );

    // =====================================
    // UPDATE ORDER
    // =====================================
    await writeQuery(

      `

      UPDATE orders

      SET

      payment_status = $1,
      order_status = $2

      WHERE id = $3

      `,

      [

        'paid',
        'completed',
        order_id

      ]

    );

    // =====================================
    // RESPONSE
    // =====================================
    res.json({

      success: true,

      status: 'paid',

      order_id: order_id,

      payment_method: payment_method,

      transaction_code: transactionCode

    });

  } catch (err) {

    console.error(
      'PAYMENT ERROR:',
      err.message
    );

    res.status(500).json({

      error: err.message

    });

  }

});

// =====================================
// GET PAYMENTS
// =====================================
app.get('/payments', async (req, res) => {

  try {

    const result = await primaryDB.query(

      `

      SELECT

      payments.id,
      payments.order_id,
      payments.payment_method,
      payments.amount,
      payments.payment_status,
      payments.transaction_code,
      payments.created_at

      FROM payments

      ORDER BY payments.id DESC

      `

    );

    res.json(
      result.rows
    );

  } catch (err) {

    console.error(
      'GET PAYMENTS ERROR:',
      err.message
    );

    res.status(500).json({

      error: 'Gagal mengambil payments'

    });

  }

});


// =====================================
// START SERVER
// =====================================
app.listen(3003, () => {

  console.log(
    'Payment Service running on 3003'
  );

});