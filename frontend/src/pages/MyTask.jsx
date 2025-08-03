import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { taskAPI, projectAPI } from '../config/api';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const countUp = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
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

const ContentContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  animation: ${slideUp} 0.6s ease-out;
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
    content: '📋';
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
    
    &::before {
      font-size: 2.2rem;
      padding: 0.5rem;
    }
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.6s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  ${glass}
  border-radius: 1.5rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      switch(props.type) {
        case 'total': return 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)';
        case 'todo': return 'linear-gradient(90deg, #9CA3AF 0%, #6B7280 100%)';
        case 'inProgress': return 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)';
        case 'inReview': return 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)';
        case 'done': return 'linear-gradient(90deg, #10B981 0%, #059669 100%)';
        default: return 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)';
      }
    }};
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 32px 64px rgba(106, 130, 251, 0.2),
      0 12px 48px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  background: ${props => {
    switch(props.type) {
      case 'total': return 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)';
      case 'todo': return 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)';
      case 'inProgress': return 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
      case 'inReview': return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      case 'done': return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      default: return 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)';
    }
  }};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  animation: ${countUp} 0.6s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: ${props => {
      switch(props.type) {
        case 'total': return '"📊"';
        case 'todo': return '"⏳"';
        case 'inProgress': return '"🚀"';
        case 'inReview': return '"👁️"';
        case 'done': return '"✅"';
        default: return '"📊"';
      }
    }};
    font-size: 1.5rem;
    -webkit-text-fill-color: initial;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    
    &::before {
      font-size: 1.2rem;
    }
  }
