import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useMenu } from '../hooks/useMenu';
import { MenuItem } from '../types';
import {
  Plus, Search, AlertTriangle, Package,
  Edit3, Trash2, RefreshCw, X, Check,
} from 'lucide-react';

// =============================================
// STOCK LEVEL BADGE
// =============================================
function StockBadge({ stock }: { stock: number }) {
  if (stock <= 2) return <Badge variant="danger" dot>{stock}</Badge>;
  if (stock <= 5) return <Badge variant="warning" dot>{stock}</Badge>;
  return <Badge variant="success">{stock}</Badge>;
}

// =============================================
// EDIT STOCK MODAL
// =============================================
interface EditModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (id: number, stock: number) => void;
}

function EditStockModal({ item, onClose, onSave }: EditModalProps) {
  const [stock, setStock] = useState(item?.stock ?? 0);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900">Update Stock</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-800">{item.menu_name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.category} · Rp {item.price.toLocaleString('id-ID')}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Stock Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStock(s => Math.max(0, s - 1))}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
              >
                −
              </button>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 text-center text-lg font-bold text-slate-900 border border-slate-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={0}
              />
              <button
                onClick={() => setStock(s => s + 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
              >
                +
              </button>
            </div>
            {stock <= 5 && (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <AlertTriangle size={11} />
                Low stock warning threshold
              </p>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              className="flex-1"
              icon={<Check size={14} />}
              onClick={() => { onSave(item.id, stock); onClose(); }}
            >
              Save Stock
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// ADD MENU MODAL
// =============================================
interface AddMenuModalProps {
  onClose: () => void;
  onAdd: (item: Omit<MenuItem, 'id' | 'created_at' | 'status'>) => void;
}

const CATEGORIES = ['Makanan', 'Minuman', 'Snack', 'Dessert'];

function AddMenuModal({ onClose, onAdd }: AddMenuModalProps) {
  const [form, setForm] = useState({
    menu_name: '',
    category: 'Makanan',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });

  const handleChange = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    if (!form.menu_name || !form.price) return;
    onAdd({
      menu_name: form.menu_name,
      category: form.category,
      description: form.description,
      price: parseInt(form.price),
      stock: parseInt(form.stock) || 0,
      image_url: form.image_url || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900">Add Menu Item</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { key: 'menu_name', label: 'Menu Name', placeholder: 'Nasi Goreng Special', type: 'text' },
            { key: 'description', label: 'Description', placeholder: 'Deskripsi menu...', type: 'text' },
            { key: 'price', label: 'Price (Rp)', placeholder: '25000', type: 'number' },
            { key: 'stock', label: 'Initial Stock', placeholder: '50', type: 'number' },
            { key: 'image_url', label: 'Image URL (optional)', placeholder: 'https://...', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              className="flex-1"
              icon={<Plus size={14} />}
              onClick={handleSubmit}
              disabled={!form.menu_name || !form.price}
            >
              Add Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================
export function StockPage() {
  const { menu, loading, refetch, addMenu, updateStock, deleteItem } = useMenu();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['All', ...Array.from(new Set(menu.map(m => m.category)))];

  const filtered = menu.filter(m => {
    const matchSearch = !search || m.menu_name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || m.category === filterCategory;
    return matchSearch && matchCat;
  });

  const lowStockItems = menu.filter(m => m.stock <= 5);
  const outOfStock = menu.filter(m => m.stock === 0);

  return (
    <div className="space-y-6">
      {/* Modals */}
      {editingItem && (
        <EditStockModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={updateStock}
        />
      )}
      {showAddModal && (
        <AddMenuModal
          onClose={() => setShowAddModal(false)}
          onAdd={addMenu}
        />
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Menu', value: menu.length, color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <Package size={18} /> },
          { label: 'Low Stock (≤5)', value: lowStockItems.length, color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <AlertTriangle size={18} /> },
          { label: 'Out of Stock', value: outOfStock.length, color: 'bg-red-50 text-red-700 border-red-200', icon: <X size={18} /> },
          { label: 'Categories', value: categories.length - 1, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <Package size={18} /> },
        ].map(item => (
          <div key={item.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${item.color}`}>
            {item.icon}
            <div>
              <p className="text-xl font-bold">{item.value}</p>
              <p className="text-xs font-medium opacity-70">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Warning */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-600" />
            <p className="text-sm font-semibold text-amber-700">Low Stock Alert — {lowStockItems.length} items need restocking</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 bg-white border border-amber-200 rounded-xl px-3 py-1.5">
                <span className="text-xs font-medium text-slate-700">{item.menu_name}</span>
                <span className={`text-xs font-bold ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                  {item.stock === 0 ? 'OUT' : `${item.stock} left`}
                </span>
                <button
                  onClick={() => setEditingItem(item)}
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
                >
                  Restock →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <Card padding="none">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-slate-100">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search menu item..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    filterCategory === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />}
              onClick={refetch}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={13} />}
              onClick={() => setShowAddModal(true)}
            >
              Add Menu
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['ID', 'Menu Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">#{item.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.menu_name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[180px]">{item.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">{item.category}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold text-slate-700">Rp {item.price.toLocaleString('id-ID')}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StockBadge stock={item.stock} />
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={item.status === 'available' ? 'success' : 'neutral'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit3 size={13} />}
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={13} />}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        onClick={() => deleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of <span className="font-semibold text-slate-700">{menu.length}</span> items
          </p>
        </div>
      </Card>
    </div>
  );
}
