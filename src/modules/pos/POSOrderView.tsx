import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const categories = ["All", "Appetizers", "Main Course", "Desserts", "Beverages", "Spirits"];

export const POSOrderView: React.FC = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock menu data
    setMenu([
      { id: '1', name: 'Paneer Tikka', category: 'Appetizers', price: 350 },
      { id: '2', name: 'Chicken Biryani', category: 'Main Course', price: 450 },
      { id: '3', name: 'Dal Makhani', category: 'Main Course', price: 280 },
      { id: '4', name: 'Gulab Jamun', category: 'Desserts', price: 150 },
      { id: '5', name: 'Fresh Lime Soda', category: 'Beverages', price: 120 },
      { id: '6', name: 'Old Fashioned', category: 'Spirits', price: 550 },
      { id: '7', name: 'Butter Chicken', category: 'Main Course', price: 480 },
      { id: '8', name: 'Garlic Naan', category: 'Main Course', price: 60 },
    ]);
  }, []);

  const addToOrder = (item: MenuItem) => {
    setOrder(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (id: string) => {
    setOrder(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setOrder(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const total = order.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const filteredMenu = menu.filter(i => 
    (selectedCategory === "All" || i.category === selectedCategory) &&
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Left: Menu Area */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/pos')}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">New Order</h1>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search menu items..." 
              className="bg-transparent border-none outline-none text-sm w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border",
                selectedCategory === cat 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(item => (
            <div 
              key={item.id} 
              onClick={() => addToOrder(item)}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-sm font-black text-slate-900">{formatCurrency(item.price)}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{item.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Current Order */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900">Current Order</h2>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">Table T-04</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {order.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium">Your cart is empty.<br/>Select items from the menu.</p>
            </div>
          ) : (
            order.map(item => (
              <div key={item.id} className="flex items-start gap-4 group">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{item.name}</h4>
                  <p className="text-xs text-slate-400">{formatCurrency(item.price)} each</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center bg-slate-50 rounded-lg border border-slate-100">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:text-indigo-600 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:text-indigo-600 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromOrder(item.id)}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Service Charge (5%)</span>
              <span>{formatCurrency(total * 0.05)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Tax (GST 18%)</span>
              <span>{formatCurrency(total * 0.18)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="font-black text-slate-900">Total</span>
              <span className="font-black text-indigo-600 text-lg">{formatCurrency(total * 1.23)}</span>
            </div>
          </div>

          <button 
            disabled={order.length === 0}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
          >
            <CreditCard className="w-5 h-5" />
            Settle Bill
          </button>
        </div>
      </div>
    </div>
  );
};
