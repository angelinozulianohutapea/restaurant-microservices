const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

// ======================================
// DATABASE VIA HAPROXY
// ======================================

const db = new Pool({
  host: '10.95.249.151',
  port: 5432,
  user: 'postgres',
  password: '123',
  database: 'restoran'
});

// ======================================
// INIT DB
// ======================================

async function initDB() {

  await db.query(`

    CREATE TABLE IF NOT EXISTS users (

      id SERIAL PRIMARY KEY,

      full_name VARCHAR(100),

      username VARCHAR(50) UNIQUE,

      email VARCHAR(100) UNIQUE,

      phone VARCHAR(20),

      address TEXT,

      password TEXT,

      role VARCHAR(20) DEFAULT 'customer',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    )

  `);

  console.log(
    'Users table ready'
  );
}

// ======================================
// REGISTER
// ======================================

app.post('/register', async (req, res) => {

  try {

    const {

      full_name,
      username,
      email,
      phone,
      address,
      password

    } = req.body;

    // VALIDASI
    if (

      !full_name ||
      !username ||
      !email ||
      !phone ||
      !address ||
      !password

    ) {

      return res.status(400).json({

        message: 'Data tidak lengkap'

      });

    }

    // CEK EMAIL
    const checkEmail = await db.query(

      'SELECT * FROM users WHERE email=$1',

      [email]

    );

    if (checkEmail.rows.length > 0) {

      return res.status(400).json({

        message: 'Email sudah digunakan'

      });

    }

    // CEK USERNAME
    const checkUsername = await db.query(

      'SELECT * FROM users WHERE username=$1',

      [username]

    );

    if (checkUsername.rows.length > 0) {

      return res.status(400).json({

        message: 'Username sudah digunakan'

      });

    }

    // INSERT USER
    const result = await db.query(

      `

      INSERT INTO users
      (
        full_name,
        username,
        email,
        phone,
        address,
        password
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

      RETURNING id

      `,

      [

        full_name,
        username,
        email,
        phone,
        address,
        password

      ]

    );

    res.json({

      message: 'Register berhasil',

      user_id: result.rows[0].id,

      username: username

    });

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: err.message

    });

  }
});

// ======================================
// LOGIN
// ======================================

app.post('/login', async (req, res) => {

  try {

    const {

      email,
      password

    } = req.body;

    const result = await db.query(

      `

      SELECT
      id,
      full_name,
      username,
      email,
      phone,
      address,
      role,
      created_at

      FROM users

      WHERE
      email=$1
      AND password=$2

      `,

      [

        email,
        password

      ]

    );

    if (result.rows.length === 0) {

      return res.status(401).json({

        message: 'Login gagal'

      });

    }

    res.json({

      message: 'Login berhasil',

      user: result.rows[0]

    });

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: err.message

    });

  }
});

// ======================================
// GET USERS
// ======================================

app.get('/users', async (req, res) => {

  try {

    const result = await db.query(

      `

      SELECT
      id,
      full_name,
      username,
      email,
      phone,
      address,
      role,
      created_at

      FROM users

      ORDER BY id

      `

    );

    res.json(
      result.rows
    );

  } catch (err) {

    console.error(
      err.message
    );

    res.status(500).json({

      error: err.message

    });

  }
});

// ======================================
// HEALTH CHECK
// ======================================

app.get('/health', (req, res) => {

  res.json({

    status: 'User Service OK',

    database: 'HAProxy ACTIVE'

  });

});

// ======================================
// START SERVER
// ======================================

const PORT = 3000;

app.listen(PORT, async () => {

  console.log(
    'User Service berjalan di port ' + PORT
  );

  await initDB();

});