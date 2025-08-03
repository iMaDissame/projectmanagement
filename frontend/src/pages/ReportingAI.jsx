import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { projectAPI, reportAPI } from '../config/api';
import ReactMarkdown from 'react-markdown';
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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const typing = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
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
    width: 150px;
    height: 150px;
    top: 10%;
    left: 5%;
    animation-delay: -2s;
  }
  
  &::after {
    width: 100px;
    height: 100px;
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
  ${glass}
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem 3rem;
  border-radius: 2rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
    border-radius: 4px 4px 0 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: 0.5px;
  
  &::before {
    content: '🤖';
    font-size: 2.5rem;
    padding: 0.8rem;
    border-radius: 16px;
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    box-shadow: 0 6px 24px rgba(106, 130, 251, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }
`;

const ProjectSelector = styled.select`
  padding: 1rem 1.5rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  min-width: 250px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:focus {
    outline: none;
    border-color: #6a82fb;
    box-shadow: 0 0 0 4px rgba(106, 130, 251, 0.1);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: rgba(106, 130, 251, 0.3);
    background: rgba(255, 255, 255, 0.95);
  }
  
  option {
    background: white;
    color: #1a1a1a;
    padding: 0.5rem;
  }
`;

const MainContent = styled.div`
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
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 2.5rem;
  background: rgba(106, 130, 251, 0.05);
  border-radius: 1.5rem;
  padding: 0.5rem;
  border: 1px solid rgba(106, 130, 251, 0.1);
`;

const Tab = styled.div`
  flex: 1;
  padding: 1rem 2rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  
  ${props => props.active ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
    transform: translateY(-2px);
  ` : css`
    color: #6a82fb;
    
    &:hover {
      background: rgba(106, 130, 251, 0.1);
      transform: translateY(-1px);
    }
  `}
  
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

const ReportTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ReportTypeButton = styled.button`
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  position: relative;
  overflow: hidden;
  
  ${props => props.selected ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    box-shadow: 0 6px 24px rgba(106, 130, 251, 0.3);
    transform: translateY(-2px);
  ` : css`
    background: rgba(255, 255, 255, 0.8);
    color: #6a82fb;
    border: 2px solid rgba(106, 130, 251, 0.15);
    
    &:hover {
      background: rgba(255, 255, 255, 0.95);
      border-color: rgba(106, 130, 251, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(106, 130, 251, 0.2);
    }
  `}
  
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

const SuggestedPrompts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PromptChip = styled.div`
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, rgba(106, 130, 251, 0.1) 0%, rgba(252, 92, 125, 0.1) 100%);
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(106, 130, 251, 0.2);
  color: #6a82fb;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(135deg, rgba(106, 130, 251, 0.2) 0%, rgba(252, 92, 125, 0.2) 100%);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.2);
    color: #fc5c7d;
  }
  
  &::before {
    content: '💡';
    margin-right: 0.5rem;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  border: 1px solid rgba(106, 130, 251, 0.15);
  overflow: hidden;
  position: relative;
  
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

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(106, 130, 251, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 1.5rem 2rem;
  border-radius: 1.5rem;
  position: relative;
  animation: ${props => props.isUser ? slideInRight : slideInLeft} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  ${props => props.isUser ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    align-self: flex-end;
    margin-left: auto;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
    
    &::before {
      content: '';
      position: absolute;
      bottom: -8px;
      right: 20px;
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-top: 15px solid #fc5c7d;
    }
  ` : css`
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    color: #2a2a2a;
    align-self: flex-start;
    margin-right: auto;
    border: 1px solid rgba(106, 130, 251, 0.15);
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 20px;
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-top: 15px solid rgba(255, 255, 255, 0.9);
    }
  `}
  
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.isUser ? 'white' : '#1a1a1a'};
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  code {
    background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(106, 130, 251, 0.1)'};
    padding: 0.2rem 0.4rem;
    border-radius: 0.3rem;
    font-size: 0.9rem;
  }
`;

const TypingIndicator = styled(MessageBubble)`
  animation: none;
  
  &::after {
    content: '...';
    animation: ${typing} 1.5s infinite;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const MessageInput = styled.div`
  display: flex;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(106, 130, 251, 0.15);
  gap: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(106, 130, 251, 0.15);
  border-radius: 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::placeholder {
    color: #6a82fb;
    opacity: 0.7;
  }
  
  &:focus {
    outline: none;
    border-color: #6a82fb;
    box-shadow: 0 0 0 4px rgba(106, 130, 251, 0.1);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  
  ${props => props.primary ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 32px rgba(106, 130, 251, 0.4);
    }
  ` : css`
    background: rgba(255, 255, 255, 0.9);
    color: #6a82fb;
    border: 2px solid rgba(106, 130, 251, 0.2);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 1);
      border-color: rgba(106, 130, 251, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(106, 130, 251, 0.2);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
  
  &:hover:not(:disabled)::after {
    left: 100%;
  }
`;

const SavedReportsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const ReportCard = styled.div`
  ${glass}
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  animation: ${slideUp} 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 32px 64px rgba(106, 130, 251, 0.2),
      0 12px 48px rgba(0, 0, 0, 0.1);
  }
`;

const ReportCardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  &::before {
    content: '📊';
    font-size: 1.2rem;
  }
`;

const ReportCardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ReportTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(106, 130, 251, 0.1) 0%, rgba(252, 92, 125, 0.1) 100%);
  color: #6a82fb;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 1.5rem;
  border: 1px solid rgba(106, 130, 251, 0.2);
  text-transform: capitalize;
  
  &::before {
    content: '🏷️';
    font-size: 0.9rem;
  }
`;

const ReportDate = styled.span`
  font-size: 0.9rem;
  color: #6a82fb;
  opacity: 0.8;
  font-weight: 500;
`;

const ReportPreview = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: rgba(106, 130, 251, 0.05);
  border-radius: 1rem;
  font-size: 0.9rem;
  color: #4a4a4a;
  line-height: 1.6;
  height: 120px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  border: 1px solid rgba(106, 130, 251, 0.1);
`;

const ReportCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6a82fb;
  font-size: 1.1rem;
  
  &::before {
    content: '📝';
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
    opacity: 0.7;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6a82fb;
  font-size: 1.1rem;
  
  &::before {
    content: '⏳';
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

// Define report types
const REPORT_TYPES = [
  { id: 'STATUS_REPORT', label: 'Status Report' },
  { id: 'SPRINT_ANALYSIS', label: 'Sprint Analysis' },
  { id: 'TEAM_PERFORMANCE', label: 'Team Performance' },
  { id: 'RISK_ASSESSMENT', label: 'Risk Assessment' },
  { id: 'CUSTOM', label: 'Custom' }
];

// Sample suggested prompts
const SUGGESTED_PROMPTS = {
  'STATUS_REPORT': [
    "Generate a weekly status report for stakeholders",
    "Create a detailed progress summary",
    "Prepare an executive summary of project status"
  ],
  'SPRINT_ANALYSIS': [
    "Analyze our latest sprint performance",
    "Compare completed vs planned work in the sprint",
    "What can we improve for our next sprint?"
  ],
  'TEAM_PERFORMANCE': [
    "Evaluate team productivity and collaboration",
    "Identify areas where team efficiency can be improved",
    "Analyze individual contributions to the project"
  ],
  'RISK_ASSESSMENT': [
    "Identify potential risks based on current project status",
    "What are the biggest threats to our timeline?",
    "Suggest risk mitigation strategies"
  ],
  'CUSTOM': [
    "Generate a burndown chart analysis",
    "Compare estimated vs actual completion times",
    "Create a project health scorecard"
  ]
};

const ReportingAI = () => {
  const { projectId: urlProjectId } = useParams();
  const [activeTab, setActiveTab] = useState('generate');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(urlProjectId || '');
  const [projectData, setProjectData] = useState(null);
  const [reportType, setReportType] = useState('STATUS_REPORT');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your AI reporting assistant. Select a project and report type, then ask me to generate reports, analyze data, or provide insights about your project.", 
      isUser: false 
    }
  ]);
  const [savedReports, setSavedReports] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectAPI.getAll();
        setProjects(response.data);
        
        // If we have a project ID from URL, set it as selected
        if (urlProjectId && !selectedProject) {
          setSelectedProject(urlProjectId);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Could not fetch projects');
      }
    };
    
    fetchProjects();
  }, [urlProjectId]);
  
  // Fetch project data when a project is selected
  useEffect(() => {
    if (!selectedProject) return;
    
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const projectResponse = await projectAPI.getById(selectedProject);
        setProjectData(projectResponse.data);
        
        // If we're on the saved reports tab, fetch them
        if (activeTab === 'saved') {
          fetchSavedReports();
        } else {
          // Add a message from the assistant about the selected project
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: `I've loaded data for ${projectResponse.data.name}. Select a report type and ask a question to generate a report.`,
            isUser: false
          }]);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        toast.error('Could not fetch project details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [selectedProject, activeTab]);
  
  // Fetch saved reports for a project
  const fetchSavedReports = async () => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      const response = await reportAPI.getByProject(selectedProject);
      setSavedReports(response.data);
    } catch (error) {
      console.error('Error fetching saved reports:', error);
      toast.error('Could not fetch saved reports');
    } finally {
      setLoading(false);
    }
  };
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleProjectChange = (e) => {
    const newProjectId = e.target.value;
    setSelectedProject(newProjectId);
    
    // Update URL without reloading the page
    navigate(`/reporting/${newProjectId}`, { replace: true });
    
    // Reset messages when changing projects
    if (activeTab === 'generate') {
      setMessages([{ 
        id: Date.now(), 
        text: "Hello! I'm your AI reporting assistant. Select a project and report type, then ask me to generate reports, analyze data, or provide insights about your project.", 
        isUser: false 
      }]);
    }
  };
  
  const handleReportTypeChange = (type) => {
    setReportType(type);
    
    // Add a message about the selected report type
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: `You've selected ${REPORT_TYPES.find(t => t.id === type).label}. What would you like to know?`,
      isUser: false
    }]);
  };
  
  // In ReportingAI.jsx
  const handleSendMessage = async () => {
    if (!input.trim() || !selectedProject) return;
    
    // Add user message to chat
    const userMessage = { id: Date.now(), text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInput('');
    
    // Show loading state
    setLoading(true);
    
    try {
        console.log('Generating report with:', {
            projectId: selectedProject,
            prompt: input,
            type: reportType
        });
        
        // Call API to generate report
        const response = await reportAPI.generate(selectedProject, input, reportType);
        console.log('API response:', response);
        
        if (response.data && response.data.content) {
            // Add the response to messages
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: response.data.content,
                isUser: false,
                reportData: response.data
            }]);
        } else {
            throw new Error('Empty or invalid response from API');
        }
        
    } catch (error) {
        console.error('Error generating report:', error);
        
        // Add more detailed error message
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `I'm sorry, I encountered an error while generating your report: ${error.message || 'Unknown error'}. Please try again.`,
            isUser: false
        }]);
    } finally {
        setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };
  
  const handleViewReport = (reportId) => {
    navigate(`/reports/${reportId}`);
  };
  
  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportAPI.delete(reportId);
        toast.success('Report deleted successfully');
        fetchSavedReports();
      } catch (error) {
        console.error('Error deleting report:', error);
        toast.error('Could not delete report');
      }
    }
  };
  
  const handleSaveReport = async (message) => {
    // The report is already saved, this just confirms to the user
    toast.success('Report saved successfully');
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderTabContent = () => {
    if (activeTab === 'generate') {
      return (
        <>
          <ReportTypeSelector>
            {REPORT_TYPES.map(type => (
              <ReportTypeButton
                key={type.id}
                selected={reportType === type.id}
                onClick={() => handleReportTypeChange(type.id)}
              >
                {type.label}
              </ReportTypeButton>
            ))}
          </ReportTypeSelector>
          
          <SuggestedPrompts>
            {SUGGESTED_PROMPTS[reportType]?.map((prompt, index) => (
              <PromptChip key={index} onClick={() => handlePromptClick(prompt)}>
                {prompt}
              </PromptChip>
            ))}
          </SuggestedPrompts>
          
          <ChatContainer>
            <MessagesContainer>
              {messages.map(message => (
                <MessageBubble key={message.id} isUser={message.isUser}>
                  {message.isUser ? (
                    message.text
                  ) : (
                    <>
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                      {message.reportData && (
                        <Button 
                          style={{ marginTop: '1rem' }}
                          onClick={() => handleSaveReport(message)}
                        >
                          Save Report
                        </Button>
                      )}
                    </>
                  )}
                </MessageBubble>
              ))}
              {loading && (
                <TypingIndicator isUser={false}>
                  <span>Generating report</span>
                </TypingIndicator>
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>
            
            <MessageInput>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask for project reports, analytics, or insights..."
                disabled={loading || !selectedProject}
              />
              <Button 
                primary 
                onClick={handleSendMessage}
                disabled={loading || !input.trim() || !selectedProject}
              >
                Send
              </Button>
            </MessageInput>
          </ChatContainer>
        </>
      );
    } else if (activeTab === 'saved') {
      return (
        <SavedReportsContainer>
          {loading ? (
            <LoadingState>Loading saved reports...</LoadingState>
          ) : savedReports.length === 0 ? (
            <EmptyState>No saved reports for this project yet. Generate some reports first!</EmptyState>
          ) : (
            savedReports.map(report => (
              <ReportCard key={report.id}>
                <ReportCardTitle>{report.title}</ReportCardTitle>
                <ReportCardMeta>
                  <ReportTag>{report.type.replace('_', ' ')}</ReportTag>
                  <ReportDate>{formatDate(report.createdAt)}</ReportDate>
                </ReportCardMeta>
                <ReportPreview>
                  {report.content.substring(0, 200)}...
                </ReportPreview>
                <ReportCardActions>
                  <Button onClick={() => handleDeleteReport(report.id)}>Delete</Button>
                  <Button primary onClick={() => handleViewReport(report.id)}>View</Button>
                </ReportCardActions>
              </ReportCard>
            ))
          )}
        </SavedReportsContainer>
      );
    }
  };

  return (
    <PageContainer>
      <FloatingElements />
      <ContentWrapper>
        <PageHeader>
          <PageTitle>AI Project Reporting</PageTitle>
          <ProjectSelector 
            value={selectedProject} 
            onChange={handleProjectChange}
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </ProjectSelector>
        </PageHeader>
        
        {!selectedProject ? (
          <MainContent>
            <EmptyState>Please select a project to generate or view reports</EmptyState>
          </MainContent>
        ) : (
          <MainContent>
            <Tabs>
              <Tab 
                active={activeTab === 'generate'} 
                onClick={() => setActiveTab('generate')}
              >
                Generate Report
              </Tab>
              <Tab 
                active={activeTab === 'saved'} 
                onClick={() => {
                  setActiveTab('saved');
                  fetchSavedReports();
                }}
              >
                Saved Reports
              </Tab>
            </Tabs>
            
            {renderTabContent()}
          </MainContent>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default ReportingAI;