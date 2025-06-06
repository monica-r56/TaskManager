import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store/store';
import { setSelectedDate } from '@/store/slices/taskSlice';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

const Calendar = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { isDark } = useSelector((state: RootState) => state.theme);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [datesWithTasks, setDatesWithTasks] = useState<Record<string, number>>({});
  const [datesWithCompletedTasks, setDatesWithCompletedTasks] = useState<Record<string, number>>({});

  useEffect(() => {
    const withTasks: Record<string, number> = {};
    const withCompleted: Record<string, number> = {};

    tasks.forEach(task => {
      const dateKey = task.due_date.substring(0, 10);

      withTasks[dateKey] = (withTasks[dateKey] || 0) + 1;

      if (task.completed) {
        withCompleted[dateKey] = (withCompleted[dateKey] || 0) + 1;
      }
    });

    setDatesWithTasks(withTasks);
    setDatesWithCompletedTasks(withCompleted);
  }, [tasks]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      dispatch(setSelectedDate(format(newDate, 'yyyy-MM-dd')));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full max-w-[280px] rounded-xl overflow-hidden shadow-lg border transition-all duration-300 ${
        isDark
          ? 'bg-gray-800/50 border-gray-700 shadow-gray-900/30'
          : 'bg-white border-gray-200 shadow-gray-200/50'
      }`}
    >
      <div
        className={`p-3 border-b transition-colors duration-300 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {date ? format(date, 'MMMM yyyy') : 'Calendar'}
        </h2>
      </div>

      <div className="p-3">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className={isDark ? 'dark-calendar' : ''}
          components={{
            DayContent: ({ date: dayDate }) => {
              const dateStr = format(dayDate, 'yyyy-MM-dd');
              const hasTasks = datesWithTasks[dateStr] > 0;
              const hasCompletedTasks = datesWithCompletedTasks[dateStr] > 0;
              const allCompleted =
                hasTasks &&
                hasCompletedTasks &&
                datesWithTasks[dateStr] === datesWithCompletedTasks[dateStr];

              return (
                <div className="relative flex items-center justify-center h-full w-full">
                  <span className="text-sm">{dayDate.getDate()}</span>

                  {hasTasks && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {allCompleted ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isDark ? 'bg-purple-500' : 'bg-indigo-500'
                          }`}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      </div>
    </motion.div>
  );
};

export default Calendar;
