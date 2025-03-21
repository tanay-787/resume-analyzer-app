import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { useAuth } from '../../context/AuthContext';
import './Auth.scss';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { createUserWithEmail, signInWithGoogle } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmail(email, password, displayName);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google registration failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.value)}
              required
            />
          </div>
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
            Register
          </Button>
        </form>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <Button onClick={handleGoogleRegister} themeColor="info" fillMode="solid">
          Sign up with Google
        </Button>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;