import React from 'react';

const Sidebar = ({ sidebarOpen, activeView, onNavigate, tasks, metadata, onLogout, onAddListClick, onAddTagClick, onSettingsClick }) => {
  // Compute counts
  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    return due.getDate() === today.getDate() && due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
  });
  const upcomingTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due > today;
  });

  const getCount = (viewId) => {
    if (viewId === 'today') return todayTasks.length;
    if (viewId === 'upcoming') return upcomingTasks.length;
    return null;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'upcoming', label: 'Upcoming', icon: '»' },
    { id: 'today', label: 'Today', icon: '☰' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'sticky', label: 'Sticky Wall', icon: '📝' },
  ];

  // Dynamic Metadata
  const listItems = metadata?.lists?.map((listName, idx) => {
    const colors = ['var(--danger)', 'var(--info)', 'var(--warning)', 'var(--success)', 'var(--primary)'];
    return { id: `list:${listName}`, label: listName, color: colors[idx % colors.length] };
  }) || [];

  const tagItems = metadata?.tags?.map((tagName, idx) => {
    const colors = ['var(--info)', 'var(--danger)', 'var(--warning)', 'var(--success)', 'var(--primary)'];
    return { id: `tag:${tagName}`, label: tagName, color: colors[idx % colors.length] };
  }) || [];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="sidebar__section">
        <div className="sidebar__section-title">TASKS</div>
        <nav className="sidebar__nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              type="button"
              className={`sidebar__item ${activeView === item.id ? 'sidebar__item--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
              {getCount(item.id) > 0 && <span className="sidebar__badge">{getCount(item.id)}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title">LISTS</div>
        <nav className="sidebar__nav">
          {listItems.map(item => (
            <button
              key={item.id}
              type="button"
              className={`sidebar__item ${activeView === item.id ? 'sidebar__item--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar__list-dot" style={{ backgroundColor: item.color }} />
              <span className="sidebar__label">{item.label}</span>
            </button>
          ))}
          <button type="button" className="sidebar__item sidebar__item--add" onClick={onAddListClick}>
            <span className="sidebar__icon">+</span>
            <span className="sidebar__label">Add New List</span>
          </button>
        </nav>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title">TAGS</div>
        <div className="sidebar__tags">
          {tagItems.map(item => (
            <button
              key={item.id}
              type="button"
              className={`sidebar__tag ${activeView === item.id ? 'sidebar__tag--active' : ''}`}
              onClick={() => onNavigate(item.id)}
              style={{ backgroundColor: `color-mix(in srgb, ${item.color} 20%, transparent)`, color: item.color }}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className="sidebar__tag sidebar__tag--add" onClick={onAddTagClick}>+ Add Tag</button>
        </div>
      </div>

      <div className="sidebar__bottom">
        <button type="button" className="sidebar__item" onClick={onSettingsClick}>
          <span className="sidebar__icon">⚙️</span>
          <span className="sidebar__label">Settings</span>
        </button>
        <button type="button" className="sidebar__item" onClick={onLogout}>
          <span className="sidebar__icon">↪️</span>
          <span className="sidebar__label">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
