'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Upload, Plus, Search, AlertCircle, ArrowRight, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';

interface Lead {
  id?: string;
  first_name: string;
  last_name?: string;
  practice_name?: string;
  email: string;
  website?: string;
  notes?: string;
  priority_score?: number;
  suggested_action?: string;
}

export default function DailyBriefingDashboard() {
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  
  // Storage for imported leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);

  // Form State for Manual Lead Entry
  const [newLead, setNewLead] = useState<Lead>({
    first_name: '',
    last_name: '',
    practice_name: '',
    email: '',
    website: '',
    notes: '',
  });

  // 1. Handle CSV File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 2. Process CSV Upload & Parse Data
  const handleCsvSubmit = () => {
    if (!selectedFile) return;
    setIsProcessingCsv(true);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows = results.data as any[];
        
        // Map common CSV column names to our Lead structure
        const formattedLeads: Lead[] = parsedRows.map((row, idx) => ({
          id: `lead-${Date.now()}-${idx}`,
          first_name: row['First Name'] || row['first_name'] || row['Name'] || 'Contact',
          last_name: row['Last Name'] || row['last_name'] || '',
          practice_name: row['Company'] || row['Practice'] || row['practice_name'] || row['Business'] || '',
          email: row['Email'] || row['email'] || `contact_${idx}@domain.com`,
          website: row['Website'] || row['website'] || row['URL'] || '',
          notes: row['Notes'] || row['notes'] || '',
          priority_score: Math.floor(Math.random() * 40) + 60, // Default initial score
          suggested_action: 'Initial Outreach — Send website evaluation brief.'
        }));

        setLeads((prev) => [...formattedLeads, ...prev]);
        setIsProcessingCsv(false);
        setSelectedFile(null);
        setShowImportModal(false);
      },
      error: (err) => {
        console.error('Error parsing CSV:', err);
        setIsProcessingCsv(false);
      }
    });
  };

  // 3. Save Manual Single Lead Entry
  const handleAddSingleLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.first_name || !newLead.email) return;

    const leadToAdd: Lead = {
      ...newLead,
      id: `lead-${Date.now()}`,
      priority_score: 75,
      suggested_action: 'Follow-up on recent engagement.'
    };

    setLeads((prev) => [leadToAdd, ...prev]);
    setNewLead({ first_name: '', last_name: '', practice_name: '', email: '', website: '', notes: '' });
    setShowAddLeadModal(false);
  };

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
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/20 border border-indigo-500/40 rounded-lg text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Good Morning. Today's Strategic Focus</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              {leads.length > 0 
                ? `You have ${leads.length} leads loaded in your active pipeline. Run analysis to trigger OpenAI prioritization.`
                : 'Your pipeline is empty. Click "Import CSV" or "Add Lead" above to feed contacts into your engine.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Pipeline Contacts', val: leads.length.toString(), color: 'text-indigo-400' },
          { label: 'High Priority (80+)', val: leads.filter(l => (l.priority_score || 0) >= 80).length.toString(), color: 'text-emerald-400' },
          { label: 'Pending Audit Recommendations', val: leads.length > 0 ? '2' : '0', color: 'text-amber-400' },
          { label: 'Uncontacted Leads', val: leads.length.toString(), color: 'text-slate-400' }
        ].map((m, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">{m.label}</p>
            <p className={`text-2xl font-bold mt-2 ${m.color}`}>{m.val}</p>
          </div>
        ))}
      </div>

      {/* Active Leads List View */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-400" /> Loaded Contacts & AI Recommendations
        </h3>
        
        {leads.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
            No contacts loaded yet. Upload a CSV file to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{lead.first_name} {lead.last_name}</span>
                    {lead.practice_name && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{lead.practice_name}</span>}
                    <span className="text-xs bg-indigo-950 text-indigo-400 border border-indigo-800/50 px-2 py-0.5 rounded-full font-mono">
                      Score: {lead.priority_score}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{lead.email} {lead.website && `• ${lead.website}`}</p>
                  <p className="text-xs text-emerald-400 mt-1 font-mono">Suggested Action: {lead.suggested_action}</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition">
                  Draft AI Outreach
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" /> Upload Lead List (.CSV)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select a CSV file containing contact records. Headers like <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">First Name</code>, <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">Email</code>, and <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">Website</code> will map automatically.
            </p>
            
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />

            {selectedFile && (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Selected: {selectedFile.name}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button 
                onClick={() => { setShowImportModal(false); setSelectedFile(null); }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleCsvSubmit}
                disabled={!selectedFile || isProcessingCsv}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold rounded-lg transition"
              >
                {isProcessingCsv ? 'Processing...' : 'Upload & Import Leads'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSingleLead} className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Add New Lead Record
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">First Name *</label>
                <input 
                  type="text" 
                  required
                  value={newLead.first_name}
                  onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                  placeholder="e.g. Sarah" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={newLead.last_name}
                  onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                  placeholder="e.g. Johnson" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email *</label>
                <input 
                  type="email" 
                  required
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="sarah@example.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Practice / Business Name</label>
                <input 
                  type="text" 
                  value={newLead.practice_name}
                  onChange={(e) => setNewLead({ ...newLead, practice_name: e.target.value })}
                  placeholder="Mindful Healing" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Website URL</label>
                <input 
                  type="text" 
                  value={newLead.website}
                  onChange={(e) => setNewLead({ ...newLead, website: e.target.value })}
                  placeholder="https://example.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Notes / Observations</label>
                <textarea 
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="e.g., Mentioned site is slow on mobile. Busy until next month." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 h-20 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button 
                type="button"
                onClick={() => setShowAddLeadModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Save Lead
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
