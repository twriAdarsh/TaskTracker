import React, { useState } from 'react';

const CalendarView = ({ tasks, onEdit, onDetail, activeId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateStr));

    days.push(
      <div key={d} className="calendar-day">
        <span className="calendar-day-number">{d}</span>
        <div className="calendar-day-tasks">
          {dayTasks.map(task => (
            <div
              key={task._id}
              className={`calendar-task status-pill--${task.status} ${activeId === task._id ? 'calendar-task--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onDetail(task); }}
            >
              <span className={`priority-dot priority-dot--${task.priority}`} />
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav">←</button>
        <h2 className="calendar-title">{monthNames[month]} {year}</h2>
        <button onClick={nextMonth} className="calendar-nav">→</button>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default CalendarView;
