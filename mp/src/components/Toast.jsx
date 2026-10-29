import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let bg = '#153825';
        let border = '#245A39';
        let Icon = CheckCircle2;
        let iconColor = '#86EFAC';

        if (toast.type === 'alert') {
          bg = '#7F1D1D';
          border = '#991B1B';
          Icon = AlertTriangle;
          iconColor = '#FCA5A5';
        } else if (toast.type === 'info') {
          bg = '#1F2937';
          border = '#374151';
          Icon = Info;
          iconColor = '#93C5FD';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: bg,
              color: '#FFFFFF',
              border: `1px solid ${border}`,
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13.5px',
              fontWeight: 500,
              minWidth: '280px',
              maxWidth: '420px',
              animation: 'fadeInUp 0.25s ease'
            }}
          >
            <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
