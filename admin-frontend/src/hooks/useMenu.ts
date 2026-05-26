import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '../types';
import { API } from '../config/api';

const MOCK_MENU: MenuItem[] = [
  { id: 1, menu_name: 'Nasi Goreng Special', category: 'Makanan', description: 'Nasi goreng dengan telur, ayam, dan sayuran segar', price: 27000, stock: 50, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, menu_name: 'Mie Ayam Bakso', category: 'Makanan', description: 'Mie dengan ayam suwir dan bakso sapi pilihan', price: 27000, stock: 35, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 3, menu_name: 'Sate Ayam', category: 'Makanan', description: '10 tusuk sate ayam dengan bumbu kacang spesial', price: 27000, stock: 4, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 4, menu_name: 'Rendang Daging', category: 'Makanan', description: 'Rendang daging sapi empuk bumbu rempah Padang', price: 45000, stock: 20, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 5, menu_name: 'Ayam Bakar', category: 'Makanan', description: 'Ayam kampung bakar bumbu kecap dengan lalapan', price: 34000, stock: 3, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 6, menu_name: 'Gado-gado', category: 'Makanan', description: 'Sayuran segar dengan saus kacang dan kerupuk', price: 22000, stock: 40, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 7, menu_name: 'Soto Ayam', category: 'Makanan', description: 'Soto kuning dengan ayam suwir dan bihun', price: 22000, stock: 45, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 8, menu_name: 'Bakso Urat', category: 'Makanan', description: 'Bakso urat dengan mie kuning dan tahu', price: 25000, stock: 2, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 9, menu_name: 'Es Teh Manis', category: 'Minuman', description: 'Teh manis dingin segar', price: 6000, stock: 100, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 10, menu_name: 'Jus Alpukat', category: 'Minuman', description: 'Jus alpukat segar dengan susu', price: 18000, stock: 25, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 11, menu_name: 'Nasi Padang', category: 'Makanan', description: 'Nasi dengan lauk pauk khas Padang', price: 38000, stock: 30, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 12, menu_name: 'Mie Goreng Jawa', category: 'Makanan', description: 'Mie goreng dengan bumbu Jawa dan telur ceplok', price: 25000, stock: 5, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 13, menu_name: 'Es Jeruk', category: 'Minuman', description: 'Jeruk peras dingin segar', price: 8000, stock: 80, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
  { id: 14, menu_name: 'Pisang Goreng', category: 'Snack', description: 'Pisang goreng tepung renyah dengan keju', price: 15000, stock: 1, image_url: null, status: 'available', created_at: '2024-01-01T00:00:00Z' },
];

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>(MOCK_MENU);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API.menu, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMenu(data);
      setUsingMock(false);
      setError(null);
    } catch {
      setMenu(MOCK_MENU);
      setUsingMock(true);
      setError('Backend unavailable — showing demo data');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMenu = useCallback(async (item: Omit<MenuItem, 'id' | 'created_at' | 'status'>) => {
    try {
      const res = await fetch(API.menu, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error();
      await fetchMenu();
      return { success: true };
    } catch {
      // Add locally for demo
      const newItem: MenuItem = {
        ...item,
        id: menu.length + 1,
        status: 'available',
        created_at: new Date().toISOString(),
      };
      setMenu(prev => [...prev, newItem]);
      return { success: true, demo: true };
    }
  }, [menu, fetchMenu]);

  const updateStock = useCallback((id: number, newStock: number) => {
    setMenu(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));
  }, []);

  const deleteItem = useCallback((id: number) => {
    setMenu(prev => prev.filter(item => item.id !== id));
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return { menu, loading, usingMock, error, refetch: fetchMenu, addMenu, updateStock, deleteItem };
}
