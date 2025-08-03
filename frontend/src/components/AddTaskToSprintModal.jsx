import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { sprintAPI, taskAPI } from '../config/api';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  ${glass}
  border-radius: 1.5rem;
  width: 100%;
  max-width: 650px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  }
  
  @media (max-width: 768px) {
    max-height: 90vh;
    border-radius: 1.5rem 1.5rem 0 0;
    margin-top: auto;
  }
  
  @media (max-width: 480px) {
    border-radius: 1rem 1rem 0 0;
  }
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;
  border-bottom: 1px solid rgba(106, 130, 251, 0.1);
  position: relative;
  
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
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  letter-spacing: 0.5px;
  
  &::before {
    content: '📋';
    font-size: 1.8rem;
    padding: 0.5rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    
    &::before {
      font-size: 1.5rem;
      padding: 0.4rem;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(106, 130, 251, 0.1);
  color: #6a82fb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(252, 92, 125, 0.15);
    color: #fc5c7d;
    transform: scale(1.1) rotate(90deg);
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
    top: 1rem;
    right: 1rem;
  }
`;

const TaskList = styled.div`
  padding: 1.5rem 2rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(106, 130, 251, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(106, 130, 251, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const TaskItem = styled.div`
  ${glass}
  display: flex;
  align-items: center;
  padding: 1.2rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid ${props => props.isSelected ? '#6a82fb' : 'transparent'};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isSelected ? 
      'linear-gradient(135deg, rgba(106, 130, 251, 0.1), rgba(252, 92, 125, 0.05))' : 
      'transparent'};
    transition: all 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 12px 40px rgba(106, 130, 251, 0.15),
      0 4px 16px rgba(0, 0, 0, 0.08);
    border-left-color: #fc5c7d;
    
    &::before {
      background: linear-gradient(135deg, rgba(252, 92, 125, 0.08), rgba(106, 130, 251, 0.05));
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 0.8rem;
  }
`;

const TaskCheckbox = styled.input`
  width: 20px;
  height: 20px;
  margin-right: 1rem;
  cursor: pointer;
  position: relative;
  appearance: none;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  background: transparent;
  transition: all 0.3s ease;
  
  &:checked {
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    border-color: #6a82fb;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  }
  
  &:hover {
    border-color: #6a82fb;
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    margin-right: 0.8rem;
  }
`;

const TaskInfo = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const TaskTitle = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1rem;
  margin-bottom: 0.3rem;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TaskDescription = styled.div`
  font-size: 0.875rem;
  color: #6a82fb;
  line-height: 1.4;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const TaskMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
  }
`;

const TaskPriority = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.7rem;
  background: ${props => {
    switch(props.priority) {
      case 'HIGHEST': return 'rgba(252, 92, 125, 0.15)';
      case 'HIGH': return 'rgba(252, 92, 125, 0.1)';
      case 'MEDIUM': return 'rgba(106, 130, 251, 0.15)';
      case 'LOW': return 'rgba(76, 154, 255, 0.15)';
      default: return 'rgba(160, 174, 192, 0.15)';
    }
  }};
  color: ${props => {
    switch(props.priority) {
      case 'HIGHEST': return '#fc5c7d';
      case 'HIGH': return '#fc5c7d';
      case 'MEDIUM': return '#6a82fb';
      case 'LOW': return '#4C9AFF';
      default: return '#a0aec0';
    }
  }};
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2rem 2rem 2rem;
  border-top: 1px solid rgba(106, 130, 251, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    flex-direction: column-reverse;
    gap: 0.8rem;
  }
`;

const SelectedCount = styled.div`
  font-size: 0.875rem;
  color: #6a82fb;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '📊';
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 0.8rem;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  min-width: 120px;
  
  ${props => props.primary ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 32px rgba(106, 130, 251, 0.4);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
    min-width: auto;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6a82fb;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  &::before {
    content: '⏳';
    font-size: 3rem;
    animation: ${pulse} 1.5s infinite;
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #fc5c7d;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  &::before {
    content: '⚠️';
    font-size: 3rem;
  }
`;

const NoTasksMessage = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6a82fb;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  &::before {
    content: '📋';
    font-size: 3rem;
    opacity: 0.6;
  }
`;

const AddTaskToSprintModal = ({ isOpen, onClose, projectId, sprintId, onTasksAdded }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableTasks();
    }
  }, [projectId, isOpen]);

  const fetchAvailableTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getAll(projectId);
      // Filter tasks that are TO_DO and not in any sprint
      const availableTasks = response.data.filter(task => 
        task.status === 'TODO' && !task.sprintId
      );
      setTasks(availableTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      }
      return [...prev, taskId];
    });
  };

  const handleSubmit = async () => {
    try {
      const updatedTasks = await Promise.all(selectedTasks.map(async taskId => {
        try {
          const sprintResponse = await sprintAPI.getById(sprintId);
          const currentSprint = sprintResponse.data;
          const response = await taskAPI.getById(taskId);
          const task = response.data;
          
          const updatePayload = {
            ...task,
            sprint: currentSprint
          };
          
          const updateResponse = await taskAPI.update(taskId, updatePayload);
          return updateResponse.data;
        } catch (taskError) {
          console.error(`Error updating task ${taskId}:`, taskError);
          throw taskError;
        }
      }));
      
      onTasksAdded(updatedTasks);
      onClose();
      setSelectedTasks([]);
    } catch (err) {
      console.error('Error adding tasks to sprint:', err);
      setError('Failed to add tasks to sprint');
    }
  };

  const handleClose = () => {
    setSelectedTasks([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>×</CloseButton>
        
        <ModalHeader>
          <ModalTitle>Add Tasks to Sprint</ModalTitle>
        </ModalHeader>
        
        <TaskList>
          {loading ? (
            <LoadingState>
              Loading available tasks...
            </LoadingState>
          ) : error ? (
            <ErrorState>
              {error}
            </ErrorState>
          ) : tasks.length > 0 ? (
            tasks.map(task => (
              <TaskItem 
                key={task.id}
                isSelected={selectedTasks.includes(task.id)}
                onClick={() => handleTaskSelection(task.id)}
              >
                <TaskCheckbox
                  type="checkbox"
                  checked={selectedTasks.includes(task.id)}
                  onChange={() => handleTaskSelection(task.id)}
                />
                <TaskInfo>
                  <TaskTitle>{task.title}</TaskTitle>
                  {task.description && (
                    <TaskDescription>{task.description}</TaskDescription>
                  )}
                  <TaskMeta>
                    {task.priority && (
                      <TaskPriority priority={task.priority}>
                        {task.priority}
                      </TaskPriority>
                    )}
                    {task.assignee && (
                      <span>Assigned to: {task.assignee.name}</span>
                    )}
                  </TaskMeta>
                </TaskInfo>
              </TaskItem>
            ))
          ) : (
            <NoTasksMessage>
              No available tasks to add to this sprint
              <span style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
                All tasks are either completed or already assigned to sprints
              </span>
            </NoTasksMessage>
          )}
        </TaskList>

        <ModalFooter>
          <SelectedCount>
            {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
          </SelectedCount>
          
          <ButtonGroup>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              primary 
              onClick={handleSubmit}
              disabled={selectedTasks.length === 0 || loading}
            >
              Add {selectedTasks.length > 0 ? `${selectedTasks.length} ` : ''}Tasks
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddTaskToSprintModal;