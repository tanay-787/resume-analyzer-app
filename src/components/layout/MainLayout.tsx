import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar, 
  AppBarSection, 
  AppBarSpacer,
  Avatar,
  Menu,
  MenuItem,
  MenuSelectEvent
} from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { useAuth } from '../../context/AuthContext';
import { SvgIcon } from '@progress/kendo-react-common';
import { userIcon, chartColumnRangeIcon, warningTriangleIcon, gearIcon, gearsIcon } from '@progress/kendo-svg-icons';
import { Popup } from '@progress/kendo-react-popup';
import './MainLayout.scss';

// Import profile components
import UserInfoCard from '../profile/UserInfoCard';
import ApiKeyCard from '../profile/ApiKeyCard';
import ApiUsageCard from '../profile/ApiUsageCard';
import DeleteAccountCard from '../profile/DeleteAccountCard';
import { Dialog } from '@progress/kendo-react-dialogs';

// Define dialog types
enum ProfileDialogType {
  NONE = "none",
  USER_INFO = "userInfo",
  API_KEY = "apiKey",
  API_USAGE = "apiUsage",
  DELETE_ACCOUNT = "deleteAccount"
}

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeDialog, setActiveDialog] = useState<ProfileDialogType>(ProfileDialogType.NONE);
  const [apiKey, setApiKey] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowMenu(false);
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const onSelect = (event: MenuSelectEvent) => {
    if(event.item.text === 'Logout') {
      handleLogout();
      return;
    }
    
    // Handle profile dialog selections
    if(event.item.data?.dialogType) {
      setActiveDialog(event.item.data.dialogType);
      setShowMenu(false);
      return;
    }
    
    // Handle regular navigation
    if(event.item.data?.route) {
      navigate(event.item.data.route);
    }
    
    setShowMenu(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeDialog = () => {
    setActiveDialog(ProfileDialogType.NONE);
  };

  const getDialogTitle = () => {
    switch (activeDialog) {
      case ProfileDialogType.USER_INFO:
        return (
          <div className="dialog-title-with-icon">
            <SvgIcon icon={userIcon} size="medium" />
            <span>User Info</span>
          </div>
        );
      case ProfileDialogType.API_KEY:
        return (
          <div className="dialog-title-with-icon">
            <SvgIcon icon={gearsIcon} size="medium" />
            <span>API Key Settings</span>
          </div>
        );
      case ProfileDialogType.API_USAGE:
        return (
          <div className="dialog-title-with-icon">
            <SvgIcon icon={chartColumnRangeIcon} size="medium" />
            <span>API Usage Statistics</span>
          </div>
        );
      case ProfileDialogType.DELETE_ACCOUNT:
        return (
          <div className="dialog-title-with-icon">
            <SvgIcon icon={warningTriangleIcon} size="medium" />
            <span>Delete Account</span>
          </div>
        );
      default:
        return (
          <div className="dialog-title-with-icon">
            <SvgIcon icon={userIcon} size="medium" />
            <span>Profile</span>
          </div>
        );
    }
  };

  const renderDialogContent = () => {
    switch (activeDialog) {
      case ProfileDialogType.USER_INFO:
        return <UserInfoCard user={user} />;
      case ProfileDialogType.API_KEY:
        return (
          <ApiKeyCard 
            user={user}
            apiKey={apiKey}
            setApiKey={setApiKey}
            showNotification={showNotification}
          />
        );
      case ProfileDialogType.API_USAGE:
        return <ApiUsageCard user={user} />;
      case ProfileDialogType.DELETE_ACCOUNT:
        return (
          <DeleteAccountCard 
            user={user} 
            showNotification={showNotification} 
            onClose={closeDialog}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-layout">
      <AppBar className="main-appbar" themeColor='primary'>
        <AppBarSection>
          <Link to="/" className="app-logo">
            <h1>Resume Analyzer</h1>
          </Link>
        </AppBarSection>
        
        <AppBarSpacer />
        
        <AppBarSection>
          {isLoggedIn ? (
            <div className="user-section">
              <div ref={anchorRef} onClick={toggleMenu} className="user-menu-container">
                <Button svgIcon={gearIcon} size="large" className='user-btn' themeColor="base" fillMode="outline" rounded="full">
                  Settings
                </Button>
              </div>
              {showMenu && (
                <Popup
                  anchor={anchorRef.current}
                  show={showMenu}
                  popupClass="user-menu-popup"
                  animate={true}
                  anchorAlign={{
                    horizontal: 'right',
                    vertical: 'bottom'
                  }}
                  popupAlign={{
                    horizontal: 'right',
                    vertical: 'top'
                  }}
                >
                  <Menu vertical={true} onSelect={onSelect}>
                    <MenuItem text="User Info" svgIcon={userIcon} icon="user" data={{ dialogType: ProfileDialogType.USER_INFO }} />
                    <MenuItem text="API Key Settings" svgIcon={gearsIcon} data={{ dialogType: ProfileDialogType.API_KEY }} />
                    {/* <MenuItem text="API Usage Statistics" icon="chart-column" data={{ dialogType: ProfileDialogType.API_USAGE }} /> */}
                    <MenuItem text="Logout" />
                    {/* <MenuItem text="Delete Account" icon="warning-triangle" data={{ dialogType: ProfileDialogType.DELETE_ACCOUNT }} /> */}
                  </Menu>
                </Popup>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Button onClick={handleLogin} themeColor="primary" fillMode="flat">
                <span><SvgIcon icon={userIcon} /></span>
                <span> Login</span>
              </Button>
            </div>
          )}
        </AppBarSection>
      </AppBar>
      
      <main className="main-content">
        {children}
      </main>

      {/* Profile Dialogs */}
      {activeDialog !== ProfileDialogType.NONE && (
        <Dialog 
        height={500}
        
          title={getDialogTitle()} 
          onClose={closeDialog}
          className={`profile-dialog ${activeDialog === ProfileDialogType.DELETE_ACCOUNT ? 'danger-dialog' : ''}`}
        >
          <div className="profile-dialog-content">
            {renderDialogContent()}
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default MainLayout;