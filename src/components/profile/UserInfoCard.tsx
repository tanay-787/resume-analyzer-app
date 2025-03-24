import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardTitle, CardActions } from "@progress/kendo-react-layout";
import { SvgIcon } from "@progress/kendo-react-common";
import { userIcon, userOutlineIcon, calendarIcon, warningTriangleIcon } from "@progress/kendo-svg-icons";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { User, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../config/firebaseConfig";
import "./Dialogs.scss";

interface UserInfoCardProps {
  user: User | null;
  showNotification?: (message: string, type: "success" | "error") => void;
  onClose?: () => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ 
  user, 
  showNotification = () => {}, 
  onClose 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const getInitial = () => {
    return user.displayName ? user.displayName[0] : user.email ? user.email[0] : "U";
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Re-authenticate user if needed (for email/password users)
      if (user.providerData[0].providerId === "password" && deletePassword) {
        const credential = EmailAuthProvider.credential(
          user.email || "", 
          deletePassword
        );
        await reauthenticateWithCredential(user, credential);
      }
      
      // Delete user data from Firestore
      await deleteDoc(doc(firestore, "users", user.uid));
      
      // Delete user account
      await deleteUser(user);
      
      showNotification("Account deleted successfully", "success");
      if (onClose) onClose();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      showNotification("Failed to delete account. Please try again.", "error");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Card className="profile-dialog-card">
        <CardBody className="profile-card-body">
          <div className="user-info-container">
            <div className="user-avatar">
              <div className="avatar-circle">
                <span className="avatar-initial">{getInitial()}</span>
              </div>
              <span className="user-name">{user.displayName || 'User'}</span>
            </div>
            
            <div className="user-info-item">
              <SvgIcon icon={userIcon} size="medium" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Name</span>
                <span className="info-value">{user.displayName || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="user-info-item">
              <SvgIcon icon={userOutlineIcon} size="medium" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
            </div>
            
            <div className="user-info-item">
              <SvgIcon icon={calendarIcon} size="medium" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Account Created</span>
                <span className="info-value">
                  {user.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString() 
                    : 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="danger-zone">
              <div className="danger-title">
                <SvgIcon icon={warningTriangleIcon} size="medium" />
                <span>Danger Zone</span>
              </div>
              <p className="danger-description">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button 
                themeColor="error" 
                fillMode="flat"
                className="delete-account-button"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {showDeleteConfirm && (
        <Dialog title="Delete Account" onClose={() => setShowDeleteConfirm(false)}>
          <div className="delete-account-dialog">
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            
            {user.providerData[0].providerId === "password" && (
              <div className="password-confirm">
                <label>Please enter your password to confirm:</label>
                <Input 
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.value)}
                />
              </div>
            )}
          </div>
          <DialogActionsBar layout="end">
            <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button 
              themeColor="error" 
              onClick={handleDeleteAccount}
              disabled={user.providerData[0].providerId === "password" && !deletePassword || loading}
            >
              Delete Account
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </>
  );
};

export default UserInfoCard;