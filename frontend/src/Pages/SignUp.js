import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import logo from '../Assets/logo.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post(`/api/signup`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        setEmail('');
        setPassword('');
        navigate('/'); // Redirect to the home page
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError('Validation Error: Please check your input.');
      } else {
        setError('Sign-Up failed. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-page-container">
        <div className="left-half">
          <div className="brand-logo">
            {/* Replace with your brand logo */}
            <img src={logo} alt="Brand Logo" />
          </div>
          <div className="website-details">
            <h1>Join Our Community</h1>
            <p>
              Create your Photon account and step into a world of intelligent photo organization. It's simple and fast!
            </p>
          </div>
        </div>
        <div className="right-half">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div className="signup-btn"><button type="submit" className="sign-up-button">Sign Up</button></div>
          </form>
          <p className="login-text">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;