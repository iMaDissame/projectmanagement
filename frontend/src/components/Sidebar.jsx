import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { projectAPI } from '../config/api';

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const glass = css`
  background: rgba(255, 255, 255, 0.98);  
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 8px 32px rgba(106, 130, 251, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-right: 1px solid rgba(106, 130, 251, 0.1);
`;

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ isCollapsed }) => isCollapsed ? '72px' : '260px'};
  ${glass}
  color: #1a1a1a;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: ${({ isOpen }) => isOpen ? '280px' : '0px'};
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${({ isOpen }) => isOpen ? '0 0 50px rgba(0, 0, 0, 0.3)' : 'none'};
  }
`;



const SidebarHeader = styled.div`
  padding: ${({ isCollapsed }) => isCollapsed ? '1.5rem 0.75rem' : '1.5rem 1.25rem'};
  border-bottom: 1px solid rgba(106, 130, 251, 0.08);
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => isCollapsed ? 'center' : 'flex-start'};
  min-height: 80px;
  flex-shrink: 0;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${({ isCollapsed }) => isCollapsed ? '0' : '1.35rem'};
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  text-decoration: none;
  gap: ${({ isCollapsed }) => isCollapsed ? '0' : '0.75rem'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    text-decoration: none;
    color: #6a82fb;
  }
`;

const LogoIcon = styled.div`
  width: ${({ isCollapsed }) => isCollapsed ? '28px' : '32px'};
  height: ${({ isCollapsed }) => isCollapsed ? '28px' : '32px'};
  border-radius: 10px;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ isCollapsed }) => isCollapsed ? '14px' : '16px'};
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(106, 130, 251, 0.25);
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoText = styled.span`
  opacity: ${({ isCollapsed }) => isCollapsed ? '0' : '1'};
  transform: ${({ isCollapsed }) => isCollapsed ? 'translateX(-20px)' : 'translateX(0)'};
  transition: all 0.3s ease;
  white-space: nowrap;
  width: ${({ isCollapsed }) => isCollapsed ? '0' : 'auto'};
  overflow: hidden;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 0;
  
  &::-webkit-scrollbar {
    width: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(106, 130, 251, 0.2);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(106, 130, 251, 0.3);
  }
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6a82fb;
  padding: ${({ isCollapsed }) => isCollapsed ? '0' : '0 1.25rem'};
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  opacity: ${({ isCollapsed }) => isCollapsed ? '0' : '1'};
  height: ${({ isCollapsed }) => isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ isCollapsed }) => isCollapsed ? '0.75rem' : '0.75rem 1.25rem'};
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  border-radius: ${({ isCollapsed }) => isCollapsed ? '8px' : '0 20px 20px 0'};
  margin: ${({ isCollapsed }) => isCollapsed ? '0.25rem 0.5rem' : '0.25rem 0'};
  position: relative;
  transition: all 0.2s ease;
  justify-content: ${({ isCollapsed }) => isCollapsed ? 'center' : 'flex-start'};
  min-height: 40px;
  
  &:hover {
    color: #6a82fb;
    background: rgba(106, 130, 251, 0.05);
    transform: ${({ isCollapsed }) => isCollapsed ? 'scale(1.05)' : 'translateX(4px)'};
  }
  
  &.active {
    background: linear-gradient(90deg, rgba(106, 130, 251, 0.1), rgba(252, 92, 125, 0.05));
    color: #6a82fb;
    font-weight: 600;
    box-shadow: ${({ isCollapsed }) => 
      isCollapsed ? '0 2px 8px rgba(106, 130, 251, 0.15)' : '3px 0 0 #6a82fb inset'};
  }
`;

const IconSpan = styled.span`
  margin-right: ${({ isCollapsed }) => isCollapsed ? '0' : '0.75rem'};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const NavText = styled.span`
  opacity: ${({ isCollapsed }) => isCollapsed ? '0' : '1'};
  width: ${({ isCollapsed }) => isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: all 0.3s ease;
  white-space: nowrap;
`;

const ProjectsSection = styled.div`
  display: flex;
  flex-direction: column;
  max-height: ${({ isCollapsed }) => isCollapsed ? 'auto' : '300px'};
`;

const ProjectsList = styled.div`
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 2px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(252, 92, 125, 0.2);
    border-radius: 1px;
  }
