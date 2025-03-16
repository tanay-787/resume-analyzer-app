import axios from "axios";

/**
 * Analyzes a resume based on a job description.
 */

export async function analyzeResume(resumeText, jobDescription) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`;

  // Structured prompt
  const prompt = `
 "You are an AI assistant that evaluates job compatibility based on a candidate's resume and a job description. Your task is to analyze the given resume against the job description and provide a structured JSON output covering the following:  

1️⃣ **Overall Skills Match (%)**  
- Provide a percentage match between the resume and the job description.  

2️⃣ **Key Strengths**  
- List the candidate’s **strongest** skills and experiences that align well with the job.  

3️⃣ **Weaknesses (if any)**  
- Identify gaps in **soft skills, experience, industry best practices, or tooling knowledge** that might impact job performance.  

4️⃣ **Missing Skills**  
- List technical or domain-specific skills mentioned in the job description but missing from the resume.  

5️⃣ **Detailed Experience Alignment**  
- Break down the candidate’s experience in relation to the **job responsibilities** and indicate how well each requirement is met. Use labels: "Strong Match", "Partial Match", or "Not Covered".  

6️⃣ **Formatting & Presentation Feedback**  
- Provide suggestions to **improve resume readability, keyword optimization, bullet point clarity, or structural consistency** (if needed).  

7️⃣ **Improvement Suggestions (Prioritized)**  
- List actionable improvements categorized as:  
  - 🔴 **High Priority:** Must-fix for better job compatibility.  
  - 🟡 **Medium Priority:** Recommended but not critical.  
  - 🔵 **Low Priority:** Minor optimizations to enhance presentation.  

### **Analyze the following inputs:**  

**Candidate Resume:**  
${resumeText}

**Job Description:**  
${jobDescription}

### **Return Format (Example JSON Output):**  

{
  "skills_match": "90%",
  "strengths": ["List of strong skills"],
  "weaknesses": ["List of soft skill or experience gaps"],
  "missing_skills": ["List of missing skills"],
  "experience_alignment": {
    "Develop and maintain React apps": "Strong Match",
    "Optimize web performance": "Partial Match",
    "Work with TypeScript & Redux": "Not Covered",
    "API integration (REST/GraphQL)": "Strong Match"
  },
  "formatting_feedback": ["List of resume structuring improvements"],
  "improvement_suggestions": {
    "high_priority": ["Critical areas to improve"],
    "medium_priority": ["Recommended but optional"],
    "low_priority": ["Minor enhancements"]
  }
}
  `;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    // Extract the raw AI response
    const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Convert the AI response from text to JSON
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return { error: "Failed to analyze resume. Please try again." };
  }
}
