'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Lightbulb } from 'lucide-react';

const PERFORMANCE_DATA = [
  { month: 'Jan', outreach: 45, responses: 12, closed: 2 },
  { month: 'Feb', outreach: 52, responses: 18, closed: 4 },
  { month: 'Mar', outreach: 61, responses: 24, closed: 5 },
  { month: 'Apr', outreach: 48, responses: 22, closed: 6 },
  { month: 'May', outreach: 70, responses: 31, closed: 8 },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* AI Pattern Insights Panel */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4" /> AI Surface Patterns & Insights
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <li className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <strong className="text-white block mb-1">Playbook Impact</strong>
            Therapists who downloaded your playbook convert <strong>3x more often</strong> than direct cold leads.
          </li>
          <li className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <strong className="text-white block mb-1">Optimal Follow-up Window</strong>
            Your highest reply rate occurs <strong>27–35 days</strong> after initial contact.
          </li>
          <li className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <strong className="text-white block mb-1">Niche Conversion</strong>
            Couples therapists respond <strong>40% faster</strong> when presented with a website audit video.
          </li>
        </ul>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Pipeline Velocity & Response Performance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERFORMANCE_DATA}>
              <defs>
                <linearGradient id="colorOutreach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155' }} />
              <Area type="monotone" dataKey="outreach" stroke="#6366f1" fillOpacity={1} fill="url(#colorOutreach)" />
              <Area type="monotone" dataKey="responses" stroke="#10b981" fillOpacity={1} fill="url(#colorResponses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}