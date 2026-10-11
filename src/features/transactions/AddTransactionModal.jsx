/**
 * @file AddTransactionModal.jsx
 * @description Manual Transaction and Financial Inflow/Outflow logging modal.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import React, { useState, useEffect, memo } from 'react';
import { 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  X 
} from 'lucide-react';
import { useFinance } from '../../core/hooks/useFinance';
import { CATEGORIES } from '../../data/initialData';

function AddTransactionModalComponent({ isOpen, onClose }) {
  const { addTransaction, currentDay, liquidBalance } = useFinance();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // expense | income
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    addTransaction(name.trim(), Number(amount), type, category, note.trim());
    setName('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-tx-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="glass-panel p-6 max-w-md w-full border border-violet-500/30 bg-[var(--bg-surface-2)] space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div id="add-tx-title" className="flex items-center gap-2 font-heading font-black text-white text-lg">
            <PlusCircle className="w-5 h-5 text-violet-400" aria-hidden="true" />
            <span>Log Financial Event (Day {currentDay})</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-violet-400 outline-none"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 bg-[var(--bg-inset)] p-1 rounded-xl border border-white/5" role="group" aria-label="Transaction Type">
            <button
              type="button"
              onClick={() => setType('expense')}
              aria-pressed={type === 'expense'}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-rose-400 outline-none ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-rose-400" aria-hidden="true" />
              <span>Spend / Expense</span>
            </button>

            <button
              type="button"
              onClick={() => setType('income')}
              aria-pressed={type === 'income'}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Income / Inflow</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="tx-name" className="text-xs text-slate-300 font-medium block mb-1">
              Description / Merchant
            </label>
            <input
              id="tx-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Swiggy Lunch with team or Chai"
              className="w-full bg-[var(--bg-inset)] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Amount */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="tx-amount" className="text-xs text-slate-300 font-medium">
                Amount in Rupees (₹)
              </label>
              {type === 'expense' && (
                <span className="text-[10px] text-slate-400 font-mono">
                  Available: ₹{liquidBalance}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm" aria-hidden="true">₹</span>
              <input
                id="tx-amount"
                type="number"
                required
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250"
                className="w-full bg-[var(--bg-inset)] border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <span className="text-xs text-slate-300 font-medium block mb-1.5">Category</span>
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all truncate focus-visible:ring-2 focus-visible:ring-violet-400 outline-none ${
                    category === c.id
                      ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                      : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span className="truncate">{c.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note / Tag */}
          <div>
            <label htmlFor="tx-note" className="text-xs text-slate-300 font-medium block mb-1">
              Optional Note
            </label>
            <input
              id="tx-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Split with 2 friends via UPI"
              className="w-full bg-[var(--bg-inset)] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary text-xs py-2.5 focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`flex-1 text-xs py-2.5 font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-violet-400 outline-none ${
                type === 'expense' ? 'btn-primary' : 'btn-success'
              }`}
            >
              {type === 'expense' ? 'Record Expense' : 'Record Inflow'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default memo(AddTransactionModalComponent);
