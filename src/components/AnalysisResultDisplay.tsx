import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { SvgIcon } from '@progress/kendo-react-common';
import { checkIcon, caretAltExpandIcon, chartColumnRangeIcon, starIcon, warningTriangleIcon, xCircleIcon, clipboardTextIcon } from '@progress/kendo-svg-icons';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import './AnalysisResultDisplay.scss';

interface AnalysisResultDisplayProps {
  analysisResult: any;
}

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ analysisResult }) => {
  const [showFullDialog, setShowFullDialog] = useState(false);

  if (!analysisResult) return null;

  // Extract data from the analysis result
  const {
    skills_match,
    strengths,
    weaknesses,
    missing_skills,
    experience_alignment,
    formatting_feedback,
    improvement_suggestions
  } = analysisResult;

  // Convert skills match percentage string to number
  const skillsMatchPercentage = parseInt(skills_match?.replace('%', '') || '0', 10);

  // Helper function to determine progress bar color based on percentage
  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  // Helper function to render list items
  const renderList = (items: string[] = []) => {
    if (!items || items.length === 0) return <p className="no-items">None found</p>;
    
    return (
      <ul className="analysis-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  // Helper function to render experience alignment
  const renderExperienceAlignment = (alignment: Record<string, string> = {}) => {
    if (!alignment || Object.keys(alignment).length === 0) {
      return <p className="no-items">No experience alignment data available</p>;
    }

    return (
      <div className="experience-alignment">
        {Object.entries(alignment).map(([requirement, match], index) => {
          let matchClass = 'match-neutral';
          let matchIcon = clipboardTextIcon;
          
          if (match.includes('Strong')) {
            matchClass = 'match-strong';
            matchIcon = checkIcon;
          } else if (match.includes('Partial')) {
            matchClass = 'match-partial';
            matchIcon = warningTriangleIcon;
          } else if (match.includes('Not')) {
            matchClass = 'match-none';
            matchIcon = xCircleIcon;
          }
          
          return (
            <div key={index} className={`alignment-item ${matchClass}`}>
              <div className="requirement">
                <SvgIcon icon={matchIcon} size="small" />
                <span>{requirement}</span>
              </div>
              <div className="match-status">{match}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to render improvement suggestions
  const renderImprovementSuggestions = (suggestions: Record<string, string[]> = {}) => {
    if (!suggestions || Object.keys(suggestions).length === 0) {
      return <p className="no-items">No improvement suggestions available</p>;
    }

    return (
      <div className="improvement-suggestions">
        {suggestions.high_priority && suggestions.high_priority.length > 0 && (
          <div className="priority-section high-priority">
            <h4>🔴 High Priority</h4>
            {renderList(suggestions.high_priority)}
          </div>
        )}
        
        {suggestions.medium_priority && suggestions.medium_priority.length > 0 && (
          <div className="priority-section medium-priority">
            <h4>🟡 Medium Priority</h4>
            {renderList(suggestions.medium_priority)}
          </div>
        )}
        
        {suggestions.low_priority && suggestions.low_priority.length > 0 && (
          <div className="priority-section low-priority">
            <h4>🔵 Low Priority</h4>
            {renderList(suggestions.low_priority)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="analysis-result-display">
      <Card>
        <CardHeader className="result-header">
          <SvgIcon icon={checkIcon} size="large" />
          <CardTitle>Analysis Results</CardTitle>
          <Button 
            fillMode="flat" 
            className="expand-button"
            onClick={() => setShowFullDialog(true)}
            title="View full analysis"
          >
            <SvgIcon icon={caretAltExpandIcon} />
          </Button>
        </CardHeader>
        <CardBody>
          <div className="skills-match-container">
            <h3 className="section-title">Overall Skills Match</h3>
            <div className="skills-match">
              <div className="percentage-display">
                <span className="percentage-value">{skills_match}</span>
              </div>
              <div className="progress-container">
                <ProgressBar 
                  value={skillsMatchPercentage} 
                  max={100}
                  labelVisible={false}
                  className={`skills-progress ${getProgressBarColor(skillsMatchPercentage)}`}
                />
              </div>
            </div>
          </div>

          <PanelBar className="analysis-panel-bar">
            <PanelBarItem 
              title="Key Strengths" 
              expanded={true}
              className="panel-strengths"
            >
              <div className="panel-content">
                {renderList(strengths)}
              </div>
            </PanelBarItem>
            
            <PanelBarItem 
              title="Weaknesses" 
              className="panel-weaknesses"
            >
              <div className="panel-content">
                {renderList(weaknesses)}
              </div>
            </PanelBarItem>
            
            <PanelBarItem 
              title="Missing Skills" 
              className="panel-missing"
            >
              <div className="panel-content">
                {renderList(missing_skills)}
              </div>
            </PanelBarItem>
            
            <PanelBarItem 
              title="Experience Alignment" 
              className="panel-alignment"
            >
              <div className="panel-content">
                {renderExperienceAlignment(experience_alignment)}
              </div>
            </PanelBarItem>
            
            <PanelBarItem 
              title="Formatting & Presentation Feedback" 
              className="panel-formatting"
            >
              <div className="panel-content">
                {renderList(formatting_feedback)}
              </div>
            </PanelBarItem>
            
            <PanelBarItem 
              title="Improvement Suggestions" 
              expanded={true}
              className="panel-improvements"
            >
              <div className="panel-content">
                {renderImprovementSuggestions(improvement_suggestions)}
              </div>
            </PanelBarItem>
          </PanelBar>
        </CardBody>
      </Card>

      {showFullDialog && (
        <Dialog title="Complete Analysis Results" onClose={() => setShowFullDialog(false)} width={800}>
          <div className="full-analysis-dialog">
            <pre className="result-content">{JSON.stringify(analysisResult, null, 2)}</pre>
          </div>
          <DialogActionsBar>
            <Button onClick={() => setShowFullDialog(false)}>Close</Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
};

export default AnalysisResultDisplay;