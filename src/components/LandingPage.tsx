import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import '../App.scss';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Analyzer</h1>
        <p>
          Compare your resume with job descriptions to get personalized feedback
        </p>
        <Button
          themeColor={'primary'}
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