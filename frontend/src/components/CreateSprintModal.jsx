import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

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
  max-width: 550px;
  padding: 2rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
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
    padding: 1.5rem;
    border-radius: 1.5rem 1.5rem 0 0;
    margin-top: auto;
    max-height: 90vh;
    overflow-y: auto;
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
    content: '🏃';
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
        case 'name': return '"📝"';
        case 'goal': return '"🎯"';
        case 'start': return '"📅"';
        case 'end': return '"🏁"';
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
  font-family: inherit;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    min-height: 80px;
  }
`;

const DateInputGroup = styled.div`
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

const ProgressIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  border-radius: 0 0 3px 3px;
  transition: width 0.3s ease;
  width: ${props => {
    const filled = Object.values(props.formData).filter(Boolean).length;
    const total = Object.keys(props.formData).length;
    return `${(filled / total) * 100}%`;
  }};
`;

const CreateSprintModal = ({ onClose, onCreateSprint }) => {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: ''
  });
  
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Sprint name is required');
      return;
    }
    
    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }
    
    if (!formData.endDate) {
      setError('End date is required');
      return;
    }
    
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    // Check if sprint duration is reasonable (not too long)
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      setError('Sprint duration should not exceed 30 days');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onCreateSprint(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create sprint');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];
  
  // Get suggested end date (2 weeks from start date)
  const getSuggestedEndDate = () => {
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      startDate.setDate(startDate.getDate() + 14); // Add 2 weeks
      return startDate.toISOString().split('T')[0];
    }
    return '';
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ProgressIndicator formData={formData} />
        
        <ModalHeader>
          <ModalTitle>Create New Sprint</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name" icon="name">Sprint Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sprint 1: User Authentication"
              maxLength={100}
            />
            <FormHint>Choose a descriptive name for your sprint</FormHint>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="goal" icon="goal">Sprint Goal</Label>
            <TextArea
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="What do you want to achieve in this sprint? Define your main objectives..."
              maxLength={500}
            />
            <FormHint>Describe the main objective and expected outcomes</FormHint>
          </FormGroup>

          <DateInputGroup>
            <FormGroup>
              <Label htmlFor="startDate" icon="start">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={today}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="endDate" icon="end">End Date</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || today}
                placeholder={getSuggestedEndDate()}
              />
            </FormGroup>
          </DateInputGroup>

          {formData.startDate && formData.endDate && (
            <FormHint>
              Sprint duration: {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
            </FormHint>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <CancelButton type="button" onClick={handleClose}>
              Cancel
            </CancelButton>
            <CreateButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Sprint...' : 'Create Sprint'}
            </CreateButton>
          </ButtonGroup>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateSprintModal;