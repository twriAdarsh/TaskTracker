import React from 'react';

/* ── SVG Icons (inline, no external library) ──────────────── */
const Icons = {
  home: (
    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  upcoming: (
    <svg viewBox="0 0 24 24"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
  ),
  today: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  sticky: (
    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
};

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
    { id: 'dashboard', label: 'Home', icon: Icons.home },
    { id: 'upcoming', label: 'Upcoming', icon: Icons.upcoming },
    { id: 'today', label: 'Today', icon: Icons.today },
    { id: 'calendar', label: 'Calendar', icon: Icons.calendar },
    { id: 'sticky', label: 'Sticky Wall', icon: Icons.sticky },
  ];

  // Dynamic Metadata
  const listItems = metadata?.lists?.map((listName, idx) => {
    const colors = ['var(--danger)', 'var(--info)', 'var(--warning)', 'var(--success)', 'var(--violet)'];
    return { id: `list:${listName}`, label: listName, color: colors[idx % colors.length] };
  }) || [];

  const tagItems = metadata?.tags?.map((tagName, idx) => {
    const colors = ['var(--info)', 'var(--danger)', 'var(--warning)', 'var(--success)', 'var(--violet)'];
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
            <span className="sidebar__icon">{Icons.plus}</span>
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
              style={{ backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`, color: item.color, borderColor: `color-mix(in srgb, ${item.color} 25%, transparent)` }}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className="sidebar__tag sidebar__tag--add" onClick={onAddTagClick}>+ Add Tag</button>
        </div>
      </div>

      <div className="sidebar__bottom">
        <button type="button" className="sidebar__item" onClick={onSettingsClick}>
          <span className="sidebar__icon">{Icons.settings}</span>
          <span className="sidebar__label">Settings</span>
        </button>
        <button type="button" className="sidebar__item" onClick={onLogout}>
          <span className="sidebar__icon">{Icons.logout}</span>
          <span className="sidebar__label">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
