import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Loader2, Search,
  CheckCircle2, Clock, Circle, AlertCircle, ChevronDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

type Task = {
  id: string; title: string; description?: string;
  status: 'todo' | 'in_progress' | 'done'; priority: 'low' | 'medium' | 'high';
  due_date?: string; assignee_id?: string;
};

const STATUS_CONFIG = {
  todo: { label: 'To Do', icon: Circle, className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  in_progress: { label: 'In Progress', icon: Clock, className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  done: { label: 'Done', icon: CheckCircle2, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  high: { label: 'High', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

function TaskModal({ projectId, task, onClose }: { projectId: string; task?: Task; onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: task?.title ?? '', description: task?.description ?? '',
    status: task?.status ?? 'todo', priority: task?.priority ?? 'medium', due_date: task?.due_date?.split('T')[0] ?? '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data: typeof form) =>
      task
        ? api.put(`/tasks/${task.id}`, data).then(r => r.data)
        : api.post(`/projects/${projectId}/tasks`, { ...data, due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined }).then(r => r.data),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['tasks', projectId] }); 
      qc.invalidateQueries({ queryKey: ['stats', projectId] }); 
      toast({ title: "Success", description: `Task ${task ? 'updated' : 'created'} successfully.` });
      onClose(); 
    },
    onError: (e: any) => {
      const msg = e.response?.data?.message || e.response?.data?.fields?.title?.[0] || 'Failed to save task';
      setError(msg);
      toast({ variant: "destructive", title: "Error", description: msg });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{task ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (!form.title.trim()) return setError('Title is required'); mutation.mutate(form); }} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Task Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Set up solar panel tracking"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Optional task details…" rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Status</label>
              <div className="relative">
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Task['status'] })}
                  className="w-full appearance-none px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 pr-8">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Priority</label>
              <div className="relative">
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                  className="w-full appearance-none px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 pr-8">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Due Date</label>
            <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #14532D, #16a34a)' }}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [modal, setModal] = useState<'create' | Task | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const { data: projectData } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.get(`/projects/${projectId}`).then(r => r.data),
  });

  const { data: statsData } = useQuery({
    queryKey: ['stats', projectId],
    queryFn: () => api.get(`/projects/${projectId}/stats`).then(r => r.data),
  });

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (statusFilter) params.set('status', statusFilter);
  if (priorityFilter) params.set('priority', priorityFilter);

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks', projectId, search, statusFilter, priorityFilter],
    queryFn: () => api.get(`/projects/${projectId}/tasks?${params}`).then(r => r.data),
  });

  const tasks: Task[] = tasksData?.data ?? [];
  const stats = statsData?.data;

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['tasks', projectId] }); 
      qc.invalidateQueries({ queryKey: ['stats', projectId] }); 
      toast({ description: "Task deleted successfully." });
    },
    onError: () => toast({ variant: "destructive", description: "Failed to delete task." })
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/projects" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{projectData?.name ?? '…'}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{projectData?.description || 'No description'}</p>
        </div>
        <button onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition active:scale-95 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #14532D, #16a34a)' }}>
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total', value: stats.totalTasks, c: 'text-slate-900 dark:text-white' },
            { label: 'To Do', value: stats.todo, c: 'text-slate-500' },
            { label: 'In Progress', value: stats.inProgress, c: 'text-amber-600' },
            { label: 'Done', value: stats.done, c: 'text-green-600' },
            { label: 'High Priority', value: stats.highPriority, c: 'text-red-500' },
            { label: 'Overdue', value: stats.overdue, c: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 text-center">
              <div className={`text-2xl font-bold ${s.c}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-slate-900 dark:text-white" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-slate-900 dark:text-white">
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-slate-900 dark:text-white">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">No tasks yet 🌱</h4>
            <p className="text-sm text-slate-500 mb-4">Start building your sustainability roadmap.</p>
            <button onClick={() => setModal('create')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #14532D, #16a34a)' }}>
              <Plus className="w-4 h-4" /> Add First Task
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Due Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                initial="hidden" animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
                className="divide-y divide-slate-100 dark:divide-slate-800"
              >
                {tasks.map((task) => {
                  const S = STATUS_CONFIG[task.status];
                  const P = PRIORITY_CONFIG[task.priority];
                  const SIcon = S.icon;
                  return (
                    <motion.tr 
                      key={task.id} 
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-slate-900 dark:text-white">{task.title}</div>
                        {task.description && <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{task.description}</div>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${S.className}`}>
                          <SIcon className="w-3 h-3" />
                          {S.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${P.className}`}>{P.label}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-xs text-slate-500">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setModal(task)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => confirm('Delete this task?') && deleteMut.mutate(task.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <TaskModal
          projectId={projectId!}
          task={modal === 'create' ? undefined : modal as Task}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
