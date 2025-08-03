import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TASK_PRIORITY, TASK_TYPE, TASK_STATUS } from '../config/constants';
import { userAPI, taskAPI } from '../config/api';
import { toast } from 'react-toastify';

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
  padding: 2rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
  
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
    padding: 1.5rem;
    border-radius: 1.5rem 1.5rem 0 0;
    margin-top: auto;
    max-height: 90vh;
  }
  
  @media (max-width: 480px) {
    border-radius: 1rem 1rem 0 0;
    padding: 1.2rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
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
    margin-bottom: 1.5rem;
    padding-bottom: 0.8rem;
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
    content: '✨';
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
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1.2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 0.3px;
  
  &::before {
    content: ${props => {
      switch(props.icon) {
        case 'title': return '"📝"';
        case 'description': return '"📄"';
        case 'type': return '"🏷️"';
        case 'priority': return '"⚡"';
        case 'assignee': return '"👤"';
        case 'date': return '"📅"';
        default: return '""';
      }
    }};
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const inputStyles = css`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  font-family: inherit;
  
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
    transform: translateY(-1px);
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
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 100px;
  max-height: 150px;
  resize: vertical;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    min-height: 80px;
  }
`;

const Select = styled.select`
  ${inputStyles}
  cursor: pointer;
  
  option {
    padding: 0.5rem;
    background: white;
    color: #1a1a1a;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const ErrorMessage = styled.div`
  color: #fc5c7d;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  background: rgba(252, 92, 125, 0.08);
  border-radius: 0.8rem;
  border-left: 3px solid #fc5c7d;
  animation: ${slideUp} 0.3s ease;
  
  &::before {
    content: '⚠️';
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.6rem 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
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
  
  @media (max-width: 768px) {
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
    min-width: auto;
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

const CreateButton = styled(Button)`
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
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: ${pulse} 1s linear infinite;
    }
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

const FormHint = styled.div`
  font-size: 0.75rem;
  color: #6a82fb;
  opacity: 0.8;
  margin-top: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &::before {
    content: '💡';
    font-size: 0.8rem;
  }
`;

const LoadingIndicator = styled.div`
  font-size: 0.75rem;
  color: #6a82fb;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &::before {
    content: '⏳';
    font-size: 0.8rem;
    animation: ${pulse} 1s linear infinite;
  }
`;

const ProgressIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  border-radius: 0 0 3px 3px;
  transition: width 0.3s ease;
  width: ${props => {
    if (!props.formData) return '0%';
    const fields = ['title', 'type', 'priority'];
    const filled = fields.filter(field => {
      const value = props.formData[field];
      return value && value.toString().trim() !== '';
    }).length;
    return `${(filled / fields.length) * 100}%`;
  }};
`;

const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  
  &::before {
    content: ${props => {
      if (!props.priority) return '"⚪"';
      switch(props.priority) {
        case 'HIGHEST': return '"🔴"';
        case 'HIGH': return '"🟠"';
        case 'MEDIUM': return '"🟡"';
        case 'LOW': return '"🟢"';
        case 'LOWEST': return '"🔵"';
        default: return '"⚪"';
      }
    }};
  }
`;

const CreateTaskModal = ({ project, onClose, onCreateTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: TASK_TYPE.TASK,
    priority: TASK_PRIORITY.MEDIUM,
    assigneeId: '',
    dueDate: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  
  // Fetch team members from the backend
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoadingMembers(true);
        const response = await userAPI.getAll();
        console.log('Team members fetched:', response.data.filter(member => member.role !== 'PRODUCT_OWNER'));
        setTeamMembers(response.data.filter(member => member.role !== 'PRODUCT_OWNER'));
      } catch (err) {
        console.error('Error fetching team members:', err);
        toast.error('Failed to load team members');
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchTeamMembers();
  }, [project.id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        // Fetch assignee if assigneeId exists
        let assignee = null;
        if (formData.assigneeId) {
          const assigneeResponse = await userAPI.getById(formData.assigneeId);
          assignee = assigneeResponse.data;
        }

        const taskData = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          priority: formData.priority,
          status: TASK_STATUS.TODO,
          assignee: assignee,
          dueDate: formData.dueDate || null
        };
        
        console.log('Sending task data:', taskData);
        console.log('Project ID:', project.id);
        
        // Create task via API
        const response = await taskAPI.create(taskData, project.id);
        console.log('Task created:', response.data);
        
        // Notify parent component
        onCreateTask(response.data);
        toast.success('Task created successfully');
        onClose();
      } catch (err) {
        console.error('Error creating task:', err);
        setErrors({
          submit: err.response?.data?.message || 'Failed to create task'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  const getTypeLabel = (type) => {
    const labels = {
      'TASK': 'Task',
      'BUG': 'Bug', 
      'STORY': 'Story',
      'EPIC': 'Epic'
    };
    return labels[type] || type;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      'HIGHEST': 'Highest',
      'HIGH': 'High',
      'MEDIUM': 'Medium',
      'LOW': 'Low',
      'LOWEST': 'Lowest'
    };
    return labels[priority] || priority;
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ProgressIndicator formData={formData} />
        
        <ModalHeader>
          <ModalTitle>Create New Task</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title" icon="title">Task Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Implement user authentication"
              maxLength={100}
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
            <FormHint>Choose a clear, descriptive title for your task</FormHint>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description" icon="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what needs to be done, acceptance criteria, or any important details..."
              maxLength={1000}
            />
            <FormHint>Provide context and requirements for this task</FormHint>
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="type" icon="type">Task Type</Label>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value={TASK_TYPE.TASK}>📝 Task</option>
                <option value={TASK_TYPE.BUG}>🐛 Bug</option>
                <option value={TASK_TYPE.STORY}>📖 Story</option>
                <option value={TASK_TYPE.EPIC}>🎯 Epic</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="priority" icon="priority">Priority</Label>
              <Select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value={TASK_PRIORITY.HIGHEST}>🔴 Highest</option>
                <option value={TASK_PRIORITY.HIGH}>🟠 High</option>
                <option value={TASK_PRIORITY.MEDIUM}>🟡 Medium</option>
                <option value={TASK_PRIORITY.LOW}>🟢 Low</option>
                <option value={TASK_PRIORITY.LOWEST}>🔵 Lowest</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="assigneeId" icon="assignee">Assignee</Label>
              <Select
                id="assigneeId"
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                disabled={loadingMembers}
              >
                <option value="">👤 Unassigned</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    👨‍💻 {member.name || member.username || member.email}
                  </option>
                ))}
              </Select>
              {loadingMembers && <LoadingIndicator>Loading team members...</LoadingIndicator>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="dueDate" icon="date">Due Date (Optional)</Label>
              <Input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={today}
              />
              <FormHint>Set a target completion date</FormHint>
            </FormGroup>
          </FormRow>

          {formData.priority && (
            <FormHint>
              Selected priority: <PriorityBadge priority={formData.priority}>{getPriorityLabel(formData.priority)}</PriorityBadge>
            </FormHint>
          )}

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          <ButtonGroup>
            <CancelButton type="button" onClick={handleClose}>
              Cancel
            </CancelButton>
            <CreateButton type="submit" disabled={isSubmitting || loadingMembers}>
              {isSubmitting ? 'Creating Task...' : 'Create Task'}
            </CreateButton>
          </ButtonGroup>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateTaskModal;