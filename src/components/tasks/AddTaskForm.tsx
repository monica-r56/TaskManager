import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addTask } from '@/store/slices/taskSlice';
import { format, parseISO, isValid } from 'date-fns';
import { X, Calendar, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
}

const AddTaskForm = ({ isOpen, onClose, selectedDate }: AddTaskFormProps) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const initialDate = selectedDate && isValid(parseISO(selectedDate))
    ? format(parseISO(selectedDate), 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(initialDate);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!isValid(new Date(dueDate))) {
      toast({
        title: 'Invalid Date',
        description: 'Please enter a valid due date.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const newTask = {
      title: title.trim(),
      description: description.trim() || null,
      due_date: format(parseISO(dueDate), 'yyyy-MM-dd'),
      priority,
    };

    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Task Created',
          description: 'Your new task has been added successfully.',
        });

        dispatch(addTask(data));

        setTitle('');
        setDescription('');
        setDueDate(initialDate);
        setPriority('medium');
        onClose();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Server Error',
        description: 'Could not connect to the backend.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Add New Task
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none backdrop-blur-sm resize-none"
                placeholder="Enter task description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <motion.button
                    key={p}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : p === 'medium'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Task'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTaskForm;
