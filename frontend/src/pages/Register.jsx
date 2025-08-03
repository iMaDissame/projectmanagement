import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled, { css, keyframes } from 'styled-components';
import { USER_ROLES } from '../config/constants';

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
    width: 80px;
    height: 80px;
    top: 20%;
    left: 10%;
    animation-delay: -2s;
  }
  
  &::after {
    width: 120px;
    height: 120px;
    bottom: 20%;
    right: 10%;
    animation-delay: -4s;
  }
`;

const RegisterContainer = styled.div`
  ${glass}
  width: 100%;
  max-width: 650px;
  border-radius: 2rem;
  padding: 3.5rem;
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
    height: 4px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem;
    max-width: 550px;
  }
  
  @media (max-width: 480px) {
    border-radius: 1.5rem;
    padding: 2rem;
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
`;

const Title = styled.h1`
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
    content: ${props => 
      props.icon === 'name' ? '"👤"' : 
      props.icon === 'email' ? '"📧"' : 
      props.icon === 'password' ? '"🔑"' : 
      props.icon === 'confirm' ? '"🔒"' :
      props.icon === 'role' ? '"👔"' : '""'};
    font-size: 1rem;
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

const Select = styled.select`
  ${inputStyles}
  cursor: pointer;
  
  option {
    background: white;
    color: #1a1a1a;
    padding: 0.5rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
  margin-top: 0.5rem;
  
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
  
  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
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
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(106, 130, 251, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(106, 130, 251, 0.3), transparent);
  }
  
  p {
    font-size: 0.875rem;
    color: #6a82fb;
    opacity: 0.8;
    margin: 0;
    font-weight: 500;
  }
`;

const StyledLink = styled(Link)`
  color: #6a82fb;
  text-decoration: none;
  font-weight: 600;
  position: relative;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #fc5c7d;
    text-decoration: none;
    
    &::after {
      width: 100%;
    }
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
    if (!props.formData) return '0%';
    const fields = ['name', 'email', 'password', 'confirmPassword', 'role'];
    const filled = fields.filter(field => {
      const value = props.formData[field];
      return value && value.toString().trim() !== '';
    }).length;
    return `${(filled / fields.length) * 100}%`;
  }};
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.MEMBER
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, error } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        
        // Redirect to login after successful registration
        navigate('/login', { 
          state: { 
            message: 'Registration successful. Please log in.' 
          } 
        });
      } catch (err) {
        console.error('Registration error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <PageContainer>
      <FloatingElements />
      <RegisterContainer>
        <ProgressIndicator formData={formData} />
        
        <Header>
          <Title>Join TaskFlow</Title>
          <Subtitle>Create your account to get started</Subtitle>
        </Header>

        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name" icon="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
            <FormHint>This will be displayed on your profile</FormHint>
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email" icon="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
            <FormHint>We'll use this for login and notifications</FormHint>
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password" icon="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            <FormHint>Must be at least 6 characters long</FormHint>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword" icon="confirm">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            <FormHint>Must match the password above</FormHint>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="role" icon="role">Your Role</Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value={USER_ROLES.MEMBER}>Team Member</option>
              <option value={USER_ROLES.PRODUCT_OWNER}>Product Owner</option>
              <option value={USER_ROLES.SCRUM_MASTER}>Scrum Master</option>
            </Select>
            <FormHint>This helps us customize your experience</FormHint>
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating your account...' : 'Create Account'}
          </Button>
        </FormContainer>
        
        <Footer>
          <p>
            Already have an account? <StyledLink to="/login">Sign in here</StyledLink>
          </p>
        </Footer>
      </RegisterContainer>
    </PageContainer>
  );
};

export default Register;