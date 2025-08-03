import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';

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

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const avatarGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(106, 130, 251, 0.3); }
  50% { box-shadow: 0 0 30px rgba(252, 92, 125, 0.4); }
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
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
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
  margin-bottom: 2rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::before {
    content: '👤';
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

const FormContainer = styled.div`
  ${glass}
  border-radius: 2rem;
  padding: 3rem;
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
    padding: 2rem;
    border-radius: 1.5rem;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(106, 130, 251, 0.05);
  border-radius: 1.5rem;
  border: 1px solid rgba(106, 130, 251, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(106, 130, 251, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(106, 130, 251, 0.15);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-right: 2rem;
  animation: ${avatarGlow} 3s ease-in-out infinite;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`;

const AvatarActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #1a1a1a;
  letter-spacing: 0.3px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
    border-radius: 1px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(106, 130, 251, 0.2);
  border-radius: 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: #1a1a1a;
  
  &:focus {
    outline: none;
    border-color: #6a82fb;
    box-shadow: 0 0 0 4px rgba(106, 130, 251, 0.1);
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: rgba(240, 240, 240, 0.8);
    color: #6a82fb;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: rgba(106, 130, 251, 0.6);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
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
  min-width: 140px;
  
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

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: white;
  box-shadow: 0 6px 24px rgba(106, 130, 251, 0.3);
  
  &::before {
    content: '💾';
    font-size: 1.1rem;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 40px rgba(106, 130, 251, 0.4);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #ccc 0%, #aaa 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &::before {
      content: '⏳';
    }
  }
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.9);
  color: #6a82fb;
  border: 2px solid rgba(106, 130, 251, 0.2);
  box-shadow: 0 4px 16px rgba(106, 130, 251, 0.1);
  
  &::before {
    content: '↩️';
    font-size: 1.1rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(106, 130, 251, 0.4);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 32px rgba(106, 130, 251, 0.2);
    color: #fc5c7d;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #6a82fb;
  border: 2px solid rgba(106, 130, 251, 0.2);
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '📸';
    font-size: 1rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(106, 130, 251, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.2);
    color: #fc5c7d;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(106, 130, 251, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover::after {
    left: 100%;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #fc5c7d;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '🗑️';
    font-size: 0.9rem;
  }
  
  &:hover {
    background: rgba(252, 92, 125, 0.1);
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  color: #fc5c7d;
  font-size: 0.9rem;
  margin-top: 0.8rem;
  padding: 0.8rem 1rem;
  background: rgba(252, 92, 125, 0.1);
  border-radius: 0.8rem;
  border: 1px solid rgba(252, 92, 125, 0.2);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  &::before {
    content: '⚠️';
    font-size: 1rem;
  }
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.9rem;
  margin-top: 0.8rem;
  padding: 0.8rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 0.8rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  animation: ${slideUp} 0.3s ease;
  
  &::before {
    content: '✅';
    font-size: 1rem;
  }
`;

const PasswordSection = styled.div`
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 2px solid rgba(106, 130, 251, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
    border-radius: 1px;
  }
`;

const PasswordTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: 0.3px;
  
  &::before {
    content: '🔒';
    font-size: 1.6rem;
    padding: 0.6rem;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(106, 130, 251, 0.1) 0%, rgba(252, 92, 125, 0.1) 100%);
    border: 1px solid rgba(106, 130, 251, 0.2);
  }
`;

const UserProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || ''
      });
    }
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, we would call an API here
      
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);
    
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would call an API here
      
      setSuccess('Password updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <PageContainer>
      <FloatingElements />
      <ContentWrapper>
        <PageTitle>My Profile</PageTitle>
        
        <FormContainer>
          <AvatarSection>
            <Avatar>{getInitials(formData.name)}</Avatar>
            <AvatarActions>
              <FileLabel htmlFor="avatar-upload">
                Upload Photo
              </FileLabel>
              <FileInput
                id="avatar-upload"
                type="file"
                accept="image/*"
              />
              <RemoveButton>
                Remove Photo
              </RemoveButton>
            </AvatarActions>
          </AvatarSection>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled // Email cannot be changed
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="role">Role</Label>
              <Input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                disabled // Role is display-only
              />
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <ButtonGroup>
              <CancelButton type="button" onClick={() => navigate('/dashboard')}>
                Cancel
              </CancelButton>
              <SaveButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </ButtonGroup>
          </form>
          
          <PasswordSection>
            <PasswordTitle>Change Password</PasswordTitle>
            
            <form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                />
              </FormGroup>
              
              <ButtonGroup>
                <SaveButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </SaveButton>
              </ButtonGroup>
            </form>
          </PasswordSection>
        </FormContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default UserProfile;