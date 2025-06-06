
import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './slices/taskSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    tasks: taskSlice,
    theme: themeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