`;

const ProjectNavItem = styled.div`
  position: relative;
  margin-bottom: 0.125rem;
`;

const ProjectLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ isCollapsed }) => isCollapsed ? '0.6rem' : '0.6rem 1.25rem 0.6rem 1.75rem'};
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  border-radius: ${({ isCollapsed }) => isCollapsed ? '6px' : '0 16px 16px 0'};
  margin: ${({ isCollapsed }) => isCollapsed ? '0.125rem 0.5rem' : '0.125rem 0'};
  position: relative;
  transition: all 0.2s ease;
  justify-content: ${({ isCollapsed }) => isCollapsed ? 'center' : 'flex-start'};
  min-height: 36px;
  
  &:hover {
    background: rgba(252, 92, 125, 0.05);
    color: #fc5c7d;
    transform: ${({ isCollapsed }) => isCollapsed ? 'scale(1.05)' : 'translateX(3px)'};
  }
  
  &.active {
    background: linear-gradient(90deg, rgba(252, 92, 125, 0.1), rgba(106, 130, 251, 0.05));
    color: #fc5c7d;
    font-weight: 600;
    box-shadow: ${({ isCollapsed }) => 
      isCollapsed ? '0 2px 6px rgba(252, 92, 125, 0.15)' : '2px 0 0 #fc5c7d inset'};
  }
`;

const ProjectText = styled.span`
  opacity: ${({ isCollapsed }) => isCollapsed ? '0' : '1'};
  width: ${({ isCollapsed }) => isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;
  max-width: 140px;
`;

const ProjectActions = styled.div`
  padding-left: 2rem;
  margin-top: 0.25rem;
  display: ${({ isCollapsed }) => isCollapsed ? 'none' : 'flex'};
  gap: 0.25rem;
  opacity: ${({ isCollapsed }) => isCollapsed ? '0' : '1'};
  height: ${({ isCollapsed }) => isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const ProjectActionLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  color: #94a3b8;
  text-decoration: none;
  font-size: 11px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(106, 130, 251, 0.05);
    color: #6a82fb;
  }
  
  &.active {
    color: #fc5c7d;
    background: rgba(252, 92, 125, 0.05);
    font-weight: 600;
  }
`;

const LoadingState = styled.div`
  padding: ${({ isCollapsed }) => isCollapsed ? '0.75rem' : '0 1.25rem'};
  color: #94a3b8;
  font-size: 12px;
  text-align: ${({ isCollapsed }) => isCollapsed ? 'center' : 'left'};
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => isCollapsed ? 'center' : 'flex-start'};
  min-height: 36px;
`;

const EmptyState = styled.div`
  padding: ${({ isCollapsed }) => isCollapsed ? '0.75rem' : '0 1.25rem'};
  color: #cbd5e1;
  font-size: 12px;
  text-align: ${({ isCollapsed }) => isCollapsed ? 'center' : 'left'};
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => isCollapsed ? 'center' : 'flex-start'};
  min-height: 36px;
`;

const Tooltip = styled.div`
  position: fixed;
  background: #1f2937;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  z-index: 1002;
  opacity: ${({ show }) => show ? '1' : '0'};
  transform: ${({ show }) => show ? 'translateY(0)' : 'translateY(4px)'};
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-width: 200px;
  word-wrap: break-word;
  
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: #1f2937;
  }
`;

const CreateProjectButton = styled.div`
  margin-top: 0.5rem;
  padding: ${({ isCollapsed }) => isCollapsed ? '0' : '0 1.25rem'};
  border-top: ${({ isCollapsed }) => isCollapsed ? 'none' : '1px solid rgba(106, 130, 251, 0.06)'};
  padding-top: ${({ isCollapsed }) => isCollapsed ? '0' : '0.75rem'};
`;

