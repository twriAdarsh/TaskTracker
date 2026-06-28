import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home  from './pages/Home';
import Login from './pages/Login';
import './styles/index.css';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes — wrapped in TaskProvider so context is only active when logged in */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TaskProvider>
                <Home />
              </TaskProvider>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1f1f38',
            color:      '#e2e8f0',
            border:     '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            fontSize: '0.875rem',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#a78bfa', secondary: '#1e1b4b' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1e1b4b' } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
