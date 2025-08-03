import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { taskAPI, projectAPI } from '../config/api';

const glass = css`
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow: 0 4px 24px rgba(76,154,255,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
`;

const Card = styled(Link)`
  display: block;
  ${glass}
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(76,154,255,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  &:hover {
    transform: translateY(-6px) scale(1.025);
    box-shadow: 0 8px 32px rgba(252,92,125,0.13);
    text-decoration: none;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const ProjectIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ color }) => color.bg};
  color: ${({ color }) => color.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  font-weight: 700;
  margin-right: 1.1rem;
  border: 3px solid;
  border-image: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%) 1;
  box-shadow: 0 2px 8px rgba(76,154,255,0.10);
`;

const ProjectTitle = styled.h3`
  font-size: 1.18rem;
  font-weight: 700;
  margin: 0;
  color: #232526;
  letter-spacing: 0.5px;
`;

const ProjectKey = styled.span`
  font-size: 12px;
  color: #6a82fb;
  display: block;
  margin-top: 2px;
  font-weight: 600;
  letter-spacing: 1px;
`;

const ProjectDescription = styled.p`
  color: #414345;
  font-size: 0.98rem;
  margin: 0 0 1.2rem 0;
  min-height: 32px;
  opacity: 0.92;
`;

const ProjectStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid #e3e8ee;
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.18rem;
  font-weight: 700;
  color: #232526;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #a0aec0;
  margin-top: 2px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 7px;
  background: #e3e8ee;
  border-radius: 6px;
  margin-top: 0.7rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  width: ${({ percent }) => percent}%;
  transition: width 0.5s cubic-bezier(.4,0,.2,1);
`;

const ProjectCard = ({ project }) => {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    completedPercentage: 0
  });
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await taskAPI.getAll(project.id);
        const tasks = response.data;
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'DONE').length;
        const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        setTaskStats({
          total,
          completed,
          completedPercentage
        });
        const memberResponse = await projectAPI.getMembers(project.id);
        setMemberCount(memberResponse.data.length);
      } catch (error) {
        setTaskStats({ total: 0, completed: 0, completedPercentage: 0 });
        setMemberCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskStats();
  }, [project.id]);

  // Generate a consistent color based on project name
  const getProjectColor = (name) => {
    const colors = [
      { bg: 'linear-gradient(135deg, #e0e7ff 0%, #fbc2eb 100%)', text: '#6a82fb' },
      { bg: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', text: '#fc5c7d' },
      { bg: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)', text: '#f8b500' },
      { bg: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', text: '#8ec5fc' },
      { bg: 'linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)', text: '#ff4e50' }
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const color = getProjectColor(project.name);

  return (
    <Card to={`/projects/${project.id}`} className="card-appear">
      <ProjectHeader>
        <ProjectIcon color={color}>
          {project.name.charAt(0).toUpperCase()}
        </ProjectIcon>
        <div>
          <ProjectTitle>{project.name}</ProjectTitle>
          <ProjectKey>{project.key}</ProjectKey>
        </div>
      </ProjectHeader>
      <ProjectDescription>
        {project.description || 'No description provided.'}
      </ProjectDescription>
      <ProgressBarContainer>
        <ProgressBar percent={loading ? 0 : taskStats.completedPercentage} />
      </ProgressBarContainer>
      <ProjectStats>
        <StatItem>
          <StatValue>{loading ? '...' : taskStats.total}</StatValue>
          <StatLabel>Tasks</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{loading ? '...' : memberCount}</StatValue>
          <StatLabel>Members</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>
            {loading ? '...' : `${taskStats.completedPercentage}%`}
          </StatValue>
          <StatLabel>Completed</StatLabel>
        </StatItem>
      </ProjectStats>
    </Card>
  );
};

export default ProjectCard;