import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import Button from './Button';

const DashboardView = ({ user, onAddClick }) => {
  const { tasks } = useTaskContext();
  const [greeting, setGreeting] = useState('');
  const [animatedCounts, setAnimatedCounts] = useState({ today: 0, completed: 0, total: 0 });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Calculate stats
  const todayCount = tasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    return due.getDate() === today.getDate() && due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
  }).length;

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Animate counters on mount
  useEffect(() => {
    const duration = 600;
    const steps = 20;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedCounts({
        today: Math.round(todayCount * eased),
        completed: Math.round(completedCount * eased),
        total: Math.round(totalCount * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [todayCount, completedCount, totalCount]);

  return (
    <div className="dashboard-view">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <h1>{greeting}, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p>"Every day is a new opportunity to reach your goals."</p>
      </div>

      {/* Bento Stat Cards */}
      <div className="dashboard-bento">
        <div className="stat-card">
          <span className="stat-card__icon">📋</span>
          <span className="stat-card__value">{animatedCounts.today}</span>
          <span className="stat-card__label">Due Today</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__icon">✅</span>
          <span className="stat-card__value">{animatedCounts.completed}</span>
          <span className="stat-card__label">Completed</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__icon">📊</span>
          <span className="stat-card__value">{progressPct}%</span>
          <span className="stat-card__label">Progress</span>
        </div>
      </div>

      {/* Quick Add CTA */}
      <div className="dashboard-cta">
        <h2>What's your main focus today?</h2>
        <Button variant="primary" size="md" onClick={onAddClick}>
          + Create a Task
        </Button>
      </div>
    </div>
  );
};

export default DashboardView;
