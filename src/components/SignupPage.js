import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function SignupPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password required.');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/signup`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ isAdmin: res.data.isAdmin, email });
      navigate('/');
    } catch {
      setError('Signup failed. Email may be in use.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
