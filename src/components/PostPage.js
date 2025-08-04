import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function PostPage({ user }) {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState({ content: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/api/posts/${id}`)
      .then(res => {
        setPostData(res.data.post);
        setReplies(res.data.replies);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleInputChange = e => {
    setNewReply({ ...newReply, [e.target.name]: e.target.value });
  };

  const handleReplySubmit = async e => {
    e.preventDefault();
    setError('');
    if (!user.email) {
      setError('You must be logged in to reply.');
      return;
    }
    if (!newReply.content) {
      setError('Reply content is required.');
      return;
    }
    setReplying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/posts/${id}/replies`, {
        content: newReply.content,
        imageUrl: newReply.imageUrl || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewReply({ content: '', imageUrl: '' });
      // Refresh replies list
      const res = await axios.get(`${API_BASE}/api/posts/${id}`);
      setReplies(res.data.replies);
    } catch {
      setError('Failed to post reply.');
    }
    setReplying(false);
  };

  if (loading) return <p>Loading post...</p>;
  if (!postData) return <p>Post not found.</p>;

  return (
    <div>
      <h2>{postData.title}</h2>
      <p>By {postData.authorEmail}</p>
      <p>{postData.content}</p>
      {postData.imageUrl && <img src={`${API_BASE}${postData.imageUrl}`} alt="Post" style={{ maxWidth: '100%' }} />}
      <hr />
      <h3>Replies</h3>
      {replies.length === 0 ? <p>No replies yet.</p> :
        <ul>
          {replies.map(reply => (
            <li key={reply.id}>
              <p><b>{reply.authorEmail}</b>: {reply.content}</p>
              {reply.imageUrl && <img src={`${API_BASE}${reply.imageUrl}`} alt="Reply" style={{ maxWidth: '80%' }} />}
            </li>
          ))}
        </ul>
      }

      <h4>Write a Reply</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleReplySubmit}>
        <textarea
          name="content"
          placeholder="Your reply"
          value={newReply.content}
          onChange={handleInputChange}
          disabled={replying}
          style={{ width: '100%', height: 80, marginBottom: 10 }}
        />
        {/* Image upload can be added later */}
        <button type="submit" disabled={replying}>Reply</button>
      </form>
    </div>
  );
}
