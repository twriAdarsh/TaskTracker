import React, { useState, useEffect } from 'react';
import Button from './Button';

const DashboardView = ({ user, onAddClick }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="dashboard-view" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      padding: '2rem',
      textAlign: 'center',
      color: 'var(--text-primary)'
    }}>
      <div className="dashboard-animation" style={{ animation: 'fadeSlideUp 1s ease-out' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--accent)' }}>
          {greeting}, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px' }}>
          "Every day is a new opportunity to reach your goals. Let's make today count."
        </p>

        <div style={{ padding: '2rem', background: 'var(--surface-1)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>What's your main focus today?</h2>
          <Button variant="primary" size="lg" onClick={onAddClick} style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: 'var(--radius-xl)' }}>
            + Create a Task
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DashboardView;
