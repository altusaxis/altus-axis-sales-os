'use client';

import React, { useState } from 'react';
import { 
  Upload, Plus, FileSpreadsheet, CheckCircle2, Search, 
  Mail, Phone, Globe, Calendar, Clock, ChevronRight, X, MessageSquare, Tag
} from 'lucide-react';
import Papa from 'papaparse';

type LeadStatus = 'New' | 'Contacted' | 'Followed Up' | 'Meeting Booked' | 'Proposal Sent' | 'Closed Won' | 'Closed Lost';

interface EmailLog {
  id: string;
  date: string;
  subject: string;
  body: string;
}

interface Lead {
  id: string;
  first_name: string;
  last_name?: string;
  practice_name?: string;
  email: string;
  phone?: string;
  website?: string;
  notes?: string;
  status: LeadStatus;
  last_contacted?: string;
  email_history: EmailLog[];
}

export default function LeadManagerDashboard() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Manual Email Compose State inside Drawer
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Form State for Manual Single Lead Entry
  const [newLead, setNewLead] = useState({
    first_name: '',
    last_name: '',
    practice_name: '',
    email: '',
    phone: '',
    website: '',
    notes: '',
  });

  // 1. Handle CSV Import
  const handleCsvSubmit = () => {
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows = results.data as any[];
        
        const formattedLeads: Lead[] = parsedRows.map((row, idx) => ({
          id: `lead-${Date.now()}-${idx}`,
          first_name: row['First Name'] || row['first_name'] || row['Name'] || 'Contact',
          last_name: row['Last Name'] || row['last_name'] || '',
          practice_name: row['Company'] || row['Practice'] || row['Business'] || '',
          email: row['Email'] || row['email'] || `contact_${idx}@domain.com`,
          phone: row['Phone'] || row['phone'] || '',
          website: row['Website'] || row['website'] || '',
          notes: row['Notes'] || row['notes'] || '',
          status: 'New',
          email_history: []
        }));

        setLeads((prev) => [...formattedLeads, ...prev]);
        setSelectedFile(null);
        setShowImportModal(false);
      }
    });
  };

  // 2. Add Single Lead
  const handleAddSingleLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.first_name || !newLead.email) return;

    const leadToAdd: Lead = {
      ...newLead,
      id: `lead-${Date.now()}`,
      status: 'New',
      email_history: []
    };

    setLeads((prev) => [leadToAdd, ...prev]);
    setNewLead({ first_name: '', last_name: '', practice_name: '', email: '', phone: '', website: '', notes: '' });
    setShowAddLeadModal(false);
  };

  // 3. Update Lead Status
  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // 4. Log Sent Email
  const handleLogEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !emailSubject || !emailBody) return;

    const newLog: EmailLog = {
      id: `email-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      subject: emailSubject,
      body: emailBody
    };

    const updatedLead: Lead = {
      ...selectedLead,
      status: selectedLead.status === 'New' ? 'Contacted' : selectedLead.status,
      last_contacted: new Date().toLocaleDateString(),
      email_history: [newLog, ...selectedLead.email_history]
    };

    setLeads(prev => prev.map(l => l.id === selectedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
    setEmailSubject('');
    setEmailBody('');
  };

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      `${lead.first_name} ${lead.last_name} ${lead.practice_name} ${lead.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Altus Axis <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Lead Manager</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manual Native Pipeline Tracker & Contact History Log</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium px-3.5 py-2 rounded-lg text-xs transition"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            Import CSV
          </button>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Lead
          </button>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['All', 'New', 'Contacted', 'Followed Up', 'Meeting Booked', 'Proposal Sent', 'Closed Won'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === st 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Lead List Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No contacts found. Upload a CSV or add a lead to get started.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredLeads.map((lead) => (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)}
                className="p-4 hover:bg-slate-800/40 cursor-pointer transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{lead.first_name} {lead.last_name}</span>
                    {lead.practice_name && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">{lead.practice_name}</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> {lead.phone}</span>}
                    {lead.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-500" /> {lead.website}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Native Dropdown Status Selector */}
                  <select
                    value={lead.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="New">Status: New</option>
                    <option value="Contacted">Status: Contacted</option>
                    <option value="Followed Up">Status: Followed Up</option>
                    <option value="Meeting Booked">Status: Meeting Booked</option>
                    <option value="Proposal Sent">Status: Proposal Sent</option>
                    <option value="Closed Won">Status: Closed Won</option>
                    <option value="Closed Lost">Status: Closed Lost</option>
                  </select>

                  <div className="text-xs text-slate-500 font-mono">
                    {lead.email_history.length} Emails Sent
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LEAD INTERACTION DRAWER / MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedLead.first_name} {selectedLead.last_name}</h2>
                <p className="text-xs text-indigo-400 mt-0.5">{selectedLead.practice_name || 'Individual Contact'}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-1 hover:bg-slate-800 text-slate-400 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Details */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
              <div><span className="text-slate-500">Email:</span> <span className="text-slate-200">{selectedLead.email}</span></div>
              <div><span className="text-slate-500">Phone:</span> <span className="text-slate-200">{selectedLead.phone || 'N/A'}</span></div>
              <div><span className="text-slate-500">Website:</span> <span className="text-slate-200">{selectedLead.website || 'N/A'}</span></div>
              <div><span className="text-slate-500">Last Contacted:</span> <span className="text-slate-200">{selectedLead.last_contacted || 'Never'}</span></div>
            </div>

            {/* Native Email Logger */}
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" /> Log Sent Email / Outreach
              </h3>
              <form onSubmit={handleLogEmail} className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Subject Line"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
                <textarea
                  placeholder="Paste the message content you emailed to this lead..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 h-24 resize-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
                >
                  Log Email to Activity History
                </button>
              </form>
            </div>

            {/* Email History Feed */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Outreach History ({selectedLead.email_history.length})
              </h3>
              {selectedLead.email_history.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No previous emails logged for this contact.</p>
              ) : (
                <div className="space-y-2">
                  {selectedLead.email_history.map((log) => (
                    <div key={log.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center text-slate-400 border-b border-slate-900 pb-1">
                        <span className="font-semibold text-slate-200">{log.subject}</span>
                        <span>{log.date}</span>
                      </div>
                      <p className="text-slate-300 pt-1 whitespace-pre-wrap">{log.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" /> Upload Lead List (.CSV)
            </h3>
            <input 
              type="file" 
              accept=".csv"
              onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white cursor-pointer"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleCsvSubmit}
                disabled={!selectedFile}
                className="px-4 py-1.5 bg-indigo-600 disabled:bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Import Leads
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
              <Plus className="w-5 h-5 text-indigo-400" /> Add New Lead Record
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">First Name *</label>
                <input 
                  type="text" 
                  required
                  value={newLead.first_name}
                  onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={newLead.last_name}
                  onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Email *</label>
                <input 
                  type="email" 
                  required
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button 
                type="button"
                onClick={() => setShowAddLeadModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
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
