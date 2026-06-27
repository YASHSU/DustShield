import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, AlertTriangle, CheckCircle, Info, Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'critical';
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, description, type = 'default', duration = 4000 }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, description, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              layout
              className={`p-4 rounded-xl border shadow-xl flex items-start space-x-3 glass-panel ${
                t.type === 'success'
                  ? 'border-secondary/20 bg-secondary/10'
                  : t.type === 'warning'
                  ? 'border-yellow-500/20 bg-yellow-500/10'
                  : t.type === 'error' || t.type === 'critical'
                  ? 'border-destructive/20 bg-destructive/10'
                  : 'border-white/10 bg-[#0E1528]/80'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {t.type === 'success' && <CheckCircle className="h-5 w-5 text-secondary" />}
                {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                {(t.type === 'error' || t.type === 'critical') && <Flame className="h-5 w-5 text-destructive animate-pulse" />}
                {t.type === 'default' && <Info className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground leading-tight">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-0.5 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
