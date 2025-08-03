import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { reportAPI } from '../config/api';
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
  max-width: 1200px;
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
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  color: #6a82fb;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 16px rgba(106, 130, 251, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '←';
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 32px rgba(106, 130, 251, 0.3);
    background: rgba(255, 255, 255, 0.95);
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

const ReportContainer = styled.div`
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

const ReportHeader = styled.div`
  margin-bottom: 3rem;
  padding-bottom: 2rem;
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

const ReportTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: 0.5px;
  
  &::before {
    content: '📊';
    font-size: 2.2rem;
    padding: 0.8rem;
    border-radius: 16px;
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    box-shadow: 0 6px 24px rgba(106, 130, 251, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    
    &::before {
      font-size: 2rem;
      padding: 0.6rem;
    }
  }
`;

const ReportMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(106, 130, 251, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(106, 130, 251, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(106, 130, 251, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.1);
  }
  
  &::before {
    content: ${props => 
      props.type === 'project' ? '"🏗️"' :
      props.type === 'date' ? '"📅"' :
      props.type === 'author' ? '"👤"' : '""'};
    font-size: 1.2rem;
  }
  
  .label {
    color: #6a82fb;
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  .value {
    color: #1a1a1a;
    font-weight: 600;
    font-size: 1rem;
  }
`;

const ReportTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, rgba(106, 130, 251, 0.1) 0%, rgba(252, 92, 125, 0.1) 100%);
  color: #6a82fb;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 2rem;
  border: 1px solid rgba(106, 130, 251, 0.2);
  text-transform: capitalize;
  letter-spacing: 0.3px;
  
  &::before {
    content: '🏷️';
    font-size: 1rem;
  }
`;

const ReportContent = styled.div`
  line-height: 1.8;
  color: #2a2a2a;
  font-size: 1.05rem;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
    font-weight: 600;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
      border-radius: 2px;
    }
  }
  
  h1 {
    font-size: 2rem;
    padding-left: 1.5rem;
  }
  
  h2 {
    font-size: 1.6rem;
    padding-left: 1.5rem;
  }
  
  h3 {
    font-size: 1.3rem;
    padding-left: 1.5rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.8rem;
    position: relative;
  }
  
  ul li::before {
    content: '•';
    color: #6a82fb;
    font-weight: bold;
    position: absolute;
    left: -1.2rem;
  }
  
  code {
    background: linear-gradient(135deg, rgba(106, 130, 251, 0.1) 0%, rgba(252, 92, 125, 0.1) 100%);
    padding: 0.3rem 0.6rem;
    border-radius: 0.5rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    border: 1px solid rgba(106, 130, 251, 0.2);
  }
  
  blockquote {
    border-left: 4px solid #6a82fb;
    padding: 1.5rem;
    margin: 2rem 0;
    background: rgba(106, 130, 251, 0.05);
    border-radius: 0 1rem 1rem 0;
    color: #4a4a4a;
    font-style: italic;
    position: relative;
    
    &::before {
      content: '"';
      font-size: 3rem;
      color: #6a82fb;
      position: absolute;
      top: -0.5rem;
      left: 1rem;
      opacity: 0.3;
    }
  }
  
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 2rem 0;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.1);
  }
  
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid rgba(106, 130, 251, 0.1);
  }
  
  th {
    background: linear-gradient(135deg, rgba(106, 130, 251, 0.1) 0%, rgba(252, 92, 125, 0.1) 100%);
    font-weight: 600;
    color: #1a1a1a;
  }
  
  td {
    background: rgba(255, 255, 255, 0.5);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

const PromptContainer = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(106, 130, 251, 0.05) 0%, rgba(252, 92, 125, 0.05) 100%);
  border-radius: 1.5rem;
  border: 1px solid rgba(106, 130, 251, 0.15);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
    border-radius: 2px 2px 0 0;
  }
