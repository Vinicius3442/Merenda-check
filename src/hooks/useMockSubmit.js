import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

export function useMockSubmit() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const mockSubmit = useCallback(
    ({ successTitle = 'Sincronizado', successMsg = 'Ação concluída com sucesso.', isError = false, onSuccess } = {}) => {
      if (loading) return;
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        if (isError) {
          showToast('Erro de Validação', 'Inconsistência identificada pelo oráculo.', 'error');
        } else {
          showToast(successTitle, successMsg, 'success');
          onSuccess?.();
        }
      }, 1500 + Math.random() * 1000);
    },
    [loading, showToast]
  );

  return { loading, mockSubmit };
}
