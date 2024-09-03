import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../Assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);
    formData.append('scope', '');
    formData.append('client_id', '');
    formData.append('client_secret', '');

    try {
      const response = await axios.post(`/api/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        setUsername('');
        setPassword('');
        navigate('/'); // Redirect to the home page
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError('Validation Error: Please check your input.');
      } else {
        setError('Login failed. Please try again later.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        <div className="left-half">
          <div className="brand-logo">
            {/* Replace with your brand logo */}
            <img src={logo} alt="Brand Logo" />
          </div>
          <div className="website-details">
            <h1>Welcome to Photon</h1>
            <p>
              Find your face in a sea of memories. Embrace the smart way to organize shared photos with Photon.
            </p>
          </div>
        </div>
        <div className="right-half">
          <h2>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="E-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="login-button"><button type="submit" className="sign-in-button">Sign In</button></div>
          </form>
          <p className="signup-text">
            Don't have an account? <a href="/signup">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;