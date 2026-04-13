import { useQuery } from '@tanstack/react-query';
import { FolderKanban, CheckSquare, Leaf, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

function StatCard({ icon: Icon, label, value, color, sub }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">{sub}</div>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 animate-pulse">
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: projectsRes, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects?limit=3').then(r => r.data),
  });

  const projects = projectsRes?.data ?? [];
  const total = projectsRes?.pagination?.total ?? 0;

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden p-8" style={{
        background: 'linear-gradient(135deg, #14532D 0%, #166534 50%, #15803D 100%)'
      }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="relative z-10">
          <p className="text-green-200 text-sm font-medium mb-1">Good day 👋</p>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {firstName}!</h2>
          <p className="text-green-100 text-sm max-w-md">
            Let's build a greener India today. Track your sustainability projects and keep your team aligned.
          </p>
        </div>
        <div className="absolute bottom-4 right-6 opacity-20">
          <Leaf className="w-20 h-20 text-white" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={FolderKanban} label="Total Projects" value={total} color="bg-green-700" sub="↑ Your workspace" />
            <StatCard icon={CheckSquare} label="Tasks Done" value="—" color="bg-blue-600" sub="View projects" />
            <StatCard icon={Clock} label="In Progress" value="—" color="bg-amber-500" sub="Stay on track" />
            <StatCard icon={Leaf} label="CO₂ Offset (kg)" value="128" color="bg-emerald-600" sub="↑ Green score 94%" />
          </>
        )}
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Projects</h3>
            <p className="text-xs text-slate-500 mt-0.5">Your latest sustainability initiatives</p>
          </div>
          <Link to="/projects"
            className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 hover:underline">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">No projects yet</h4>
            <p className="text-sm text-slate-500 mb-4">Start building your sustainability roadmap.</p>
            <Link to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #14532D, #16a34a)' }}>
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {projects.map((p: any) => (
              <Link key={p.id} to={`/projects/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <FolderKanban className="w-4 h-4 text-green-700 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{p.name}</p>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{p.description || 'No description'}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Eco Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Carbon Saved', value: '128 kg CO₂', icon: '🌿', desc: 'Equivalent to planting 6 trees' },
          { label: 'Green Score', value: '94%', icon: '⚡', desc: 'Top 5% of all Zomato ops teams' },
          { label: 'Eco Initiatives', value: `${total} Active`, icon: '🌍', desc: 'Across India operations' },
        ].map((w) => (
          <div key={w.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
            <div className="text-2xl mb-3">{w.icon}</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{w.value}</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{w.label}</div>
            <div className="text-xs text-slate-400 mt-1">{w.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
