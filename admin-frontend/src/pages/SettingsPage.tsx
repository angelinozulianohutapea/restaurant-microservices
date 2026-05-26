import { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GATEWAY_URL } from '../config/api';
import {
  Settings, Server, Database, Bell, Shield, Globe,
  Save, RefreshCw, Check, Copy
} from 'lucide-react';

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-indigo-600' : 'bg-slate-200'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: '5',
    notifications: true,
    lowStockAlert: true,
    lowStockThreshold: '5',
    errorAlerts: true,
    darkLogs: true,
    compactMode: false,
    gatewayUrl: GATEWAY_URL,
    demoMode: true,
  });

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.gatewayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SERVICES = [
    { name: 'API Gateway', url: 'http://localhost:8080', status: 'ONLINE', port: 8080 },
    { name: 'User Service', url: 'http://user:3000', status: 'ONLINE', port: 3000 },
    { name: 'Menu Service', url: 'http://menu:3002', status: 'ONLINE', port: 3002 },
    { name: 'Order Service 1', url: 'http://order-service-1:3001', status: 'ONLINE', port: 3001 },
    { name: 'Order Service 2', url: 'http://order-service-2:3005', status: 'ONLINE', port: 3005 },
    { name: 'Payment Service', url: 'http://payment:3003', status: 'ONLINE', port: 3003 },
    { name: 'Monitoring Service', url: 'http://monitoring:3004', status: 'ONLINE', port: 3004 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card padding="md">
          <CardHeader
            title="General"
            subtitle="Dashboard behavior settings"
            icon={<Settings size={16} />}
          />
          <div>
            <SettingRow label="Auto Refresh" description="Automatically refresh dashboard data">
              <ToggleSwitch checked={settings.autoRefresh} onChange={(v) => setSettings(p => ({ ...p, autoRefresh: v }))} />
            </SettingRow>
            <SettingRow label="Refresh Interval" description="How often to fetch new data">
              <select
                value={settings.refreshInterval}
                onChange={e => setSettings(p => ({ ...p, refreshInterval: e.target.value }))}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="3">3 seconds</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
              </select>
            </SettingRow>
            <SettingRow label="Compact Mode" description="Reduce spacing for more data visibility">
              <ToggleSwitch checked={settings.compactMode} onChange={(v) => setSettings(p => ({ ...p, compactMode: v }))} />
            </SettingRow>
            <SettingRow label="Dark Log Terminal" description="Use dark theme for log viewer">
              <ToggleSwitch checked={settings.darkLogs} onChange={(v) => setSettings(p => ({ ...p, darkLogs: v }))} />
            </SettingRow>
            <SettingRow label="Demo Mode" description="Use mock data when backend is unavailable">
              <ToggleSwitch checked={settings.demoMode} onChange={(v) => setSettings(p => ({ ...p, demoMode: v }))} />
            </SettingRow>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card padding="md">
          <CardHeader
            title="Alerts & Notifications"
            subtitle="Configure alert thresholds"
            icon={<Bell size={16} />}
          />
          <div>
            <SettingRow label="Enable Notifications" description="Show system alerts and warnings">
              <ToggleSwitch checked={settings.notifications} onChange={(v) => setSettings(p => ({ ...p, notifications: v }))} />
            </SettingRow>
            <SettingRow label="Low Stock Alerts" description="Alert when menu stock falls below threshold">
              <ToggleSwitch checked={settings.lowStockAlert} onChange={(v) => setSettings(p => ({ ...p, lowStockAlert: v }))} />
            </SettingRow>
            <SettingRow label="Low Stock Threshold" description="Minimum stock before alert triggers">
              <input
                type="number"
                value={settings.lowStockThreshold}
                onChange={e => setSettings(p => ({ ...p, lowStockThreshold: e.target.value }))}
                className="w-16 text-center text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={1}
              />
            </SettingRow>
            <SettingRow label="Error Alerts" description="Alert on service errors and failures">
              <ToggleSwitch checked={settings.errorAlerts} onChange={(v) => setSettings(p => ({ ...p, errorAlerts: v }))} />
            </SettingRow>
          </div>
        </Card>

        {/* API Config */}
        <Card padding="md">
          <CardHeader
            title="API Configuration"
            subtitle="Gateway & service endpoints"
            icon={<Globe size={16} />}
          />
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Gateway URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.gatewayUrl}
                  onChange={e => setSettings(p => ({ ...p, gatewayUrl: e.target.value }))}
                  className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  onClick={handleCopy}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs font-semibold text-slate-600 mb-2">Route Map</p>
              {[
                { method: 'POST', path: '/user/register', service: 'user:3000' },
                { method: 'POST', path: '/user/login', service: 'user:3000' },
                { method: 'GET', path: '/menu', service: 'menu:3002' },
                { method: 'POST', path: '/order', service: 'order-svc (LB)' },
                { method: 'POST', path: '/payment', service: 'payment:3003' },
                { method: 'GET', path: '/stats', service: 'monitoring:3004' },
              ].map(r => (
                <div key={r.path} className="flex items-center gap-2 text-xs">
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    r.method === 'GET' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>{r.method}</span>
                  <span className="font-mono text-slate-600 flex-1">{r.path}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-mono text-indigo-600">{r.service}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Service Registry */}
        <Card padding="md">
          <CardHeader
            title="Service Registry"
            subtitle="Registered microservice endpoints"
            icon={<Server size={16} />}
          />
          <div className="space-y-2">
            {SERVICES.map(svc => (
              <div key={svc.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{svc.name}</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">{svc.url}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono">:{svc.port}</span>
                  <Badge variant="success" dot size="sm">ONLINE</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Security */}
      <Card padding="md">
        <CardHeader
          title="Security"
          subtitle="Authentication and access control"
          icon={<Shield size={16} />}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'CORS', value: 'Enabled (all origins)', status: 'warning' as const },
            { label: 'Authentication', value: 'JWT (Not yet implemented)', status: 'neutral' as const },
            { label: 'Rate Limiting', value: 'Not configured', status: 'danger' as const },
            { label: 'HTTPS', value: 'Not configured (dev)', status: 'warning' as const },
            { label: 'API Keys', value: 'Not configured', status: 'neutral' as const },
            { label: 'Firewall', value: 'Docker network only', status: 'success' as const },
          ].map(item => (
            <div key={item.label} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <div className="flex items-center gap-2">
                <Badge variant={item.status} size="sm">{item.value}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Database */}
      <Card padding="md">
        <CardHeader
          title="Database Configuration"
          subtitle="PostgreSQL connection settings"
          icon={<Database size={16} />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Primary Host', value: '10.95.249.151:5432', mono: true },
            { label: 'Replica Host', value: '10.95.249.151:5433', mono: true },
            { label: 'Database', value: 'restoran', mono: true },
            { label: 'User', value: 'postgres', mono: true },
            { label: 'Replication', value: 'Streaming WAL', mono: false },
            { label: 'Failover', value: 'Automatic (app-level)', mono: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className={`text-xs font-semibold text-slate-800 ${item.mono ? 'font-mono' : ''}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="md" icon={<RefreshCw size={14} />}>
          Reset to Defaults
        </Button>
        <Button
          variant="primary"
          size="md"
          icon={saved ? <Check size={14} /> : <Save size={14} />}
          onClick={handleSave}
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
