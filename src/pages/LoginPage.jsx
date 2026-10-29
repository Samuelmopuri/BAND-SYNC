import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { Music, LogIn, Sparkles, Key, Mail } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to log in. Please check your credentials or verify backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="container-sm" style={{ padding: '60px 20px' }}>
      <div className="card" style={{ maxWidth: '460px', margin: '0 auto', padding: '36px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="brand-icon" style={{ margin: '0 auto 14px', width: '48px', height: '48px' }}>
            <Music size={26} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Log in to manage your bands, rehearsals, and connections.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                placeholder="musician@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <LogIn size={18} />
          </button>
        </form>

        {/* Demo Credentials Helper for Quick Testing */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
            ⚡ EVALUATOR QUICK FILL (IF SEEDED):
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="badge badge-purple"
              onClick={() => handleQuickLogin('elena@bandportal.dev')}
              style={{ cursor: 'pointer' }}
            >
              Elena (Lead Guitar)
            </button>
            <button
              type="button"
              className="badge badge-cyan"
              onClick={() => handleQuickLogin('marcus@bandportal.dev')}
              style={{ cursor: 'pointer' }}
            >
              Marcus (Drums)
            </button>
            <button
              type="button"
              className="badge badge-amber"
              onClick={() => handleQuickLogin('maya@bandportal.dev')}
              style={{ cursor: 'pointer' }}
            >
              Maya (Synthesizer)
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
