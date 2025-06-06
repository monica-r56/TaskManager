import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleTheme } from '@/store/slices/themeSlice';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state: RootState) => state.theme);

  // Add/remove "dark" class to <html> based on Redux theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl 
                 bg-white/10 dark:bg-black/20 
                 border-b border-white/20 
                 light:bg-white/60 light:border-black/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-8 h-8 text-purple-400 light:text-purple-700" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 light:from-purple-600 light:to-pink-500 bg-clip-text text-transparent">
              Task Manager
            </h1>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(toggleTheme())}
            className="p-3 rounded-full 
                       bg-white/10 hover:bg-white/20 
                       light:bg-black/10 light:hover:bg-black/20 
                       transition-all duration-300 
                       backdrop-blur-sm border 
                       border-white/20 light:border-black/20"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-purple-700" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
