import React from 'react';

const StickyWallView = ({ tasks, onEdit, onDetail, activeId }) => {
  return (
    <div className="sticky-wall">
      {tasks.length === 0 ? (
        <div className="state-empty">No tasks to display on the wall.</div>
      ) : (
        <div className="sticky-grid">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`sticky-note sticky-note--${task.priority} ${activeId === task._id ? 'sticky-note--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onDetail(task); }}
            >
              <h3 className="sticky-note__title">{task.title}</h3>
              {task.description && <p className="sticky-note__desc">{task.description}</p>}
              <div className="sticky-note__meta">
                {task.dueDate && <span className="sticky-note__date">📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                <span className={`status-pill status-pill--${task.status}`}>{task.status.replace('-', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StickyWallView;
