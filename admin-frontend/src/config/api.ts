// =============================================
// API CONFIG — GATEWAY BASE URL
// =============================================

export const GATEWAY_URL =
  'http://10.95.249.151:8080';

// =============================================
// API ENDPOINTS
// =============================================

export const API = {

  // ===========================================
  // USER SERVICE
  // ===========================================

  register:
    `${GATEWAY_URL}/user/register`,

  login:
    `${GATEWAY_URL}/user/login`,

  users:
    `${GATEWAY_URL}/users`,

  // ===========================================
  // MENU SERVICE
  // ===========================================

  menu:
    `${GATEWAY_URL}/menu`,

  // ===========================================
  // ORDER SERVICE
  // ===========================================

  order:
    `${GATEWAY_URL}/order`,

  orders:
    `${GATEWAY_URL}/orders`,

  // ===========================================
  // PAYMENT SERVICE
  // ===========================================

  payment:
    `${GATEWAY_URL}/payment`,

  payments:
    `${GATEWAY_URL}/payments`,

  // ===========================================
  // MONITORING SERVICE
  // ===========================================

  log:
    `${GATEWAY_URL}/log`,

  stats:
    `${GATEWAY_URL}/stats`,

  // ===========================================
  // ANALYTICS SERVICE
  // ===========================================

  analytics:
    `${GATEWAY_URL}/analytics`,

  // ===========================================
  // HEALTH CHECKS
  // ===========================================

  health: {

    // GATEWAY

    gateway:
      `${GATEWAY_URL}/`,

    // USER

    user:
      `http://10.95.249.151:3000/health`,

    // MENU

    menu:
      `http://10.95.249.151:3002/health`,

    // PAYMENT

    payment:
      `http://10.95.249.151:3003/health`,

    // MONITORING

    monitoring:
      `http://10.95.249.151:3004/health`,

    // ORDER SERVICES

    orderService1:
      `http://10.95.249.151:3001/health`,

    orderService2:
      `http://10.95.249.151:3005/health`,

    // DATABASE STATUS

    dbStatus:
      `http://10.95.249.151:3004/db-status`,
  },
};