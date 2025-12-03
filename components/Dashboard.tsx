import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { BrainCircuit, Activity, MousePointer2, Search, Zap, Loader2, Trash2 } from 'lucide-react';
import { UserEvent, MarketingInsight } from '../types';
import { analyzeUserBehavior } from '../services/geminiService';

interface DashboardProps {
  events: UserEvent[];
  onClearEvents: () => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Dashboard: React.FC<DashboardProps> = ({ events, onClearEvents }) => {
  const [insight, setInsight] = useState<MarketingInsight | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Reset insight when events are cleared
  useEffect(() => {
    if (events.length === 0) {
      setInsight(null);
    }
  }, [events]);

  // --- Data Processing for Charts ---
  
  // 1. Event Type Distribution
  const eventTypeData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    if (events.length === 0) return [{ name: 'No Data', value: 1 }];
    
    events.forEach(e => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [events]);

  // 2. Extract Categories from details (Naive parsing for demo)
  const categoryInterestData = React.useMemo(() => {
    const categories: Record<string, number> = {};
    events.forEach(e => {
      // Very simple keyword extraction from the "details" string we generated in Store
      const keywords = ['Electronics', 'Fashion', 'Furniture', 'Groceries', 'Fitness'];
      keywords.forEach(cat => {
        if (e.details.includes(cat)) {
          categories[cat] = (categories[cat] || 0) + 1;
        }
      });
    });
    const data = Object.keys(categories).map(key => ({ name: key, value: categories[key] }));
    return data.length > 0 ? data : [{name: 'None', value: 0}];
  }, [events]);

  const handleGenerateInsight = async () => {
    setIsLoadingAI(true);
    const result = await analyzeUserBehavior(events);
    setInsight(result);
    setIsLoadingAI(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Marketer's Intelligence Hub
          </h1>
          <p className="text-slate-400 mt-1">Real-time user tracking & AI analysis</p>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={onClearEvents}
                className="flex items-center px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-400 rounded transition-colors"
                title="Clear all events"
            >
                <Trash2 size={14} className="mr-2" /> Reset
            </button>
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Total Events</span>
                <div className="text-2xl font-mono font-bold text-white text-right">{events.length}</div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: Activity Breakdown */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-300">
            <Activity className="mr-2" size={20} /> Interaction Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={events.length > 0 ? COLORS[index % COLORS.length] : '#475569'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Category Interest */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-emerald-300">
            <MousePointer2 className="mr-2" size={20} /> Category Heatmap
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryInterestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI SECTION: The "Brain" */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
            <BrainCircuit className="mr-2 text-purple-400" size={24} /> 
            Gemini AI Analyst
          </h3>
          
          <div className="flex-1 bg-slate-900/40 rounded-xl p-4 mb-4 overflow-y-auto min-h-[200px] border border-white/10">
            {events.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-center text-sm">
                Waiting for user activity in the Store...
              </div>
            ) : !insight ? (
              <div className="h-full flex items-center justify-center text-slate-300 text-center">
                <p>Data collected. Ready to analyze.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div>
                  <span className="text-xs uppercase text-purple-300 font-bold tracking-wider">Persona</span>
                  <p className="text-xl font-bold text-white">{insight.userPersona}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-blue-300 font-bold tracking-wider">Summary</span>
                  <p className="text-sm text-slate-200 leading-relaxed">{insight.summary}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-emerald-300 font-bold tracking-wider">Strategy</span>
                  <p className="text-sm italic text-emerald-100 bg-emerald-900/30 p-2 rounded border border-emerald-500/20">
                    "{insight.marketingStrategy}"
                  </p>
                </div>
                <div>
                   <span className="text-xs uppercase text-orange-300 font-bold tracking-wider">User Wants</span>
                   <div className="flex flex-wrap gap-2 mt-1">
                      {insight.predictedInterests.map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-800 text-orange-200 px-2 py-1 rounded border border-slate-600">
                          {tag}
                        </span>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateInsight}
            disabled={events.length === 0 || isLoadingAI}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center transition-all ${
              events.length === 0 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-white text-indigo-900 hover:bg-indigo-50 hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isLoadingAI ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} /> Analyze Data
              </>
            ) : (
              <>
                <Zap className="mr-2" size={20} fill="currentColor" /> Generate Insight
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-400">Raw Data Stream</h3>
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="bg-slate-900 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Event Type</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {events.slice().reverse().slice(0, 5).map((e) => (
                <tr key={e.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-mono text-slate-500">
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      e.type === 'SEARCH' ? 'bg-blue-900/50 text-blue-300' :
                      e.type === 'ADD_TO_CART' ? 'bg-emerald-900/50 text-emerald-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {e.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{e.details}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">
                    No events recorded yet. Go to the Store tab to generate data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;