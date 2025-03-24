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
import { userIcon } from '@progress/kendo-svg-icons';
import { Popup } from '@progress/kendo-react-popup';
import './MainLayout.scss';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowMenu(false);
  };

  const onSelect = (event: MenuSelectEvent) => {
    if(event.item.text === 'Logout') {
      handleLogout();
      return;
    }
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

  return (
    <div className="main-layout">
      <AppBar className="main-appbar" themeColor='primary'>
        <AppBarSection>
          {/* <Link to="/" className="app-logo">
            <h1>Resume Analyzer</h1>
          </Link> */}
        </AppBarSection>
        
        <AppBarSpacer />
        
        <AppBarSection>
          {isLoggedIn ? (
            <div className="user-section">
              <div ref={anchorRef} onClick={toggleMenu} className="user-menu-container">
                <Button svgIcon={userIcon} size="large" className='user-btn' themeColor="base" fillMode="outline" rounded="full">
                  User
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
                    <MenuItem text="Profile" data={{ route: '/profile'}} />
                    <MenuItem text="Logout" />
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
    </div>
  );
};

export default MainLayout;