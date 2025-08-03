import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { projectAPI, userAPI } from '../config/api';
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
  padding: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 2rem;
  margin-bottom: 2rem;
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

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideInLeft} 0.8s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PageIcon = styled.div`
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

const PageTitle = styled.h1`
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

const BackButton = styled.button`
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
  background: rgba(106, 130, 251, 0.1);
  color: #6a82fb;
  border: 1px solid rgba(106, 130, 251, 0.2);
  animation: ${slideInRight} 0.8s ease-out;
  
  &:hover {
    background: rgba(106, 130, 251, 0.15);
    border-color: rgba(106, 130, 251, 0.3);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    align-self: stretch;
    justify-content: center;
  }
`;

const TabsContainer = styled.div`
  ${glass}
  border-radius: 1.5rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 0.5rem;
  animation: ${slideUp} 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    border-radius: 1rem;
  }
`;

const Tab = styled.button`
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.active ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
    transform: translateY(-1px);
    
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
    
    &:hover::before {
      left: 100%;
    }
  ` : css`
    background: transparent;
    color: #6a82fb;
    
    &:hover {
      background: rgba(106, 130, 251, 0.1);
      transform: translateY(-1px);
    }
  `}
`;

const FormContainer = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 2rem;
  animation: ${slideUp} 0.8s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    border-radius: 1.5rem;
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: 0.3px;
  
  &::before {
    content: ${props => props.icon ? `"${props.icon}"` : '""'};
    font-size: 1.5rem;
    padding: 0.5rem;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 40px;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
  animation: ${slideInLeft} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
  letter-spacing: 0.3px;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  font-family: inherit;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  min-height: 120px;
  resize: vertical;
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

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  border-radius: 1rem;
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
  
  option {
    padding: 0.5rem;
    background: white;
    color: #1a1a1a;
  }
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: #6a82fb;
  opacity: 0.8;
  margin-top: 0.5rem;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 3rem;
  animation: ${slideInRight} 0.6s ease-out;
  animation-delay: 0.6s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    flex-direction: column;
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
  justify-content: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SaveButton = styled(Button)`
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
`;

const CancelButton = styled(Button)`
  background: rgba(106, 130, 251, 0.1);
  color: #6a82fb;
  border: 1px solid rgba(106, 130, 251, 0.2);
  
  &:hover {
    background: rgba(106, 130, 251, 0.15);
    border-color: rgba(106, 130, 251, 0.3);
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled(Button)`
  background: linear-gradient(135deg, #fc5c7d 0%, #ff6b6b 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(252, 92, 125, 0.3);
  
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

const AddMemberForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${slideInLeft} 0.6s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AddButton = styled(Button)`
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
  white-space: nowrap;
  
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
`;

const MembersTable = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(106, 130, 251, 0.1);
  backdrop-filter: blur(10px);
  animation: ${slideUp} 0.6s ease-out;
  animation-delay: 0.5s;
  animation-fill-mode: both;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(106, 130, 251, 0.1) 0%, rgba(252, 92, 125, 0.1) 100%);
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.875rem;
  letter-spacing: 0.3px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(106, 130, 251, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(106, 130, 251, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.875rem;
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: #6a82fb;
  opacity: 0.8;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6a82fb;
  opacity: 0.8;
  
  &::before {
    content: '👥';
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const DangerZone = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  border: 2px solid rgba(252, 92, 125, 0.2);
  border-radius: 1.5rem;
  background: rgba(252, 92, 125, 0.05);
  animation: ${slideUp} 0.6s ease-out;
  animation-delay: 0.8s;
  animation-fill-mode: both;
`;

const DangerTitle = styled.h3`
  color: #fc5c7d;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '⚠️';
    font-size: 1.5rem;
  }
`;

const DangerDescription = styled.p`
  color: #1a1a1a;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ErrorMessage = styled.div`
  color: #fc5c7d;
  font-size: 0.875rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(252, 92, 125, 0.1);
  border-radius: 0.75rem;
  border: 1px solid rgba(252, 92, 125, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '⚠️';
    font-size: 1rem;
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

const ProjectSettings = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('details');
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: ''
  });
  
  const userRoles = [
    { id: 'MEMBER', name: 'Member' },
    { id: 'PRODUCT_OWNER', name: 'Product Owner' },
    { id: 'SCRUM_MASTER', name: 'Scrum Master' }
  ];
  
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        const projectResponse = await projectAPI.getById(projectId);
        const projectData = projectResponse.data;
        
        setProject(projectData);
        setFormData({
          name: projectData.name,
          key: projectData.key,
          description: projectData.description || ''
        });
        
        try {
          const membersResponse = await projectAPI.getMembers(projectId);
          setMembers(membersResponse.data);
        } catch (memberErr) {
          console.error('Could not fetch members:', memberErr);
          if (projectData.lead) {
            setMembers([{
              id: projectData.lead.id,
              name: projectData.lead.name,
              email: projectData.lead.email,
              role: 'PRODUCT_OWNER'
            }]);
          }
        }
        
        try {
          const usersResponse = await userAPI.getAll();
          setAvailableUsers(usersResponse.data);
        } catch (usersErr) {
          console.error('Could not fetch users:', usersErr);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);
  
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    
    try {
      const updatedProject = await projectAPI.update(projectId, formData);
      setProject(updatedProject.data);
      toast.success('Project details updated successfully');
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project details: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      setError('Please select a user to add');
      return;
    }
    
    try {
      setError(null);
      
      const selectedUser = availableUsers.find(user => user.id.toString() === selectedUserId);
      
      if (!selectedUser) {
        setError('Selected user not found');
        return;
      }
      
      if (members.some(member => member.id.toString() === selectedUserId)) {
        setError('This user is already a member of the project');
        return;
      }
      
      const response = await projectAPI.addMember(projectId, selectedUserId);
      
      setMembers([...members, {
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        role: 'MEMBER'
      }]);
      
      setSelectedUserId('');
      toast.success('Member added successfully');
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleRoleChange = async (userId, newRole) => {
    try {
      await projectAPI.updateMemberRole(projectId, userId, newRole);
      
      const updatedMembers = members.map(member => 
        member.id === userId ? { ...member, role: newRole } : member
      );
      
      setMembers(updatedMembers);
      toast.success('Member role updated successfully');
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleRemoveMember = async (userId) => {
    try {
      await projectAPI.removeMember(projectId, userId);
      
      const updatedMembers = members.filter(member => member.id !== userId);
      setMembers(updatedMembers);
      
      toast.success('Member removed successfully');
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone!'
    );
    
    if (confirmed) {
      try {
        await projectAPI.delete(projectId);
        
        navigate('/dashboard', { 
          state: { 
            message: 'Project deleted successfully' 
          } 
        });
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Failed to delete project: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingText>Loading project settings...</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }
  
  if (error && !project) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingContainer>
            <ErrorMessage>{error}</ErrorMessage>
            <Button onClick={() => navigate('/dashboard')}>
              🏠 Back to Dashboard
            </Button>
          </LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <HeaderContent>
            <TitleSection>
              <PageIcon>⚙️</PageIcon>
              <PageTitle>Project Settings</PageTitle>
            </TitleSection>
            <BackButton onClick={() => navigate(`/projects/${projectId}`)}>
              ← Back to Project
            </BackButton>
          </HeaderContent>
        </PageHeader>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'details'} 
            onClick={() => handleTabChange('details')}
          >
            📄 Details
          </Tab>
          <Tab 
            active={activeTab === 'members'} 
            onClick={() => handleTabChange('members')}
          >
            👥 Members
          </Tab>
        </TabsContainer>
        
        {activeTab === 'details' && (
          <FormContainer>
            <SectionTitle icon="📝">Project Details</SectionTitle>
            <form onSubmit={handleSaveDetails}>
              <FormGroup delay="0.1s">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                />
              </FormGroup>
              
              <FormGroup delay="0.2s">
                <Label htmlFor="key">Project Key</Label>
                <Input
                  type="text"
                  id="key"
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  placeholder="e.g., PRJ"
                  maxLength={5}
                />
                <HelpText>
                  2-5 uppercase letters, used as a prefix for task IDs
                </HelpText>
              </FormGroup>
              
              <FormGroup delay="0.3s">
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the purpose of this project"
                />
              </FormGroup>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <ButtonGroup>
                <CancelButton type="button" onClick={() => navigate(`/projects/${projectId}`)}>
                  ✕ Cancel
                </CancelButton>
                <SaveButton type="submit">
                  💾 Save Changes
                </SaveButton>
              </ButtonGroup>
            </form>
            
            <DangerZone>
              <DangerTitle>Danger Zone</DangerTitle>
              <DangerDescription>
                Once you delete a project, there is no going back. Please be certain.
              </DangerDescription>
              <DeleteButton onClick={handleDeleteProject}>
                🗑️ Delete Project
              </DeleteButton>
            </DangerZone>
          </FormContainer>
        )}
        
        {activeTab === 'members' && (
          <FormContainer>
            <SectionTitle icon="👥">Project Members</SectionTitle>
            
            <AddMemberForm onSubmit={handleAddMember}>
              <Select
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">Select a user to add</option>
                {availableUsers
                  .filter(user => !members.some(member => member.id === user.id))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
              </Select>
              <AddButton type="submit">
                ➕ Add Member
              </AddButton>
            </AddMemberForm>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <MembersTable>
              <TableHeader>
                <div>User</div>
                <div>Role</div>
                <div>Actions</div>
              </TableHeader>
              
              {members.length > 0 ? (
                members.map((member, index) => (
                  <TableRow key={member.id} style={{ animationDelay: `${0.1 * index}s` }}>
                    <UserInfo>
                      <UserAvatar>{getInitials(member.name)}</UserAvatar>
                      <UserDetails>
                        <UserName>{member.name}</UserName>
                        <UserEmail>{member.email}</UserEmail>
                      </UserDetails>
                    </UserInfo>
                    <div>
                      <Select
                        value={member.role}
                        onChange={e => handleRoleChange(member.id, e.target.value)}
                      >
                        {userRoles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Button 
                        onClick={() => handleRemoveMember(member.id)}
                        style={{
                          background: 'rgba(252, 92, 125, 0.1)',
                          color: '#fc5c7d',
                          border: '1px solid rgba(252, 92, 125, 0.2)',
                          padding: '0.5rem 1rem',
                          fontSize: '0.75rem'
                        }}
                      >
                        🗑️ Remove
                      </Button>
                    </div>
                  </TableRow>
                ))
              ) : (
                <EmptyState>
                  No members found
                </EmptyState>
              )}
            </MembersTable>
          </FormContainer>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default ProjectSettings;