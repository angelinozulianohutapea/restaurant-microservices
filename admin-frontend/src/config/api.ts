// =============================================
// API CONFIG — GATEWAY BASE URL
// Gunakan IP server, bukan localhost,
// karena browser mengakses dari luar server
// =============================================
export const GATEWAY_URL = 'http://10.95.249.151:8080';

export const API = {
  // USER
  register: `${GATEWAY_URL}/user/register`,
  login:    `${GATEWAY_URL}/user/login`,
  users:    `${GATEWAY_URL}/users`,
  // MENU
  menu:     `${GATEWAY_URL}/menu`,
  // ORDER
  order:    `${GATEWAY_URL}/order`,
  orders:   `${GATEWAY_URL}/orders`,
  // PAYMENT
  payment:  `${GATEWAY_URL}/payment`,
  payments: `${GATEWAY_URL}/payments`,
  // MONITORING
  log:      `${GATEWAY_URL}/log`,
  stats:    `${GATEWAY_URL}/stats`,
  // HEALTH CHECKS (direct ke tiap service via IP)
  health: {
    gateway:       `${GATEWAY_URL}/`,
    user:          `http://10.95.249.151:3000/health`,
    menu:          `http://10.95.249.151:3002/health`,
    payment:       `http://10.95.249.151:3003/health`,
    monitoring:    `http://10.95.249.151:3004/health`,
    orderService1: `http://10.95.249.151:3001/health`,
    orderService2: `http://10.95.249.151:3005/health`,
    dbStatus:      `http://10.95.249.151:3004/db-status`,
  },
};