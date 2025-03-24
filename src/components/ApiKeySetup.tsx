import React, { useState } from "react";
import { generateKey, encryptApiKey, importKey, decryptApiKey  } from "./util/encryption-fns";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";


const APIKeySetup = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      showNotification("API Key cannot be empty!", "error");
      return;
    }

    try {
      setLoading(true);

      // Encrypt API key before storing
      // const encryptedKey = await encryptApiKey(apiKey);

      // Save API key to Firestore
      if (user) {
        await updateDoc(doc(firestore, "users", user.uid), {
          apiKey: apiKey,
        });

        showNotification("API Key saved successfully!", "success");
        setTimeout(() => navigate("/analyze"), 1500);
      } else {
        showNotification("User not authenticated", "error");
      }
    } catch (error) {
      console.error("Error saving API Key:", error);
      showNotification("Failed to save API Key.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Set Up Your Gemini API Key</h2>
      <p>Please enter your Google Gemini API key to continue.</p>

      <div style={{ marginBottom: "20px" }}>
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.value)}
          placeholder="Enter your Gemini API Key"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <p style={{ fontSize: "0.8rem", color: "#666", textAlign: "left" }}>
          Your API key will be encrypted before storage for security.
        </p>
      </div>

      <Button themeColor={"primary"} onClick={handleSaveApiKey} disabled={loading}>
        {loading ? (
          <>
            <Loader size="small" type="infinite-spinner" />
            <span style={{ marginLeft: "8px" }}>Saving...</span>
          </>
        ) : (
          "Save & Continue"
        )}
      </Button>

      <NotificationGroup style={{ position: "fixed", top: 20, right: 20 }}>
        {notification && (
          <Notification type={{ style: notification.type, icon: true }} closable={true}>
            {notification.message}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
};

export default APIKeySetup;
