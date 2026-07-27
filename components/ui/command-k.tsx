'use client';

import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Sparkles, Command } from 'lucide-react';

export function GlobalCommandK() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="p-3 border-b border-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, practices, tags, or run AI query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-100 text-sm focus:outline-none placeholder:text-slate-500"
            autoFocus
          />
          <span className="text-[10px] text-slate-500 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </div>

        <div className="p-2 space-y-1 text-xs text-slate-300">
          <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generate Morning AI Action Briefing</span>
          </div>
          <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-2">
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import CSV Lead List</span>
          </div>
        </div>
      </div>
    </div>
  );
}