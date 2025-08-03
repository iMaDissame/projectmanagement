import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const glass = css`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1.5px 6px rgba(0,0,0,0.03);
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2.5rem;
  ${glass}
  border-bottom: 1.5px solid #e3e8ee;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #2d3748;
  font-size: 2rem;
  cursor: pointer;
  margin-right: 1.5rem;
  @media (max-width: 768px) {
    display: block;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-left: 1.5rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  padding: 0.7rem 1.2rem 0.7rem 2.5rem;
  border: none;
  border-radius: 2rem;
  width: 270px;
  background: rgba(245, 247, 250, 0.95);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  font-size: 1rem;
  color: #222;
  transition: box-shadow 0.2s, background 0.2s;
  &:focus {
    outline: none;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1.1rem;
  pointer-events: none;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.7rem 1.7rem;
  font-weight: 600;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px rgba(252,92,125,0.08);
  cursor: pointer;
  margin-right: 0.8rem;
  transition: background 0.2s, transform 0.15s;
  &:hover {
    background: linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%);
    transform: translateY(-2px) scale(1.03);
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  position: relative;
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  border: 2.5px solid #fff;
  box-shadow: 0 2px 8px rgba(106,130,251,0.12);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(252,92,125,0.18);
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(255,255,255,0.98);
  border-radius: 1.1rem;
  box-shadow: 0 8px 32px rgba(106,130,251,0.13);
  width: 210px;
  z-index: 200;
  overflow: hidden;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.22s cubic-bezier(.4,0,.2,1);
  backdrop-filter: blur(8px);
`;

const UserMenuItem = styled.div`
  padding: 1.1rem 1.5rem;
  cursor: pointer;
  font-size: 1.01rem;
  color: #2d3748;
  background: transparent;
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: #f7fafc;
    color: #6a82fb;
  }
  &.logout {
    border-top: 1px solid #e3e8ee;
    color: #fc5c7d;
    font-weight: 600;
    &:hover {
      background: #fff0f3;
      color: #fc5c7d;
    }
  }
`;

const Header = ({ user, onLogout, toggleSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Optional: close menu on click outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.user-profile-menu') && userMenuOpen) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  return (
    <HeaderContainer>
      <LeftSection>
        <MobileMenuButton onClick={toggleSidebar}>
          <span role="img" aria-label="menu">☰</span>
        </MobileMenuButton>
        <SearchBar>
          <SearchIcon>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="7"/><line x1="12.5" y1="12.5" x2="17" y2="17"/></svg>
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search tasks, projects, or people" 
          />
        </SearchBar>
      </LeftSection>
      <RightSection>
        <Link to="/projects/create">
          <CreateButton>
            + Create
          </CreateButton>
        </Link>
        <UserProfile className="user-profile-menu">
          <Avatar onClick={toggleUserMenu}>
            {getInitials(user?.name)}
          </Avatar>
          <UserMenu isOpen={userMenuOpen}>
            <UserMenuItem>
              <Link to="/profile" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                Profile
              </Link>
            </UserMenuItem>
            <UserMenuItem>
              <Link to="/settings" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                Settings
              </Link>
            </UserMenuItem>
            <UserMenuItem className="logout" onClick={onLogout}>
              Log out
            </UserMenuItem>
          </UserMenu>
        </UserProfile>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;