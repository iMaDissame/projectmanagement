import React from 'react';
import styled, { css } from 'styled-components';
import { TASK_PRIORITY, TASK_TYPE } from '../config/constants';

const glass = css`
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px) saturate(180%);
  box-shadow: 0 4px 24px rgba(106,130,251,0.08), 0 1.5px 6px rgba(0,0,0,0.03);
`;

const Card = styled.div`
  ${glass}
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(106,130,251,0.08), 0 1.5px 6px rgba(0,0,0,0.03);
  padding: 1.4rem 1.2rem 1.1rem 1.2rem;
  margin-bottom: 1.2rem;
  border-left: 5px solid ${props => {
    switch(props.priority) {
      case TASK_PRIORITY.HIGHEST: return 'linear-gradient(90deg,#fc5c7d,#6a82fb)';
      case TASK_PRIORITY.HIGH: return '#fc5c7d';
      case TASK_PRIORITY.MEDIUM: return '#6a82fb';
      case TASK_PRIORITY.LOW: return '#4C9AFF';
      case TASK_PRIORITY.LOWEST: return '#a0aec0';
      default: return '#6a82fb';
    }
  }};
  transition: transform 0.18s, box-shadow 0.18s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px) scale(1.025);
    box-shadow: 0 8px 32px rgba(252,92,125,0.13);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
`;

const TaskTypeIcon = styled.span`
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  margin-right: 0.7rem;
  font-size: 1.1rem;
  border-radius: 50%;
  background: ${({ type }) => {
    switch(type) {
      case TASK_TYPE.BUG: return 'linear-gradient(135deg,#fc5c7d 0%,#fbc2eb 100%)';
      case TASK_TYPE.STORY: return 'linear-gradient(135deg,#4C9AFF 0%,#6a82fb 100%)';
      case TASK_TYPE.EPIC: return 'linear-gradient(135deg,#e0c3fc 0%,#8ec5fc 100%)';
      default: return 'linear-gradient(135deg,#e0e7ff 0%,#fbc2eb 100%)';
    }
  }};
  color: #fff;
`;

const TaskId = styled.span`
  font-size: 12px;
  color: #6a82fb;
  font-family: monospace;
  font-weight: 600;
`;

const TaskPriority = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ priority }) => {
    switch(priority) {
      case TASK_PRIORITY.HIGHEST: return '#fc5c7d';
      case TASK_PRIORITY.HIGH: return '#fc5c7d';
      case TASK_PRIORITY.MEDIUM: return '#6a82fb';
      case TASK_PRIORITY.LOW: return '#4C9AFF';
      case TASK_PRIORITY.LOWEST: return '#a0aec0';
      default: return '#6a82fb';
    }
  }};
  background: ${({ priority }) => {
    switch(priority) {
      case TASK_PRIORITY.HIGHEST: return 'rgba(252,92,125,0.08)';
      case TASK_PRIORITY.HIGH: return 'rgba(252,92,125,0.06)';
      case TASK_PRIORITY.MEDIUM: return 'rgba(106,130,251,0.08)';
      case TASK_PRIORITY.LOW: return 'rgba(76,154,255,0.08)';
      case TASK_PRIORITY.LOWEST: return 'rgba(160,174,192,0.08)';
      default: return 'rgba(106,130,251,0.08)';
    }
  }};
  border-radius: 1rem;
  padding: 0.2rem 0.7rem;
`;

const TaskTitle = styled.h4`
  font-size: 1.08rem;
  font-weight: 600;
  margin: 0.3rem 0 1.1rem 0;
  color: #232526;
  word-break: break-word;
  letter-spacing: 0.1px;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #6a82fb;
`;

const AssigneeChip = styled.div`
  display: flex;
  align-items: center;
`;

const AssigneeAvatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(106,130,251,0.10);
`;

const getTaskIcon = (type) => {
  switch(type) {
    case TASK_TYPE.BUG: return '🐞';
    case TASK_TYPE.STORY: return '📖';
    case TASK_TYPE.EPIC: return '🌟';
    default: return '📋';
  }
};

const getPriorityText = (priority) => {
  switch(priority) {
    case TASK_PRIORITY.HIGHEST: return 'Highest';
    case TASK_PRIORITY.HIGH: return 'High';
    case TASK_PRIORITY.MEDIUM: return 'Medium';
    case TASK_PRIORITY.LOW: return 'Low';
    case TASK_PRIORITY.LOWEST: return 'Lowest';
    default: return 'Medium';
  }
};

const TaskCard = ({ task, onClick }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card priority={task.priority} onClick={onClick} className="card-appear">
      <TaskHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TaskTypeIcon type={task.type}>
            {getTaskIcon(task.type)}
          </TaskTypeIcon>
          <TaskId>{task.id}</TaskId>
        </div>
        <TaskPriority priority={task.priority}>
          {getPriorityText(task.priority)}
        </TaskPriority>
      </TaskHeader>
      
      <TaskTitle>{task.title}</TaskTitle>
      
      <TaskFooter>
        {task.assignee ? (
          <AssigneeChip>
            <AssigneeAvatar>
              {getInitials(task.assignee.name)}
            </AssigneeAvatar>
            {task.assignee.name}
          </AssigneeChip>
        ) : (
          <span style={{ color: '#a0aec0' }}>Unassigned</span>
        )}
        
        {task.dueDate && (
          <span style={{ color: '#414345' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </TaskFooter>
    </Card>
  );
};

export default TaskCard;