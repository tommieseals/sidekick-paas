import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, AlertCircle, Tag } from 'lucide-react';

function TaskCard({ task }) {
  const priorityIcon = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  const getTagClass = (tag) => {
    const tagClasses = {
      bug: 'tag-bug',
      feature: 'tag-feature',
      docs: 'tag-docs',
      ui: 'tag-ui',
      backend: 'tag-backend',
      refactor: 'tag-default',
      test: 'tag-default',
      devops: 'tag-default',
      security: 'tag-bug',
    };
    return tagClasses[tag] || 'tag-default';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`cyber-card rounded p-3 mb-2 relative priority-${task.priority}`}
    >
      {/* Priority Indicator */}
      <div className="absolute top-2 right-2 text-sm">
        {priorityIcon[task.priority]}
      </div>

      {/* Title */}
      <h3 className="font-medium text-sm text-white pr-6 mb-2">
        {task.title}
      </h3>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag, index) => (
            <span key={index} className={`tag ${getTagClass(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {task.assignee && (
          <div className="flex items-center gap-1">
            <User size={10} />
            <span>@{task.assignee}</span>
          </div>
        )}
        
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Hover effect line */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-cyan transition-all group-hover:w-full" />
    </motion.div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `${days} days`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default TaskCard;
