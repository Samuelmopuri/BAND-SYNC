import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import {
  MessageSquare,
  Heart,
  Send,
  PlusCircle,
  Filter,
  Sparkles,
  Search,
  Trash2,
} from 'lucide-react';

const CommunityPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  // New Post Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General',
  });
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comment input per post (map of postId -> text)
  const [commentInputs, setCommentInputs] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.get('/posts', { params });
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Error fetching community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      setNotification({ type: 'error', message: 'Please provide both title and content.' });
      return;
    }

    try {
      setSubmittingPost(true);
      await api.post('/posts', newPost);
      setNotification({ type: 'success', message: 'Post published to the community!' });
      setNewPost({ title: '', content: '', category: 'General' });
      setShowCreateForm(false);
      fetchPosts();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create post.',
      });
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleToggleLike = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/posts/${postId}/like`);
      // Update locally
      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p._id === postId) {
            const hasLiked = res.data.liked;
            let updatedLikes = [...p.likes];
            if (hasLiked) {
              updatedLikes.push(user._id);
            } else {
              updatedLikes = updatedLikes.filter((id) => id.toString() !== user._id.toString());
            }
            return { ...p, likes: updatedLikes };
          }
          return p;
        })
      );
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to toggle like.',
      });
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
      const res = await api.post(`/posts/${postId}/comment`, {
        text: commentText.trim(),
      });

      // Update locally
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comments: res.data.comments } : p))
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to add comment.',
      });
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setNotification({ type: 'success', message: 'Post removed.' });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete post.',
      });
    }
  };

  const categories = [
    'All',
    'General',
    'Jam Session',
    'Gear & Tips',
    'Looking for Band',
    'Songwriting',
    'Show & Gig',
  ];

  return (
    <div className="container-sm" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
            Musicians Feed
          </span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '6px' }}>Community Feed</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Share studio tips, gear setups, gig announcements, and jam requests.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) navigate('/login');
            else setShowCreateForm(!showCreateForm);
          }}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> {showCreateForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* New Post Form Expandable */}
      {showCreateForm && (
        <div className="card" style={{ marginBottom: '32px', borderColor: 'var(--primary)', animation: 'slideUp 0.25s ease' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Write a Community Post</h3>
          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <label className="form-label">Post Title *</label>
              <input
                type="text"
                placeholder="e.g. Favorite distortion pedal for aggressive rock tones?"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Jam Session">Jam Session</option>
                <option value="Gear & Tips">Gear & Tips</option>
                <option value="Looking for Band">Looking for Band</option>
                <option value="Songwriting">Songwriting</option>
                <option value="Show & Gig">Show & Gig</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Post Content *</label>
              <textarea
                rows="4"
                placeholder="Share your thoughts, advice, or collaboration request..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submittingPost}
              >
                {submittingPost ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Bar & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm">
            <Search size={16} />
          </button>
        </form>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'badge badge-purple' : 'badge badge-secondary'}
              style={{
                cursor: 'pointer',
                padding: '6px 14px',
                fontSize: '0.82rem',
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <LoadingSpinner message="Loading community posts..." />
      ) : posts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post) => {
            const hasLiked =
              user &&
              post.likes &&
              post.likes.some((likeId) => (likeId._id || likeId).toString() === user._id.toString());
            const isAuthor = user && post.author?._id === user._id;

            return (
              <div key={post._id} className="card">
                {/* Author Info & Category */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={post.author?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author?.name}`}
                      alt={post.author?.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <Link
                        to={`/musicians/${post.author?._id}`}
                        style={{ fontSize: '0.98rem', fontWeight: 600, color: '#fff' }}
                      >
                        {post.author?.name}
                      </Link>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-purple">{post.category}</span>
                    {isAuthor && (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="Delete Post"
                      >
                        <Trash2 size={14} style={{ color: '#f87171' }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#fff' }}>
                  {post.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px', whiteSpace: 'pre-line' }}>
                  {post.content}
                </p>

                {/* Actions: Likes & Comment Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => handleToggleLike(post._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'transparent',
                      color: hasLiked ? '#ec4899' : 'var(--text-muted)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    <Heart
                      size={18}
                      fill={hasLiked ? '#ec4899' : 'none'}
                      stroke={hasLiked ? '#ec4899' : 'currentColor'}
                    />
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <MessageSquare size={17} />
                    <span>{post.comments?.length || 0} Comments</span>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', paddingLeft: '8px' }}>
                    {post.comments.map((comment, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                            {comment.author?.name || 'Musician'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input Form */}
                {isAuthenticated ? (
                  <form
                    onSubmit={(e) => handleAddComment(e, post._id)}
                    style={{ display: 'flex', gap: '10px', marginTop: '16px' }}
                  >
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post._id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                      }
                      style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={submittingComment[post._id]}
                    >
                      <Send size={14} />
                    </button>
                  </form>
                ) : (
                  <p style={{ marginTop: '14px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    <Link to="/login" style={{ color: 'var(--primary)' }}>
                      Log in
                    </Link>{' '}
                    to like and leave comments on this post.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No posts in this category yet"
          description="Be the very first artist to share a post with the community!"
          actionLabel="Create a Post"
          onAction={() => setShowCreateForm(true)}
        />
      )}
    </div>
  );
};

export default CommunityPage;
