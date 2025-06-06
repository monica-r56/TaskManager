import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/store/store';
import { format, parseISO, isToday, isPast } from 'date-fns';
import { Plus, CalendarIcon, Sparkles, Eye } from 'lucide-react';
import { addTask, setSelectedDate } from '@/store/slices/taskSlice';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { useToast } from '@/hooks/use-toast';

const TaskList = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { tasks, selectedDate } = useSelector((state: RootState) => state.tasks);
  const [showAddTask, setShowAddTask] = useState(false);

  // 🔧 Correct date-based filtering
  const filteredTasks = selectedDate
    ? tasks.filter(task => format(parseISO(task.due_date), 'yyyy-MM-dd') === selectedDate)
    : tasks;

  const handleViewAllTasks = () => {
    dispatch(setSelectedDate(null));
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl flex-1 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-white flex items-center gap-3"
              >
                <Sparkles className="w-6 h-6 text-purple-400" />
                {selectedDate ? (
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      {format(parseISO(selectedDate), 'MMMM d, yyyy')}
                    </span>
                    <div className="text-sm font-normal text-white/70 mt-1">
                      {isToday(parseISO(selectedDate))
                        ? "Today's Tasks"
                        : isPast(parseISO(selectedDate))
                        ? 'Past Tasks'
                        : 'Upcoming Tasks'}
                    </div>
                  </div>
                ) : (
                  'All Tasks'
                )}
              </motion.h2>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {selectedDate && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewAllTasks}
                  className="px-5 py-2 rounded-xl bg-white/20 text-white border border-white/30 shadow-md hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View All Tasks
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddTask(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Task</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Task list body */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6 h-full overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 flex flex-col items-center justify-center h-full"
              >
                <div className="text-6xl mb-6">🌟</div>
                <div className="text-xl font-medium text-white/80 mb-3">
                  {selectedDate
                    ? 'No tasks scheduled for this day'
                    : 'You have no tasks yet'}
                </div>
                <p className="text-white/60 mb-6">
                  Click the "Add Task" button to create your first task
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddTask(true)}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Task</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TaskItem task={task} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <AddTaskForm
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default TaskList;
