import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Cloud,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Timer,
  Webhook,
  GitBranch,
  RefreshCw,
  Shield,
  BarChart3,
  Play,
  Mail,
  Database,
  FileText,
  Calendar,
  MessageSquare,
  Globe,
  Plus,
  Copy,
  Trash2,
  MousePointer2,
  Bell,
  Share2,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const triggerTypes = [
  {
    icon: Zap,
    title: 'Instant Triggers',
    description: 'React immediately when events happen—new emails, file uploads, form submissions, and more.',
    color: '#ed8936',
  },
  {
    icon: Timer,
    title: 'Scheduled Triggers',
    description: 'Run flows on a schedule—hourly, daily, weekly, or with custom cron expressions.',
    color: '#3182ce',
  },
  {
    icon: Webhook,
    title: 'Webhook Triggers',
    description: 'Accept incoming HTTP requests from any external system with custom webhooks.',
    color: '#805ad5',
  },
];

const capabilities = [
  {
    icon: GitBranch,
    title: 'Conditional Logic',
    description: 'Add if/else conditions, switches, and complex branching to handle any scenario.',
  },
  {
    icon: RefreshCw,
    title: 'Loops & Arrays',
    description: 'Process collections of items with for-each loops and array operations.',
  },
  {
    icon: Shield,
    title: 'Error Handling',
    description: 'Configure retry policies, catch errors, and ensure flows complete reliably.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Monitor flow performance, track runs, and identify optimization opportunities.',
  },
];

const connectors = [
  { icon: Mail, name: 'Office 365', category: 'Productivity' },
  { icon: Database, name: 'Salesforce', category: 'CRM' },
  { icon: FileText, name: 'SharePoint', category: 'Storage' },
  { icon: Calendar, name: 'Google Calendar', category: 'Calendar' },
  { icon: MessageSquare, name: 'Slack', category: 'Communication' },
  { icon: Globe, name: 'REST APIs', category: 'Custom' },
];

const useCases = [
  {
    title: 'Approval Workflows',
    description: 'Route documents for approval, track status, send reminders automatically.',
    steps: ['Document submitted', 'Manager notified', 'Approval recorded', 'Requester updated'],
  },
  {
    title: 'Data Synchronization',
    description: 'Keep data consistent across multiple systems without manual updates.',
    steps: ['CRM updated', 'Data validated', 'ERP synced', 'Report generated'],
  },
  {
    title: 'Lead Management',
    description: 'Capture leads from multiple sources and route them to sales teams.',
    steps: ['Form submitted', 'Lead enriched', 'Assigned to rep', 'Follow-up scheduled'],
  },
];

// Connector logos for the badge
const connectorLogos = [
  { name: 'Microsoft', color: '#00a4ef', icon: Layers },
  { name: 'Salesforce', color: '#00a1e0', icon: Cloud },
  { name: 'SAP', color: '#0faaff', icon: Database },
  { name: 'Slack', color: '#4a154b', icon: MessageSquare },
  { name: 'Google', color: '#4285f4', icon: Globe },
  { name: 'Dropbox', color: '#0061fe', icon: FileText },
];

// Animated Flow Line Component with pulsing data dots
function AnimatedFlowLine({ 
  startX, 
  startY, 
  endX, 
  endY, 
  delay = 0,
  color = '#0078d4',
  curved = false,
  curveDirection = 'right'
}: { 
  startX: number; 
  startY: number; 
  endX: number; 
  endY: number; 
  delay?: number;
  color?: string;
  curved?: boolean;
  curveDirection?: 'left' | 'right';
}) {
  const midY = (startY + endY) / 2;
  const curveOffset = curveDirection === 'right' ? 40 : -40;
  
  const path = curved 
    ? `M ${startX} ${startY} Q ${startX + curveOffset} ${midY} ${endX} ${endY}`
    : `M ${startX} ${startY} L ${endX} ${endY}`;

  return (
    <g>
      {/* Base line */}
      <motion.path
        d={path}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeOpacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay }}
      />
      {/* Glowing line */}
      <motion.path
        d={path}
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay }}
      />
      {/* Animated data dot */}
      <motion.circle
        r="4"
        fill={color}
        filter="url(#glow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.8 }}
      >
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={path}
          begin={`${delay + 1}s`}
        />
      </motion.circle>
    </g>
  );
}

