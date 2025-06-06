import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store/store';
import { setSelectedDate } from '@/store/slices/taskSlice';
import {
  format,
  isToday,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Calendar as CalendarIcon,
} from 'lucide-react';

const CustomCalendar = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelected] = useState<Date>(new Date());

  const handleDateClick = (date: Date) => {
    setSelected(date);
    dispatch(setSelectedDate(format(date, 'yyyy-MM-dd')));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty cells for days before month starts
  const startDayOfWeek = getDay(monthStart);
  const emptyCells = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl h-fit sticky top-8"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>

          <motion.h2
            key={format(currentDate, 'MMMM yyyy')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            <CalendarIcon className="w-5 h-5" />
            {format(currentDate, 'MMMM yyyy')}
          </motion.h2>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-white/70 p-2"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="h-12" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((date) => {
            const tasksForTheDay = tasks.filter((task) =>
              isSameDay(parseISO(task.due_date), date)
            );

            const hasTasks = tasksForTheDay.length > 0;
            const completedTasks = tasksForTheDay.filter(
              (task) => task.completed
            ).length;
            const allCompleted =
              hasTasks && completedTasks === tasksForTheDay.length;

            const isSelectedDate = isSameDay(date, selectedDate);
            const todayDate = isToday(date);

            return (
              <motion.button
                key={date.toISOString()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(date)}
                className={`
                  h-12 w-12 rounded-xl flex items-center justify-center text-sm font-medium relative transition-all duration-200
                  ${isSelectedDate
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                    : todayDate
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/80 hover:bg-white/10'}
                `}
              >
                <span className="relative z-10">{date.getDate()}</span>

                {/* Task indicators */}
                {hasTasks && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    {allCompleted ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomCalendar;
