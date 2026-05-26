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
// GET MENU (hanya yang available)
// =====================================
app.get('/menu', async (req, res) => {
  try {
    const result = await primaryDB.query(`
      SELECT
        id, menu_name, category, description,
        price, stock, image_url, status, created_at
      FROM menus
      WHERE status != 'unavailable'
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('MENU ERROR:', err.message);
    res.status(500).json({ error: 'Gagal mengambil menu' });
  }
});

// =====================================
// ADD MENU
// =====================================
app.post('/menu', async (req, res) => {
  try {
    const { menu_name, category, description, price, stock, image_url } = req.body;
    if (!menu_name || !category || !description || !price) {
      return res.status(400).json({ message: 'Data menu tidak lengkap' });
    }
    const result = await primaryDB.query(
      `INSERT INTO menus (menu_name, category, description, price, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [menu_name, category, description, price, stock || 0, image_url || null]
    );
    res.json({ message: 'Menu berhasil ditambahkan', menu: result.rows[0] });
  } catch (err) {
    console.error('ADD MENU ERROR:', err.message);
    res.status(500).json({ error: 'Gagal menambahkan menu' });
  }
});

// =====================================
// UPDATE MENU (stock / data lainnya)
// =====================================
app.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_name, category, description, price, stock, image_url, status } = req.body;

    const result = await primaryDB.query(
      `UPDATE menus SET
        menu_name   = COALESCE($1, menu_name),
        category    = COALESCE($2, category),
        description = COALESCE($3, description),
        price       = COALESCE($4, price),
        stock       = COALESCE($5, stock),
        image_url   = COALESCE($6, image_url),
        status      = COALESCE($7, status)
       WHERE id = $8
       RETURNING *`,
      [menu_name, category, description, price, stock, image_url, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Menu tidak ditemukan' });
    }

    res.json({ message: 'Menu berhasil diupdate', menu: result.rows[0] });
  } catch (err) {
    console.error('UPDATE MENU ERROR:', err.message);
    res.status(500).json({ error: 'Gagal mengupdate menu' });
  }
});

// =====================================
// DELETE MENU (soft delete)
// =====================================
app.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await primaryDB.query(
      `UPDATE menus SET status = 'unavailable' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Menu tidak ditemukan' });
    }

    res.json({ message: 'Menu berhasil dihapus', menu: result.rows[0] });
  } catch (err) {
    console.error('DELETE MENU ERROR:', err.message);
    res.status(500).json({ error: 'Gagal menghapus menu' });
  }
});

// =====================================
// START SERVER
// =====================================
app.listen(3002, () => {
  console.log('Menu Service running on 3002');
});