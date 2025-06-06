import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { loadTasksFromStorage } from '@/store/slices/taskSlice';
import Header from './Header';
import Calendar from '../tasks/Calendar';
import TaskList from '../tasks/TaskList';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state: RootState) => state.theme);

  // Load tasks from localStorage
  useEffect(() => {
    dispatch(loadTasksFromStorage());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`
        min-h-screen transition-colors duration-500
        ${isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100'
          : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-gray-900'}
      `}
    >
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-1">
            <Calendar />
          </div>
          <div className="lg:col-span-2">
            <TaskList />
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
