import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store/store';
import { updateTask, deleteTask } from '@/store/slices/taskSlice';
import { format, parseISO } from 'date-fns';
import { Calendar, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EditTaskForm from './EditTaskForm';
import ModalPortal from './ModalPortal';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description?: string;
    due_date: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    updated_at: string;
  };
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isDark } = useSelector((state: RootState) => state.theme);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

const handleToggleComplete = () => {
  const updatedTask = {
    ...task,
    completed: !task.completed,
    updated_at: new Date().toISOString(),
    due_date: task.due_date, // 👈 ensure due_date is preserved exactly
  };

  dispatch(updateTask(updatedTask));

  toast({
    title: updatedTask.completed ? 'Task marked complete' : 'Task marked incomplete',
    description: `“${updatedTask.title}” has been ${updatedTask.completed ? 'completed' : 'reopened'}.`,
  });
};

  const handleDelete = async () => {
    if (loadingDelete) return; // Prevent double clicks
    setLoadingDelete(true);

    try {
      const res = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(deleteTask(task.id));

        toast({
          title: 'Task deleted',
          description: `“${task.title}” was marked as deleted.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete task',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Server error',
        description: 'Could not connect to backend.',
        variant: 'destructive',
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-pink-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`relative z-10 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10 ${
          task.completed ? 'opacity-70' : ''
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Completion Checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleComplete}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              task.completed
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                : 'border-white/30 hover:border-purple-400'
            }`}
          >
            {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
          </motion.button>

          {/* Task Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                {/* Title */}
                <h3
                  className={`text-lg font-medium ${
                    task.completed ? 'text-white/50 line-through' : 'text-white'
                  }`}
                >
                  {task.title}
                </h3>

                {/* Description */}
                {task.description && (
                  <p className="text-white/70 text-sm">{task.description}</p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm">
                  {/* Due Date */}
                  <div className="flex items-center gap-1 text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>{format(parseISO(task.due_date), 'MMM d, yyyy')}</span>
                  </div>

                  {/* Priority */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(
                      task.priority
                    )} text-white`}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {/* Edit */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditForm(true)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>

                {/* Delete */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  disabled={loadingDelete}
                  className={`p-2 rounded-full transition-colors text-red-300 hover:text-red-200 ${
                    loadingDelete
                      ? 'bg-red-500/40 cursor-not-allowed'
                      : 'bg-red-500/20 hover:bg-red-500/30'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {showEditForm && (
        <ModalPortal>
          <EditTaskForm
            isOpen={showEditForm}
            onClose={() => setShowEditForm(false)}
            task={task}
          />
        </ModalPortal>
      )}
    </>
  );
};

export default TaskItem;