`;

const StatLabel = styled.div`
  color: #1a1a1a;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const FiltersSection = styled.div`
  ${glass}
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.6s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const FilterButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 2rem;
  border: 2px solid rgba(106, 130, 251, 0.2);
  background: ${props => 
    props.active 
      ? 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)' 
      : 'rgba(255, 255, 255, 0.8)'
  };
  color: ${props => props.active ? 'white' : '#1a1a1a'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  
  &::before {
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
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(106, 130, 251, 0.3);
    border-color: rgba(106, 130, 251, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
`;

const FilterDropdown = styled.select`
  padding: 0.8rem 1.2rem;
  border-radius: 1rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-weight: 500;
  font-size: 0.875rem;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #6a82fb;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 
      0 0 0 3px rgba(106, 130, 251, 0.1),
      0 4px 16px rgba(106, 130, 251, 0.15);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(106, 130, 251, 0.25);
  }
  
  option {
    background: white;
    color: #1a1a1a;
    padding: 0.5rem;
  }
  
  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

const TasksSection = styled.div`
  animation: ${slideUp} 0.6s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
`;

const TasksGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const LoadingCard = styled.div`
  ${glass}
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  
  p {
    color: #1a1a1a;
    font-weight: 500;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    &::after {
      content: '';
      width: 20px;
      height: 20px;
      border: 3px solid rgba(106, 130, 251, 0.2);
      border-top: 3px solid #6a82fb;
      border-radius: 50%;
      animation: ${pulse} 1s linear infinite;
    }
  }
`;

const EmptyState = styled.div`
  ${glass}
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  
  &::before {
    content: '📭';
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
    animation: ${float} 3s ease-in-out infinite;
  }
  
  h3 {
    color: #1a1a1a;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }
  
  p {
    color: #6a82fb;
    opacity: 0.8;
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const FilterLabel = styled.span`
  color: #1a1a1a;
  font-weight: 600;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &::before {
    content: '🔍';
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    inReview: 0,
    done: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch tasks
        const tasksResponse = await taskAPI.getAssigned();
        const userTasks = tasksResponse.data;
        console.log('User Tasks:', userTasks);
        
        // Get unique project IDs from tasks
        const uniqueProjectIds = [...new Set(userTasks.map(task => task.projectId))];
        
        // Fetch project details for each unique project ID
        const projectPromises = uniqueProjectIds.map(projectId => 
          projectAPI.getById(projectId)
        );
        
        const projectResponses = await Promise.all(projectPromises);
        const projectsData = projectResponses.map(response => response.data);
        
        setProjects(projectsData);
        
        // Calculate stats
        const newStats = userTasks.reduce((acc, task) => {
          acc.total++;
          switch (task.status) {
            case 'TODO':
              acc.todo++;
              break;
            case 'IN_PROGRESS':
              acc.inProgress++;
              break;
            case 'IN_REVIEW':
              acc.inReview++;
              break;
            case 'DONE':
              acc.done++;
              break;
            default:
              break;
          }
          return acc;
        }, {
          total: 0,
          todo: 0,
          inProgress: 0,
          inReview: 0,
          done: 0
        });

        setStats(newStats);
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );

    // Update stats when task status changes
    const newStats = { ...stats };
    if (selectedTask.status !== updatedTask.status) {
      newStats[selectedTask.status.toLowerCase()]--;
      newStats[updatedTask.status.toLowerCase()]++;
      setStats(newStats);
    }
    
    toast.success('Task updated successfully');
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskAPI.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // Update stats when task is deleted
      const taskToDelete = tasks.find(task => task.id === taskId);
      if (taskToDelete) {
        setStats(prevStats => ({
          ...prevStats,
          total: prevStats.total - 1,
          [taskToDelete.status.toLowerCase()]: prevStats[taskToDelete.status.toLowerCase()] - 1
        }));
      }
      
      setTaskDetailModalOpen(false);
      setSelectedTask(null);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskDetailModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    // First filter by status
    if (filter !== 'ALL' && task.status !== filter) {
      return false;
    }
    
    // Then filter by project
    if (selectedProject !== 'ALL' && task.projectId.toString() !== selectedProject.toString()) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingCard>
            <p>Loading your tasks...</p>
          </LoadingCard>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <PageHeader>
          <PageTitle>My Tasks</PageTitle>
        </PageHeader>
        
        <StatsContainer>
          <StatCard type="total">
            <StatNumber type="total">{stats.total}</StatNumber>
            <StatLabel>Total Tasks</StatLabel>
          </StatCard>
          <StatCard type="todo">
            <StatNumber type="todo">{stats.todo}</StatNumber>
            <StatLabel>To Do</StatLabel>
          </StatCard>
          <StatCard type="inProgress">
            <StatNumber type="inProgress">{stats.inProgress}</StatNumber>
            <StatLabel>In Progress</StatLabel>
          </StatCard>
          <StatCard type="inReview">
            <StatNumber type="inReview">{stats.inReview}</StatNumber>
            <StatLabel>In Review</StatLabel>
          </StatCard>
          <StatCard type="done">
            <StatNumber type="done">{stats.done}</StatNumber>
            <StatLabel>Done</StatLabel>
          </StatCard>
        </StatsContainer>

        <FiltersSection>
          <FilterContainer>
            <div>
              <FilterLabel>Filter by Status:</FilterLabel>
              <FilterButtonGroup>
                <FilterButton 
                  active={filter === 'ALL'} 
                  onClick={() => setFilter('ALL')}
                >
                  All
                </FilterButton>
                <FilterButton 
                  active={filter === 'TODO'} 
                  onClick={() => setFilter('TODO')}
                >
                  To Do
                </FilterButton>
                <FilterButton 
                  active={filter === 'IN_PROGRESS'} 
                  onClick={() => setFilter('IN_PROGRESS')}
                >
                  In Progress
                </FilterButton>
                <FilterButton 
                  active={filter === 'IN_REVIEW'} 
                  onClick={() => setFilter('IN_REVIEW')}
                >
                  In Review
                </FilterButton>
                <FilterButton 
                  active={filter === 'DONE'} 
                  onClick={() => setFilter('DONE')}
                >
                  Done
                </FilterButton>
              </FilterButtonGroup>
            </div>
            
            <div>
              <FilterLabel>Project:</FilterLabel>
              <FilterDropdown
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="ALL">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </FilterDropdown>
            </div>
          </FilterContainer>
        </FiltersSection>

        <TasksSection>
          <TasksGrid>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                />
              ))
            ) : (
              <EmptyState>
                <h3>No tasks found</h3>
                <p>Try adjusting your filters or create some new tasks to get started.</p>
              </EmptyState>
            )}
          </TasksGrid>
        </TasksSection>

        {taskDetailModalOpen && selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            project={selectedTask.project}
            onClose={() => {
              setTaskDetailModalOpen(false);
              setSelectedTask(null);
            }}
            onUpdateTask={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default MyTasks;