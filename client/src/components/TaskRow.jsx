import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import Button from './Button';
import Modal  from './Modal';

const STATUS_LABELS = { pending:'Pending', 'in-progress':'In Progress', completed:'Completed' };
const STATUS_CYCLE  = { pending:'in-progress', 'in-progress':'completed', completed:'pending' };

/**
 * TaskRow — Google Tasks-style list row with circular checkbox.
 */
const TaskRow = ({ task, onEdit, onDetail, isActive }) => {
  const { editTask, removeTask } = useTaskContext();
  const [toggling,      setToggling]      = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleComplete = async (e) => {
    e.stopPropagation();
    setToggling(true);
    const next = task.status === 'completed' ? 'pending' : 'completed';
    await editTask(task._id, { status: next });
    setToggling(false);
  };

  const cycleStatus = async (e) => {
    e.stopPropagation();
    setToggling(true);
    await editTask(task._id, { status: STATUS_CYCLE[task.status] });
    setToggling(false);
  };

  const isOverdue = task.dueDate && task.status !== 'completed'
    && new Date(task.dueDate) < new Date();

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month:'short', day:'numeric' })
    : null;

  return (
    <>
      <div
        className={`task-row ${isActive ? 'task-row--active' : ''} ${task.status === 'completed' ? 'task-row--done' : ''}`}
        onClick={() => onDetail(task)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onDetail(task)}
      >
        {/* Circular checkbox */}
        <button
          className={`circle-check circle-check--${task.status} ${toggling ? 'circle-check--spinning' : ''}`}
          onClick={toggleComplete}
          disabled={toggling}
          aria-label={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
          title={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.status === 'completed' && <span className="circle-check__tick">✓</span>}
        </button>

        {/* Priority dot */}
        <span className={`priority-dot priority-dot--${task.priority}`} title={`${task.priority} priority`} />

        {/* Content */}
        <div className="task-row__content">
          <span className={`task-row__title ${task.status === 'completed' ? 'task-row__title--done' : ''}`}>
            {task.title}
          </span>
          {task.description && (
            <span className="task-row__desc">{task.description}</span>
          )}
          <div className="task-row__meta">
            {formattedDate && (
              <span className={`task-row__date ${isOverdue ? 'task-row__date--overdue' : ''}`}>
                📅 {formattedDate}{isOverdue ? ' · Overdue' : ''}
              </span>
            )}
            {task.list && (
              <span className="status-pill" style={{ backgroundColor: 'var(--surface-3)', color: 'var(--text-secondary)' }}>
                📁 {task.list}
              </span>
            )}
            {task.tags && task.tags.length > 0 && task.tags.map(tag => (
              <span key={tag} className="status-pill" style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: 'var(--info)' }}>
                #{tag}
              </span>
            ))}
            <button
              className={`status-pill status-pill--${task.status}`}
              onClick={cycleStatus}
              disabled={toggling}
              title="Click to cycle status"
            >
              {STATUS_LABELS[task.status]}
            </button>
          </div>
        </div>

        {/* Actions (shown on hover via CSS) */}
        <div className="task-row__actions">
          <button
            className="row-action"
            onClick={e => { e.stopPropagation(); onEdit(task); }}
            title="Edit task"
            aria-label="Edit"
          >✏️</button>
          <button
            className="row-action row-action--danger"
            onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
            title="Delete task"
            aria-label="Delete"
          >🗑️</button>
        </div>
      </div>

      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Task" size="sm">
        <p className="confirm-text">
          Delete <strong>"{task.title}"</strong>? This cannot be undone.
        </p>
        <div className="confirm-actions">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={async () => { await removeTask(task._id); setConfirmDelete(false); }}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TaskRow;
