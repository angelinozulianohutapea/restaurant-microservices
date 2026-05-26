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
// HEALTH CHECK
// =====================================
app.get('/health', (req, res) => {

  res.json({

    status: 'UP',

    service: 'menu-service',

    database: 'ACTIVE'

  });

});

// =====================================
// GET MENU
// =====================================
app.get('/menu', async (req, res) => {

  try {

    const result = await primaryDB.query(`

      SELECT

      id,
      menu_name,
      category,
      description,
      price,
      stock,
      image_url,
      status,
      created_at

      FROM menus

      ORDER BY id ASC

    `);

    res.json(result.rows);

  } catch (err) {

    console.error(
      'MENU ERROR:',
      err.message
    );

    res.status(500).json({

      error: 'Gagal mengambil menu'

    });

  }

});

// =====================================
// ADD MENU
// =====================================
app.post('/menu', async (req, res) => {

  try {

    const {

      menu_name,
      category,
      description,
      price,
      stock,
      image_url

    } = req.body;

    if (

      !menu_name ||
      !category ||
      !description ||
      !price

    ) {

      return res.status(400).json({

        message: 'Data menu tidak lengkap'

      });

    }

    const result = await primaryDB.query(

      `

      INSERT INTO menus
      (
        menu_name,
        category,
        description,
        price,
        stock,
        image_url
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )

      RETURNING *

      `,

      [

        menu_name,
        category,
        description,
        price,
        stock || 0,
        image_url || null

      ]

    );

    res.json({

      message: 'Menu berhasil ditambahkan',

      menu: result.rows[0]

    });

  } catch (err) {

    console.error(
      'ADD MENU ERROR:',
      err.message
    );

    res.status(500).json({

      error: 'Gagal menambahkan menu'

    });

  }

});


// =====================================
// START SERVER
// =====================================
app.listen(3002, () => {

  console.log(
    'Menu Service running on 3002'
  );

});