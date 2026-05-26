import { useState, useEffect, useCallback } from 'react';
import { Order } from '../types';
import { API } from '../config/api';

const MOCK_ORDERS: Order[] = [
  { id: 1, full_name: 'Budi Santoso', menu_name: 'Nasi Goreng Special', quantity: 2, total_price: 54000, order_status: 'completed', payment_status: 'paid', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, full_name: 'Siti Rahma', menu_name: 'Mie Ayam Bakso', quantity: 1, total_price: 27000, order_status: 'completed', payment_status: 'paid', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, full_name: 'Andi Wijaya', menu_name: 'Sate Ayam', quantity: 3, total_price: 81000, order_status: 'created', payment_status: 'unpaid', created_at: new Date(Date.now() - 900000).toISOString() },
  { id: 4, full_name: 'Dewi Kusuma', menu_name: 'Rendang Daging', quantity: 1, total_price: 45000, order_status: 'completed', payment_status: 'paid', created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: 5, full_name: 'Rizky Pratama', menu_name: 'Ayam Bakar', quantity: 2, total_price: 68000, order_status: 'completed', payment_status: 'paid', created_at: new Date(Date.now() - 18000000).toISOString() },
  { id: 6, full_name: 'Linda Sari', menu_name: 'Gado-gado', quantity: 1, total_price: 22000, order_status: 'created', payment_status: 'unpaid', created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 7, full_name: 'Hendra Putra', menu_name: 'Soto Ayam', quantity: 2, total_price: 44000, order_status: 'completed', payment_status: 'paid', created_at: new Date(Date.now() - 21600000).toISOString() },
  { id: 8, full_name: 'Maya Indah', menu_name: 'Bakso Urat', quantity: 3, total_price: 75000, order_status: 'completed', payment_status: 'paid', created_at: new Date(Date.now() - 28800000).toISOString() },
  { id: 9, full_name: 'Fajar Nugroho', menu_name: 'Nasi Padang', quantity: 1, total_price: 38000, order_status: 'completed', payment_status: 'paid', created_at: new Date(Date.now() - 32400000).toISOString() },
  { id: 10, full_name: 'Rini Wulandari', menu_name: 'Mie Goreng Jawa', quantity: 2, total_price: 50000, order_status: 'created', payment_status: 'unpaid', created_at: new Date(Date.now() - 120000).toISOString() },
];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API.orders, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data);
      setUsingMock(false);
    } catch {
      setOrders(MOCK_ORDERS);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, usingMock, refetch: fetchOrders };
}
