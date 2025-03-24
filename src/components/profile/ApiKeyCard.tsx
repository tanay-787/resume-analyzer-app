import React, { useState } from "react";
import { Card, CardBody, CardActions } from "@progress/kendo-react-layout";
import { SvgIcon } from "@progress/kendo-react-common";
import { infoCircleIcon, linkIcon, checkCircleIcon, warningTriangleIcon } from "@progress/kendo-svg-icons";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../config/firebaseConfig";
import { User } from "firebase/auth";
import "./Dialogs.scss";

interface ApiKeyCardProps {
  user: User | null;
  apiKey: string;
  setApiKey: (value: string) => void;
  showNotification: (message: string, type: "success" | "error") => void;
}

const ApiKeyCard: React.FC<ApiKeyCardProps> = ({ 
  user, 
  apiKey, 
  setApiKey, 
  showNotification 
}) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const handleUpdateApiKey = async () => {
    if (!apiKey.trim()) {
      setFeedback({
        message: "API Key cannot be empty!",
        type: "error"
      });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ message: "", type: null });
      
      if (user) {
        await updateDoc(doc(firestore, "users", user.uid), {
          apiKey: apiKey,
        });
        
        setFeedback({
          message: "API Key updated successfully!",
          type: "success"
        });
        
        // Still call the external notification for when dialog closes
        showNotification("API Key updated successfully!", "success");
      } else {
        setFeedback({
          message: "User not authenticated",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error updating API Key:", error);
      setFeedback({
        message: "Failed to update API Key.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="profile-dialog-card">
      <CardBody className="profile-card-body">
      {feedback.type && (
          <div className={`feedback-message ${feedback.type}`}>
            <SvgIcon 
              icon={feedback.type === "success" ? checkCircleIcon : warningTriangleIcon} 
              size="small" 
            />
            <span>{feedback.message}</span>
          </div>
        )}
        <p className="section-description">
          Update your API key to continue using the resume analyzer.
        </p>
        
        <div className="api-key-form">
          <Input
          type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.value);
              if (feedback.type) setFeedback({ message: "", type: null });
            }}
            placeholder="Enter your Gemini API Key"
            className="api-key-input"
          />
        </div>
        
        <div className="api-key-info">
          <div className="info-header">
            <h4>How to get a Gemini API key:</h4>
          </div>
          <ol className="steps-list">
            <li>
              Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="external-link">
                Google AI Studio <SvgIcon icon={linkIcon} size="small" />
              </a>
            </li>
            <li>Sign in with your Google account</li>
            <li>Create a new API key or use an existing one</li>
            <li>Copy and paste the key here</li>
          </ol>
          <p className="usage-note">
            The free tier includes 15 requests per day, which should be sufficient for most users.
          </p>
        </div>
      </CardBody>
      <CardActions className="profile-card-actions">
        <Button 
          themeColor="primary" 
          fillMode="solid"
          onClick={handleUpdateApiKey} 
          disabled={loading}
          className="update-button"
        >
          {loading ? (
            <>
              <Loader size="small" type="infinite-spinner" />
              <span>Updating...</span>
            </>
          ) : (
            "Update API Key"
          )}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ApiKeyCard;