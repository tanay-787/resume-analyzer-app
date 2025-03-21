import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { useAuth } from '../../context/AuthContext';
import './Auth.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.value)}
              required
            />
          </div>
          <Button type="submit" themeColor="primary" fillMode="solid">
            Login
          </Button>
        </form>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <Button onClick={handleGoogleLogin} themeColor="info" fillMode="solid">
          Sign in with Google
        </Button>
        
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;