import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardBody, 
  CardActions,
  TileLayout
} from '@progress/kendo-react-layout';
import { SvgIcon } from '@progress/kendo-react-common';
import { fileTxtIcon, heartIcon, chartBarRangeIcon } from '@progress/kendo-svg-icons';
import { useAuth } from '../context/AuthContext';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnalyzeResume = () => {
    navigate('/analyze');
  };

  // Define the tiles for the TileLayout
  const tiles = [
    {
      header: "Recent Analyses",
      icon: heartIcon,
      description: "View your recent resume analyses and track your improvements over time.",
      buttonText: "View History",
      buttonTheme: "info",
      onClick: () => navigate('/history')
    },
    {
      header: "Job Recommendations",
      icon: chartBarRangeIcon,
      description: "Get personalized job recommendations based on your resume skills and experience.",
      buttonText: "View Jobs",
      buttonTheme: "success",
      onClick: () => navigate('/jobs')
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Your Dashboard</h2>
        <p className="dashboard-subtitle">Optimize your job search with our AI-powered resume analysis</p>
      </div>
      
      <div className="resume-analysis-spotlight">
        <Card className="spotlight-card">
          <CardBody>
            <div className="spotlight-content">
              <div className="spotlight-text">
                <h2>Resume Analysis</h2>
                <p>
                  Our AI-powered resume analyzer compares your resume with job descriptions to identify:
                </p>
                <ul>
                  <li>Keyword matches and gaps</li>
                  <li>Skills alignment with job requirements</li>
                  <li>Experience relevance to the position</li>
                  <li>Formatting and content improvement suggestions</li>
                </ul>
                <Button
                  themeColor="primary"
                  fillMode="solid"
                  size="large"
                  onClick={handleAnalyzeResume}
                  className="spotlight-button"
                >
                  Start Your Analysis Now
                </Button>
              </div>
              <div className="spotlight-image">
                <SvgIcon icon={fileTxtIcon} size="xxlarge" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <h3 className="section-title">Additional Tools</h3>
      
      <div className="dashboard-cards">
        {tiles.map((tile, index) => (
          <Card key={index} className="dashboard-card">
            <CardHeader className="card-header-with-icon">
              <SvgIcon icon={tile.icon} />
              <CardTitle>{tile.header}</CardTitle>
            </CardHeader>
            <CardBody>
              <p>{tile.description}</p>
            </CardBody>
            <CardActions>
              <Button
                themeColor={tile.buttonTheme as any}
                fillMode="solid"
                onClick={tile.onClick}
              >
                {tile.buttonText}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;