import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { projectAPI, taskAPI } from '../config/api';
import ProjectCard from '../components/ProjectCard';
import { toast } from 'react-toastify';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const glass = css`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 25px 50px rgba(106, 130, 251, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(106, 130, 251, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.6s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: 0.5px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '🚀';
    font-size: 2.8rem;
    padding: 0.6rem;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    justify-content: center;
    
    &::before {
      font-size: 2.2rem;
      padding: 0.5rem;
    }
  }
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-size: 0.875rem;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '✨';
    margin-right: 0.5rem;
    font-size: 1rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 32px rgba(106, 130, 251, 0.4);
    text-decoration: none;
    
    &::after {
      left: 100%;
    }
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 1rem 1.5rem;
  }
`;

const Section = styled.div`
  margin-bottom: 3rem;
  animation: ${slideUp} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: ${props => props.icon || '"📋"'};
    font-size: 1.8rem;
    padding: 0.4rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    
    &::before {
      font-size: 1.5rem;
      padding: 0.3rem;
    }
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const GlassCard = styled.div`
  ${glass}
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 32px 64px rgba(106, 130, 251, 0.2),
      0 12px 48px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const NoProjectsMessage = styled(GlassCard)`
  text-align: center;
  padding: 3rem 2rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    &::before {
      content: '📁';
      font-size: 2rem;
    }
  }
  
  p {
    color: #6a82fb;
    opacity: 0.8;
    margin: 0 0 2rem 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const TasksTable = styled(GlassCard)`
  padding: 0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1.2rem 1.5rem;
  background: rgba(106, 130, 251, 0.08);
  color: #1a1a1a;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.3px;
  border-bottom: 2px solid rgba(106, 130, 251, 0.1);
  
  &:first-child {
    border-top-left-radius: 1.5rem;
  }
  
  &:last-child {
    border-top-right-radius: 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.8rem;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(106, 130, 251, 0.08);
  vertical-align: top;
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
`;

const TaskRow = styled.tr`
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(106, 130, 251, 0.04);
    
    ${TableCell} {
      background: transparent;
    }
  }
  
  &:last-child ${TableCell} {
    border-bottom: none;
  }
`;

const ProjectName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const TaskLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: #1a1a1a;
  padding: 0.5rem 0;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  
  &:hover {
    color: #6a82fb;
    transform: translateX(4px);
    text-decoration: none;
  }
`;

const ProjectLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  
  &:hover {
    text-decoration: none;
    
    ${ProjectName} {
      color: #6a82fb;
    }
  }
`;

const TaskStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch(props.status) {
      case 'TODO': return 'rgba(156, 163, 175, 0.1)';
      case 'IN_PROGRESS': return 'rgba(106, 130, 251, 0.1)';
      case 'IN_REVIEW': return 'rgba(245, 158, 11, 0.1)';
      case 'DONE': return 'rgba(34, 197, 94, 0.1)';
      default: return 'rgba(156, 163, 175, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'TODO': return '#6B7280';
      case 'IN_PROGRESS': return '#6a82fb';
      case 'IN_REVIEW': return '#F59E0B';
      case 'DONE': return '#22C55E';
      default: return '#6B7280';
    }
  }};
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const TaskKey = styled.span`
  color: #6a82fb;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(106, 130, 251, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
`;

const LoadingCard = styled(GlassCard)`
  text-align: center;
  padding: 3rem 2rem;
  
  &::after {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid rgba(106, 130, 251, 0.2);
    border-top: 3px solid #6a82fb;
    border-radius: 50%;
    animation: ${pulse} 1s linear infinite;
    margin-left: 0.5rem;
  }
`;

const ErrorCard = styled(GlassCard)`
  text-align: center;
  padding: 2rem;
  border-left: 4px solid #fc5c7d;
  
  p {
    color: #fc5c7d;
    font-weight: 500;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    &::before {
      content: '⚠️';
      font-size: 1.2rem;
    }
  }
