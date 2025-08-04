import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Backend API URL from environment variable
const API_BASE = process.env.REACT_APP_BACKEND_URL;

// Authentication helper
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

  // Load categories on mount
  useEffect(() => {
    axios.get(`${API_BASE}/api/categories`)
      .then(res => {
        setCategories(res.data);
        setLoadingCategories(false);
      })
      .catch(() => setLoadingCategories(false));
  }, []);

  // Check token on load
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Decode token to check admin
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ isAdmin: payload.isAdmin, email: payload.email });
    }
  }, []);

  // Logout function
  const logout = () => {
    removeToken();
    setUser({ isAdmin: false });
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: 20 }}>
        <h1>NullSpire Fan Forum</h1>
        <nav>
          <Link to="/" style={{ marginRight: 15 }}>Home</Link>
          {user.email ? (
            <>
              <span>Welcome, {user.email}</span>
              <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 15 }}>Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          loadingCategories ? <p>Loading categories...</p> :
            <CategoryList categories={categories} />
        } />
        <Route path="/category/:id" element={<CategoryPage user={user} />} />
        <Route path="/post/:id" element={<PostPage user={user} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

// Components below: CategoryList, CategoryPage, PostPage, LoginPage, SignupPage
// Due to length, I'll provide these next step by step. Ready for the next chunk?

export default App;
