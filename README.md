# Resume Analyzer App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![KendoReact](https://img.shields.io/badge/KendoReact-10.0.0-purple.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)


## 🚀 About the Project

Resume Analyzer is an intelligent application that helps job seekers optimize their resumes for specific job descriptions. Using AI-powered analysis, the app provides personalized feedback on your resume, highlighting strengths, identifying weaknesses, and suggesting improvements to increase your chances of landing interviews.

### ✨ Key Features

- **AI-Powered Resume Analysis**: Compare your resume against job descriptions to find the perfect match
- **Skills Gap Analysis**: Identify missing skills and experience required for your target roles
- **Improvement Suggestions**: Get actionable recommendations prioritized by importance
- **Experience Alignment**: See how well your experience matches job requirements
- **Formatting Feedback**: Receive tips on resume structure and presentation
- **Secure Authentication**: Google Sign-In and email/password options with Firebase

## 🛠️ Built With

- **Frontend**: React, TypeScript, SCSS
- **UI Components**: KendoReact UI Library
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini API
- **PDF Processing**: PDF.js

## 🏁 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase account (for authentication and database)
- Google Gemini API key

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/resume-analyzer-app.git
   cd resume-analyzer-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase and Gemini API credentials:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## 📋 Usage

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Upload Resume**: Upload your resume in PDF or TXT format
3. **Enter Job Description**: Paste the job description you're targeting
4. **Analyze**: Get instant feedback on how well your resume matches the job
5. **Implement Suggestions**: Use the prioritized recommendations to improve your resume

## 📊 Analysis Results

The app provides comprehensive analysis including:

- Overall skills match percentage
- Key strengths relevant to the job
- Weaknesses that might hinder your application
- Missing skills required for the position
- Experience alignment with job requirements
- Formatting and presentation feedback
- Prioritized improvement suggestions

## 🧰 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 📱 Responsive Design

The Resume Analyzer App is fully responsive and works seamlessly across desktop, tablet, and mobile devices.

## 🔒 Privacy

Your resume data and analysis results are securely stored and only accessible to you. We do not share your information with third parties.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📬 Contact

Project Link: [https://github.com/yourusername/resume-analyzer-app](https://github.com/yourusername/resume-analyzer-app)

---

<p align="center">
  Made with ❤️ using KendoReact UI Components
</p>