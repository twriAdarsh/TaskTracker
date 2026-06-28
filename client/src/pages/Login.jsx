import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

/**
 * Login — combined Login / Register page with tab toggle.
 * Redirects to "/" on success (handled by ProtectedRoute).
 */
const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [tab,     setTab]     = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (tab === 'register') {
      if (!form.name.trim())           errs.name = 'Name is required';
      if (form.password !== form.confirmPassword)
        errs.confirmPassword = 'Passwords do not match';
    }
    if (!form.email.trim())            errs.email    = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password)                errs.password = 'Password is required';
    if (form.password.length < 6)      errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
      }
      navigate('/');
    } catch (err) {
      // Server errors — display under the relevant field or as a general error
      setErrors({ general: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => {
    setTab(t);
    setErrors({});
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="auth-page__orb auth-page__orb--1" />
      <div className="auth-page__orb auth-page__orb--2" />

      <div className="auth-card">
        {/* Brand */}
        <div className="auth-card__brand">
          <h1 className="auth-card__title">TaskTracker</h1>
          <p className="auth-card__sub">Capture, organise, and tackle your to-dos</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* General server error */}
          {errors.general && (
            <div className="auth-error-banner" role="alert">
              ⚠️ {errors.general}
            </div>
          )}

          {/* Name — register only */}
          {tab === 'register' && (
            <div className={`form-group ${errors.name ? 'form-group--error' : ''}`}>
              <label htmlFor="auth-name" className="form-label">Full Name</label>
              <input
                id="auth-name" name="name" type="text"
                className="form-input" placeholder="John Doe"
                value={form.name} onChange={handleChange}
                autoComplete="name" autoFocus
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
          )}

          {/* Email */}
          <div className={`form-group ${errors.email ? 'form-group--error' : ''}`}>
            <label htmlFor="auth-email" className="form-label">Email Address</label>
            <input
              id="auth-email" name="email" type="email"
              className="form-input" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              autoComplete="email" autoFocus={tab === 'login'}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className={`form-group ${errors.password ? 'form-group--error' : ''}`}>
            <label htmlFor="auth-password" className="form-label">Password</label>
            <input
              id="auth-password" name="password" type="password"
              className="form-input" placeholder={tab === 'register' ? 'Min. 6 characters' : '••••••••'}
              value={form.password} onChange={handleChange}
              autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm Password — register only */}
          {tab === 'register' && (
            <div className={`form-group ${errors.confirmPassword ? 'form-group--error' : ''}`}>
              <label htmlFor="auth-confirm" className="form-label">Confirm Password</label>
              <input
                id="auth-confirm" name="confirmPassword" type="password"
                className="form-input" placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Switch prompt */}
        <p className="auth-card__switch">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-link" onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}>
            {tab === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
