import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { loadTasksFromStorage } from '@/store/slices/taskSlice';
import Header from './layout/Header';
import CustomCalendar from './calendar/CustomCalendar';
import TaskList from './tasks/TaskList';
import FloatingBubbles from './ui/FloatingBubbles';

const TodoApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTasksFromStorage());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Floating background bubbles */}
      <FloatingBubbles />

      {/* Glass background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-3xl" />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Calendar Section - Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full md:w-[360px] flex-shrink-0"
            >
              <CustomCalendar />
            </motion.div>

            {/* Task List Section - Right */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1"
            >
              <TaskList />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TodoApp;
