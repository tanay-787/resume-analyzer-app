import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar, 
  AppBarSection, 
  AppBarSpacer,
  Avatar
} from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { useAuth } from '../../context/AuthContext';
import { SvgIcon } from '@progress/kendo-react-common';
import { userIcon } from '@progress/kendo-svg-icons'
import './MainLayout.scss';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <AppBar className="main-appbar" themeColor='light'>
        <AppBarSection>
          <Link to="/" className="app-logo">
            <h1>Resume Analyzer</h1>
          </Link>
        </AppBarSection>
        
        <AppBarSpacer />
        
        <AppBarSection>
          {isLoggedIn ? (
            <div className="user-section">
              <span className="user-welcome">Welcome, {user?.displayName || 'User'}</span>
              <Avatar type="icon" className="user-avatar" fillMode={'outline'} border={true}>
              <SvgIcon icon={userIcon} />
              </Avatar>
              <Button onClick={handleLogout} themeColor="error" fillMode="flat">
                 Logout
              </Button>
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
    </div>
  );
};

export default MainLayout;