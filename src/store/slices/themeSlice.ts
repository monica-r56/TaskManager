import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
}

// This safely checks localStorage only on the client
const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') === 'dark';
  }
  return false;
};

const initialState: ThemeState = {
  isDark: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;

      // Apply to <html> and localStorage
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.isDark);
        localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
      }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;

      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.isDark);
        localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
