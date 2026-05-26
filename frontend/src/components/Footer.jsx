import { motion } from 'framer-motion';
import { ChefHat, Heart,Globe, Shield, Database, Server, Layers } from 'lucide-react';

const techStack = [
  { icon: '⚛️', name: 'React.js', desc: 'Frontend' },
  { icon: '⚡', name: 'Vite', desc: 'Build Tool' },
  { icon: '🎨', name: 'Tailwind CSS', desc: 'Styling' },
  { icon: '🐘', name: 'PostgreSQL HA', desc: 'Database' },
  { icon: '🐳', name: 'Docker', desc: 'Container' },
  { icon: '🌐', name: 'NGINX', desc: 'Load Balancer' },
  { icon: '🔗', name: 'API Gateway', desc: 'Microservice' },
  { icon: '📊', name: 'Monitoring', desc: 'Observability' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold gradient-text">RestoApp</span>
                <div className="text-[10px] text-white/30 font-medium -mt-0.5 tracking-widest uppercase">Enterprise Edition</div>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Modern enterprise digital restaurant management system with high availability infrastructure and microservice architecture.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 badge-online px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
                System Online
              </span>
              <span className="text-xs text-white/30">v2.0.0</span>
            </div>
          </div>

          {/* System Info */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">System Information</h4>
            <ul className="space-y-2.5">
              {[
                { icon: Server, label: 'API Gateway', value: '10.95.249.151:8080' },
                { icon: Database, label: 'PostgreSQL HA', value: 'Streaming Replication' },
                { icon: Shield, label: 'Auto Failover', value: 'Enabled' },
                { icon: Globe, label: 'Load Balancer', value: 'NGINX Upstream' },
                { icon: Layers, label: 'Architecture', value: 'Microservice' },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-white/40">
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                  <span className="text-white/60 font-mono">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Technology Stack</h4>
            <div className="grid grid-cols-4 gap-2">
              {techStack.map(({ icon, name, desc }) => (
                <motion.div
                  key={name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all cursor-default"
                  title={`${name} - ${desc}`}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-[8px] text-white/40 text-center leading-tight">{name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 flex items-center gap-1">
            © {new Date().getFullYear()} RestoApp Enterprise. Built with
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            for the future of dining.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>Docker Ready</span>
            <span>·</span>
            <span>Production Grade</span>
            <span>·</span>
            <span>HA PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
