import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '../types';
import { API } from '../config/api';


export function useMenu() {
const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── FETCH ────────────────────────────────────────────────────────────────
  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API.menu, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMenu(data);
      setUsingMock(false);
      setError(null);
    } catch (err) {
  console.error('❌ fetchMenu error:', err);
  setMenu([]);
  setUsingMock(false);
  setError('Backend tidak tersedia');
}finally {
      setLoading(false);
    }
  }, []);

  // ─── ADD ──────────────────────────────────────────────────────────────────
  const addMenu = useCallback(async (item: Omit<MenuItem, 'id' | 'created_at' | 'status'>) => {
    try {
      const res = await fetch(API.menu, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchMenu();
      return { success: true };
    } catch (err) {
      console.error('❌ addMenu error:', err);
      // Fallback: tambah lokal saja (demo mode)
      const newItem: MenuItem = {
        ...item,
        id: Date.now(),
        status: 'available',
        created_at: new Date().toISOString(),
      };
      setMenu(prev => [...prev, newItem]);
      return { success: true, demo: true };
    }
  }, [fetchMenu]);

  // ─── UPDATE STOCK ─────────────────────────────────────────────────────────
  const updateStock = useCallback(async (id: number, newStock: number) => {
    // Optimistic update — langsung update UI dulu
    setMenu(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));

    try {
      const res = await fetch(`${API.menu}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { success: true };
    } catch (err) {
      console.error('❌ updateStock error:', err);
      // Kalau gagal, refresh dari server untuk sinkronisasi
      await fetchMenu();
      return { success: false };
    }
  }, [fetchMenu]);

  // ─── DELETE ───────────────────────────────────────────────────────────────
  const deleteItem = useCallback(async (id: number) => {
    // Optimistic update — langsung hapus dari UI dulu
    setMenu(prev => prev.filter(item => item.id !== id));

    try {
      const res = await fetch(`${API.menu}/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { success: true };
    } catch (err) {
      console.error('❌ deleteItem error:', err);
      // Kalau gagal, kembalikan data dari server
      await fetchMenu();
      return { success: false };
    }
  }, [fetchMenu]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return { menu, loading, usingMock, error, refeytch: fetchMenu, addMenu, updateStock, deleteItem };
}