import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Search, 
  PieChart, 
  Tag, 
  Clock,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES } from '../data/initialData';

export default function TransactionLedger({ onOpenAddModal }) {
  const { transactions } = useFinance();
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Category distribution calculation
  const categoryStats = useMemo(() => {
    const map = {};
    let totalDebit = 0;

    transactions.forEach(t => {
      if (t.type !== 'income' && t.category !== 'budget') {
        const amt = Number(t.amount) || 0;
        map[t.category] = (map[t.category] || 0) + amt;
        totalDebit += amt;
      }
    });

    return {
      map,
      totalDebit: Math.max(1, totalDebit)
    };
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all') {
        if (filterType === 'income' && t.type !== 'income') return false;
        if (filterType === 'expense' && t.type !== 'expense') return false;
        if (filterType === 'commitment' && t.type !== 'commitment') return false;
        if (filterType === 'subscription' && t.type !== 'subscription') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          (t.note && t.note.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  return (
    <div className="glass-panel p-6 sm:p-7 space-y-6 shadow-2xl">
      
      {/* Header and Add button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-violet-400 uppercase tracking-wider mb-1">
            <Receipt className="w-3.5 h-3.5" />
            Financial Audit Ledger & Activity
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
            Spending Distribution & Transaction Log
          </h3>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 font-bold shadow-lg"
        >
          <span>+ Log Spend / Income</span>
        </button>
      </div>

      {/* Category Distribution Bar */}
      <div className="bg-[#0b1022] p-4 rounded-2xl border border-white/10 shadow-inner">
        <div className="flex justify-between text-xs text-slate-300 font-mono mb-2.5">
          <span className="font-bold">Expense Distribution (₹{categoryStats.totalDebit.toLocaleString('en-IN')} debited)</span>
          <span className="text-cyan-400">Budget Share %</span>
        </div>

        <div className="w-full h-3.5 rounded-full bg-slate-900 overflow-hidden flex border border-white/5">
          {Object.entries(categoryStats.map).map(([catId, amount]) => {
            const catObj = CATEGORIES.find(c => c.id === catId);
            const color = catObj?.color || '#8B5CF6';
            const pct = (amount / categoryStats.totalDebit) * 100;
            if (pct < 1) return null;

            return (
              <div
                key={catId}
                style={{ width: `${pct}%`, backgroundColor: color }}
                title={`${catObj?.label || catId}: ₹${amount} (${Math.round(pct)}%)`}
                className="h-full transition-all hover:opacity-85"
              />
            );
          })}
        </div>

        {/* Category Legend Chips */}
        <div className="flex flex-wrap gap-2 mt-3.5">
          {Object.entries(categoryStats.map).map(([catId, amount]) => {
            const catObj = CATEGORIES.find(c => c.id === catId);
            const color = catObj?.color || '#8B5CF6';
            const pct = Math.round((amount / categoryStats.totalDebit) * 100);

            return (
              <div
                key={catId}
                className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-1 rounded-xl border border-white/5"
              >
                <span className="w-2.5 h-2.5 rounded-full shadow" style={{ backgroundColor: color }} />
                <span>{catObj?.label || catId}:</span>
                <span className="font-mono font-bold text-white">₹{amount}</span>
                <span className="text-slate-400 font-mono text-[10px]">({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'expense', label: 'Discretionary' },
            { id: 'commitment', label: 'Bills & Rent' },
            { id: 'subscription', label: 'Subscriptions' },
            { id: 'income', label: 'Income & Inflows' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all ${
                filterType === f.id
                  ? 'bg-violet-600/30 text-white border border-violet-500/50 shadow'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="bg-[#0b1022] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 shadow-inner w-56 sm:w-64"
          />
        </div>

      </div>

      {/* Transaction Feed */}
      <div className="divide-y divide-white/5 max-h-[460px] overflow-y-auto pr-1 space-y-1">
        {filteredTransactions.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-xs">
            No transactions match your search filter.
          </div>
        ) : (
          filteredTransactions.map(tx => {
            const isCredit = tx.type === 'income';
            const catObj = CATEGORIES.find(c => c.id === tx.category);

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.03] px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow ${
                    isCredit 
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                      : 'bg-[#0f1428] border-white/10 text-slate-300'
                  }`}>
                    {isCredit ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-rose-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate flex items-center gap-2">
                      <span>{tx.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        Day {tx.day}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      {tx.note || catObj?.label || tx.category}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className={`font-mono font-black text-base ${
                    isCredit ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {isCredit ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400 capitalize font-mono bg-white/5 px-2 py-0.5 rounded-md">
                    {tx.type}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
