import React, { useState, useEffect } from 'react';


const Topbar = ({ toggleSidebar, user }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <span /><span /><span />
        </button>
        <span className="topbar__logo">Menu</span>
      </div>
      <div className="topbar__center">
        {/* Search / Filter moved to main-panel */}
      </div>
      <div className="topbar__right">
        <div className="clock">
          <span className="clock__time">
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="clock__date">
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="user-menu">
          <div className="user-avatar" title={user?.email}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="user-name">{user?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
