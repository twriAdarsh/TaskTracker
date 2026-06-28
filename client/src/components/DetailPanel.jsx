import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import Button   from './Button';
import TaskForm  from './TaskForm';

const PRIORITY_ICONS = { low:'🟢', medium:'🟡', high:'🔴' };
const STATUS_LABELS  = { pending:'Pending', 'in-progress':'In Progress', completed:'Completed' };

/**
 * DetailPanel — slides in from the right like Google Tasks detail drawer.
 * Shows full task info with inline editing toggle.
 */
const DetailPanel = ({ task, onClose, onEdit, onUpdated }) => {
  const { editTask, removeTask } = useTaskContext();
  const [editing, setEditing] = useState(false);

  const isOverdue = task.dueDate && task.status !== 'completed'
    && new Date(task.dueDate) < new Date();

  const quickComplete = async () => {
    const next = task.status === 'completed' ? 'pending' : 'completed';
    const res = await editTask(task._id, { status: next });
    if (res?.success !== false) onUpdated?.({ ...task, status: next });
  };

  return (
    <aside className="detail-panel">
      {/* Header */}
      <div className="detail-panel__header">
        <span className="detail-panel__heading">Task Details</span>
        <button className="detail-panel__close" onClick={onClose} aria-label="Close panel">✕</button>
      </div>

      {editing ? (
        <div className="detail-panel__form">
          <TaskForm
            task={task}
            onSuccess={() => { setEditing(false); onClose(); }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="detail-panel__body">
          {/* Title */}
          <h2 className={`detail-title ${task.status === 'completed' ? 'detail-title--done' : ''}`}>
            {task.title}
          </h2>

          {/* Description */}
          {task.description ? (
            <p className="detail-desc">{task.description}</p>
          ) : (
            <p className="detail-desc detail-desc--empty">No description added.</p>
          )}

          {/* Meta chips */}
          <div className="detail-chips">
            <div className="detail-chip">
              <span className="detail-chip__icon">⚡</span>
              <span>Status</span>
              <span className={`status-pill status-pill--${task.status}`}>{STATUS_LABELS[task.status]}</span>
            </div>
            <div className="detail-chip">
              <span className="detail-chip__icon">{PRIORITY_ICONS[task.priority]}</span>
              <span>Priority</span>
              <span className="detail-chip__value">{task.priority}</span>
            </div>
            {task.list && (
              <div className="detail-chip">
                <span className="detail-chip__icon">📁</span>
                <span>List</span>
                <span className="detail-chip__value">{task.list}</span>
              </div>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="detail-chip">
                <span className="detail-chip__icon">🏷️</span>
                <span>Tags</span>
                <span className="detail-chip__value">{task.tags.join(', ')}</span>
              </div>
            )}
            {task.dueDate && (
              <div className={`detail-chip ${isOverdue ? 'detail-chip--overdue' : ''}`}>
                <span className="detail-chip__icon">📅</span>
                <span>Due</span>
                <span className="detail-chip__value">
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}
                  {isOverdue && ' · Overdue'}
                </span>
              </div>
            )}
            <div className="detail-chip">
              <span className="detail-chip__icon">🕐</span>
              <span>Created</span>
              <span className="detail-chip__value">
                {new Date(task.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
              </span>
            </div>
          </div>

          {/* Quick complete */}
          <button className="detail-complete-btn" onClick={quickComplete}>
            {task.status === 'completed' ? '↩ Mark as Pending' : '✓ Mark as Complete'}
          </button>
        </div>
      )}

      {/* Footer actions */}
      {!editing && (
        <div className="detail-panel__footer">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>✏️ Edit</Button>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => { await removeTask(task._id); onClose(); }}
          >
            🗑️ Delete
          </Button>
        </div>
      )}
    </aside>
  );
};

export default DetailPanel;
