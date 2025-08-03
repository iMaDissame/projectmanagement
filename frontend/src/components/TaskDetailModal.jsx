import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TASK_PRIORITY, TASK_TYPE, TASK_STATUS } from '../config/constants';
import { taskAPI, userAPI, commentAPI } from '../config/api';
import { toast } from 'react-toastify';
import { authAPI } from '../config/api';

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

const slideInRight = keyframes`
  from { 
    opacity: 0;
    transform: translateX(20px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
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
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

const ModalContent = styled.div`
  ${glass}
  border-radius: 1.5rem;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  
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
    border-radius: 1rem;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1.5rem;
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
    padding: 1.5rem 1.5rem 1rem;
  }
`;

const TaskInfo = styled.div`
  flex: 1;
  animation: ${slideInRight} 0.5s ease-out;
`;

const TaskType = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6a82fb;
  margin-bottom: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const TaskTypeIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.2rem;
  padding: 0.3rem;
  border-radius: 8px;
  background: ${props => {
    switch(props.type) {
      case 'BUG': return 'rgba(252, 92, 125, 0.1)';
      case 'STORY': return 'rgba(76, 175, 80, 0.1)';
      case 'EPIC': return 'rgba(156, 39, 176, 0.1)';
      default: return 'rgba(106, 130, 251, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'BUG': return '#fc5c7d';
      case 'STORY': return '#4caf50';
      case 'EPIC': return '#9c27b0';
      default: return '#6a82fb';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
`;

const TaskTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  letter-spacing: 0.3px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const TaskId = styled.div`
  font-size: 0.875rem;
  color: #6a82fb;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  background: rgba(106, 130, 251, 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  display: inline-block;
  font-weight: 500;
`;

const CloseButton = styled.button`
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
  margin-left: 1rem;
  
  &:hover {
    background: rgba(252, 92, 125, 0.15);
    color: #fc5c7d;
    transform: scale(1.1) rotate(90deg);
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const ModalBody = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  max-height: calc(90vh - 120px);
  overflow: hidden;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-height: calc(95vh - 100px);
  }
`;

const MainContent = styled.div`
  padding: 2rem;
  border-right: 1px solid rgba(106, 130, 251, 0.1);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(106, 130, 251, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(106, 130, 251, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(106, 130, 251, 0.5);
    }
  }
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid rgba(106, 130, 251, 0.1);
    padding: 1.5rem;
  }
`;

const Sidebar = styled.div`
  padding: 2rem;
  background: rgba(106, 130, 251, 0.02);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(106, 130, 251, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(106, 130, 251, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(106, 130, 251, 0.5);
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    background: rgba(106, 130, 251, 0.01);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 0.3px;
  
  &::before {
    content: ${props => props.icon ? `"${props.icon}"` : '""'};
    font-size: 1.2rem;
  }
`;

const DescriptionSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideInRight} 0.6s ease-out;
`;

const DescriptionContent = styled.div`
  color: #1a1a1a;
  line-height: 1.6;
  white-space: pre-wrap;
  background: rgba(106, 130, 251, 0.05);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(106, 130, 251, 0.1);
  
  p {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &:empty::before {
    content: 'No description provided.';
    color: #6a82fb;
    opacity: 0.7;
    font-style: italic;
  }
`;

const CommentsSection = styled.div`
  animation: ${slideInRight} 0.7s ease-out;
`;

const CommentsList = styled.div`
  margin: 1.5rem 0;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(106, 130, 251, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(106, 130, 251, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(106, 130, 251, 0.5);
    }
  }
`;

const CommentItem = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  animation: ${slideUp} 0.3s ease-out;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CommentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
  flex-shrink: 0;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(106, 130, 251, 0.3);
`;

const CommentContent = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(106, 130, 251, 0.1);
  backdrop-filter: blur(10px);
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
`;

const CommentAuthor = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.875rem;
`;

const CommentTime = styled.div`
  font-size: 0.75rem;
  color: #6a82fb;
  opacity: 0.8;
`;

const CommentText = styled.div`
  color: #1a1a1a;
  line-height: 1.5;
  font-size: 0.875rem;
`;

const CommentForm = styled.form`
  margin-top: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(106, 130, 251, 0.1);
  backdrop-filter: blur(10px);
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  min-height: 80px;
  resize: vertical;
  margin-bottom: 1rem;
  font-family: inherit;
  line-height: 1.5;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::placeholder {
    color: #6a82fb;
    opacity: 0.7;
  }
  
  &:focus {
    outline: none;
    border-color: #6a82fb;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 
      0 0 0 3px rgba(106, 130, 251, 0.1),
      0 4px 16px rgba(106, 130, 251, 0.15);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(106, 130, 251, 0.25);
    background: rgba(255, 255, 255, 0.9);
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideInRight} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SidebarItem = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SidebarLabel = styled.div`
  font-size: 0.75rem;
  color: #6a82fb;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &::before {
    content: ${props => props.icon ? `"${props.icon}"` : '""'};
    font-size: 0.875rem;
  }
`;

const SidebarValue = styled.div`
  font-size: 0.875rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  border-radius: 0.8rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:focus {
    outline: none;
    border-color: #6a82fb;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 
      0 0 0 3px rgba(106, 130, 251, 0.1),
      0 4px 16px rgba(106, 130, 251, 0.15);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(106, 130, 251, 0.25);
    background: rgba(255, 255, 255, 0.9);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.5);
  }
  
  option {
    padding: 0.5rem;
    background: white;
    color: #1a1a1a;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 0.8rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  font-family: inherit;
  
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
`;

const DeleteButton = styled(Button)`
  background: linear-gradient(135deg, #fc5c7d 0%, #ff6b6b 100%);
  color: white;
  width: 100%;
  box-shadow: 0 4px 16px rgba(252, 92, 125, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 32px rgba(252, 92, 125, 0.4);
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
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 0.5rem;
  font-size: 0.75rem;
  box-shadow: 0 2px 8px rgba(106, 130, 251, 0.3);
`;

const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  background: ${props => {
    switch(props.status) {
      case 'TODO': return 'rgba(106, 130, 251, 0.1)';
      case 'IN_PROGRESS': return 'rgba(255, 193, 7, 0.1)';
      case 'IN_REVIEW': return 'rgba(255, 152, 0, 0.1)';
      case 'DONE': return 'rgba(76, 175, 80, 0.1)';
      default: return 'rgba(106, 130, 251, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'TODO': return '#6a82fb';
      case 'IN_PROGRESS': return '#ffc107';
      case 'IN_REVIEW': return '#ff9800';
      case 'DONE': return '#4caf50';
      default: return '#6a82fb';
    }
  }};
`;

const LoadingText = styled.div`
  color: #6a82fb;
  padding: 1.5rem;
  text-align: center;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: '⏳';
    animation: ${pulse} 1s linear infinite;
  }
`;

const EmptyState = styled.div`
  color: #6a82fb;
  padding: 1.5rem;
  text-align: center;
  font-style: italic;
  opacity: 0.8;
  
  &::before {
    content: '💬';
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }
`;

const getTaskTypeIcon = (type) => {
  switch(type) {
    case 'BUG': return '🐞';
    case 'STORY': return '📖';
    case 'EPIC': return '🌟';
    default: return '📋';
  }
};

const getPriorityText = (priority) => {
  switch(priority) {
    case 'HIGHEST': return 'Highest';
    case 'HIGH': return 'High';
    case 'MEDIUM': return 'Medium';
    case 'LOW': return 'Low';
    case 'LOWEST': return 'Lowest';
    default: return 'Medium';
  }
};

const getStatusText = (status) => {
  switch(status) {
    case 'TODO': return 'To Do';
    case 'IN_PROGRESS': return 'In Progress';
    case 'IN_REVIEW': return 'In Review';
    case 'DONE': return 'Done';
    default: return 'To Do';
  }
};

const TaskDetailModal = ({ task, project, onClose, onUpdateTask, onTaskDelete }) => {
  const [updatedTask, setUpdatedTask] = useState({ ...task });
  const [newComment, setNewComment] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast.error('Failed to load user details');
      }
    };
  
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const response = await commentAPI.getByTask(task.id);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [task.id]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoadingMembers(true);
        const response = await userAPI.getAll();
        setTeamMembers(response.data.filter(member => member.role !== 'PRODUCT_OWNER'));
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast.error('Failed to load team members');
      } finally {
        setLoadingMembers(false);
      }
    };
  
    fetchTeamMembers();
  }, []);

  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
        console.log('Updating status to:', newStatus);
        const response = await taskAPI.updateStatus(updatedTask.id, newStatus);
        console.log('Status update response:', response);
        
        setUpdatedTask({ ...updatedTask, status: newStatus });
        onUpdateTask({ ...updatedTask, status: newStatus });
        toast.success('Status updated successfully');
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status
        });
        toast.error('Failed to update status');
    }
};
  
