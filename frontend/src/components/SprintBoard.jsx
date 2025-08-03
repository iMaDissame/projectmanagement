import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import AddTaskToSprintModal from './AddTaskToSprintModal';
import { taskAPI } from '../config/api';

const glass = css`
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px) saturate(180%);
  box-shadow: 0 4px 24px rgba(106,130,251,0.08), 0 1.5px 6px rgba(0,0,0,0.03);
`;

const BoardContainer = styled.div`
  margin-top: 1.5rem;
`;

const SprintHeader = styled.div`
  ${glass}
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 1.2rem;
  border-radius: 1.2rem 1.2rem 0 0;
  border-left: 5px solid;
  border-image: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%) 1;
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
`;

const SprintTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #232526;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  letter-spacing: 0.1px;
  margin: 0;
`;

const SprintStatus = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'ACTIVE': return 'linear-gradient(135deg, rgba(106,130,251,0.12) 0%, rgba(252,92,125,0.08) 100%)';
      case 'COMPLETED': return 'linear-gradient(135deg, rgba(72,187,120,0.12) 0%, rgba(56,178,172,0.08) 100%)';
      case 'PLANNING': return 'linear-gradient(135deg, rgba(255,159,67,0.12) 0%, rgba(255,107,107,0.08) 100%)';
      default: return 'linear-gradient(135deg, rgba(160,174,192,0.12) 0%, rgba(113,128,150,0.08) 100%)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'ACTIVE': return '#6a82fb';
      case 'COMPLETED': return '#48bb78';
      case 'PLANNING': return '#ff9f43';
      default: return '#a0aec0';
    }
  }};
  box-shadow: 0 2px 8px ${props => {
    switch(props.status) {
      case 'ACTIVE': return 'rgba(106,130,251,0.15)';
      case 'COMPLETED': return 'rgba(72,187,120,0.15)';
      case 'PLANNING': return 'rgba(255,159,67,0.15)';
      default: return 'rgba(160,174,192,0.15)';
    }
  }};
`;

const SprintInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 14px;
  color: #6a82fb;
`;

const SprintDates = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #414345;
  
  &::before {
    content: '📅';
    font-size: 16px;
  }
`;

const TasksContainer = styled.div`
  ${glass}
  border-radius: 0 0 1.2rem 1.2rem;
  padding: 1.4rem 1.2rem;
  min-height: 200px;
  position: relative;
  border-left: 5px solid;
  border-image: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%) 1;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 1rem;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  border: none;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  
  ${props => props.primary ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(106,130,251,0.25);
    
    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 24px rgba(106,130,251,0.35);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    
    &:hover::before {
      left: 100%;
    }
  ` : css`
    background: rgba(255,255,255,0.8);
    color: #6a82fb;
    border: 1px solid rgba(106,130,251,0.2);
    backdrop-filter: blur(8px);
    
    &:hover {
      background: rgba(106,130,251,0.08);
      border-color: rgba(106,130,251,0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(106,130,251,0.15);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const EmptyState = styled.div`
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
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
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

const DroppableArea = styled.div`
  min-height: 100px;
  background-color: ${props => props.isDraggingOver ? 
    'rgba(106,130,251,0.05)' : 'transparent'};
  border-radius: 0.8rem;
  transition: all 0.2s;
  border: 2px dashed ${props => props.isDraggingOver ? 
    'rgba(106,130,251,0.3)' : 'transparent'};
  padding: ${props => props.isDraggingOver ? '1rem' : '0'};
`;

const TaskCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  color: #6a82fb;
  font-weight: 500;
  
  &::before {
    content: '📊';
    font-size: 14px;
  }
`;

const SprintBoard = ({ sprint, onStartSprint, onCompleteSprint, onUpdateTask }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    
    useEffect(() => {
        fetchSprintTasks();
    }, [sprint.id]);

    const fetchSprintTasks = async () => {
      try {
          setLoading(true);
          console.log('Fetching tasks for sprint:', sprint.id);
          const response = await taskAPI.getBySprint(sprint.id);
          console.log('Received tasks:', response.data);
          setTasks(response.data);
          setError(null);
      } catch (err) {
          console.error('Error fetching sprint tasks:', err);
          console.error('Error details:', err.response?.data);
          setError('Failed to load tasks');
      } finally {
          setLoading(false);
      }
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        // Call the parent component's update function
        onUpdateTask(draggableId, destination.droppableId);
    };

    return (
        <BoardContainer>
            <SprintHeader>
                <SprintTitle>
                    {sprint.name}
                    <SprintStatus status={sprint.status}>
                        {sprint.status}
                    </SprintStatus>
                </SprintTitle>
                
                <SprintInfo>
                    <SprintDates>
                        {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                    </SprintDates>
                    
                    <TaskCount>
                        {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                    </TaskCount>
                    
                    <ButtonGroup>
                        <Button onClick={() => setIsAddTaskModalOpen(true)}>
                            Add Tasks
                        </Button>
                        
                        {sprint.status === 'PLANNING' && (
                            <Button primary onClick={() => onStartSprint(sprint.id)}>
                                Start Sprint
                            </Button>
                        )}
                        
                        {sprint.status === 'ACTIVE' && (
                            <Button onClick={() => onCompleteSprint(sprint.id)}>
                                Complete Sprint
                            </Button>
                        )}
                    </ButtonGroup>
                </SprintInfo>
            </SprintHeader>

            <DragDropContext onDragEnd={handleDragEnd}>
                <TasksContainer>
                    <Droppable droppableId={`sprint-${sprint.id}`}>
                        {(provided, snapshot) => (
                            <DroppableArea
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                            >
                                {loading ? (
                                    <LoadingState>
                                        Loading tasks...
                                    </LoadingState>
                                ) : error ? (
                                    <ErrorState>
                                        {error}
                                    </ErrorState>
                                ) : tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <TaskCard 
                                            key={task.id} 
                                            task={task} 
                                            index={index}
                                        />
                                    ))
                                ) : (
                                    <EmptyState>
                                        No tasks in this sprint yet
                                        <span style={{ fontSize: '14px', opacity: 0.8 }}>
                                            Click "Add Tasks" to get started
                                        </span>
                                    </EmptyState>
                                )}
                                {provided.placeholder}
                            </DroppableArea>
                        )}
                    </Droppable>
                </TasksContainer>
            </DragDropContext>

            {isAddTaskModalOpen && (
                <AddTaskToSprintModal
                    isOpen={isAddTaskModalOpen}
                    onClose={() => setIsAddTaskModalOpen(false)}
                    projectId={sprint.projectId}
                    sprintId={sprint.id}
                    onTasksAdded={() => {
                        fetchSprintTasks(); // Refresh tasks after adding new ones
                        setIsAddTaskModalOpen(false);
                    }}
                />
            )}
        </BoardContainer>
    );
};

export default SprintBoard;