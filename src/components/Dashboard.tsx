import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardTitle, CardBody, CardActions } from '@progress/kendo-react-layout';
import { useAuth } from '../context/AuthContext';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnalyzeResume = () => {
    navigate('/analyze');
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Dashboard</h2>
      
      <div className="dashboard-content">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Analyze Your Resume</CardTitle>
          </CardHeader>
          <CardBody>
            <p>
              Upload your resume and compare it with job descriptions to get
              personalized feedback and improvement suggestions.
            </p>
          </CardBody>
          <CardActions>
            <Button
              themeColor="primary"
              fillMode="solid"
              onClick={handleAnalyzeResume}
            >
              Start Analysis
            </Button>
          </CardActions>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
          </CardHeader>
          <CardBody>
            <p>
              View your recent resume analyses and track your improvements over time.
            </p>
          </CardBody>
          <CardActions>
            <Button
              themeColor="info"
              fillMode="solid"
              onClick={() => navigate('/history')}
            >
              View History
            </Button>
          </CardActions>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Job Recommendations</CardTitle>
          </CardHeader>
          <CardBody>
            <p>
              Get personalized job recommendations based on your resume skills and experience.
            </p>
          </CardBody>
          <CardActions>
            <Button
              themeColor="success"
              fillMode="solid"
              onClick={() => navigate('/jobs')}
            >
              View Jobs
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;