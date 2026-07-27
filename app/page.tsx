'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Upload, Plus, Search, AlertCircle, ArrowRight } from 'lucide-react';

export default function DailyBriefingDashboard() {
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // Form State for Manual Lead Entry
  const [newLead, setNewLead] = useState({
    first_name: '',
    last_name: '',
    practice_name: '',
    email: '',
    website: '',
    speciality: '',
    notes: '',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Top Header & Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Altus Axis <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Sales OS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Daily AI Action Intelligence & Pipeline Command</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium px-3.5 py-2 rounded-lg text-xs transition"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            Import CSV
          </button>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium px-3.5 py-2 rounded-lg text-xs transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            Add Lead
          </button>

          <button 
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Run AI Pipeline Analysis
          </button>
        </div>
      </header>

      {/* AI Executive Summary Card */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-xl p-6 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/20 border border-indigo-500/40 rounded-lg text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Good Morning. Today's Strategic Focus</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              System initialized. Import your leads or add contacts manually using the buttons above to trigger live OpenAI scoring and priority management.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Highest Impact Tasks', val: '0', color: 'text-indigo-400' },
          { label: 'Hot Opportunities', val: '0', color: 'text-emerald-400' },
          { label: 'Proposals Needing Follow-up', val: '0', color: 'text-amber-400' },
          { label: 'Leads On Hold', val: '0', color: 'text-slate-400' }
        ].map((m, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">{m.label}</p>
            <p className={`text-2xl font-bold mt-2 ${m.color}`}>{m.val}</p>
          </div>
        ))}
      </div>

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" /> Upload Lead List (.CSV)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select a CSV file containing contact records. Headers like <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">First Name</code>, <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">Email</code>, <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">Website</code>, and <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">Notes</code> will map automatically.
            </p>
            <input 
              type="file" 
              accept=".csv"
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Add New Lead Record
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">First Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sarah" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Last Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Johnson" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email *</label>
                <input 
                  type="email" 
                  placeholder="sarah@example.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Practice / Business Name</label>
                <input 
                  type="text" 
                  placeholder="Mindful Healing" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Website URL</label>
                <input 
                  type="text" 
                  placeholder="https://example.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Notes / Observations</label>
                <textarea 
                  placeholder="e.g., Mentioned site is slow on mobile. Busy until next month." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 h-20 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
