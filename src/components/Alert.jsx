import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const iconMap = {
    error: <AlertCircle size={18} style={{ flexShrink: 0 }} />,
    success: <CheckCircle size={18} style={{ flexShrink: 0 }} />,
    info: <Info size={18} style={{ flexShrink: 0 }} />,
  };

  const classMap = {
    error: 'alert alert-error',
    success: 'alert alert-success',
    info: 'alert alert-info',
  };

  return (
    <div className={classMap[type] || classMap.error} role="alert">
      {iconMap[type]}
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'transparent', color: 'inherit', padding: '0 4px', cursor: 'pointer' }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
