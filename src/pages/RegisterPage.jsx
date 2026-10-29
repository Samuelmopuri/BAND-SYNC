import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { Music, Sparkles, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    instruments: 'Electric Guitar',
    genres: 'Rock, Alternative',
    experienceLevel: 'Intermediate',
    location: '',
    bio: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-type your password.');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to register. Please check your data and ensure MongoDB is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm" style={{ padding: '50px 20px' }}>
      <div className="card" style={{ maxWidth: '580px', margin: '0 auto', padding: '36px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="brand-icon" style={{ margin: '0 auto 14px', width: '48px', height: '48px' }}>
            <Music size={26} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Join BandSync</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Create your artist profile and connect with bands and musicians worldwide.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Jimi Hendrix"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="musician@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="instruments">
                Primary Musical Instrument(s)
              </label>
              <input
                id="instruments"
                name="instruments"
                type="text"
                placeholder="e.g. Drums, Vocals, Bass"
                value={formData.instruments}
                onChange={handleChange}
              />
              <div className="form-helper">Separate multiple with commas</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experienceLevel">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner (1-2 years)</option>
                <option value="Intermediate">Intermediate (3-5 years)</option>
                <option value="Advanced">Advanced (6+ years)</option>
                <option value="Professional">Professional / Touring</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="genres">
                Genre Preferences
              </label>
              <input
                id="genres"
                name="genres"
                type="text"
                placeholder="e.g. Rock, Jazz, Funk, Metal"
                value={formData.genres}
                onChange={handleChange}
              />
              <div className="form-helper">Separate multiple with commas</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                City / Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Austin, TX or Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              Short Bio & Musical Interests
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              placeholder="Tell others what gear you play, your inspirations, and what you're looking for..."
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '12px' }}
          >
            {loading ? 'Creating Your Account...' : 'Complete Registration'}{' '}
            <UserPlus size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
