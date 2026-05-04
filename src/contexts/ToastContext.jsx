import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ToastContext = createContext(null);

function ToastItem({ toast, onRemove }) {
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    timerRef.current = setTimeout(() => {
      setShow(false);
      setTimeout(() => onRemove(toast.id), 400);
    }, 5000);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, onRemove]);

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-triangle-exclamation',
    warning: 'fa-circle-exclamation',
  };

  return (
    <div className={`toast toast-${toast.type} ${show ? 'show' : ''}`}>
      <div className="toast-icon">
        <i className={`fa-solid ${icons[toast.type]}`}></i>
      </div>
      <div className="toast-content">
        <h4>{toast.title}</h4>
        <p>{toast.message}</p>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((title, message, type = 'success') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
