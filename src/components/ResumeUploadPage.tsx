import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { TextArea } from "@progress/kendo-react-inputs";
import { analyzeResume } from "../api/analyzeResume";
import * as pdfjs from "pdfjs-dist";
import { 
  Card, 
  CardBody, 
  CardTitle,
  CardActions,
  CardHeader
} from "@progress/kendo-react-layout";
import { 
  Stepper, 
  StepperChangeEvent 
} from "@progress/kendo-react-layout";
import { 
  Loader 
} from "@progress/kendo-react-indicators";
import { 
  SvgIcon 
} from "@progress/kendo-react-common";
import { 
  fileTxtIcon, 
  fileWordIcon, 
  clipboardTextIcon, 
  arrowRightIcon,
  checkIcon,
  xIcon
} from "@progress/kendo-svg-icons";
import "./ResumeUploadPage.scss";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const ResumeUploadPage: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Define stepper items
  const stepperItems = [
    {
      label: "Upload Resume",
      icon: "file-text",
      iconColor: "primary"
    },
    {
      label: "Job Description",
      icon: "clipboard-text",
      iconColor: "primary"
    }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    
    const file = event.target.files[0];
    setFileName(file.name);
    setIsLoadingFile(true);
    setError(null);

    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
    } catch (err) {
      setError("Failed to process file. Please try again.");
      console.error(err);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === "application/pdf") {
      return extractTextFromPdf(file);
    } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      return file.text();
    } else {
      throw new Error("Unsupported file type. Upload a PDF or TXT file.");
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  };

  const handleAnalyzeClick = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide both resume and job description.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStepChange = (e: StepperChangeEvent) => {
    setCurrentStep(e.value);
  };

  const handleNextStep = () => {
    if (currentStep === 0 && !resumeText.trim()) {
      setError("Please upload or enter your resume text before proceeding.");
      return;
    }
    
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const renderResumeStep = () => {
    return (
      <Card className="upload-card">
        <CardHeader className="upload-card-header">
          <SvgIcon icon={fileTxtIcon} size="large" />
          <CardTitle>Upload Your Resume</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="upload-description">
            Upload your resume in PDF or TXT format, or paste your resume text below.
          </p>
          
          <div className="file-upload-area">
            <div className="file-upload-container">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.txt"
                className="file-input"
                id="resume-file-input"
              />
              <div className="upload-zone" onClick={() => document.getElementById("resume-file-input")?.click()}>
                <SvgIcon icon={fileTxtIcon} size="xlarge" />
                <p>Drag & drop your resume here or click to browse</p>
                <span className="supported-formats">Supported formats: PDF, TXT</span>
                {isLoadingFile && <Loader size="medium" type="infinite-spinner" />}
                {fileName && <div className="file-name">{fileName}</div>}
              </div>
            </div>
          </div>
          
          <div className="text-area-container">
            <h4>Or paste your resume text:</h4>
            <TextArea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.value)}
              rows={10}
              className="custom-textarea"
            />
          </div>
        </CardBody>
        <CardActions className="upload-card-actions">
          <Button
            themeColor="primary"
            fillMode="solid"
            disabled={!resumeText.trim()}
            onClick={handleNextStep}
            className="next-button"
          >
            Next Step
            <SvgIcon icon={arrowRightIcon} />
          </Button>
        </CardActions>
      </Card>
    );
  };

  const renderJobDescriptionStep = () => {
    return (
      <Card className="upload-card">
        <CardHeader className="upload-card-header">
          <SvgIcon icon={clipboardTextIcon} size="large" />
          <CardTitle>Enter Job Description</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="upload-description">
            Paste the job description you want to compare your resume against.
          </p>
          
          <div className="text-area-container">
            <TextArea
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.value)}
              rows={12}
              className="custom-textarea"
            />
          </div>
        </CardBody>
        <CardActions className="upload-card-actions">
          <div className="button-group">
            <Button
              themeColor="light"
              fillMode="solid"
              onClick={handlePrevStep}
              className="back-button"
            >
              Back
            </Button>
            <Button
              themeColor="primary"
              fillMode="solid"
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing || !jobDescription.trim() || !resumeText.trim()}
              className="analyze-button"
            >
              {isAnalyzing ? (
                <>
                  <Loader size="small" type="infinite-spinner" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        </CardActions>
      </Card>
    );
  };

  return (
    <div className="resume-upload-container">
    <div className="resume-upload-card">
      <h2>Resume Analysis</h2>
      <p className="subtitle">Compare your resume with job descriptions to find the perfect match</p>
      
      <div className="stepper-container">
        <Stepper 
          value={currentStep} 
          onChange={handleStepChange} 
          items={stepperItems}
          linear={true}
        />
      </div>

      {error && (
        <div className="error-message">
          <SvgIcon icon={xIcon} />
          <span>{error}</span>
        </div>
      )}

      <div className="step-content">
        {currentStep === 0 ? renderResumeStep() : renderJobDescriptionStep()}
      </div>

      {analysisResult && (
        <div className="analysis-results">
          <h3>Analysis Results</h3>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
    </div>
  );
};

export default ResumeUploadPage;
