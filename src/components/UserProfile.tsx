import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import { Notification, NotificationGroup } from "@progress/kendo-react-notification";
import { eyeIcon, infoCircleIcon, linkIcon, userIcon, chartColumnRangeIcon, warningTriangleIcon } from "@progress/kendo-svg-icons";
import "./UserProfile.scss";

// Import modular components
import UserInfoCard from "./profile/UserInfoCard";
import ApiKeyCard from "./profile/ApiKeyCard";
import ApiUsageCard from "./profile/ApiUsageCard";
import DeleteAccountCard from "./profile/DeleteAccountCard";

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists() && userDoc.data().apiKey) {
          setApiKey(userDoc.data().apiKey);
        }
      }
    };
    
    fetchApiKey();
  }, [user]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="user-profile-container">
      <h2 className="page-title">Your Profile</h2>
      
      <div className="profile-grid">
        {/* User Info Card */}
        <UserInfoCard user={user} />
        
        {/* API Key Card */}
        <ApiKeyCard 
          user={user}
          apiKey={apiKey}
          setApiKey={setApiKey}
          showNotification={showNotification}
        />
        
        {/* API Usage Card */}
        <ApiUsageCard user={user} />
        
        {/* Delete Account Card - spans full width */}
        <DeleteAccountCard user={user} showNotification={showNotification} />
      </div>
      
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

export default UserProfile;