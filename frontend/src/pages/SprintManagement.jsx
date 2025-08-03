import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import SprintBoard from '../components/SprintBoard';
import CreateSprintModal from '../components/CreateSprintModal';
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

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
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
  padding: 2rem;
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
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: ${float} 6s ease-in-out infinite;
  }
  
  &::before {
    width: 120px;
    height: 120px;
    top: 10%;
    left: 5%;
    animation-delay: -2s;
  }
  
  &::after {
    width: 80px;
    height: 80px;
    bottom: 15%;
    right: 8%;
    animation-delay: -4s;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: 0.5px;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '🏃‍♂️';
    font-size: 2.2rem;
    padding: 0.8rem;
    border-radius: 16px;
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    box-shadow: 0 6px 24px rgba(106, 130, 251, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    justify-content: center;
    text-align: center;
    
    &::before {
      font-size: 2rem;
      padding: 0.6rem;
    }
  }
`;

const Button = styled.button`
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  box-shadow: 0 6px 24px rgba(106, 130, 251, 0.3);
  
  &::before {
    content: '✨';
    font-size: 1.1rem;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 40px rgba(106, 130, 251, 0.4);
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
  
  &:hover::after {
    left: 100%;
  }
`;

const SprintsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${slideUp} 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

const SprintBoardWrapper = styled.div`
  ${glass}
  border-radius: 2rem;
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
    height: 4px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 35px 70px rgba(106, 130, 251, 0.2),
      0 12px 48px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 1.5rem;
  }
`;

const NoSprintsContainer = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 4rem;
  text-align: center;
  animation: ${slideUp} 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  
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
    padding: 3rem 2rem;
    border-radius: 1.5rem;
  }
`;

const NoSprintsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
  
  &::before {
    content: '🚀';
  }
`;

const NoSprintsTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  letter-spacing: 0.3px;
`;

const NoSprintsText = styled.p`
  font-size: 1.1rem;
  color: #6a82fb;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CreateSprintButton = styled(Button)`
  margin: 0 auto;
  min-width: 200px;
  
  &::before {
    content: '🎯';
  }
`;

const LoadingContainer = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 4rem;
  text-align: center;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::before {
    content: '⏳';
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  .loading-text {
    font-size: 1.2rem;
    color: #6a82fb;
    font-weight: 500;
  }
`;

const ErrorContainer = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 4rem;
  text-align: center;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::before {
    content: '😞';
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
  }
  
  .error-text {
    font-size: 1.2rem;
    color: #fc5c7d;
    font-weight: 500;
  }
`;

const SprintManagement = () => {
  const { projectId } = useParams();
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchSprints();
  }, [projectId]);

  const fetchSprints = async () => {
    try {
      const response = await sprintAPI.getByProject(projectId);
      setSprints(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sprints:', err);
      setError('Failed to load sprints');
      setLoading(false);
    }
  };

  const handleCreateSprint = async (sprintData) => {
    try {
      const response = await sprintAPI.create(sprintData, projectId);
      setSprints(prev => [...prev, response.data]);
      setCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating sprint:', err);
      throw new Error('Failed to create sprint');
    }
  };

  const handleStartSprint = async (sprintId) => {
    try {
      const response = await sprintAPI.start(sprintId);
      setSprints(prev =>
        prev.map(sprint =>
          sprint.id === sprintId ? response.data : sprint
        )
      );
    } catch (err) {
      console.error('Error starting sprint:', err);
    }
  };

  const handleCompleteSprint = async (sprintId) => {
    try {
      const response = await sprintAPI.complete(sprintId);
      setSprints(prev =>
        prev.map(sprint =>
          sprint.id === sprintId ? response.data : sprint
        )
      );
    } catch (err) {
      console.error('Error completing sprint:', err);
    }
  };

  const handleUpdateTask = async (taskId, newStatus, updatedTasks) => {
    try {
      if (updatedTasks) {
        // If we received updated tasks from AddTaskToSprintModal
        fetchSprints(); // Refresh sprints to show new tasks
        return;
      }
  
      if (taskId && newStatus) {
        // Handle drag-and-drop status updates
        await taskAPI.updateStatus(taskId, newStatus);
        fetchSprints();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <FloatingElements />
        <ContentWrapper>
          <LoadingContainer>
            <div className="loading-text">Loading sprints...</div>
          </LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <FloatingElements />
        <ContentWrapper>
          <ErrorContainer>
            <div className="error-text">{error}</div>
          </ErrorContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FloatingElements />
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Sprint Management</PageTitle>
          <Button onClick={() => setCreateModalOpen(true)}>
            Create Sprint
          </Button>
        </PageHeader>

        <SprintsList>
          {sprints.length > 0 ? (
            sprints.map(sprint => (
              <SprintBoardWrapper key={sprint.id}>
                <SprintBoard
                  sprint={sprint}
                  onStartSprint={handleStartSprint}
                  onCompleteSprint={handleCompleteSprint}
                  onUpdateTask={handleUpdateTask}
                />
              </SprintBoardWrapper>
            ))
          ) : (
            <NoSprintsContainer>
              <NoSprintsIcon />
              <NoSprintsTitle>No sprints found</NoSprintsTitle>
              <NoSprintsText>
                Create your first sprint to start planning your work and managing your team's progress
              </NoSprintsText>
              <CreateSprintButton onClick={() => setCreateModalOpen(true)}>
                Create Your First Sprint
              </CreateSprintButton>
            </NoSprintsContainer>
          )}
        </SprintsList>

        {createModalOpen && (
          <CreateSprintModal
            onClose={() => setCreateModalOpen(false)}
            onCreateSprint={handleCreateSprint}
          />
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default SprintManagement;