const Sidebar = ({ isOpen, onToggle, user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectAPI.getAll();
        const sortedProjects = [...response.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setProjects(sortedProjects);
      } catch (error) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      onToggle();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const showTooltip = (text, event) => {
    if (isCollapsed && !isMobile) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        show: true,
        text,
        x: rect.right + 8,
        y: rect.top + rect.height / 2
      });
    }
  };

  const hideTooltip = () => {
    setTooltip({ show: false, text: '', x: 0, y: 0 });
  };

  return (
    <>
      <SidebarContainer isCollapsed={isCollapsed} isOpen={isOpen}>
        
        <SidebarHeader isCollapsed={isCollapsed}>
          <Logo to="/dashboard" isCollapsed={isCollapsed}>
            <LogoIcon isCollapsed={isCollapsed}>T</LogoIcon>
            <LogoText isCollapsed={isCollapsed}>TaskFlow</LogoText>
          </Logo>
        </SidebarHeader>

        <SidebarContent>
          <NavSection>
            <NavItem 
              to="/dashboard" 
              isCollapsed={isCollapsed}
              onMouseEnter={(e) => showTooltip('Dashboard', e)}
              onMouseLeave={hideTooltip}
            >
              <IconSpan isCollapsed={isCollapsed}>📊</IconSpan>
              <NavText isCollapsed={isCollapsed}>Dashboard</NavText>
            </NavItem>
            <NavItem 
              to="/mytasks" 
              isCollapsed={isCollapsed}
              onMouseEnter={(e) => showTooltip('My Tasks', e)}
              onMouseLeave={hideTooltip}
            >
              <IconSpan isCollapsed={isCollapsed}>✓</IconSpan>
              <NavText isCollapsed={isCollapsed}>My Tasks</NavText>
            </NavItem>
            <NavItem 
              to="/calendar" 
              isCollapsed={isCollapsed}
              onMouseEnter={(e) => showTooltip('Calendar', e)}
              onMouseLeave={hideTooltip}
            >
              <IconSpan isCollapsed={isCollapsed}>📅</IconSpan>
              <NavText isCollapsed={isCollapsed}>Calendar</NavText>
            </NavItem>
            <NavItem 
              to="/reporting" 
              isCollapsed={isCollapsed}
              onMouseEnter={(e) => showTooltip('Reporting AI', e)}
              onMouseLeave={hideTooltip}
            >
              <IconSpan isCollapsed={isCollapsed}>🤖</IconSpan>
              <NavText isCollapsed={isCollapsed}>Reporting AI</NavText>
            </NavItem>
          </NavSection>

          <ProjectsSection isCollapsed={isCollapsed}>
            <SectionTitle isCollapsed={isCollapsed}>My Projects</SectionTitle>
            <ProjectsList>
              {loading ? (
                <LoadingState isCollapsed={isCollapsed}>
                  {isCollapsed ? '⏳' : 'Loading projects...'}
                </LoadingState>
              ) : projects.length > 0 ? (
                projects.map(project => (
                  <ProjectNavItem key={project.id}>
                    <ProjectLink 
                      to={`/projects/${project.id}`} 
                      isCollapsed={isCollapsed}
                      onMouseEnter={(e) => showTooltip(project.name, e)}
                      onMouseLeave={hideTooltip}
                    >
                      <IconSpan isCollapsed={isCollapsed}>📁</IconSpan>
                      <ProjectText isCollapsed={isCollapsed}>
                        {project.name}
                      </ProjectText>
                    </ProjectLink>
                    <ProjectActions isCollapsed={isCollapsed}>
                      <ProjectActionLink to={`/projects/${project.id}/settings`}>
                        ⚙️ Settings
                      </ProjectActionLink>
                      <ProjectActionLink to={`/projects/${project.id}/sprints`}>
                        🏃 Sprints
                      </ProjectActionLink>
                    </ProjectActions>
                  </ProjectNavItem>
                ))
              ) : (
                <EmptyState isCollapsed={isCollapsed}>
                  {isCollapsed ? '📂' : 'No projects found'}
                </EmptyState>
              )}
            </ProjectsList>
            <CreateProjectButton isCollapsed={isCollapsed}>
              <NavItem 
                to="/projects/create" 
                isCollapsed={isCollapsed}
                onMouseEnter={(e) => showTooltip('Create Project', e)}
                onMouseLeave={hideTooltip}
              >
                <IconSpan isCollapsed={isCollapsed}>➕</IconSpan>
                <NavText isCollapsed={isCollapsed}>Create Project</NavText>
              </NavItem>
            </CreateProjectButton>
          </ProjectsSection>
        </SidebarContent>
      </SidebarContainer>

      <Tooltip 
        show={tooltip.show} 
        style={{ 
          left: tooltip.x, 
          top: tooltip.y - 10 
        }}
      >
        {tooltip.text}
      </Tooltip>
    </>
  );
};

export default Sidebar;