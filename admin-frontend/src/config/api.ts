// =============================================
// API CONFIG — GATEWAY BASE URL
// =============================================

export const GATEWAY_URL = 'http://localhost:8080';

export const API = {
  // USER
  register: `${GATEWAY_URL}/user/register`,
  login: `${GATEWAY_URL}/user/login`,
  users: `${GATEWAY_URL}/users`,

  // MENU
  menu: `${GATEWAY_URL}/menu`,

  // ORDER
  order: `${GATEWAY_URL}/order`,
  orders: `${GATEWAY_URL}/orders`,

  // PAYMENT
  payment: `${GATEWAY_URL}/payment`,
  payments: `${GATEWAY_URL}/payments`,

  // MONITORING
  log: `${GATEWAY_URL}/log`,
  stats: `${GATEWAY_URL}/stats`,

  // HEALTH CHECKS (direct service)
  health: {
    gateway: `${GATEWAY_URL}/`,
    user: `http://localhost:3000/health`,
    menu: `http://localhost:3002/health`,
    payment: `http://localhost:3003/health`,
    monitoring: `http://localhost:3004/health`,
    orderService1: `http://localhost:3001/health`,
    orderService2: `http://localhost:3005/health`,
    dbStatus: `http://localhost:3004/db-status`,
  },
};
