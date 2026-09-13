import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  show: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++idCounter;
    setItems((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismiss = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:w-auto">
        {items.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${
              t.kind === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : t.kind === 'error'
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : 'border-gray-200 bg-white text-gray-800'
            }`}
          >
            {t.kind === 'success' && <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            {t.kind === 'error' && <XCircle size={18} className="mt-0.5 shrink-0" />}
            {t.kind === 'info' && <Info size={18} className="mt-0.5 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Fechar">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
}
