import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { useAuth } from '../context/AuthContext';
import './LandingPage.scss';
import { GraphicElement } from './GraphicElement';
import aiFillIcon from './icons/AIFillIcon';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const handleGetStarted = async () => {
    try {
      if(user){
        navigate('/analyze')
      }else{
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };
  
  // Create twinkling stars effect
  useEffect(() => {
    const app = document.querySelector('.App');
    if (!app) return;
    
    // Create stars
    const starCount = 20;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      app.appendChild(star);
    }
    
    return () => {
      // Clean up stars on unmount
      const stars = document.querySelectorAll('.star');
      stars.forEach(star => star.remove());
    };
  }, []);

  return (
    <div className="App">
      <main className="LP-content">
        <GraphicElement />
        <p>
          Turn your resume into your <span>dream job</span> ticket with <span>AI-powered</span> insights
        </p>
        <Button
          className='cta-btn'
          fillMode={'solid'}
          size={"large"}
          onClick={handleGetStarted}
          svgIcon={aiFillIcon}
        >
          Get Started

        </Button>
      </main>
    </div>
  );
};

export default LandingPage;