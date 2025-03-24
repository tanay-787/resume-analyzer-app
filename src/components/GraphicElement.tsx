import React from 'react';
import './GraphicElement.scss';

export const GraphicElement: React.FC = () => {
  return (
    <div className="graphic-container">
      <div className="resume-graphic">
        <div className="resume-line"></div>
        <div className="resume-line"></div>
        <div className="resume-line"></div>
        <div className="resume-line"></div>
      </div>
      <div className="scan-line"></div>
      <div className="glow-effect"></div>
    </div>
  );
};