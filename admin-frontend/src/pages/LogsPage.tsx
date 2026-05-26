import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLogs } from '../hooks/useLogs';
import { Search, RefreshCw, Filter, AlertTriangle, Info, XCircle, Pause, Play } from 'lucide-react';

const SERVICE_COLORS: Record<string, string> = {
  'gateway': 'bg-indigo-100 text-indigo-700',
  'user-service': 'bg-sky-100 text-sky-700',
  'menu-service': 'bg-emerald-100 text-emerald-700',
  'order-service-1': 'bg-violet-100 text-violet-700',
  'order-service-2': 'bg-violet-100 text-violet-700',
  'payment-service': 'bg-amber-100 text-amber-700',
  'monitoring-service': 'bg-slate-100 text-slate-700',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(dateStr).toLocaleDateString('id-ID');
}

export function LogsPage() {
  const { logs, loading, refetch } = useLogs(5000);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [filterService, setFilterService] = useState('ALL');
  const [paused, setPaused] = useState(false);

  const services = ['ALL', ...Array.from(new Set(logs.map(l => l.service_name)))];

  const filtered = logs.filter(l => {
    const matchSearch = !search ||
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.service_name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel === 'ALL' || l.log_level === filterLevel;
    const matchService = filterService === 'ALL' || l.service_name === filterService;
    return matchSearch && matchLevel && matchService;
  });

  const infoCount = logs.filter(l => l.log_level === 'INFO').length;
  const warnCount = logs.filter(l => l.log_level === 'WARN').length;
  const errorCount = logs.filter(l => l.log_level === 'ERROR').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: logs.length, color: 'bg-slate-50 text-slate-700 border-slate-200', icon: <Filter size={16} /> },
          { label: 'INFO', value: infoCount, color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Info size={16} /> },
          { label: 'WARN', value: warnCount, color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <AlertTriangle size={16} /> },
          { label: 'ERROR', value: errorCount, color: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle size={16} /> },
        ].map(item => (
          <div key={item.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${item.color}`}>
            {item.icon}
            <div>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs font-medium opacity-70">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Log Stream */}
      <Card padding="none">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 p-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant={paused ? 'primary' : 'secondary'}
                size="sm"
                icon={paused ? <Play size={13} /> : <Pause size={13} />}
                onClick={() => setPaused(p => !p)}
              >
                {paused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />}
                onClick={refetch}
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Level Filter */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filterLevel === level ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Service Filter */}
            <select
              value={filterService}
              onChange={e => setFilterService(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600"
            >
              {services.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* Live indicator */}
            {!paused && (
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-600 font-medium">Live stream</span>
              </div>
            )}
          </div>
        </div>

        {/* Log Entries — Terminal Style */}
        <div className="bg-slate-950 rounded-b-2xl font-mono">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs text-slate-500 ml-2">System Log Stream — {filtered.length} entries</span>
          </div>

          <div className="overflow-y-auto max-h-[520px] p-2 space-y-0.5">
            {filtered.length === 0 ? (
              <p className="text-center text-slate-600 py-12 text-sm">No logs found</p>
            ) : (
              filtered.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-3 px-3 py-2 rounded-lg text-xs transition-colors hover:bg-white/5 ${
                    log.log_level === 'ERROR' ? 'bg-red-950/20 border border-red-900/30' :
                    log.log_level === 'WARN' ? 'bg-amber-950/20' : ''
                  }`}
                >
                  {/* Time */}
                  <span className="text-slate-500 flex-shrink-0 w-16">
                    {timeAgo(log.created_at)}
                  </span>

                  {/* Level */}
                  <span className={`flex-shrink-0 w-14 font-bold text-center py-0.5 rounded text-[10px] ${
                    log.log_level === 'ERROR' ? 'bg-red-900/60 text-red-300' :
                    log.log_level === 'WARN' ? 'bg-amber-900/60 text-amber-300' :
                    'bg-blue-900/40 text-blue-300'
                  }`}>
                    {log.log_level}
                  </span>

                  {/* Service */}
                  <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    SERVICE_COLORS[log.service_name] || 'bg-slate-800 text-slate-400'
                  } bg-opacity-20`}>
                    {log.service_name}
                  </span>

                  {/* Message */}
                  <span className={`flex-1 ${
                    log.log_level === 'ERROR' ? 'text-red-300' :
                    log.log_level === 'WARN' ? 'text-amber-300' :
                    'text-slate-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