`;

const PromptLabel = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  &::before {
    content: '💭';
    font-size: 1.3rem;
  }
`;

const PromptText = styled.div`
  color: #4a4a4a;
  font-size: 1rem;
  line-height: 1.6;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  border: 1px solid rgba(106, 130, 251, 0.1);
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
  
  ${props => props.primary ? css`
    background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
    color: white;
    box-shadow: 0 6px 24px rgba(106, 130, 251, 0.3);
    
    &::before {
      content: '📤';
      font-size: 1.1rem;
    }
    
    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 40px rgba(106, 130, 251, 0.4);
    }
  ` : props.danger ? css`
    background: linear-gradient(135deg, #fc5c7d 0%, #ff6b9d 100%);
    color: white;
    box-shadow: 0 6px 24px rgba(252, 92, 125, 0.3);
    
    &::before {
      content: '🗑️';
      font-size: 1.1rem;
    }
    
    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 40px rgba(252, 92, 125, 0.4);
    }
  ` : css`
    background: rgba(255, 255, 255, 0.9);
    color: #6a82fb;
    border: 2px solid rgba(106, 130, 251, 0.2);
    box-shadow: 0 4px 16px rgba(106, 130, 251, 0.1);
    
    &::before {
      content: '🏗️';
      font-size: 1.1rem;
    }
    
    &:hover {
      background: rgba(255, 255, 255, 1);
      border-color: rgba(106, 130, 251, 0.4);
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 32px rgba(106, 130, 251, 0.2);
      color: #fc5c7d;
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

const ReportDetail = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await reportAPI.getById(reportId);
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Could not fetch report details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [reportId]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportAPI.delete(reportId);
        toast.success('Report deleted successfully');
        navigate(-1);
      } catch (error) {
        console.error('Error deleting report:', error);
        toast.error('Could not delete report');
      }
    }
  };
  
  const handleExport = () => {
    const element = document.createElement('a');
    
    // Convert Markdown to HTML for better print formatting
    const content = `# ${report.title}\n\n${report.content}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(blob);
    element.download = `${report.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <PageContainer>
        <FloatingElements />
        <ContentWrapper>
          <LoadingContainer>
            <div className="loading-text">Loading report...</div>
          </LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }
  
  if (!report) {
    return (
      <PageContainer>
        <FloatingElements />
        <ContentWrapper>
          <ErrorContainer>
            <div className="error-text">Report not found</div>
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
          <BackButton onClick={() => navigate(-1)}>
            Back to Reports
          </BackButton>
        </PageHeader>
        
        <ReportContainer>
          <ReportHeader>
            <ReportTitle>{report.title}</ReportTitle>
            <ReportMeta>
              <MetaItem type="project">
                <div>
                  <div className="label">Project</div>
                  <div className="value">{report.projectName}</div>
                </div>
              </MetaItem>
              <MetaItem type="date">
                <div>
                  <div className="label">Created</div>
                  <div className="value">{formatDate(report.createdAt)}</div>
                </div>
              </MetaItem>
              <MetaItem type="author">
                <div>
                  <div className="label">Author</div>
                  <div className="value">{report.authorName}</div>
                </div>
              </MetaItem>
            </ReportMeta>
            <ReportTag>{report.type.replace('_', ' ')}</ReportTag>
          </ReportHeader>
          
          <ReportContent>
            <ReactMarkdown>{report.content}</ReactMarkdown>
          </ReportContent>
          
          <PromptContainer>
            <PromptLabel>Generated from prompt:</PromptLabel>
            <PromptText>{report.prompt}</PromptText>
          </PromptContainer>
          
          <ButtonGroup>
            <Button danger onClick={handleDelete}>Delete Report</Button>
            <Button onClick={() => navigate(`/projects/${report.projectId}`)}>
              Go to Project
            </Button>
            <Button primary onClick={handleExport}>
              Export as Markdown
            </Button>
          </ButtonGroup>
        </ReportContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ReportDetail;