// Node Component
function WorkflowNode({
  x,
  y,
  type,
  label,
  sublabel,
  icon: Icon,
  color,
  delay,
  isHovered,
  onHover,
  width = 180,
  height = 60
}: {
  x: number;
  y: number;
  type: 'trigger' | 'action' | 'condition' | 'connector';
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  color: string;
  delay: number;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  width?: number;
  height?: number;
}) {
  const isCondition = type === 'condition';
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 200 }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{ cursor: 'pointer' }}
    >
      {isCondition ? (
        // Diamond shape for conditions
        <g>
          <motion.path
            d={`M ${x} ${y - 35} L ${x + 50} ${y} L ${x} ${y + 35} L ${x - 50} ${y} Z`}
            fill="#1a1a2e"
            stroke={color}
            strokeWidth={isHovered ? 3 : 2}
            filter={isHovered ? 'url(#glow-strong)' : undefined}
            animate={{ 
              strokeWidth: isHovered ? 3 : 2,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.path
            d={`M ${x} ${y - 35} L ${x + 50} ${y} L ${x} ${y + 35} L ${x - 50} ${y} Z`}
            fill={`${color}15`}
            stroke="none"
          />
          {/* Icon in diamond */}
          <foreignObject x={x - 12} y={y - 12} width={24} height={24}>
            <div className="flex items-center justify-center w-full h-full">
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </foreignObject>
          {/* Label below diamond */}
          <text x={x} y={y + 55} textAnchor="middle" fill="white" fontSize="11" fontWeight="500">
            {label}
          </text>
          {/* Yes/No labels */}
          <text x={x + 65} y={y + 5} textAnchor="start" fill="#22c55e" fontSize="10" fontWeight="600">
            Yes
          </text>
          <text x={x - 65} y={y + 5} textAnchor="end" fill="#ef4444" fontSize="10" fontWeight="600">
            No
          </text>
        </g>
      ) : (
        // Regular rectangular node
        <g>
          {/* Shadow */}
          <motion.rect
            x={x - width/2 + 4}
            y={y - height/2 + 4}
            width={width}
            height={height}
            rx={12}
            fill="rgba(0,0,0,0.3)"
            animate={{ 
              y: isHovered ? y - height/2 + 2 : y - height/2 + 4,
            }}
            transition={{ duration: 0.2 }}
          />
          {/* Main card */}
          <motion.rect
            x={x - width/2}
            y={y - height/2}
            width={width}
            height={height}
            rx={12}
            fill="#1a1a2e"
            stroke={color}
            strokeWidth={isHovered ? 3 : 2}
            filter={isHovered ? 'url(#glow-strong)' : undefined}
            animate={{ 
              y: isHovered ? y - height/2 - 2 : y - height/2,
              strokeWidth: isHovered ? 3 : 2,
            }}
            transition={{ duration: 0.2 }}
          />
          {/* Color accent bar */}
          <motion.rect
            x={x - width/2}
            y={y - height/2}
            width={width}
            height={height}
            rx={12}
            fill={`${color}10`}
            animate={{ 
              y: isHovered ? y - height/2 - 2 : y - height/2,
            }}
            transition={{ duration: 0.2 }}
          />
          {/* Left color stripe */}
          <motion.rect
            x={x - width/2}
            y={y - height/2}
            width={5}
            height={height}
            rx={2}
            fill={color}
            animate={{ 
              y: isHovered ? y - height/2 - 2 : y - height/2,
            }}
            transition={{ duration: 0.2 }}
          />
          {/* Icon circle */}
          <motion.circle
            cx={x - width/2 + 35}
            cy={y}
            r={18}
            fill={color}
            animate={{ 
              cy: isHovered ? y - 2 : y,
            }}
            transition={{ duration: 0.2 }}
          />
          <foreignObject x={x - width/2 + 23} y={y - 12} width={24} height={24}>
            <motion.div 
              className="flex items-center justify-center w-full h-full"
              animate={{ y: isHovered ? -2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
          </foreignObject>
          {/* Labels */}
          <motion.g
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <text x={x - width/2 + 60} y={sublabel ? y - 4 : y + 4} fill="white" fontSize="12" fontWeight="600">
              {label}
            </text>
            {sublabel && (
              <text x={x - width/2 + 60} y={y + 12} fill="rgba(255,255,255,0.5)" fontSize="10">
                {sublabel}
              </text>
            )}
          </motion.g>
          {/* Type badge */}
          <motion.g
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <rect 
              x={x + width/2 - 55} 
              y={y - 10} 
              width={45} 
              height={20} 
              rx={10} 
              fill={`${color}30`}
            />
            <text 
              x={x + width/2 - 32} 
              y={y + 4} 
              textAnchor="middle" 
              fill={color} 
              fontSize="8" 
              fontWeight="600"
              style={{ textTransform: 'uppercase' }}
            >
              {type}
            </text>
          </motion.g>
        </g>
      )}
    </motion.g>
  );
}

// Parallel Branch Indicator
function ParallelBranchIndicator({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <rect x={x - 60} y={y - 12} width={120} height={24} rx={12} fill="#1a1a2e" stroke="#6366f1" strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="500">
        ⚡ Parallel Branch
      </text>
    </motion.g>
  );
}

// 500+ Connectors Badge
function ConnectorsBadge() {
  return (
    <motion.div
      className="absolute -right-1 top-4 z-10 hidden xl:block"
      initial={{ opacity: 0, x: 20, rotate: 5 }}
      animate={{ opacity: 1, x: 0, rotate: 3 }}
      transition={{ delay: 1.5, duration: 0.6, type: 'spring' }}
    >
      <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl p-3 shadow-2xl shadow-green-500/30 border border-green-400/30">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">500+</span>
        </div>
        <div className="text-white/90 text-xs font-medium mb-3">Connectors</div>
        
        {/* Logo grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {connectorLogos.map((logo, i) => (
            <motion.div
              key={logo.name}
              className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + i * 0.1, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.3)' }}
              title={logo.name}
            >
              <logo.icon className="w-3.5 h-3.5 text-white" />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-2 text-[9px] text-white/70 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          & more...
        </motion.div>
      </div>
    </motion.div>
  );
}

// Main Workflow Builder Diagram - Portfolio-worthy version
function WorkflowBuilderDiagram() {
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Connectors Badge */}
      <ConnectorsBadge />
      
      <div className="bg-gradient-to-br from-[#0f0f23] via-[#1a1a35] to-[#0d1b2a] rounded-2xl lg:rounded-3xl p-1 border border-white/10 shadow-2xl shadow-blue-500/10 overflow-hidden">
        {/* Designer Header */}
        <div className="bg-gradient-to-r from-[#1e1e3f] to-[#2a2a4a] rounded-t-2xl px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <motion.div 
                className="w-3 h-3 rounded-full bg-red-500"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-yellow-500"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-green-500"
                whileHover={{ scale: 1.2 }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-white/80 text-sm font-semibold">Cloud Flow Designer</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1.5 border border-green-500/30"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Auto-saved
            </motion.div>
            <motion.button 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 text-xs font-medium transition-colors border border-blue-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-3.5 h-3.5" />
              Test
            </motion.button>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-[#0a0a1a] rounded-b-2xl relative overflow-hidden aspect-[5/4]">
          {/* Animated grid background */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
            {/* Radial glow in center */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
              }}
            />
          </div>

          {/* SVG Canvas for Workflow */}
          <svg 
            viewBox="0 0 500 400" 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Definitions */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Flow Lines - Draw these first so nodes appear on top */}
            {/* Trigger to Condition */}
            <AnimatedFlowLine startX={250} startY={75} endX={250} endY={140} delay={0.3} color="#3b82f6" />
            
            {/* Condition to Left Branch (No) */}
            <AnimatedFlowLine startX={200} startY={175} endX={120} endY={240} delay={0.8} color="#ef4444" curved curveDirection="left" />
            
            {/* Condition to Right Branch (Yes) */}
            <AnimatedFlowLine startX={300} startY={175} endX={380} endY={240} delay={0.8} color="#22c55e" curved curveDirection="right" />
            
            {/* Parallel Branch Connectors */}
            <AnimatedFlowLine startX={380} startY={270} endX={320} endY={310} delay={1.2} color="#8b5cf6" curved curveDirection="left" />
            <AnimatedFlowLine startX={380} startY={270} endX={440} endY={310} delay={1.2} color="#8b5cf6" curved curveDirection="right" />
            
            {/* Rejoin line from parallel */}
            <AnimatedFlowLine startX={320} startY={340} endX={250} endY={375} delay={1.6} color="#8b5cf6" curved curveDirection="left" />
            <AnimatedFlowLine startX={440} startY={340} endX={250} endY={375} delay={1.6} color="#8b5cf6" curved curveDirection="right" />
            
            {/* No branch to end */}
            <AnimatedFlowLine startX={120} startY={270} endX={120} endY={340} delay={1.3} color="#ef4444" />

            {/* NODES */}
            
            {/* Trigger Node - Email */}
            <WorkflowNode
              x={250}
              y={50}
              type="trigger"
              label="When email arrives"
              sublabel="Office 365 Outlook"
              icon={Mail}
              color="#3b82f6"
              delay={0}
              isHovered={hoveredNode === 'trigger'}
              onHover={(h) => setHoveredNode(h ? 'trigger' : null)}
            />

            {/* Condition Node - Diamond */}
            <WorkflowNode
              x={250}
              y={175}
              type="condition"
              label="Has Attachment?"
              icon={GitBranch}
              color="#f97316"
              delay={0.4}
              isHovered={hoveredNode === 'condition'}
              onHover={(h) => setHoveredNode(h ? 'condition' : null)}
            />

            {/* No Branch - Send notification */}
            <WorkflowNode
              x={120}
              y={255}
              type="action"
              label="Send notification"
              sublabel="Microsoft Teams"
              icon={Bell}
              color="#8b5cf6"
              delay={0.9}
              isHovered={hoveredNode === 'notify'}
              onHover={(h) => setHoveredNode(h ? 'notify' : null)}
              width={160}
              height={55}
            />

            {/* Yes Branch - SharePoint */}
            <WorkflowNode
              x={380}
              y={255}
              type="connector"
              label="Save to SharePoint"
              sublabel="Document Library"
              icon={FileText}
              color="#22c55e"
              delay={0.9}
              isHovered={hoveredNode === 'sharepoint'}
              onHover={(h) => setHoveredNode(h ? 'sharepoint' : null)}
              width={165}
              height={55}
            />

            {/* Parallel Branch Indicator */}
            <ParallelBranchIndicator x={380} y={295} delay={1.1} />

            {/* Parallel Node 1 - Teams */}
            <WorkflowNode
              x={320}
              y={340}
              type="action"
              label="Post to Teams"
              icon={MessageSquare}
              color="#8b5cf6"
              delay={1.3}
              isHovered={hoveredNode === 'teams'}
              onHover={(h) => setHoveredNode(h ? 'teams' : null)}
              width={130}
              height={45}
            />

            {/* Parallel Node 2 - Calendar */}
            <WorkflowNode
              x={440}
              y={340}
              type="action"
              label="Create event"
              icon={Calendar}
              color="#8b5cf6"
              delay={1.3}
              isHovered={hoveredNode === 'calendar'}
              onHover={(h) => setHoveredNode(h ? 'calendar' : null)}
              width={130}
              height={45}
            />

            {/* End notification node */}
            <WorkflowNode
              x={120}
              y={355}
              type="action"
              label="Log to database"
              icon={Database}
              color="#6366f1"
              delay={1.4}
              isHovered={hoveredNode === 'log'}
              onHover={(h) => setHoveredNode(h ? 'log' : null)}
              width={140}
              height={45}
            />

            {/* Final success indicator */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
            >
              <circle cx={250} cy={385} r={15} fill="#22c55e" filter="url(#glow)" />
              <foreignObject x={238} y={373} width={24} height={24}>
                <div className="flex items-center justify-center w-full h-full">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </foreignObject>
            </motion.g>
          </svg>

          {/* Floating cursor animation - uses percentage positioning to avoid layout shifts */}
          <motion.div
            className="absolute pointer-events-none z-10 hidden sm:block"
            style={{ left: '15%', top: '15%' }}
            initial={{ opacity: 0 }}
            animate={{ 
              left: ['15%', '40%', '70%', '40%', '15%'],
              top: ['15%', '35%', '55%', '75%', '15%'],
              opacity: [0, 1, 1, 1, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatDelay: 2 }}
          >
            <MousePointer2 
              className="w-5 h-5 text-white drop-shadow-xl" 
              style={{ 
                filter: 'drop-shadow(0 2px 10px rgba(59, 130, 246, 0.6))',
                transform: 'rotate(-15deg)'
              }} 
            />
          </motion.div>

          {/* Mini toolbar */}
          <motion.div
            className="absolute left-3 top-3 flex flex-col gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
          >
            {[
              { icon: Plus, tooltip: 'Add step' },
              { icon: Copy, tooltip: 'Duplicate' },
              { icon: Trash2, tooltip: 'Delete' },
            ].map((tool, i) => (
              <motion.button
                key={i}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white/80 transition-colors border border-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={tool.tooltip}
              >
                <tool.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </motion.div>

          {/* Zoom controls */}
          <motion.div
            className="absolute right-3 bottom-3 flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            <button className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors text-lg font-light">
              −
            </button>
            <span className="text-white/50 text-xs px-2">100%</span>
            <button className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors text-lg font-light">
              +
            </button>
          </motion.div>

          {/* Run history mini panel */}
          <motion.div
            className="absolute left-3 bottom-3 bg-white/5 rounded-lg p-2 border border-white/10 hidden sm:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
          >
            <div className="text-[10px] text-white/40 mb-1.5 font-medium">RECENT RUNS</div>
            <div className="space-y-1">
              {[
                { status: 'success', time: '2m ago' },
                { status: 'success', time: '1h ago' },
                { status: 'running', time: 'now' },
              ].map((run, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${
                      run.status === 'success' ? 'bg-green-500' : 
                      run.status === 'running' ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                    animate={run.status === 'running' ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-[10px] text-white/50">{run.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CloudFlowsPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0078d4] via-[#005a9e] to-[#00bcf2] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%` }}
            animate={{ 
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-medium mb-4 lg:mb-6">
                <Cloud className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-2" />
                CLOUD FLOWS
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                Connect apps.
                <span className="block text-[#ffc83d]">Automate everything.</span>
              </h1>
              <p className="text-base lg:text-xl text-white/90 mb-6 lg:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Build automated workflows between your favorite cloud services without writing code. 
                Trigger actions instantly, on schedule, or via webhooks.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
                <Link to="/signup">
                  <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#004578] font-semibold px-6 lg:px-8 w-full sm:w-auto">
                    Start Building Free
                    <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5" />
                  </Button>
                </Link>
                <Link to="/request-demo">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    <Play className="mr-2 w-4 h-4 lg:w-5 lg:h-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Mobile Flow Preview - Simple version for small screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:hidden mt-8"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <div className="bg-[#0f0f23] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="ml-auto text-xs text-white/40 font-medium">Cloud Flow Designer</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xs font-medium">When email arrives</div>
                        <div className="text-white/50 text-[10px]">Office 365</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-4 h-4 text-white/30 rotate-90" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                      <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center flex-shrink-0">
                        <GitBranch className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xs font-medium">Has Attachment?</div>
                        <div className="text-white/50 text-[10px]">Condition</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-4 h-4 text-white/30 rotate-90" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xs font-medium">Save to SharePoint</div>
                        <div className="text-white/50 text-[10px]">Action</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Desktop Workflow Builder Diagram - Full interactive version */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <WorkflowBuilderDiagram />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trigger Types */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 lg:mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Three Ways to Trigger</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start your flows exactly when you need them—instantly, on schedule, or via webhooks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {triggerTypes.map((trigger, index) => (
              <motion.div
                key={trigger.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: `${trigger.color}15` }}
                    >
                      <trigger.icon className="w-8 h-8" style={{ color: trigger.color }} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{trigger.title}</h3>
                    <p className="text-gray-600">{trigger.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Connectors */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 lg:mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">500+ Connectors</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect to virtually any app or service with our extensive library of pre-built connectors.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {connectors.map((connector, index) => (
              <motion.div
                key={connector.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-[#0078d4]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <connector.icon className="w-6 h-6 text-[#0078d4]" />
                </div>
                <div className="font-medium text-gray-900 text-sm">{connector.name}</div>
                <div className="text-xs text-gray-500 mt-1">{connector.category}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/connectors">
              <Button variant="outline" className="border-[#0078d4] text-[#0078d4] hover:bg-[#0078d4] hover:text-white">
                View All Connectors
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 lg:mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Build sophisticated workflows with enterprise-grade features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-[#0078d4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <capability.icon className="w-7 h-7 text-[#0078d4]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{capability.title}</h3>
                <p className="text-gray-600 text-sm">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 lg:mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Use Cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how teams are using Cloud Flows to automate their work.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                    <p className="text-gray-600 mb-6">{useCase.description}</p>
                    <div className="space-y-3">
                      {useCase.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#0078d4] text-white text-xs flex items-center justify-center font-medium">
                            {i + 1}
                          </div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-[#0078d4] to-[#00bcf2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 text-[#ffc83d] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Start automating in minutes
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Create your first Cloud Flow today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#004578] font-semibold px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore All Products
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
