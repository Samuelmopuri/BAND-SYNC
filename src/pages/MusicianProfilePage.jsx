import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import {
  User as UserIcon,
  MapPin,
  Music,
  Radio,
  Send,
  Edit3,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';

const MusicianProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser, isAuthenticated } = useAuth();

  const [musician, setMusician] = useState(null);
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Edit Profile Modal
  const isOwner = currentUser && musician && currentUser._id === musician._id;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    instruments: '',
    genres: '',
    experienceLevel: 'Intermediate',
    location: '',
    collaborationInterests: '',
  });
  const [updating, setUpdating] = useState(false);

  // Collab Request Modal
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [collabMessage, setCollabMessage] = useState('');
  const [projectType, setProjectType] = useState('Jam Session');
  const [sendingCollab, setSendingCollab] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${id}`);
      setMusician(res.data.musician);
      setBands(res.data.bands);

      // Populate edit form
      setEditForm({
        name: res.data.musician.name || '',
        bio: res.data.musician.bio || '',
        instruments: res.data.musician.instruments?.join(', ') || '',
        genres: res.data.musician.genres?.join(', ') || '',
        experienceLevel: res.data.musician.experienceLevel || 'Intermediate',
        location: res.data.musician.location || '',
        collaborationInterests: res.data.musician.collaborationInterests?.join(', ') || '',
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load musician profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await api.put('/users/profile', editForm);
      setMusician(res.data.user);
      updateUser(res.data.user);
      setNotification({ type: 'success', message: 'Your profile has been updated!' });
      setIsEditModalOpen(false);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSendCollaboration = async (e) => {
    e.preventDefault();
    if (!collabMessage.trim()) {
      setNotification({ type: 'error', message: 'Please write a message.' });
      return;
    }

    try {
      setSendingCollab(true);
      await api.post('/collaborations', {
        recipientId: musician._id,
        message: collabMessage.trim(),
        projectType,
      });

      setNotification({
        type: 'success',
        message: `Collaboration request delivered to ${musician.name}!`,
      });
      setIsCollabModalOpen(false);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to send request.',
      });
    } finally {
      setSendingCollab(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving artist profile..." />;
  }

  if (!musician) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Musician profile not found.</h2>
        <Link to="/discover" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Musicians
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(23, 26, 40, 0.9) 0%, rgba(30, 34, 53, 0.9) 100%)',
          padding: '36px',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={musician.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${musician.name}`}
              alt={musician.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary)',
                boxShadow: 'var(--shadow-glow)',
              }}
            />
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '2rem', color: '#fff' }}>{musician.name}</h1>
                <span className="badge badge-purple">{musician.experienceLevel}</span>
              </div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '8px' }}>
                <MapPin size={16} /> {musician.location || 'Local / Remote'}
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Member since {new Date(musician.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div>
            {isOwner ? (
              <button onClick={() => setIsEditModalOpen(true)} className="btn btn-primary">
                <Edit3 size={16} /> Edit My Profile
              </button>
            ) : (
              isAuthenticated && (
                <button
                  onClick={() => {
                    setCollabMessage(`Hi ${musician.name}! I would love to jam or collaborate together.`);
                    setIsCollabModalOpen(true);
                  }}
                  className="btn btn-primary"
                >
                  <Send size={16} /> Propose Collaboration
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left: Attributes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Instruments</h3>
            {musician.instruments && musician.instruments.length > 0 ? (
              musician.instruments.map((inst, idx) => (
                <span key={idx} className="tag-chip" style={{ fontSize: '0.88rem', padding: '5px 10px' }}>
                  {inst}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>None specified.</p>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Preferred Genres</h3>
            {musician.genres && musician.genres.length > 0 ? (
              musician.genres.map((g, idx) => (
                <span key={idx} className="tag-chip" style={{ fontSize: '0.88rem', padding: '5px 10px' }}>
                  {g}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>None specified.</p>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Collaboration Goals</h3>
            {musician.collaborationInterests && musician.collaborationInterests.length > 0 ? (
              musician.collaborationInterests.map((interest, idx) => (
                <span key={idx} className="badge badge-cyan" style={{ marginRight: '6px', marginBottom: '6px' }}>
                  {interest}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Open to any musical collaboration.</p>
            )}
          </div>
        </div>

        {/* Right: Bio & Bands */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '14px' }}>About Me</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.98rem' }}>
              {musician.bio || 'This musician hasn’t written a bio yet.'}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
              Bands & Projects ({bands.length})
            </h3>
            {bands.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {bands.map((band) => (
                  <div
                    key={band._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{band.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0' }}>
                        {band.genre} &bull; {band.location || 'Remote'}
                      </p>
                    </div>
                    <Link to={`/bands/${band._id}`} className="btn btn-secondary btn-sm">
                      View Band
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Not currently affiliated with any public bands.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal (Owner Only) */}
      {isOwner && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Your Musician Profile"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProfile}
                className="btn btn-primary btn-sm"
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          }
        >
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select
                  value={editForm.experienceLevel}
                  onChange={(e) => setEditForm({ ...editForm, experienceLevel: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City / Base Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Instruments Played</label>
              <input
                type="text"
                value={editForm.instruments}
                onChange={(e) => setEditForm({ ...editForm, instruments: e.target.value })}
                placeholder="e.g. Electric Guitar, Bass, Keyboards"
              />
              <div className="form-helper">Separate multiple instruments with commas</div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Genres</label>
              <input
                type="text"
                value={editForm.genres}
                onChange={(e) => setEditForm({ ...editForm, genres: e.target.value })}
                placeholder="e.g. Rock, Blues, Funk"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio & Influences</label>
              <textarea
                rows="4"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell the community about your musical experience and style..."
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Collaboration Interests</label>
              <input
                type="text"
                value={editForm.collaborationInterests}
                onChange={(e) => setEditForm({ ...editForm, collaborationInterests: e.target.value })}
                placeholder="e.g. Jamming, Studio Recording, Tour"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Send Collaboration Request Modal */}
      <Modal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        title={`Collaborate with ${musician.name}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsCollabModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendCollaboration}
              className="btn btn-primary btn-sm"
              disabled={sendingCollab}
            >
              {sendingCollab ? 'Sending...' : 'Send Request'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSendCollaboration}>
          <div className="form-group">
            <label className="form-label">Project Type</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="Jam Session">Jam Session</option>
              <option value="Band Audition">Band Audition / Recruitment</option>
              <option value="Songwriting & Recording">Songwriting & Recording</option>
              <option value="Live Gig / Replacement">Live Gig / Replacement</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Proposal Message *</label>
            <textarea
              rows="4"
              value={collabMessage}
              onChange={(e) => setCollabMessage(e.target.value)}
              placeholder="Introduce your project and what kind of collaboration you want..."
              required
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MusicianProfilePage;
