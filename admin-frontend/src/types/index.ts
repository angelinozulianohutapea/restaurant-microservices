// =============================================
// GLOBAL TYPES
// =============================================

export interface ServiceStatus {
  name: string;
  port: number;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  responseTime: number;
  uptime: number;
  lastChecked: Date;
  endpoint: string;
  description: string;
  icon: string;
}

export interface MenuItem {
  id: number;
  menu_name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  status: string;
  created_at: string;
}

export interface Order {
  id: number;
  full_name: string;
  menu_name: string;
  quantity: number;
  total_price: number;
  order_status: string;
  payment_status: string;
  created_at: string;
}

export interface Payment {
  id: number;
  order_id: number;
  payment_method: string;
  amount: number;
  payment_status: string;
  transaction_code: string;
  created_at: string;
}

export interface Log {
  id: number;
  service_name: string;
  log_level: string;
  message: string;
  created_at: string;
}

export interface Stats {
  total_users: number;
  total_menu: number;
  total_orders: number;
  total_payments: number;
  total_revenue: number;
  low_stock_items: number;
  database_role: string;
  database_host: string;
  database_port: number;
  replication_status: string;
  failover_status: string;
  database_status: string;
  microservice: string;
  uptime: number;
  timestamp: string;
}

export interface DBStatus {
  primary: {
    host: string;
    port: number;
    status: string;
  };
  replica: {
    host: string;
    port: number;
    status: string;
  };
  active_node: string;
  automatic_failover: boolean;
}

export interface User {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  created_at: string;
}

export type NavPage =
  | 'dashboard'
  | 'orders'
  | 'stock'

