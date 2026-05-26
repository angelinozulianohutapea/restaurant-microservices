const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

// =====================================
// DATABASE VIA HAPROXY
// =====================================

const db = new Pool({
  host: '10.95.249.151',
  port: 5432,
  user: 'postgres',
  password: '123',
  database: 'restoran'
});

// =====================================
// HEALTH CHECK
// =====================================

app.get('/health', (req, res) => {

  res.json({

    status: 'UP',

    service: 'order-service',

    HA: 'ACTIVE'

  });

});

// =====================================
// GET MENU
// =====================================

app.get('/menu', async (req, res) => {

  try {

    const result = await db.query(

      `

      SELECT

      id,
      menu_name,
      category,
      description,
      price,
      stock,
      image_url,
      status

      FROM menus

      ORDER BY id ASC

      `

    );

    res.json(
      result.rows
    );

  } catch (err) {

    console.error(
      'MENU ERROR:',
      err.message
    );

    res.status(500).json({

      error: err.message

    });

  }

});

// =====================================
// CREATE ORDER
// =====================================

app.post('/order', async (req, res) => {

  const {

    user_id,
    items

  } = req.body;

  console.log(
    'ORDER REQUEST:',
    JSON.stringify(req.body)
  );

  // VALIDASI
  if (

    !user_id ||
    !items ||
    items.length === 0

  ) {

    return res.status(400).json({

      error: 'Data order tidak valid'

    });

  }

  // =====================================
  // CONNECT DATABASE
  // =====================================

  const client =
    await db.connect();

  try {

    // =====================================
    // BEGIN TRANSACTION
    // =====================================

    await client.query('BEGIN');

    let total = 0;

    // =====================================
    // CHECK STOCK
    // =====================================

    for (const item of items) {

      console.log(

        'CHECK STOCK:',
        item.menu_id,
        item.quantity

      );

      const menuResult =
        await client.query(

          `

          SELECT

          id,
          menu_name,
          price,
          stock

          FROM menus

          WHERE id = $1

          FOR UPDATE

          `,

          [

            item.menu_id

          ]

        );

      // MENU TIDAK ADA
      if (
        menuResult.rows.length === 0
      ) {

        throw new Error(

          'Menu tidak ditemukan'

        );

      }

      const menu =
        menuResult.rows[0];

      // STOCK TIDAK CUKUP
      if (
        menu.stock < item.quantity
      ) {

        throw new Error(

          'Stock ' +
          menu.menu_name +
          ' tidak cukup'

        );

      }

      // TOTAL
      total += (

        menu.price *
        item.quantity

      );

    }

    // =====================================
    // INSERT ORDER
    // =====================================

    let orderId = null;

    for (const item of items) {

      const menuResult =
        await client.query(

          `

          SELECT
          price

          FROM menus

          WHERE id = $1

          `,

          [

            item.menu_id

          ]

        );

      const menuPrice =
        menuResult.rows[0].price;

      const subtotal =
        menuPrice *
        item.quantity;

      // INSERT ORDER
      const orderResult =
        await client.query(

          `

          INSERT INTO orders
          (
            user_id,
            menu_id,
            quantity,
            total_price,
            order_status,
            payment_status,
            notes
          )

          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
          )

          RETURNING id

          `,

          [

            user_id,
            item.menu_id,
            item.quantity,
            subtotal,
            'created',
            'unpaid',
            'Order berhasil dibuat'

          ]

        );

      orderId =
        orderResult.rows[0].id;

      console.log(
        'ORDER CREATED:',
        orderId
      );

      // =====================================
      // UPDATE STOCK
      // =====================================

      await client.query(

        `

        UPDATE menus

        SET stock = stock - $1

        WHERE id = $2

        `,

        [

          item.quantity,
          item.menu_id

        ]

      );

      console.log(

        'UPDATE STOCK:',
        item.menu_id

      );

    }

    // =====================================
    // COMMIT
    // =====================================

    await client.query('COMMIT');

    console.log(
      'TRANSACTION COMMIT'
    );

    // =====================================
    // RESPONSE
    // =====================================

    res.json({

      success: true,

      order_id: orderId,

      total_price: total,

      order_status: 'created',

      payment_status: 'unpaid',

      database: 'HAProxy ACTIVE'

    });

  } catch (err) {

    // =====================================
    // ROLLBACK
    // =====================================

    await client.query('ROLLBACK');

    console.error(
      'ORDER FAILED:',
      err.message
    );

    res.status(400).json({

      success: false,

      error: err.message

    });

  } finally {

    // =====================================
    // RELEASE CONNECTION
    // =====================================

    client.release();

  }

});

// =====================================
// GET ORDERS
// =====================================

app.get('/orders', async (req, res) => {

  try {

    const result = await db.query(

      `

      SELECT

      orders.id,
      users.full_name,
      menus.menu_name,
      orders.quantity,
      orders.total_price,
      orders.order_status,
      orders.payment_status,
      orders.created_at

      FROM orders

      JOIN users
      ON users.id = orders.user_id

      JOIN menus
      ON menus.id = orders.menu_id

      ORDER BY orders.id DESC

      `

    );

    res.json(
      result.rows
    );

  } catch (err) {

    console.error(
      'GET ORDERS ERROR:',
      err.message
    );

    res.status(500).json({

      error: err.message

    });

  }

});

// =====================================
// START SERVER
// =====================================

const PORT =
  process.env.PORT || 3005;

app.listen(PORT, () => {

  console.log(
    'Order Service running on port ' +
    PORT
  );

});