const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

// =====================================================
// DATABASE CONFIG
// =====================================================

const PRIMARY_DB = {
  host: '10.95.249.151',
  user: 'postgres',
  password: '123',
  database: 'restoran',
  port: 5432,
};

const REPLICA_DB = {
  host: '10.95.249.151',
  user: 'postgres',
  password: '123',
  database: 'restoran',
  port: 5433,
};

// =====================================================
// DATABASE POOLS
// =====================================================

let currentRole = 'PRIMARY';

const primaryPool = new Pool(PRIMARY_DB);

const replicaPool = new Pool(REPLICA_DB);

// =====================================================
// DATABASE FAILOVER HELPER
// =====================================================

async function getActiveDB() {
  try {
    await primaryPool.query('SELECT NOW()');

    currentRole = 'PRIMARY';

    return {
      db: primaryPool,
      role: 'PRIMARY',
      host: PRIMARY_DB.host,
      port: PRIMARY_DB.port,
      status: 'ONLINE',
    };
  } catch (primaryError) {
    console.log('PRIMARY DOWN -> switching to REPLICA');

    try {
      await replicaPool.query('SELECT NOW()');

      currentRole = 'REPLICA';

      return {
        db: replicaPool,
        role: 'REPLICA',
        host: REPLICA_DB.host,
        port: REPLICA_DB.port,
        status: 'FAILOVER ACTIVE',
      };
    } catch (replicaError) {
      throw new Error('ALL DATABASE NODES DOWN');
    }
  }
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/health', async (req, res) => {
  try {
    const active = await getActiveDB();

    res.json({
      status: 'UP',
      service: 'monitoring-service',
      database_role: active.role,
      database_host: active.host,
      database_port: active.port,
      failover_status:
        active.role === 'PRIMARY'
          ? 'NORMAL'
          : 'REPLICA PROMOTED',
      database_status: active.status,
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      service: 'monitoring-service',
      error: err.message,
    });
  }
});

// =====================================================
// CREATE LOG
// =====================================================

app.post('/log', async (req, res) => {
  try {
    const {
      service_name,
      log_level,
      message,
    } = req.body;

    if (
      !service_name ||
      !log_level ||
      !message
    ) {
      return res.status(400).json({
        error: 'Data log tidak lengkap',
      });
    }

    const active = await getActiveDB();

    await active.db.query(
      `
      INSERT INTO logs
      (
        service_name,
        log_level,
        message
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      `,
      [
        service_name,
        log_level,
        message,
      ]
    );

    console.log(
      `[${active.role}] LOG SAVED:`,
      service_name,
      log_level
    );

    res.json({
      success: true,
      database_role: active.role,
      failover_status:
        active.role === 'PRIMARY'
          ? 'NORMAL'
          : 'REPLICA ACTIVE',
      message: 'Log berhasil disimpan',
    });
  } catch (err) {
    console.error(
      'LOG ERROR:',
      err.message
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

// =====================================================
// GET LOGS
// =====================================================

app.get('/log', async (req, res) => {
  try {
    const active = await getActiveDB();

    const result = await active.db.query(`
      SELECT
        id,
        service_name,
        log_level,
        message,
        created_at
      FROM logs
      ORDER BY id DESC
      LIMIT 100
    `);

    res.json({
      database_role: active.role,
      failover_status:
        active.role === 'PRIMARY'
          ? 'NORMAL'
          : 'REPLICA ACTIVE',
      total_logs: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error(
      'GET LOG ERROR:',
      err.message
    );

    res.status(500).json({
      error: 'Gagal mengambil logs',
    });
  }
});

// =====================================================
// SYSTEM STATS
// =====================================================

app.get('/stats', async (req, res) => {
  try {
    const active = await getActiveDB();

    const users = await active.db.query(
      'SELECT COUNT(*) FROM users'
    );

    const menus = await active.db.query(
      'SELECT COUNT(*) FROM menus'
    );

    const orders = await active.db.query(
      'SELECT COUNT(*) FROM orders'
    );

    const payments = await active.db.query(
      'SELECT COUNT(*) FROM payments'
    );

    const revenue = await active.db.query(`
      SELECT COALESCE(SUM(amount),0) AS total
      FROM payments
    `);

    const lowStock = await active.db.query(`
      SELECT COUNT(*)
      FROM menus
      WHERE stock <= 5
    `);

    const replicationStatus =
      active.role === 'PRIMARY'
        ? 'STREAMING'
        : 'PROMOTED TO PRIMARY';

    res.json({
      total_users:
        Number(users.rows[0].count),

      total_menu:
        Number(menus.rows[0].count),

      total_orders:
        Number(orders.rows[0].count),

      total_payments:
        Number(payments.rows[0].count),

      total_revenue:
        Number(revenue.rows[0].total),

      low_stock_items:
        Number(lowStock.rows[0].count),

      database_role: active.role,

      database_host: active.host,

      database_port: active.port,

      replication_status: replicationStatus,

      failover_status:
        active.role === 'PRIMARY'
          ? 'NORMAL'
          : 'ACTIVE',

      database_status: active.status,

      microservice: 'RUNNING',

      uptime: process.uptime(),

      timestamp: new Date(),
    });
  } catch (err) {
    console.error(
      'STATS ERROR:',
      err.message
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

// =====================================================
// DATABASE STATUS
// =====================================================

app.get('/db-status', async (req, res) => {
  try {
    let primaryStatus = 'DOWN';
    let replicaStatus = 'DOWN';

    try {
      await primaryPool.query('SELECT NOW()');
      primaryStatus = 'ONLINE';
    } catch {}

    try {
      await replicaPool.query('SELECT NOW()');
      replicaStatus = 'ONLINE';
    } catch {}

    res.json({
      primary: {
        host: PRIMARY_DB.host,
        port: PRIMARY_DB.port,
        status: primaryStatus,
      },

      replica: {
        host: REPLICA_DB.host,
        port: REPLICA_DB.port,
        status: replicaStatus,
      },

      active_node: currentRole,
      automatic_failover: currentRole !== 'PRIMARY',
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// =====================================================
// START SERVER
// =====================================================

app.listen(3004, () => {
  console.log(
    'Monitoring Service running on port 3004'
  );

  console.log(
    'Primary DB:',
    `${PRIMARY_DB.host}:${PRIMARY_DB.port}`
  );

  console.log(
    'Replica DB:',
    `${REPLICA_DB.host}:${REPLICA_DB.port}`
  );
});