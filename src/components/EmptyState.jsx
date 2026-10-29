import React from 'react';
import { Music } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Music,
  title = 'No items found',
  description = 'There is currently no data to display here.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
