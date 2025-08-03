import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { projectAPI } from '../config/api';

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

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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
    align-items: flex-start;
  }
`;

const FormCard = styled.div`
  ${glass}
  border-radius: 1.5rem;
  width: 100%;
  max-width: 650px;
  padding: 2rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
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
    margin-top: 2rem;
  }
  
  @media (max-width: 480px) {
    border-radius: 1rem;
    padding: 1.2rem;
  }
`;

const Header = styled.div`
  text-align: center;
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

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  letter-spacing: 0.5px;
  
  &::before {
    content: '🚀';
    font-size: 2rem;
    padding: 0.5rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    &::before {
      font-size: 1.6rem;
      padding: 0.4rem;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #6a82fb;
  opacity: 0.8;
  margin: 0;
  font-weight: 500;
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
        case 'key': return '"🔑"';
        case 'description': return '"📄"';
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
  min-height: 120px;
  max-height: 200px;
  resize: vertical;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    min-height: 100px;
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

const KeyPreview = styled.div`
  font-size: 0.75rem;
  color: #6a82fb;
  opacity: 0.9;
  margin-top: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  
  &::before {
    content: '🎯';
    font-size: 0.8rem;
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
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 0.8rem;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.8rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  min-width: 140px;
  
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
    const fields = ['name', 'key'];
    const filled = fields.filter(field => {
      const value = props.formData[field];
      return value && value.toString().trim() !== '';
    }).length;
    return `${(filled / fields.length) * 100}%`;
  }};
`;

const createProjectKey = (name) => {
  if (!name) return '';
  
  // Generate key from first letters of words, max 5 characters
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 5);
};

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // If name field is changing, auto-generate the key
      if (name === 'name') {
        return {
          ...prev,
          [name]: value,
          key: createProjectKey(value)
        };
      }
      
      return {
        ...prev,
        [name]: value
      };
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.key.trim()) {
      newErrors.key = 'Project key is required';
    } else if (!/^[A-Z]{2,5}$/.test(formData.key)) {
      newErrors.key = 'Key must be 2-5 uppercase letters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        const response = await projectAPI.create(formData);
        
        navigate('/dashboard', { 
          state: { 
            message: 'Project created successfully!' 
          } 
        });
      } catch (err) {
        console.error('Error creating project:', err);
        setErrors({
          submit: err.response?.data?.message || 'Failed to create project'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <PageContainer>
      <FormCard>
        <ProgressIndicator formData={formData} />
        
        <Header>
          <PageTitle>Create New Project</PageTitle>
          <Subtitle>Set up your workspace and start building something amazing</Subtitle>
        </Header>

        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name" icon="name">Project Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., My Awesome Project"
              maxLength={100}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            <FormHint>Choose a descriptive name for your project</FormHint>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="key" icon="key">Project Key</Label>
            <Input
              type="text"
              id="key"
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder="e.g., MAP"
              maxLength={5}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.key && <ErrorMessage>{errors.key}</ErrorMessage>}
            <KeyPreview>
              Used as prefix for task IDs • Example: {formData.key || 'KEY'}-123
            </KeyPreview>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description" icon="description">Project Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the purpose and goals of this project..."
              maxLength={1000}
            />
            <FormHint>Help your team understand what this project is about</FormHint>
          </FormGroup>
          
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          
          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              Cancel
            </CancelButton>
            <CreateButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </CreateButton>
          </ButtonGroup>
        </FormContainer>
      </FormCard>
    </PageContainer>
  );
};

export default CreateProject;