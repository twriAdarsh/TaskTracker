import { useState, useEffect } from 'react';
import Button from './Button';
import { useTaskContext } from '../context/TaskContext';

/**
 * TaskForm — Used for both creating and editing tasks.
 *
 * Props:
 *  - task      : existing task object (null when creating)
 *  - onSuccess : callback fired after successful create/update
 *  - onCancel  : callback to dismiss the form/modal
 */

const EMPTY_FORM = {
  title:       '',
  description: '',
  status:      'pending',
  priority:    'medium',
  dueDate:     '',
  list:        'Personal',
  tags:        '',
};

const TaskForm = ({ task = null, onSuccess, onCancel }) => {
  const { addTask, editTask, metadata } = useTaskContext();
  const isEditing = Boolean(task);

  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  // Pre-populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        status:      task.status      || 'pending',
        priority:    task.priority    || 'medium',
        dueDate:     task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : '',
        list:        task.list || 'Personal',
        tags:        task.tags ? task.tags.join(', ') : '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on user input
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Client-side validation — mirrors backend rules
  const validate = () => {
    const errs = {};
    if (!form.title.trim())               errs.title = 'Title is required';
    if (form.title.length > 100)          errs.title = 'Title cannot exceed 100 characters';
    if (form.description.length > 500)    errs.description = 'Description cannot exceed 500 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      dueDate: form.dueDate || null,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    const result = isEditing
      ? await editTask(task._id, payload)
      : await addTask(payload);

    setLoading(false);

    if (result?.success !== false) {
      onSuccess?.();
    }
    // If error — toast is shown by context; field errors could come from server 422
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>

      {/* Title */}
      <div className={`form-group ${errors.title ? 'form-group--error' : ''}`}>
        <label htmlFor="task-title" className="form-label">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          className="form-input"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          maxLength={100}
          autoFocus
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className={`form-group ${errors.description ? 'form-group--error' : ''}`}>
        <label htmlFor="task-description" className="form-label">Description</label>
        <textarea
          id="task-description"
          name="description"
          className="form-input form-textarea"
          placeholder="Add more details (optional)..."
          value={form.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
        />
        <span className="form-char-count">{form.description.length}/500</span>
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {/* Status & Priority — side by side */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-status" className="form-label">Status</label>
          <select id="task-status" name="status" className="form-select" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-priority" className="form-label">Priority</label>
          <select id="task-priority" name="priority" className="form-select" value={form.priority} onChange={handleChange}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="form-group">
        <label htmlFor="task-dueDate" className="form-label">Due Date</label>
        <input
          id="task-dueDate"
          name="dueDate"
          type="date"
          className="form-input"
          value={form.dueDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* List & Tags — side by side */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-list" className="form-label">List</label>
          <select id="task-list" name="list" className="form-select" value={form.list} onChange={handleChange}>
            {metadata?.lists?.length > 0 ? (
              metadata.lists.map(list => (
                <option key={list} value={list}>{list}</option>
              ))
            ) : (
              <>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-tags" className="form-label">Tags (comma separated)</label>
          <input
            id="task-tags"
            name="tags"
            type="text"
            className="form-input"
            placeholder="e.g. Tag 1, urgent"
            value={form.tags}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
