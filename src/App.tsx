
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import TodoApp from "./components/TodoApp";

// Initialize theme from localStorage
const initializeTheme = () => {
  const isDark = localStorage.getItem('theme') === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
};

const App = () => {
  // Initialize theme when app loads
  useEffect(() => {
    initializeTheme();
  }, []);
  
  const queryClient = new QueryClient();
  
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <TodoApp />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