const handleAssigneeChange = async (e) => {
  const assigneeId = e.target.value ? parseInt(e.target.value) : null;
  try {
      console.log('Starting assignee update:', {
          taskId: updatedTask.id,
          assigneeId: assigneeId
      });

      const taskResponse = await taskAPI.getById(updatedTask.id);
      const currentTask = taskResponse.data;

      let assignee = null;
      if (assigneeId) {
          const userResponse = await userAPI.getById(assigneeId);
          assignee = userResponse.data;
      }

      const taskToUpdate = {
          ...currentTask,
          assignee: assignee
      };

      const response = await taskAPI.update(updatedTask.id, taskToUpdate);
      
      if (response.data) {
          setUpdatedTask(response.data);
          onUpdateTask(response.data);
          toast.success(assigneeId ? 'Task assigned successfully' : 'Task unassigned');
      }
  } catch (error) {
      console.error('Error updating assignee:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
      });
      
      if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
      } else {
          toast.error('Failed to update assignee');
          setUpdatedTask({ ...updatedTask });
      }
  }
};
  
const handlePriorityChange = async (e) => {
  const newPriority = e.target.value;
  try {
      console.log('Updating task priority:', {
          taskId: updatedTask.id,
          priority: newPriority
      });

      const taskToUpdate = {
          ...updatedTask,
          priority: newPriority
      };

      const response = await taskAPI.update(updatedTask.id, taskToUpdate);
      
      if (response.data) {
          setUpdatedTask(response.data);
          onUpdateTask(response.data);
          toast.success('Priority updated successfully');
      }
  } catch (error) {
      console.error('Error updating priority:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
      });
      
      if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
      } else {
          toast.error('Failed to update priority');
          setUpdatedTask({ ...updatedTask });
      }
  }
};
  
const handleAddComment = async (e) => {
  e.preventDefault();
  
  if (!newComment.trim()) return;
  
  try {
    const commentData = {
      text: newComment,
      taskId: task.id
    };
    
    const response = await commentAPI.create(commentData, task.id);
    setComments(prevComments => [...prevComments, response.data]);
    setNewComment('');
    toast.success('Comment added successfully');
  } catch (error) {
    console.error('Error adding comment:', error);
    toast.error('Failed to add comment');
  }
};

const handleDeleteComment = async (commentId) => {
  if (!window.confirm('Are you sure you want to delete this comment?')) {
    return;
  }

  try {
    await commentAPI.delete(commentId);
    setComments(prevComments => prevComments.filter(c => c.id !== commentId));
    toast.success('Comment deleted successfully');
  } catch (error) {
    console.error('Error deleting comment:', error);
    toast.error('Failed to delete comment');
  }
};

const handleDeleteTask = async () => {
  if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
    return;
  }

  try {
    await taskAPI.delete(task.id);
    onTaskDelete(task.id);
    onClose();
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error('Failed to delete task');
  }
};

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <TaskInfo>
            <TaskType>
              <TaskTypeIcon type={updatedTask.type}>
                {getTaskTypeIcon(updatedTask.type)}
              </TaskTypeIcon>
              {updatedTask.type}
            </TaskType>
            <TaskTitle>{updatedTask.title}</TaskTitle>
            <TaskId>#{updatedTask.id}</TaskId>
          </TaskInfo>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <MainContent>
            <DescriptionSection>
              <SectionTitle icon="📄">Description</SectionTitle>
              <DescriptionContent>
                {updatedTask.description || ''}
              </DescriptionContent>
            </DescriptionSection>
            
            <CommentsSection>
              <SectionTitle icon="💬">Comments</SectionTitle>
              
              <CommentsList>
                {loadingComments ? (
                  <LoadingText>Loading comments...</LoadingText>
                ) : comments.length === 0 ? (
                  <EmptyState>No comments yet.</EmptyState>
                ) : (
                  comments.map(comment => (
                    <CommentItem key={comment.id}>
                      <CommentAvatar>
                        {getInitials(comment.authorName)}
                      </CommentAvatar>
                      <CommentContent>
                        <CommentHeader>
                          <CommentAuthor>{comment.authorName}</CommentAuthor>
                          <CommentTime>{formatDateTime(comment.createdAt)}</CommentTime>
                          {currentUser && comment.authorEmail === currentUser.email && (
                            <Button
                              onClick={() => handleDeleteComment(comment.id)}
                              style={{ 
                                marginLeft: 'auto', 
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.75rem'
                              }}
                            >
                              🗑️ Delete
                            </Button>
                          )}
                        </CommentHeader>
                        <CommentText>{comment.text}</CommentText>
                      </CommentContent>
                    </CommentItem>
                  ))
                )}
              </CommentsList>
              
              <CommentForm onSubmit={handleAddComment}>
                <CommentTextarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <Button 
                  primary 
                  type="submit" 
                  disabled={!newComment.trim() || loadingComments}
                >
                  💬 Comment
                </Button>
              </CommentForm>
            </CommentsSection>
          </MainContent>
          
          <Sidebar>
            <SidebarSection delay="0.1s">
              <SidebarItem>
                <SidebarLabel icon="📊">Status</SidebarLabel>
                <Select
                  value={updatedTask.status}
                  onChange={handleStatusChange}
                >
                  {Object.values(TASK_STATUS).map(status => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </Select>
              </SidebarItem>
              
              <SidebarItem>
                <SidebarLabel icon="👤">Assignee</SidebarLabel>
                <Select
                  value={updatedTask.assignee?.id || ''}
                  onChange={handleAssigneeChange}
                  disabled={loadingMembers}
                >
                  <option value="">👤 Unassigned</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      👨‍💻 {member.name || member.email}
                    </option>
                  ))}
                </Select>
                {loadingMembers && (
                  <LoadingText style={{ padding: '0.5rem 0', fontSize: '0.75rem' }}>
                    Loading team members...
                  </LoadingText>
                )}
              </SidebarItem>
              
              <SidebarItem>
                <SidebarLabel icon="📝">Reporter</SidebarLabel>
                <SidebarValue>
                  <UserAvatar>{getInitials(updatedTask.reporter?.name)}</UserAvatar>
                  {updatedTask.reporter?.name}
                </SidebarValue>
              </SidebarItem>
              
              <SidebarItem>
                <SidebarLabel icon="⚡">Priority</SidebarLabel>
                <Select
                  value={updatedTask.priority}
                  onChange={handlePriorityChange}
                >
                  {Object.values(TASK_PRIORITY).map(priority => (
                    <option key={priority} value={priority}>
                      {priority === 'HIGHEST' && '🔴'} 
                      {priority === 'HIGH' && '🟠'} 
                      {priority === 'MEDIUM' && '🟡'} 
                      {priority === 'LOW' && '🟢'} 
                      {priority === 'LOWEST' && '🔵'} 
                      {' '}{getPriorityText(priority)}
                    </option>
                  ))}
                </Select>
              </SidebarItem>
            </SidebarSection>
            
            <SidebarSection delay="0.2s">
              <SidebarItem>
                <SidebarLabel icon="📅">Created</SidebarLabel>
                <SidebarValue>
                  {formatDateTime(updatedTask.createdAt)}
                </SidebarValue>
              </SidebarItem>
              
              <SidebarItem>
                <SidebarLabel icon="🎯">Due Date</SidebarLabel>
                <SidebarValue>
                  {updatedTask.dueDate ? formatDate(updatedTask.dueDate) : 'Not set'}
                </SidebarValue>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection delay="0.3s">
              <SidebarItem>
                <DeleteButton onClick={handleDeleteTask}>
                  <span>🗑️</span>
                  Delete Task
                </DeleteButton>
              </SidebarItem>
            </SidebarSection>
          </Sidebar>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskDetailModal;