'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Calendar, TrendingUp, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface BriefingTask {
  id: string;
  name: string;
  practice: string;
  reason: string;
  action: string;
  priorityScore: number;
}

export default function DailyBriefingDashboard() {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<BriefingTask[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      practice: 'Mindful Healing Psychology',
      reason: 'Last contacted 28 days ago. Updated Psychology Today profile recently. Mobile performance score is 34/100.',
      action: 'Send personalized follow-up audit video.',
      priorityScore: 94
    },
    {
      id: '2',
      name: 'James Brown',
      practice: 'Cascade Health Clinic',
      reason: 'Opened previous proposal email twice. Conversion score is 42/100. No direct response yet.',
      action: 'Send conversion bottleneck breakdown.',
      priorityScore: 88
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Altus Axis <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Sales OS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Daily AI Action Intelligence & Pipeline Command</p>
        </div>
        <button 
          onClick={() => setLoading(!loading)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Run AI Pipeline Analysis
        </button>
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
              You have <span className="text-indigo-400 font-semibold">4 high-value touches</span> scheduled today with an estimated potential pipeline value of <span className="text-emerald-400 font-semibold">$12,400</span>. Top recommendation: Reach out to Sarah Johnson—her recent directory updates signal expansion mode.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Highest Impact Tasks Today', val: '4', color: 'text-indigo-400' },
          { label: 'Hot Opportunities', val: '3', color: 'text-emerald-400' },
          { label: 'Proposals Needing Follow-up', val: '2', color: 'text-amber-400' },
          { label: 'Leads Recommended to Hold', val: '18', color: 'text-slate-400' }
        ].map((m, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">{m.label}</p>
            <p className={`text-2xl font-bold mt-2 ${m.color}`}>{m.val}</p>
          </div>
        ))}
      </div>

      {/* High-Impact Tasks Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-400" />
          Today's Highest Impact Actions
        </h3>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">{task.name}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700">{task.practice}</span>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/20">Score: {task.priorityScore}</span>
                </div>
                
                <p className="text-sm text-slate-300"><strong className="text-slate-400 font-medium">Why Now:</strong> {task.reason}</p>
                
                <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                  <span>Suggested Action:</span> {task.action}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg font-medium transition">
                  Hold / Snooze
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 transition">
                  Execute & Draft <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}