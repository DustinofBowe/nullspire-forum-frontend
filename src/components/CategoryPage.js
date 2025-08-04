import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function CategoryPage({ user }) {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/api/categories/${id}/posts`)
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleInputChange = e => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handlePostSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!user.email) {
      setError('You must be logged in to post.');
      return;
    }
    if (!newPost.title || !newPost.content) {
      setError('Title and content are required.');
      return;
    }
    setPosting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/posts`, {
        categoryId: id,
        title: newPost.title,
        content: newPost.content,
        imageUrl: newPost.imageUrl || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewPost({ title: '', content: '', imageUrl: '' });
      // Refresh posts list
      const res = await axios.get(`${API_BASE}/api/categories/${id}/posts`);
      setPosts(res.data);
    } catch {
      setError('Failed to create post.');
    }
    setPosting(false);
  };

  return (
    <div>
      <h2>Posts</h2>
      {loading ? <p>Loading posts...</p> :
        posts.length === 0 ? <p>No posts in this category.</p> :
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <Link to={`/post/${post.id}`}>{post.title}</Link> by {post.authorEmail}
              </li>
            ))}
          </ul>
      }

      <h3>Create New Post</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handlePostSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPost.title}
          onChange={handleInputChange}
          disabled={posting}
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newPost.content}
          onChange={handleInputChange}
          disabled={posting}
          style={{ display: 'block', width: '100%', height: 100, marginBottom: 10 }}
        />
        {/* Image upload can be added later */}
        <button type="submit" disabled={posting}>Post</button>
      </form>
    </div>
  );
}
