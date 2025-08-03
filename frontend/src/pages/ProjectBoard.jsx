import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { projectAPI, taskAPI } from '../config/api';
import { toast } from 'react-toastify';

import TaskCard from '../components/TaskCard';
import { TASK_STATUS } from '../config/constants';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

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

const slideInLeft = keyframes`
  from { 
    opacity: 0;
    transform: translateX(-30px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from { 
    opacity: 0;
    transform: translateX(30px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
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

const BoardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BoardWrapper = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${slideUp} 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  }
  
  @media (max-width: 768px) {
    border-radius: 1.5rem;
    padding: 1.5rem;
  }
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(106, 130, 251, 0.1);
  position: relative;
  animation: ${slideInLeft} 0.8s ease-out;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(106, 130, 251, 0.3), transparent);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }
`;

const ProjectTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProjectIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 32px rgba(106, 130, 251, 0.3);
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`;

const ProjectTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 0.3px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProjectSubtitle = styled.div`
  font-size: 0.875rem;
  color: #6a82fb;
  margin-top: 0.5rem;
  opacity: 0.8;
  font-weight: 500;
`;

const BoardActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  animation: ${slideInRight} 0.8s ease-out;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.primary ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 32px rgba(106, 130, 251, 0.4);
    }
    
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
    
    &:hover:not(:disabled)::before {
      left: 100%;
    }
  ` : css`
    background: rgba(106, 130, 251, 0.1);
    color: #6a82fb;
    border: 1px solid rgba(106, 130, 251, 0.2);
    
    &:hover {
      background: rgba(106, 130, 251, 0.15);
      border-color: rgba(106, 130, 251, 0.3);
      transform: translateY(-1px);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 0.875rem 1.5rem;
  }
`;

const BoardColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  animation: ${slideUp} 1s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const BoardColumn = styled.div`
  ${glass}
  border-radius: 1.5rem;
  padding: 1.5rem;
  min-height: 600px;
  position: relative;
  overflow: hidden;
  animation: ${slideUp} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      switch(props.status) {
        case 'TODO': return 'linear-gradient(90deg, #64b5f6, #42a5f5)';
        case 'IN_PROGRESS': return 'linear-gradient(90deg, #ffb74d, #ffa726)';
        case 'IN_REVIEW': return 'linear-gradient(90deg, #ab47bc, #9c27b0)';
        case 'DONE': return 'linear-gradient(90deg, #66bb6a, #4caf50)';
        default: return 'linear-gradient(90deg, #64b5f6, #42a5f5)';
      }
    }};
    border-radius: 1.5rem 1.5rem 0 0;
  }
  
  @media (max-width: 768px) {
    border-radius: 1rem;
    padding: 1rem;
    min-height: 400px;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(106, 130, 251, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(106, 130, 251, 0.3), transparent);
  }
`;

const ColumnTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 0.3px;
`;

const ColumnTitleIcon = styled.div`
  margin-right: 0.75rem;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.75rem;
  background: ${props => {
    switch(props.status) {
      case 'TODO': return 'rgba(100, 181, 246, 0.15)';
      case 'IN_PROGRESS': return 'rgba(255, 183, 77, 0.15)';
      case 'IN_REVIEW': return 'rgba(171, 71, 188, 0.15)';
      case 'DONE': return 'rgba(102, 187, 106, 0.15)';
      default: return 'rgba(100, 181, 246, 0.15)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'TODO': return '#42a5f5';
      case 'IN_PROGRESS': return '#ffa726';
      case 'IN_REVIEW': return '#9c27b0';
      case 'DONE': return '#4caf50';
      default: return '#42a5f5';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

const TaskCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 1rem;
  min-width: 32px;
  height: 32px;
  padding: 0 0.75rem;
  box-shadow: 0 4px 12px rgba(106, 130, 251, 0.3);
  letter-spacing: 0.3px;
`;

const TasksContainer = styled.div`
  min-height: 400px;
  transition: all 0.3s ease;
  border-radius: 1rem;
  padding: 0.5rem;
  
  ${props => props.isDraggingOver && css`
    background: rgba(106, 130, 251, 0.08);
    border: 2px dashed rgba(106, 130, 251, 0.3);
  `}
`;

const EmptyColumnMessage = styled.div`
  color: #6a82fb;
  text-align: center;
  padding: 3rem 1rem;
  font-size: 0.875rem;
  opacity: 0.7;
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  &::before {
    content: '✨';
    font-size: 2rem;
    opacity: 0.5;
  }
`;

const LoadingContainer = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 4rem 2rem;
  text-align: center;
  animation: ${slideUp} 0.8s ease-out;
  
  @media (max-width: 768px) {
    border-radius: 1.5rem;
    padding: 3rem 1.5rem;
  }
`;

const LoadingText = styled.div`
  color: #6a82fb;
  font-size: 1.125rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  &::before {
    content: '⏳';
    font-size: 1.5rem;
    animation: ${pulse} 1.5s linear infinite;
  }
`;

const ErrorContainer = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 4rem 2rem;
  text-align: center;
  border-left: 4px solid #fc5c7d;
  animation: ${slideUp} 0.8s ease-out;
  
  @media (max-width: 768px) {
    border-radius: 1.5rem;
    padding: 3rem 1.5rem;
  }
`;

const ErrorText = styled.div`
  color: #fc5c7d;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  
  &::before {
    content: '⚠️';
    font-size: 1.5rem;
    margin-right: 0.75rem;
  }
`;

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  useEffect(() => {
    const fetchProjectBoard = async () => {
      try {
        setLoading(true);
        
        console.log(`Fetching project with ID: ${projectId}`);
        const projectResponse = await projectAPI.getById(projectId);
        const projectData = projectResponse.data;
        console.log('Project data:', projectData);
        
        console.log(`Fetching tasks for project: ${projectId}`);
        const tasksResponse = await taskAPI.getAll(projectId);
        const tasksData = tasksResponse.data;
        console.log('Tasks data:', tasksData);
        
        setProject(projectData);
        setTasks(tasksData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project board:', err);
        setError('Failed to load project board: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchProjectBoard();
  }, [projectId]);
  
  const handleCreateTask = () => {
    setCreateTaskModalOpen(true);
  };
  
  const handleTaskDelete = async (taskId) => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
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
  
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex(task => task.id.toString() === draggableId);
    if (taskIndex === -1) return;
    
    const task = updatedTasks[taskIndex];
    
    updatedTasks[taskIndex] = {
      ...task,
      status: destination.droppableId
    };
    
    setTasks(updatedTasks);
    
    try {
      await taskAPI.updateStatus(task.id, destination.droppableId);
      toast.success('Task status updated');
    } catch (err) {
      console.error('Error updating task status:', err);
      setTasks([...tasks]);
      toast.error('Failed to update task status');
    }
  };
  
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };
  
  const getColumnIcon = (status) => {
    switch(status) {
      case 'TODO': return '📋';
      case 'IN_PROGRESS': return '🔄';
      case 'IN_REVIEW': return '👀';
      case 'DONE': return '✅';
      default: return '📋';
    }
  };
  
  const getStatusDisplayName = (status) => {
    switch(status) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'IN_REVIEW': return 'In Review';
      case 'DONE': return 'Done';
      default: return status;
    }
  };
  
  if (loading) {
    return (
      <BoardContainer>
        <LoadingContainer>
          <LoadingText>Loading project board...</LoadingText>
        </LoadingContainer>
      </BoardContainer>
    );
  }
  
  if (error) {
    return (
      <BoardContainer>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <Button onClick={() => navigate('/dashboard')}>
            🏠 Back to Dashboard
          </Button>
        </ErrorContainer>
      </BoardContainer>
    );
  }
  
  if (!project) {
    return (
      <BoardContainer>
        <ErrorContainer>
          <ErrorText>Project not found</ErrorText>
          <Button onClick={() => navigate('/dashboard')}>
            🏠 Back to Dashboard
          </Button>
        </ErrorContainer>
      </BoardContainer>
    );
  }

  return (
    <BoardContainer>
      <BoardWrapper>
        <BoardHeader>
          <ProjectTitleSection>
            <ProjectIcon>🚀</ProjectIcon>
            <ProjectTitleContainer>
              <ProjectTitle>{project.name}</ProjectTitle>
              <ProjectSubtitle>
                {tasks.length} tasks • {getTasksByStatus('DONE').length} completed
              </ProjectSubtitle>
            </ProjectTitleContainer>
          </ProjectTitleSection>
          <BoardActionsContainer>
            <Button onClick={() => navigate(`/projects/${projectId}/settings`)}>
              ⚙️ Settings
            </Button>
            <Button primary onClick={handleCreateTask}>
              ➕ Create Task
            </Button>
          </BoardActionsContainer>
        </BoardHeader>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <BoardColumnsContainer>
            {Object.values(TASK_STATUS).map((status, index) => (
              <BoardColumn 
                key={status} 
                status={status}
                delay={`${0.2 + (index * 0.1)}s`}
              >
                <ColumnHeader>
                  <ColumnTitle>
                    <ColumnTitleIcon status={status}>
                      {getColumnIcon(status)}
                    </ColumnTitleIcon>
                    {getStatusDisplayName(status)}
                  </ColumnTitle>
                  <TaskCount>{getTasksByStatus(status).length}</TaskCount>
                </ColumnHeader>
                
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <TasksContainer
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {getTasksByStatus(status).length > 0 ? (
                        getTasksByStatus(status).map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  transform: snapshot.isDragging
                                    ? provided.draggableProps.style?.transform
                                    : 'translate(0, 0)',
                                }}
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => handleTaskClick(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <EmptyColumnMessage>
                          No tasks yet
                        </EmptyColumnMessage>
                      )}
                      {provided.placeholder}
                    </TasksContainer>
                  )}
                </Droppable>
              </BoardColumn>
            ))}
          </BoardColumnsContainer>
        </DragDropContext>
        
        {createTaskModalOpen && (
          <CreateTaskModal
            project={project}
            onClose={() => setCreateTaskModalOpen(false)}
            onCreateTask={(newTask) => {
              setTasks([...tasks, newTask]);
              setCreateTaskModalOpen(false);
              toast.success('Task created successfully');
            }}
          />
        )}
        
        {taskDetailModalOpen && selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            project={project}
            onClose={() => {
              setTaskDetailModalOpen(false);
              setSelectedTask(null);
            }}
            onUpdateTask={(updatedTask) => {
              setTasks(tasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
              ));
              toast.success('Task updated successfully');
            }}
            onTaskDelete={handleTaskDelete}
          />
        )}
      </BoardWrapper>
    </BoardContainer>
  );
};

export default ProjectBoard;