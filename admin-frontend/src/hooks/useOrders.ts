import { useState, useEffect, useCallback } from 'react';
import { Order } from '../types';
import { API } from '../config/api';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API.orders, {
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch orders (${res.status})`);
      }

      const data = await res.json();

      // memastikan data array
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }

    } catch (err) {
      console.error('Fetch Orders Error:', err);

      // kosongkan data jika gagal
      setOrders([]);

      setError('Tidak dapat mengambil data order dari server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}