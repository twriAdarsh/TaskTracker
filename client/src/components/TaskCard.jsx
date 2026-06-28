import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import { useTaskContext } from '../context/TaskContext';

/**
 * TaskCard — displays a single task with inline status toggle,
 * edit, and delete actions.
 *
 * Props:
 *  - task : Task object from MongoDB
 */

// Map status strings to human-readable badge labels
const STATUS_LABELS = {
  'pending':     'Pending',
  'in-progress': 'In Progress',
  'completed':   'Completed',
};

const PRIORITY_ICONS = {
  low:    '🟢',
  medium: '🟡',
  high:   '🔴',
};

const TaskCard = ({ task, onEdit }) => {
  const { editTask, removeTask } = useTaskContext();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toggling, setToggling]           = useState(false);

  // Cycle through statuses on badge click
  const cycleStatus = async () => {
    const cycle = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
    setToggling(true);
    await editTask(task._id, { status: cycle[task.status] });
    setToggling(false);
  };

  const handleDelete = async () => {
    await removeTask(task._id);
    setConfirmDelete(false);
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : null;

  const isOverdue =
    task.dueDate &&
    task.status !== 'completed' &&
    new Date(task.dueDate) < new Date();

  return (
    <>
      <article className={`task-card task-card--${task.status}`}>
        {/* Priority stripe */}
        <div className={`task-card__stripe task-card__stripe--${task.priority}`} />

        <div className="task-card__content">
          {/* Top row */}
          <div className="task-card__header">
            <h3 className={`task-card__title ${task.status === 'completed' ? 'task-card__title--done' : ''}`}>
              {task.title}
            </h3>
            <div className="task-card__badges">
              <button
                className={`badge badge--status badge--${task.status} ${toggling ? 'badge--loading' : ''}`}
                onClick={cycleStatus}
                disabled={toggling}
                title="Click to cycle status"
              >
                {toggling ? '…' : STATUS_LABELS[task.status]}
              </button>
              <span className="badge badge--priority" title={`Priority: ${task.priority}`}>
                {PRIORITY_ICONS[task.priority]} {task.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="task-card__description">{task.description}</p>
          )}

          {/* Footer */}
          <div className="task-card__footer">
            {formattedDate && (
              <span className={`task-card__due ${isOverdue ? 'task-card__due--overdue' : ''}`}>
                📅 {formattedDate}{isOverdue ? ' — Overdue!' : ''}
              </span>
            )}
            <div className="task-card__actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                aria-label={`Edit task: ${task.title}`}
              >
                ✏️ Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                aria-label={`Delete task: ${task.title}`}
              >
                🗑️ Delete
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Task"
        size="sm"
      >
        <p className="confirm-text">
          Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
        </p>
        <div className="confirm-actions">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TaskCard;
