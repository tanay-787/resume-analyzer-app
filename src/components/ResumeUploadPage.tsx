import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { TextArea } from "@progress/kendo-react-inputs";
import { analyzeResume } from "../api/analyzeResume";
import * as pdfjs from "pdfjs-dist";
import "./ResumeUploadPage.scss";


// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js`;

const ResumeUploadPage: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

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

  return (
    <div className="resume-upload-container">
      <h2>Upload Resume & Job Description</h2>

      <div className="upload-section">
        <h3>Resume</h3>
        <p>Upload your resume (PDF or TXT) or paste text below.</p>

        <div className="file-upload-container">
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.txt"
            className="file-input"
          />
          <Button themeColor="primary" onClick={() => (document.querySelector(".file-input") as HTMLInputElement)?.click()} disabled={isLoadingFile}>
            {isLoadingFile ? "Processing..." : "Choose File"}
          </Button>
          <span className="file-name">{fileName || "No file chosen"}</span>
        </div>

        <TextArea
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.value)}
          rows={10}
        />
      </div>

      <div className="upload-section">
        <h3>Job Description</h3>
        <TextArea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.value)}
          rows={10}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <Button themeColor="primary" fillMode="solid" size="large" onClick={handleAnalyzeClick} disabled={isAnalyzing || isLoadingFile || !resumeText || !jobDescription}>
        {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
      </Button>

      {analysisResult && (
        <div className="analysis-results">
          <h3>Analysis Results</h3>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadPage;