`;

const EmptyTasksCard = styled(GlassCard)`
  text-align: center;
  padding: 2rem;
  
  p {
    color: #6a82fb;
    opacity: 0.8;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    &::before {
      content: '📝';
      font-size: 1.2rem;
    }
  }
`;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects first
        const projectsResponse = await projectAPI.getAll();
        const projects = projectsResponse.data;
        setProjects(projects);
        
        // Fetch tasks
        const tasksResponse = await taskAPI.getAssigned();
        
        // Add project information to each task
        const tasksWithProjects = tasksResponse.data.map(task => ({
          ...task,
          project: {
            id: task.projectId,
            name: task.projectName
          }
        }));
        
        setRecentTasks(tasksWithProjects);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [location]);

  if (loading) {
    return (
      <PageContainer>
        <DashboardContainer>
          <LoadingCard>
            <p>Loading your workspace...</p>
          </LoadingCard>
        </DashboardContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <DashboardContainer>
          <ErrorCard>
            <p>{error}</p>
          </ErrorCard>
        </DashboardContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DashboardContainer>
        <DashboardHeader>
          <PageTitle>My Workspace</PageTitle>
          <CreateButton to="/projects/create">Create Project</CreateButton>
        </DashboardHeader>
        
        <Section delay="0.1s">
          <SectionTitle icon='"📁"'>Projects</SectionTitle>
          {projects.length > 0 ? (
            <ProjectGrid>
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ProjectGrid>
          ) : (
            <NoProjectsMessage>
              <h3>No projects yet</h3>
              <p>
                Create your first project to get started with task management.<br />
                Organize your work and collaborate with your team.
              </p>
              <CreateButton to="/projects/create">Create Your First Project</CreateButton>
            </NoProjectsMessage>
          )}
        </Section>
        
        <Section delay="0.2s">
          <SectionTitle icon='"📋"'>My Recent Tasks</SectionTitle>
          {loading ? (
            <LoadingCard>
              <p>Loading tasks...</p>
            </LoadingCard>
          ) : recentTasks.length > 0 ? (
            <TasksTable>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Project</TableHeader>
                    <TableHeader>Task</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Key</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    recentTasks.reduce((acc, task) => {
                      const project = {
                        id: task.projectId,
                        name: task.projectName
                      };
                      
                      const taskWithProject = {
                        ...task,
                        project: task.project || project
                      };
                      
                      if (!acc[project.id]) {
                        acc[project.id] = {
                          project,
                          tasks: []
                        };
                      }
                      
                      acc[project.id].tasks.push(taskWithProject);
                      return acc;
                    }, {})
                  ).map(([projectId, { project, tasks }]) => (
                    tasks.map((task, index) => (
                      <TaskRow key={`${projectId}-${task.id}`}>
                        <TableCell>
                          {index === 0 && (
                            <ProjectLink to={`/projects/${project.id}`}>
                              <ProjectName>{project.name || 'Unnamed Project'}</ProjectName>
                            </ProjectLink>
                          )}
                        </TableCell>
                        <TableCell>
                          <TaskLink to={`/projects/${project.id}?taskId=${task.id}`}>
                            {task.title || 'Untitled Task'}
                          </TaskLink>
                        </TableCell>
                        <TableCell>
                          <TaskStatus status={task.status || 'TODO'}>
                            {(task.status || 'TODO').replace('_', ' ')}
                          </TaskStatus>
                        </TableCell>
                        <TableCell>
                          <TaskKey>{task.key || '-'}</TaskKey>
                        </TableCell>
                      </TaskRow>
                    ))
                  ))}
                </tbody>
              </Table>
            </TasksTable>
          ) : (
            <EmptyTasksCard>
              <p>No tasks assigned to you</p>
            </EmptyTasksCard>
          )}
        </Section>
      </DashboardContainer>
    </PageContainer>
  );
};

export default Dashboard;