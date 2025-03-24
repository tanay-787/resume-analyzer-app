import React, { useState, useEffect, useRef } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { TextArea } from "@progress/kendo-react-inputs";
import { analyzeResume } from "../api/analyzeResume";
import * as pdfjs from "pdfjs-dist";
import { 
  Card, 
  CardBody, 
  CardTitle,
  CardActions,
  CardHeader,
  Splitter
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
import { firestore } from "../config/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import AnalysisResultDisplay from "./AnalysisResultDisplay";
import "./ResumeUploadPage.scss";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ResumeUploadPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkApiKey = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists() || !userDoc.data().apiKey) {
          setError("You need to set up your API key first in Settings");
          
        }
      }
    };
    
    checkApiKey();
  }, [user, navigate]);
  
  // Modify handleAnalyzeClick to handle API key errors
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
    } catch (err: any) {
      if (err.message && err.message.includes("API key")) {
        setError(err.message);
      } else {
        setError("Failed to analyze resume. Please try again.");
        console.error(err);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

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

  // Refs for resizable panels
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup resizer functionality
  useEffect(() => {
    const resizer = resizerRef.current;
    const leftPanel = leftPanelRef.current;
    const container = containerRef.current;
    
    if (!resizer || !leftPanel || !container) return;
    
    let x = 0;
    let leftWidth = 0;
    
    const mouseDownHandler = (e: MouseEvent) => {
      x = e.clientX;
      leftWidth = leftPanel.getBoundingClientRect().width;
      
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      
      resizer.style.userSelect = 'none';
      resizer.style.pointerEvents = 'none';
    };
    
    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = e.clientX - x;
      const containerWidth = container.getBoundingClientRect().width;
      const newLeftWidth = ((leftWidth + dx) / containerWidth) * 100;
      
      if (newLeftWidth > 20 && newLeftWidth < 80) {
        leftPanel.style.width = `${newLeftWidth}%`;
      }
    };
    
    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      
      resizer.style.userSelect = '';
      resizer.style.pointerEvents = '';
    };
    
    resizer.addEventListener('mousedown', mouseDownHandler);
    
    return () => {
      resizer.removeEventListener('mousedown', mouseDownHandler);
    };
  }, []);

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
          
          {/* <div className="text-area-container">
            <h4>Or paste your resume text:</h4>
            <TextArea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.value)}
              rows={10}
              className="custom-textarea"
            />
          </div> */}
        </CardBody>
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
        </CardActions>
      </Card>
    );
  };

  return (
    <div className="resume-upload-container">
      <div className="resume-upload-card">
        <h2>Resume Analysis</h2>
        <p className="subtitle">Compare your resume with job descriptions to find the perfect match</p>
        
        {error && (
          <div className="error-message">
            <SvgIcon icon={xIcon} />
            <span>{error}</span>
          </div>
        )}

        <div className="custom-layout" ref={containerRef}>
          <div className="left-panel" ref={leftPanelRef}>
            <div className="steps-container">
              <div className="step-content">
                {renderResumeStep()}
              </div>
              <div className="step-content">
                {renderJobDescriptionStep()}
              </div>
            </div>
          </div>
          
          <div className="resizer" ref={resizerRef}></div>
          
          <div className="right-panel">
            {analysisResult ? (
              <div className="analysis-results">
                <AnalysisResultDisplay analysisResult={analysisResult} />
              </div>
            ) : (
              <div className="placeholder-content">
                <div className="placeholder-message">
                  <SvgIcon icon={clipboardTextIcon} size="xlarge" />
                  <p>Your analysis results will appear here after processing</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
