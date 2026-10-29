import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import {
  Inbox,
  Send,
  Check,
  X,
  Clock,
  Sparkles,
  User,
  ArrowRight,
} from 'lucide-react';

const CollaborationRequestsPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      if (activeTab === 'received') {
        const res = await api.get('/collaborations/received');
        setReceivedRequests(res.data.requests);
      } else {
        const res = await api.get('/collaborations/sent');
        setSentRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Error fetching collaboration requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      setProcessingId(requestId);
      const res = await api.put(`/collaborations/${requestId}/status`, { status });
      setNotification({
        type: 'success',
        message: `Collaboration request marked as ${status}.`,
      });

      // Update locally
      setReceivedRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status } : req))
      );
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update request status.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="badge badge-emerald">Accepted</span>;
      case 'rejected':
        return <span className="badge badge-red">Declined</span>;
      default:
        return <span className="badge badge-amber">Pending</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
          Network & Jam Invites
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '6px' }}>Collaboration Requests</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your incoming collaboration proposals and monitor requests sent to other musicians.
        </p>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '28px',
          paddingBottom: '2px',
        }}
      >
        <button
          onClick={() => setActiveTab('received')}
          style={{
            background: 'transparent',
            color: activeTab === 'received' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '10px 18px',
            borderBottom: activeTab === 'received' ? '2px solid var(--primary)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <Inbox size={18} /> Received Requests ({receivedRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          style={{
            background: 'transparent',
            color: activeTab === 'sent' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '10px 18px',
            borderBottom: activeTab === 'sent' ? '2px solid var(--primary)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <Send size={18} /> Sent Proposals ({sentRequests.length})
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <LoadingSpinner message="Retrieving collaboration requests..." />
      ) : currentRequests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentRequests.map((req) => {
            const otherParty = activeTab === 'received' ? req.sender : req.recipient;

            return (
              <div key={req._id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={otherParty?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${otherParty?.name}`}
                      alt={otherParty?.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link
                          to={`/musicians/${otherParty?._id}`}
                          style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}
                        >
                          {otherParty?.name}
                        </Link>
                        {getStatusBadge(req.status)}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {otherParty?.instruments?.join(', ') || 'Musician'} &bull;{' '}
                        {otherParty?.experienceLevel || 'Intermediate'} &bull;{' '}
                        {otherParty?.location || 'Remote'}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-purple" style={{ fontSize: '0.78rem' }}>
                    {req.projectType || 'Jam Session'}
                  </span>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px 18px',
                    marginBottom: '16px',
                  }}
                >
                  <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    "{req.message}"
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Sent on {new Date(req.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  {/* Actions for Received Pending requests */}
                  {activeTab === 'received' && req.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleStatusUpdate(req._id, 'accepted')}
                        className="btn btn-primary btn-sm"
                        disabled={processingId === req._id}
                      >
                        <Check size={14} /> Accept Proposal
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req._id, 'rejected')}
                        className="btn btn-danger btn-sm"
                        disabled={processingId === req._id}
                      >
                        <X size={14} /> Decline
                      </button>
                    </div>
                  )}

                  {/* Sent request view */}
                  {activeTab === 'sent' && (
                    <Link to={`/musicians/${req.recipient?._id}`} className="btn btn-secondary btn-sm">
                      View Musician <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={activeTab === 'received' ? Inbox : Send}
          title={
            activeTab === 'received'
              ? 'No collaboration requests received yet'
              : 'You haven’t sent any collaboration proposals'
          }
          description={
            activeTab === 'received'
              ? 'When other musicians discover your profile and want to jam, their invites will appear here.'
              : 'Explore the musician directory to discover artists and send your first collaboration request.'
          }
          actionLabel="Discover Musicians"
          onAction={() => (window.location.href = '/discover')}
        />
      )}
    </div>
  );
};

export default CollaborationRequestsPage;
