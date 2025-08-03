import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

const LoginContainer = styled.div`
  ${glass}
  width: 100%;
  max-width: 450px;
  border-radius: 1.5rem;
  padding: 2.5rem;
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
    padding: 2rem;
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    border-radius: 1rem;
    padding: 1.5rem;
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
    content: '🔐';
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
    content: ${props => props.icon === 'email' ? '"📧"' : props.icon === 'password' ? '"🔑"' : '""'};
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
    const fields = ['email', 'password'];
    const filled = fields.filter(field => {
      const value = props.formData[field];
      return value && value.toString().trim() !== '';
    }).length;
    return `${(filled / fields.length) * 100}%`;
  }};
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <FloatingElements />
      <LoginContainer>
        <ProgressIndicator formData={formData} />
        
        <Header>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to continue to TaskFlow</Subtitle>
        </Header>

        <FormContainer onSubmit={handleSubmit}>
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
            <FormHint>We'll never share your email with anyone</FormHint>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password" icon="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <FormHint>Use a strong password to keep your account secure</FormHint>
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing you in...' : 'Sign In'}
          </Button>
        </FormContainer>
        
        <Footer>
          <p>
            Don't have an account? <StyledLink to="/register">Create one here</StyledLink>
          </p>
        </Footer>
      </LoginContainer>
    </PageContainer>
  );
};

export default Login;