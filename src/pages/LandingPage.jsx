import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Music,
  Users,
  Radio,
  Calendar,
  Sparkles,
  ArrowRight,
  Disc,
  Headphones,
  Mic2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

const LandingPage = () => {
  const [featuredMusicians, setFeaturedMusicians] = useState([]);
  const [featuredBands, setFeaturedBands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [musiciansRes, bandsRes] = await Promise.allSettled([
          api.get('/users?limit=4'),
          api.get('/bands?limit=3'),
        ]);

        if (musiciansRes.status === 'fulfilled') {
          setFeaturedMusicians(musiciansRes.value.data.musicians.slice(0, 4));
        }
        if (bandsRes.status === 'fulfilled') {
          setFeaturedBands(bandsRes.value.data.bands.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>The All-In-One Platform for Modern Musicians</span>
        </div>
        <h1 className="hero-title">
          Find Your Sound. <br />
          Build Your Band.
        </h1>
        <p className="hero-subtitle">
          Connect with talented instrumentalists and vocalists, create your dream band, coordinate rehearsals effortlessly, and share original music with a vibrant community.
        </p>

        <div className="hero-cta">
          <Link to="/discover" className="btn btn-primary btn-lg">
            <Users size={20} /> Explore Musicians
          </Link>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Join the Community <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="container" style={{ margin: '40px auto 60px' }}>
        <div className="grid-3">
          <div className="card">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Musician Matchmaking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Search guitarists, drummers, keyboardists, and vocalists by instrument, musical genre, and experience level. Send collaboration invites in seconds.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Radio size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Band Creation & Roster</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Found your group, designate instrumental roles, publish band announcements, and recruit new talent by listing open positions.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: 'var(--accent-pink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Calendar size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Rehearsal Scheduling</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Schedule studio practices and online sessions with dates, times, and maps or meeting links. Track RSVP status across all members.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        style={{
          background: 'rgba(15, 17, 26, 0.6)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          padding: '70px 0',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
              Simple 3-Step Journey
            </span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>How BandSync Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              From bedroom jam sessions to headlining gigs, here is how you collaborate on our platform.
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Build Your Musician Profile</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Highlight your instruments, preferred genres, bio, and skill level so others know your unique style.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--secondary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Discover & Form Bands</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Filter artists by genre and gear, send collaboration requests, and assemble your band line-up.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--accent-pink)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Schedule & Create</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Coordinate in-person and virtual studio practices, post community updates, and produce amazing music.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Musicians Section */}
      <section className="container" style={{ padding: '70px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              Featured Artists
            </span>
            <h2 style={{ fontSize: '2rem' }}>Meet Fellow Musicians</h2>
            <p style={{ color: 'var(--text-muted)' }}>Explore creators ready to collaborate right now.</p>
          </div>
          <Link to="/discover" className="btn btn-secondary btn-sm">
            View All Musicians <ArrowRight size={15} />
          </Link>
        </div>

        {featuredMusicians.length > 0 ? (
          <div className="grid-4">
            {featuredMusicians.map((musician) => (
              <div key={musician._id} className="card card-clickable" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img
                    src={musician.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${musician.name}`}
                    alt={musician.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{musician.name}</h4>
                    <span className="badge badge-purple" style={{ marginTop: '4px' }}>
                      {musician.experienceLevel}
                    </span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '14px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {musician.bio || 'Passionate musician looking to connect and make music.'}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px' }}>INSTRUMENTS</div>
                  <div>
                    {musician.instruments && musician.instruments.slice(0, 2).map((inst, idx) => (
                      <span key={idx} className="tag-chip">
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>

                <Link to={`/musicians/${musician._id}`} className="btn btn-outline btn-sm btn-block">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <Users size={36} style={{ color: 'var(--text-dim)', marginBottom: '10px' }} />
            <p style={{ color: 'var(--text-muted)' }}>No musicians registered yet. Be the very first to register!</p>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
              Create Your Profile
            </Link>
          </div>
        )}
      </section>

      {/* Featured Bands Section */}
      <section className="container" style={{ padding: '30px 20px 70px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '8px' }}>
              Active Groups
            </span>
            <h2 style={{ fontSize: '2rem' }}>Featured Bands</h2>
            <p style={{ color: 'var(--text-muted)' }}>Groups currently rehearsing and scouting members.</p>
          </div>
          <Link to="/bands" className="btn btn-secondary btn-sm">
            View All Bands <ArrowRight size={15} />
          </Link>
        </div>

        {featuredBands.length > 0 ? (
          <div className="grid-3">
            {featuredBands.map((band) => (
              <div key={band._id} className="card card-clickable" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{band.name}</h3>
                  <span className="badge badge-purple">{band.genre}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px', flex: 1 }}>
                  {band.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                    {band.members?.length || 1} members &bull; {band.location || 'Remote'}
                  </span>
                  <Link to={`/bands/${band._id}`} className="btn btn-secondary btn-sm">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <Radio size={36} style={{ color: 'var(--text-dim)', marginBottom: '10px' }} />
            <p style={{ color: 'var(--text-muted)' }}>No bands created yet. Start one today!</p>
            <Link to="/bands" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
              Create a Band
            </Link>
          </div>
        )}
      </section>

      {/* Call To Action Banner */}
      <section className="container" style={{ marginBottom: '40px' }}>
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
            borderColor: 'rgba(139, 92, 246, 0.4)',
            textAlign: 'center',
            padding: '50px 24px',
          }}
        >
          <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>Ready to amplify your musical journey?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 28px', fontSize: '1.05rem' }}>
            Join hundreds of musicians forming bands, booking rehearsal spaces, and bringing original songs to life.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            <Sparkles size={18} /> Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
