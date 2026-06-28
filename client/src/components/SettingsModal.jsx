import React, { useState, useEffect } from 'react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, updatePassword } = useAuth();
  const { clearCompletedTasks } = useTaskContext();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Initialize profile data when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCurrentPassword('');
      setNewPassword('');
      setActiveTab('profile');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    await updateProfile({ name, email });
    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    const res = await updatePassword({ currentPassword, newPassword });
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
    }
    setPasswordLoading(false);
  };

  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to permanently delete all completed tasks?')) {
      clearCompletedTasks();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Settings</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        
        <div className="modal__body" style={{ padding: 0 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 1.5rem' }}>
            <button 
              type="button"
              onClick={() => setActiveTab('profile')}
              style={{
                background: 'none', border: 'none', padding: '1rem', color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
              }}
            >
              Profile
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('account')}
              style={{
                background: 'none', border: 'none', padding: '1rem', color: activeTab === 'account' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'account' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
              }}
            >
              Account & Data
            </button>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="form">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button type="submit" variant="primary" loading={profileLoading}>Save Profile</Button>
                </div>
              </form>
            )}

            {activeTab === 'account' && (
              <div>
                <form onSubmit={handlePasswordSubmit} className="form" style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text)' }}>Change Password</h3>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button type="submit" variant="primary" loading={passwordLoading}>Update Password</Button>
                  </div>
                </form>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Data Management</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Permanently delete all tasks marked as completed. This action cannot be undone.
                  </p>
                  <Button type="button" variant="secondary" onClick={handleClearCompleted} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                    Clear Completed Tasks
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
