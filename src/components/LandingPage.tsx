import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { useAuth } from '../context/AuthContext';
import './LandingPage.scss';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const handleGetStarted = async () => {
    try {
      // Directly trigger Google Sign-In
      if(user){
        navigate('/analyze')
      }else{
        await signInWithGoogle();
      }

      // Navigation will be handled in the AuthContext after successful sign-in
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <div className="App">
      <header className="LP-content">
        <h1>Resume Analyzer</h1>
        <p>
          Compare your resume with job descriptions to get personalized feedback
        </p>
        <Button
          className='cta-btn'
          fillMode={'solid'}
          size={"large"}
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </header>
    </div>
  );
};

export default LandingPage;