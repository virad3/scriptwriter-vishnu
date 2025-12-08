import React, { useEffect, useState } from 'react';
import { ScriptElement } from '../types';
import { analyzeScript } from '../services/geminiService';
import { Activity, BarChart2, MessageSquare, AlertTriangle, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalysisDashboardProps {
  script: ScriptElement[];
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ script }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    const result = await analyzeScript(script);
    setData(result);
    setLoading(false);
  };

  // Calculate simple stats locally
  const characterCounts = script.filter(e => e.type === 'character').reduce((acc: any, curr) => {
    acc[curr.content] = (acc[curr.content] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(characterCounts)
    .map(name => ({ name, lines: characterCounts[name] }))
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 10); // Top 10 characters

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#1e1e1e] text-white">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-6">
            <div>
                <h2 className="text-2xl font-bold mb-1">Deep Analysis</h2>
                <p className="text-gray-400 text-sm">AI-powered insights into your screenplay's structure and voice.</p>
            </div>
            <button 
                onClick={runAnalysis}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
                <Zap size={18} />
                {loading ? 'Analyzing...' : 'Run Full Analysis'}
            </button>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="flex items-center gap-2 font-bold mb-6 text-gray-300">
                    <MessageSquare size={18} /> Dialogue Distribution
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#e5e7eb' }}
                            />
                            <Bar dataKey="lines" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="flex items-center gap-2 font-bold mb-6 text-gray-300">
                    <Activity size={18} /> Emotional Arc (AI Estimated)
                </h3>
                {data?.emotionalArc ? (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.emotionalArc}>
                                <XAxis dataKey="scene" hide />
                                <YAxis domain={[0, 10]} hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} 
                                />
                                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500 italic border-2 border-dashed border-gray-700 rounded-lg">
                        Run analysis to see emotional mapping
                    </div>
                )}
            </div>
        </div>

        {data && (
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="flex items-center gap-2 font-bold mb-4 text-orange-400">
                        <AlertTriangle size={18} /> Cliché Detection
                    </h3>
                    <ul className="space-y-2">
                        {data.cliches?.map((c: string, i: number) => (
                            <li key={i} className="flex gap-3 items-start text-sm text-gray-300">
                                <span className="text-orange-500">•</span> {c}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="flex items-center gap-2 font-bold mb-4 text-blue-400">
                        <BarChart2 size={18} /> Pacing & Structure
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {data.pacing}
                    </p>
                    <div className="mt-4">
                         <h4 className="font-bold text-xs uppercase text-gray-500 mb-2">Suggestions</h4>
                         <ul className="space-y-1">
                            {data.suggestions?.map((s: string, i: number) => (
                                <li key={i} className="text-sm text-gray-400 italic">"{s}"</li>
                            ))}
                         </ul>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AnalysisDashboard;
