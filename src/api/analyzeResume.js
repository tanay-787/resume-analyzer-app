import axios from "axios";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import { auth } from "../config/firebaseConfig";

/**
 * Analyzes a resume based on a job description.
 */

async function analyzeResume(resumeText, jobDescription) {
  // Get current user
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  // Fetch user's API key from Firestore
  const userDoc = await getDoc(doc(firestore, "users", user.uid));
  
  if (!userDoc.exists() || !userDoc.data().apiKey) {
    throw new Error("API key not found. Please set up your API key.");
  }
  
  const apiKey = userDoc.data().apiKey;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Structured prompt
  const prompt = `
 "You are an AI assistant that evaluates job compatibility based on a candidate's resume and a job description. Your task is to analyze the given resume against the job description and provide a structured JSON output covering the following:  

1️⃣ **Overall Skills Match (%)**  
- Provide a percentage match between the resume and the job description.  

2️⃣ **Key Strengths**  
- List the candidate's **strongest** skills and experiences that align well with the job.  

3️⃣ **Weaknesses (if any)**  
- Identify gaps in **soft skills, experience, industry best practices, or tooling knowledge** that might impact job performance.  

4️⃣ **Missing Skills**  
- List technical or domain-specific skills mentioned in the job description but missing from the resume.  

5️⃣ **Detailed Experience Alignment**  
- Break down the candidate's experience in relation to the **job responsibilities** and indicate how well each requirement is met. Use labels: "Strong Match", "Partial Match", or "Not Covered".  

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

IMPORTANT: Return ONLY the JSON object without any markdown formatting or code blocks.
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

    // Clean the response if it contains markdown code blocks
    let cleanedText = rawText;

    // Remove markdown code block indicators if present
    if (rawText.includes("```json")) {
      cleanedText = rawText.replace(/```json\n|\n```/g, "");
    } else if (rawText.includes("```")) {
      cleanedText = rawText.replace(/```\n|\n```/g, "");
    }

    // Convert the cleaned AI response from text to JSON
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    
    // Add specific error handling for API key issues
    if (error.response && error.response.status === 403) {
      throw new Error("Invalid API key. Please check your API key and try again.");
    }
    
    throw error;
  }
}

export { analyzeResume };
