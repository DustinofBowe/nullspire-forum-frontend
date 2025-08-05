import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

import CategoryList from './components/CategoryList';
import CategoryPage from './components/CategoryPage';
import PostPage from './components/PostPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function App() {
  const [user, setUser] = useState({ isAdmin: false });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/categories`)
      .then(res => {
        setCategories(res.data);
        setLoadingCategories(false);
      })
      .catch(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ isAdmin: payload.isAdmin, email: payload.email });
      } catch (err) {
        removeToken();
      }
    }
  }, []);

  const logout = () => {
    removeToken();
    setUser({ isAdmin: false });
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: 20 }}>
        <h1>NullSpire Fan Forum</h1>
        <nav style={{ marginBottom: 10 }}>
          <Link to="/" style={{ marginRight: 10 }}>Home</Link>
          {user.email ? (
            <>
              <span>Welcome, {user.email}!</span>
              <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : (
        <Routes>
          <Route path="/" element={<CategoryList categories={categories} />} />
          <Route path="/category/:id" element={<CategoryPage user={user} />} />
          <Route path="/post/:id" element={<PostPage user={user} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
