import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { Inbox, Play, Eye, CheckCircle } from 'lucide-react';

const COLUMNS = [
  { id: 'backlog', title: 'BACKLOG', icon: Inbox, color: 'cyan' },
  { id: 'in-progress', title: 'IN PROGRESS', icon: Play, color: 'yellow' },
  { id: 'review', title: 'REVIEW', icon: Eye, color: 'purple' },
  { id: 'done', title: 'DONE', icon: CheckCircle, color: 'green' },
];

function KanbanBoard({ tasks, onTaskMove }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    if (result.source.droppableId !== newStatus) {
      onTaskMove(taskId, newStatus);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {COLUMNS.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Column 
              column={column} 
              tasks={getTasksByStatus(column.id)} 
            />
          </motion.div>
        ))}
      </div>
    </DragDropContext>
  );
}

function Column({ column, tasks }) {
  const Icon = column.icon;
  const colorClasses = {
    cyan: 'border-cyber-cyan/30 text-cyber-cyan',
    yellow: 'border-cyber-yellow/30 text-cyber-yellow',
    purple: 'border-cyber-purple/30 text-cyber-purple',
    green: 'border-cyber-green/30 text-cyber-green',
  };

  return (
    <div className="kanban-column rounded-lg overflow-hidden">
      {/* Column Header */}
      <div className={`kanban-column-header p-3 flex items-center justify-between ${colorClasses[column.color]}`}>
        <div className="flex items-center gap-2">
          <Icon size={16} />
          <span className="font-cyber text-sm tracking-wider">{column.title}</span>
        </div>
        <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded">
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 min-h-[350px] transition-colors ${
              snapshot.isDraggingOver ? 'drag-over' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'dragging' : ''}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-600 text-xs font-mono">
                NO TASKS
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanBoard;
