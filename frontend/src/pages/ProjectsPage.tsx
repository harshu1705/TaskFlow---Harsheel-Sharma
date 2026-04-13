import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Plus, Pencil, Trash2, ArrowRight, Leaf, Loader2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';

type Project = { id: string; name: string; description?: string; created_at: string; };

function ProjectModal({ project, onClose }: { project?: Project; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: project?.name ?? '', description: project?.description ?? '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data: typeof form) =>
      project
        ? api.put(`/projects/${project.id}`, data).then(r => r.data)
        : api.post('/projects', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); onClose(); },
    onError: (e: any) => setError(e.response?.data?.message || 'Failed to save project'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{project ? 'Edit Project' : 'New Project'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (!form.name.trim()) return setError('Name is required'); mutation.mutate(form); }} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Project Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Solar Logistics Initiative"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="What sustainability goal does this project achieve?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none" />
          </div>
          {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #14532D, #16a34a)' }}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }: { project: Project; onEdit: () => void; onDelete: () => void }) {
  // Dummy progress value based on project ID for the demo/CTO requirement, realistic values would come from API
  const progress = React.useMemo(() => Math.floor(Math.random() * 60) + 20, [project.id]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-all group relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-green-700 dark:text-green-400" />
          </div>
          {/* Animated Progress Ring */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100 dark:text-slate-800" />
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent"
                strokeDasharray={100} strokeDashoffset={100 - progress}
                className="text-green-500 transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">{progress}%</div>
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{project.name}</h3>
      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{project.description || 'No description provided.'}</p>
      
      {/* Animated Progress Bar linear alternative */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
        <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <Link to={`/projects/${project.id}`} className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 hover:underline">
        View Project Board <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | Project | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => api.get(`/projects?page=${page}&limit=${limit}`).then(r => r.data),
  });

  const projects: Project[] = data?.data ?? [];
  const pagination = data?.pagination;

  const filtered = search ? projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())) : projects;

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your sustainability initiatives</p>
        </div>
        <button onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition active:scale-95 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #14532D, #16a34a)' }}>
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search projects…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400" /></button>}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 animate-pulse">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-5">
            <Leaf className="w-10 h-10 text-green-600" />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">No projects yet 🌱</h4>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">Start building your sustainability roadmap. Create your first project to get started.</p>
          <button onClick={() => setModal('create')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #14532D, #16a34a)' }}>
            <Plus className="w-4 h-4" /> Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={() => setModal(project)}
              onDelete={() => { confirm('Delete this project?') && deleteMut.mutate(project.id) }} 
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-slate-500">Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, pagination.total)} of {pagination.total} projects</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <ProjectModal
          project={modal === 'create' ? undefined : modal as Project}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
