import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Database, Shield, Lock, Server, Globe, 
  Cpu, Zap, Users, ArrowRight, ChevronDown, 
  Workflow, Bot, Brain, Code2, Key, Eye,
  Layers, RefreshCw, CheckCircle2,
  Network, Boxes, Container, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Architecture diagram data
const architectureSections = [
  {
    id: 'platform',
    title: 'Platform Overview',
    subtitle: 'End-to-end automation architecture',
    icon: Layers,
    color: '#3182CE',
  },
  {
    id: 'ai-pipeline',
    title: 'AI/LLM Pipeline',
    subtitle: 'Intelligent processing engine',
    icon: Brain,
    color: '#9F7AEA',
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    subtitle: 'Request flow & authentication',
    icon: Network,
    color: '#38B2AC',
  },
  {
    id: 'workflow-engine',
    title: 'Workflow Engine',
    subtitle: 'Execution & orchestration',
    icon: Workflow,
    color: '#ED8936',
  },
  {
    id: 'integrations',
    title: 'Integration Layer',
    subtitle: '500+ connectors',
    icon: Boxes,
    color: '#E53E3E',
  },
  {
    id: 'security',
    title: 'Security Architecture',
    subtitle: 'Enterprise-grade protection',
    icon: Shield,
    color: '#48BB78',
  },
];

// Animated flowing line component
function FlowingLine({ 
  startX, startY, endX, endY, delay = 0, color = '#3182CE', curved = false 
}: { 
  startX: number; startY: number; endX: number; endY: number; delay?: number; color?: string; curved?: boolean;
}) {
  const midX = (startX + endX) / 2;
  const midY = curved ? Math.min(startY, endY) - 30 : (startY + endY) / 2;
  
  const pathD = curved 
    ? `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`
    : `M ${startX} ${startY} L ${endX} ${endY}`;

  return (
    <g>
      {/* Base line */}
      <path
        d={pathD}
        fill="none"
        stroke={`${color}30`}
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      {/* Animated flowing particles */}
      <motion.circle
        r="4"
        fill={color}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: 2,
          delay,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path("${pathD}")`,
        }}
      >
        <animate
          attributeName="r"
          values="3;5;3"
          dur="2s"
          repeatCount="indefinite"
        />
      </motion.circle>
    </g>
  );
}

// Interactive node component
function ArchitectureNode({
  x, y, width, height, title, subtitle, icon: Icon, color, delay = 0, onClick, isActive = false, small = false
}: {
  x: number; y: number; width: number; height: number; title: string; subtitle?: string;
  icon: React.ComponentType<{ className?: string }>; color: string; delay?: number;
  onClick?: () => void; isActive?: boolean; small?: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {/* Glow effect for active state */}
      {isActive && (
        <motion.rect
          x={x - 4}
          y={y - 4}
          width={width + 8}
          height={height + 8}
          rx={small ? 10 : 14}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Main box */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={small ? 8 : 12}
        fill="white"
        stroke={isActive ? color : '#E2E8F0'}
        strokeWidth={isActive ? 2 : 1}
        filter="url(#shadow)"
      />
      
      {/* Gradient header */}
      <rect
        x={x}
        y={y}
        width={width}
        height={small ? 6 : 8}
        rx={small ? 8 : 12}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      
      {/* Icon background */}
      <circle
        cx={x + width / 2}
        cy={y + (small ? 25 : 35)}
        r={small ? 16 : 22}
        fill={`${color}15`}
      />
      
      {/* Icon placeholder (using foreignObject for React icons) */}
      <foreignObject x={x + width / 2 - (small ? 10 : 14)} y={y + (small ? 11 : 13)} width={small ? 20 : 28} height={small ? 28 : 44}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color }}>
          <Icon className={`${small ? 'w-4 h-4' : 'w-6 h-6'}`} />
        </div>
      </foreignObject>
      
      {/* Title */}
      <text
        x={x + width / 2}
        y={y + (small ? 50 : 70)}
        textAnchor="middle"
        fill="#1A202C"
        fontSize={small ? 10 : 13}
        fontWeight="600"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {title}
      </text>
      
      {/* Subtitle */}
      {subtitle && !small && (
        <text
          x={x + width / 2}
          y={y + 88}
          textAnchor="middle"
          fill="#718096"
          fontSize="10"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {subtitle}
        </text>
      )}
    </motion.g>
  );
}

// Platform Overview Diagram
function PlatformOverviewDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 500" className="w-full min-w-[700px] h-auto">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
          </filter>
          <linearGradient id="gradient-3182CE" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3182CE" />
            <stop offset="100%" stopColor="#63B3ED" />
          </linearGradient>
          <linearGradient id="gradient-9F7AEA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9F7AEA" />
            <stop offset="100%" stopColor="#B794F4" />
          </linearGradient>
          <linearGradient id="gradient-ED8936" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ED8936" />
            <stop offset="100%" stopColor="#F6AD55" />
          </linearGradient>
          <linearGradient id="gradient-48BB78" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#48BB78" />
            <stop offset="100%" stopColor="#68D391" />
          </linearGradient>
          <linearGradient id="gradient-E53E3E" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E53E3E" />
            <stop offset="100%" stopColor="#FC8181" />
          </linearGradient>
          <linearGradient id="gradient-38B2AC" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38B2AC" />
            <stop offset="100%" stopColor="#4FD1C5" />
          </linearGradient>
        </defs>

        {isInView && (
          <>
            {/* Users Layer */}
            <ArchitectureNode x={50} y={30} width={120} height={80} title="Web Users" icon={Users} color="#3182CE" delay={0} />
            <ArchitectureNode x={200} y={30} width={120} height={80} title="Mobile Users" icon={Globe} color="#3182CE" delay={0.1} />
            <ArchitectureNode x={350} y={30} width={120} height={80} title="API Clients" icon={Code2} color="#3182CE" delay={0.2} />

            {/* Connections to API Gateway */}
            <FlowingLine startX={110} startY={110} endX={320} endY={180} delay={0.5} color="#3182CE" />
            <FlowingLine startX={260} startY={110} endX={350} endY={180} delay={0.6} color="#3182CE" />
            <FlowingLine startX={410} startY={110} endX={380} endY={180} delay={0.7} color="#3182CE" />

            {/* API Gateway Layer */}
            <ArchitectureNode x={270} y={180} width={180} height={90} title="API Gateway" subtitle="Auth • Rate Limit • Route" icon={Network} color="#38B2AC" delay={0.3} />

            {/* Connection to Orchestration */}
            <FlowingLine startX={360} startY={270} endX={360} endY={320} delay={0.9} color="#38B2AC" />

            {/* Orchestration Layer */}
            <ArchitectureNode x={270} y={320} width={180} height={90} title="Orchestration Layer" subtitle="Workflow • Events • Queue" icon={Workflow} color="#ED8936" delay={0.4} />

            {/* Processing Services */}
            <ArchitectureNode x={50} y={320} width={140} height={80} title="AI Engine" icon={Brain} color="#9F7AEA" delay={0.5} />
            <FlowingLine startX={270} startY={360} endX={190} endY={360} delay={1.1} color="#9F7AEA" />

            <ArchitectureNode x={530} y={320} width={140} height={80} title="RPA Engine" icon={Bot} color="#E53E3E" delay={0.6} />
            <FlowingLine startX={450} startY={360} endX={530} endY={360} delay={1.2} color="#E53E3E" />

            {/* Connections to Data Layer */}
            <FlowingLine startX={120} startY={400} endX={200} endY={440} delay={1.3} color="#9F7AEA" />
            <FlowingLine startX={360} startY={410} endX={360} endY={440} delay={1.4} color="#ED8936" />
            <FlowingLine startX={600} startY={400} endX={520} endY={440} delay={1.5} color="#E53E3E" />

            {/* Data Layer */}
            <ArchitectureNode x={150} y={440} width={140} height={55} title="Document Store" icon={Database} color="#48BB78" delay={0.7} small />
            <ArchitectureNode x={310} y={440} width={140} height={55} title="Time-Series DB" icon={Activity} color="#48BB78" delay={0.8} small />
            <ArchitectureNode x={470} y={440} width={140} height={55} title="Cache Layer" icon={Zap} color="#48BB78" delay={0.9} small />

            {/* Integration Layer (right side) */}
            <rect x={700} y={150} width={170} height={300} rx={16} fill="#F7FAFC" stroke="#E2E8F0" strokeWidth={1} />
            <text x={785} y={175} textAnchor="middle" fill="#4A5568" fontSize="12" fontWeight="600">Integrations</text>
            
            {['Salesforce', 'SAP', 'Microsoft', 'Slack', 'Oracle'].map((name, i) => (
              <g key={name}>
                <rect x={720} y={195 + i * 48} width={130} height={38} rx={8} fill="white" stroke="#E2E8F0" />
                <text x={785} y={220 + i * 48} textAnchor="middle" fill="#4A5568" fontSize="11">{name}</text>
              </g>
            ))}

            {/* Connections to Integrations */}
            <FlowingLine startX={450} startY={230} endX={700} endY={230} delay={1.6} color="#38B2AC" />
            <FlowingLine startX={450} startY={360} endX={700} endY={320} delay={1.7} color="#ED8936" />
          </>
        )}
      </svg>
    </div>
  );
}

// AI/LLM Pipeline Diagram
function AIPipelineDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const pipelineSteps = [
    { title: 'Input', subtitle: 'Documents, Text, Images', icon: Layers, color: '#3182CE' },
    { title: 'Preprocessing', subtitle: 'OCR, Extraction, Normalization', icon: RefreshCw, color: '#38B2AC' },
    { title: 'LLM Processing', subtitle: 'GPT-4, Claude, Custom Models', icon: Brain, color: '#9F7AEA' },
    { title: 'Validation', subtitle: 'Confidence Scoring, QA', icon: CheckCircle2, color: '#48BB78' },
    { title: 'Output', subtitle: 'Structured Data, Actions', icon: Zap, color: '#ED8936' },
  ];

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 350" className="w-full min-w-[700px] h-auto">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
          </filter>
        </defs>

        {isInView && (
          <>
            {/* Pipeline steps */}
            {pipelineSteps.map((step, i) => (
              <g key={step.title}>
                <ArchitectureNode
                  x={50 + i * 170}
                  y={100}
                  width={140}
                  height={100}
                  title={step.title}
                  subtitle={step.subtitle}
                  icon={step.icon}
                  color={step.color}
                  delay={i * 0.15}
                />
                {i < pipelineSteps.length - 1 && (
                  <FlowingLine
                    startX={190 + i * 170}
                    startY={150}
                    endX={220 + i * 170}
                    endY={150}
                    delay={0.5 + i * 0.2}
                    color={step.color}
                  />
                )}
              </g>
            ))}

            {/* Model Selection Box */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <rect x={320} y={240} width={260} height={90} rx={12} fill="#F7FAFC" stroke="#9F7AEA" strokeWidth={2} strokeDasharray="4,4" />
              <text x={450} y={265} textAnchor="middle" fill="#553C9A" fontSize="12" fontWeight="600">Available Models</text>
              
              {['GPT-4 Turbo', 'Claude 3 Opus', 'Custom Fine-tuned'].map((model, i) => (
                <g key={model}>
                  <rect x={340 + i * 78} y={280} width={70} height={35} rx={6} fill="white" stroke="#9F7AEA30" />
                  <text x={375 + i * 78} y={302} textAnchor="middle" fill="#553C9A" fontSize="9">{model}</text>
                </g>
              ))}
            </motion.g>

            {/* Metrics panel */}
            <motion.g
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <rect x={720} y={80} width={150} height={140} rx={12} fill="white" stroke="#E2E8F0" filter="url(#shadow)" />
              <rect x={720} y={80} width={150} height={8} rx={12} fill="url(#gradient-48BB78)" />
              <text x={795} y={110} textAnchor="middle" fill="#1A202C" fontSize="12" fontWeight="600">Live Metrics</text>
              
              {[
                { label: 'Accuracy', value: '99.2%' },
                { label: 'Latency', value: '120ms' },
                { label: 'Throughput', value: '1.2k/min' },
              ].map((metric, i) => (
                <g key={metric.label}>
                  <text x={735} y={140 + i * 30} fill="#718096" fontSize="10">{metric.label}</text>
                  <text x={855} y={140 + i * 30} textAnchor="end" fill="#1A202C" fontSize="11" fontWeight="600">{metric.value}</text>
                </g>
              ))}
            </motion.g>
          </>
        )}
      </svg>
    </div>
  );
}

// API Gateway Architecture Diagram
function APIGatewayDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 400" className="w-full min-w-[700px] h-auto">
        {isInView && (
          <>
            {/* Incoming Requests */}
            <motion.g
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <text x={50} y={45} fill="#4A5568" fontSize="11" fontWeight="600">INCOMING REQUESTS</text>
              {['REST API', 'GraphQL', 'WebSocket', 'gRPC'].map((type, i) => (
                <g key={type}>
                  <rect x={30} y={55 + i * 45} width={100} height={35} rx={8} fill="white" stroke="#3182CE" strokeWidth={1.5} />
                  <text x={80} y={78 + i * 45} textAnchor="middle" fill="#3182CE" fontSize="11" fontWeight="500">{type}</text>
                </g>
              ))}
            </motion.g>

            {/* Flow lines to gateway */}
            {[0, 1, 2, 3].map((i) => (
              <FlowingLine key={i} startX={130} startY={73 + i * 45} endX={200} endY={200} delay={0.3 + i * 0.1} color="#3182CE" />
            ))}

            {/* API Gateway Core */}
            <motion.g
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <rect x={200} y={100} width={200} height={200} rx={16} fill="white" stroke="#38B2AC" strokeWidth={2} filter="url(#shadow)" />
              <rect x={200} y={100} width={200} height={10} rx={16} fill="url(#gradient-38B2AC)" />
              
              <text x={300} y={135} textAnchor="middle" fill="#234E52" fontSize="14" fontWeight="700">API Gateway</text>
              
              {/* Gateway components */}
              {[
                { label: 'Authentication', y: 160 },
                { label: 'Rate Limiting', y: 190 },
                { label: 'Load Balancing', y: 220 },
                { label: 'Request Transform', y: 250 },
                { label: 'Caching', y: 280 },
              ].map((item) => (
                <g key={item.label}>
                  <rect x={215} y={item.y - 15} width={170} height={25} rx={6} fill="#38B2AC10" />
                  <text x={300} y={item.y + 2} textAnchor="middle" fill="#234E52" fontSize="11">{item.label}</text>
                </g>
              ))}
            </motion.g>

            {/* Flow to services */}
            <FlowingLine startX={400} startY={150} endX={500} endY={100} delay={0.8} color="#38B2AC" />
            <FlowingLine startX={400} startY={200} endX={500} endY={200} delay={0.9} color="#38B2AC" />
            <FlowingLine startX={400} startY={250} endX={500} endY={300} delay={1.0} color="#38B2AC" />

            {/* Backend Services */}
            <motion.g
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <text x={500} y={45} fill="#4A5568" fontSize="11" fontWeight="600">MICROSERVICES</text>
              
              <ArchitectureNode x={500} y={60} width={130} height={70} title="Auth Service" icon={Key} color="#9F7AEA" delay={0.7} small />
              <ArchitectureNode x={500} y={160} width={130} height={70} title="Workflow Service" icon={Workflow} color="#ED8936" delay={0.8} small />
              <ArchitectureNode x={500} y={260} width={130} height={70} title="Data Service" icon={Database} color="#48BB78" delay={0.9} small />
            </motion.g>

            {/* Security Layer */}
            <motion.g
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <rect x={680} y={80} width={180} height={240} rx={12} fill="#FFF5F5" stroke="#E53E3E" strokeDasharray="4,4" />
              <text x={770} y={105} textAnchor="middle" fill="#C53030" fontSize="12" fontWeight="600">Security Layer</text>
              
              {[
                { icon: Shield, label: 'WAF Protection' },
                { icon: Lock, label: 'TLS 1.3 Encryption' },
                { icon: Eye, label: 'DDoS Mitigation' },
                { icon: Key, label: 'OAuth 2.0 / OIDC' },
              ].map((item, i) => (
                <g key={item.label}>
                  <rect x={700} y={120 + i * 48} width={140} height={38} rx={8} fill="white" stroke="#FC818130" />
                  <foreignObject x={708} y={127 + i * 48} width={24} height={24}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <item.icon className="w-4 h-4" style={{ color: '#C53030' }} />
                    </div>
                  </foreignObject>
                  <text x={770} y={144 + i * 48} fill="#742A2A" fontSize="10">{item.label}</text>
                </g>
              ))}
            </motion.g>

            {/* Connections */}
            <FlowingLine startX={630} startY={200} endX={680} endY={200} delay={1.1} color="#E53E3E" />
          </>
        )}
      </svg>
    </div>
  );
}

// Workflow Engine Diagram
function WorkflowEngineDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 420" className="w-full min-w-[700px] h-auto">
        {isInView && (
          <>
            {/* Trigger Types */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <text x={100} y={30} textAnchor="middle" fill="#4A5568" fontSize="11" fontWeight="600">TRIGGERS</text>
              
              {[
                { label: 'Scheduled', color: '#3182CE' },
                { label: 'Event-Based', color: '#9F7AEA' },
                { label: 'Manual', color: '#48BB78' },
                { label: 'API Webhook', color: '#ED8936' },
              ].map((trigger, i) => (
                <g key={trigger.label}>
                  <motion.rect
                    x={40}
                    y={45 + i * 50}
                    width={120}
                    height={40}
                    rx={20}
                    fill={`${trigger.color}15`}
                    stroke={trigger.color}
                    strokeWidth={1.5}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                  <text x={100} y={70 + i * 50} textAnchor="middle" fill={trigger.color} fontSize="11" fontWeight="500">{trigger.label}</text>
                </g>
              ))}
            </motion.g>

            {/* Flow to Engine */}
            {[0, 1, 2, 3].map((i) => (
              <FlowingLine key={i} startX={160} startY={65 + i * 50} endX={230} endY={180} delay={0.4 + i * 0.1} color="#ED8936" />
            ))}

            {/* Workflow Engine Core */}
            <motion.g
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <rect x={230} y={50} width={260} height={280} rx={16} fill="white" stroke="#ED8936" strokeWidth={2} filter="url(#shadow)" />
              <rect x={230} y={50} width={260} height={10} rx={16} fill="url(#gradient-ED8936)" />
              
              <text x={360} y={85} textAnchor="middle" fill="#C05621" fontSize="14" fontWeight="700">Workflow Engine</text>

              {/* Workflow steps visualization */}
              <g>
                {/* Step nodes */}
                {[
                  { x: 280, y: 110, label: 'Start', color: '#48BB78' },
                  { x: 380, y: 110, label: 'Action 1', color: '#3182CE' },
                  { x: 280, y: 180, label: 'Condition', color: '#9F7AEA' },
                  { x: 380, y: 180, label: 'Action 2', color: '#3182CE' },
                  { x: 330, y: 250, label: 'End', color: '#E53E3E' },
                ].map((node, i) => (
                  <motion.g 
                    key={node.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <circle cx={node.x} cy={node.y} r={25} fill={`${node.color}20`} stroke={node.color} strokeWidth={1.5} />
                    <text x={node.x} y={node.y + 4} textAnchor="middle" fill={node.color} fontSize="9" fontWeight="500">{node.label}</text>
                  </motion.g>
                ))}

                {/* Connecting lines */}
                <motion.path d="M 305 110 L 355 110" stroke="#718096" strokeWidth={1.5} strokeDasharray="3,3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.8 }} />
                <motion.path d="M 280 135 L 280 155" stroke="#718096" strokeWidth={1.5} strokeDasharray="3,3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.9 }} />
                <motion.path d="M 305 180 L 355 180" stroke="#718096" strokeWidth={1.5} strokeDasharray="3,3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1 }} />
                <motion.path d="M 330 205 L 330 225" stroke="#718096" strokeWidth={1.5} strokeDasharray="3,3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.1 }} />
              </g>

              {/* Engine features */}
              <rect x={250} y={290} width={220} height={30} rx={6} fill="#ED893610" />
              <text x={360} y={310} textAnchor="middle" fill="#C05621" fontSize="10">Parallel • Retry • Error Handling</text>
            </motion.g>

            {/* Flow to outputs */}
            <FlowingLine startX={490} startY={120} endX={560} endY={80} delay={1.2} color="#ED8936" />
            <FlowingLine startX={490} startY={190} endX={560} endY={190} delay={1.3} color="#ED8936" />
            <FlowingLine startX={490} startY={260} endX={560} endY={300} delay={1.4} color="#ED8936" />

            {/* Action Types */}
            <motion.g
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <text x={680} y={30} textAnchor="middle" fill="#4A5568" fontSize="11" fontWeight="600">ACTIONS</text>
              
              <ArchitectureNode x={560} y={45} width={130} height={65} title="Send Email" icon={Globe} color="#3182CE" delay={1} small />
              <ArchitectureNode x={560} y={140} width={130} height={65} title="Update CRM" icon={Database} color="#48BB78" delay={1.1} small />
              <ArchitectureNode x={560} y={235} width={130} height={65} title="Call API" icon={Code2} color="#9F7AEA" delay={1.2} small />
              <ArchitectureNode x={560} y={330} width={130} height={65} title="Run Script" icon={Container} color="#E53E3E" delay={1.3} small />
            </motion.g>

            {/* Monitoring Panel */}
            <motion.g
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <rect x={730} y={100} width={150} height={200} rx={12} fill="white" stroke="#E2E8F0" filter="url(#shadow)" />
              <rect x={730} y={100} width={150} height={8} rx={12} fill="url(#gradient-ED8936)" />
              <text x={805} y={130} textAnchor="middle" fill="#1A202C" fontSize="12" fontWeight="600">Execution Stats</text>
              
              {[
                { label: 'Running', value: '24', color: '#48BB78' },
                { label: 'Completed', value: '1,847', color: '#3182CE' },
                { label: 'Failed', value: '3', color: '#E53E3E' },
                { label: 'Avg Duration', value: '2.4s', color: '#9F7AEA' },
              ].map((stat, i) => (
                <g key={stat.label}>
                  <circle cx={755} y={160 + i * 35} r={4} fill={stat.color} />
                  <text x={765} y={163 + i * 35} fill="#718096" fontSize="10">{stat.label}</text>
                  <text x={865} y={163 + i * 35} textAnchor="end" fill={stat.color} fontSize="11" fontWeight="600">{stat.value}</text>
                </g>
              ))}
            </motion.g>
          </>
        )}
      </svg>
    </div>
  );
}

// Integration Layer Diagram
function IntegrationLayerDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const integrations = [
    { name: 'Salesforce', category: 'CRM', color: '#00A1E0' },
    { name: 'SAP', category: 'ERP', color: '#0FAAFF' },
    { name: 'Microsoft 365', category: 'Productivity', color: '#D83B01' },
    { name: 'Slack', category: 'Communication', color: '#4A154B' },
    { name: 'Oracle', category: 'Database', color: '#F80000' },
    { name: 'ServiceNow', category: 'ITSM', color: '#81B5A1' },
  ];

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 400" className="w-full min-w-[700px] h-auto">
        {isInView && (
          <>
            {/* Central Integration Hub */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <circle cx={450} cy={200} r={80} fill="url(#gradient-E53E3E)" />
              <circle cx={450} cy={200} r={65} fill="white" />
              <foreignObject x={420} y={170} width={60} height={60}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Boxes className="w-10 h-10 text-[#E53E3E]" />
                </div>
              </foreignObject>
              <text x={450} y={215} textAnchor="middle" fill="#C53030" fontSize="11" fontWeight="600">Integration</text>
              <text x={450} y={230} textAnchor="middle" fill="#C53030" fontSize="11" fontWeight="600">Hub</text>
            </motion.g>

            {/* Integration orbits */}
            <motion.circle
              cx={450}
              cy={200}
              r={160}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={1}
              strokeDasharray="5,5"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            />

            {/* Integration nodes arranged in circle */}
            {integrations.map((integration, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const x = 450 + 160 * Math.cos(angle);
              const y = 200 + 160 * Math.sin(angle);
              
              return (
                <motion.g
                  key={integration.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  {/* Connector line */}
                  <line x1={450} y1={200} x2={x} y2={y} stroke={`${integration.color}40`} strokeWidth={2} />
                  
                  {/* Integration card */}
                  <rect x={x - 55} y={y - 30} width={110} height={60} rx={10} fill="white" stroke={integration.color} strokeWidth={2} filter="url(#shadow)" />
                  <rect x={x - 55} y={y - 30} width={110} height={6} rx={10} fill={integration.color} />
                  <text x={x} y={y} textAnchor="middle" fill="#1A202C" fontSize="11" fontWeight="600">{integration.name}</text>
                  <text x={x} y={y + 15} textAnchor="middle" fill="#718096" fontSize="9">{integration.category}</text>

                  {/* Animated data packet */}
                  <motion.circle
                    r={4}
                    fill={integration.color}
                    initial={{ cx: x, cy: y }}
                    animate={{
                      cx: [x, 450],
                      cy: [y, 200],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                  />
                </motion.g>
              );
            })}

            {/* Stats panel */}
            <motion.g
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <rect x={730} y={100} width={150} height={200} rx={12} fill="white" stroke="#E2E8F0" filter="url(#shadow)" />
              <rect x={730} y={100} width={150} height={8} rx={12} fill="url(#gradient-E53E3E)" />
              <text x={805} y={130} textAnchor="middle" fill="#1A202C" fontSize="12" fontWeight="600">Connector Stats</text>
              
              {[
                { label: 'Total Connectors', value: '500+' },
                { label: 'Active Today', value: '234' },
                { label: 'Data Synced', value: '4.2TB' },
                { label: 'Avg Latency', value: '45ms' },
              ].map((stat, i) => (
                <g key={stat.label}>
                  <text x={745} y={160 + i * 35} fill="#718096" fontSize="10">{stat.label}</text>
                  <text x={865} y={160 + i * 35} textAnchor="end" fill="#1A202C" fontSize="11" fontWeight="600">{stat.value}</text>
                </g>
              ))}
            </motion.g>

            {/* Left info panel */}
            <motion.g
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <rect x={20} y={100} width={160} height={200} rx={12} fill="#F7FAFC" stroke="#E2E8F0" />
              <text x={100} y={130} textAnchor="middle" fill="#4A5568" fontSize="12" fontWeight="600">Connector Features</text>
              
              {['OAuth 2.0 Auth', 'Real-time Sync', 'Batch Processing', 'Error Retry', 'Data Mapping', 'Rate Limiting'].map((feature, i) => (
                <g key={feature}>
                  <circle cx={40} cy={158 + i * 25} r={4} fill="#48BB78" />
                  <text x={52} y={162 + i * 25} fill="#4A5568" fontSize="10">{feature}</text>
                </g>
              ))}
            </motion.g>
          </>
        )}
      </svg>
    </div>
  );
}

// Security Architecture Diagram
function SecurityArchitectureDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 450" className="w-full min-w-[700px] h-auto">
        {isInView && (
          <>
            {/* Security Layers - Nested boxes */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Outer layer - Network Security */}
              <rect x={100} y={50} width={600} height={350} rx={20} fill="#FFF5F5" stroke="#E53E3E" strokeWidth={2} strokeDasharray="8,4" />
              <text x={130} y={80} fill="#C53030" fontSize="12" fontWeight="600">🔒 Network Security Layer</text>
              
              {/* Middle layer - Application Security */}
              <rect x={150} y={100} width={500} height={250} rx={16} fill="#FFFFF0" stroke="#ED8936" strokeWidth={2} strokeDasharray="6,3" />
              <text x={180} y={125} fill="#C05621" fontSize="11" fontWeight="600">🛡️ Application Security Layer</text>
              
              {/* Inner layer - Data Security */}
              <rect x={200} y={145} width={400} height={160} rx={12} fill="#F0FFF4" stroke="#48BB78" strokeWidth={2} />
              <text x={230} y={170} fill="#276749" fontSize="11" fontWeight="600">🔐 Data Security Layer</text>
              
              {/* Core - Protected Data */}
              <motion.rect
                x={300}
                y={190}
                width={200}
                height={80}
                rx={10}
                fill="white"
                stroke="#48BB78"
                strokeWidth={2}
                filter="url(#shadow)"
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <foreignObject x={370} y={205} width={60} height={40}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database className="w-8 h-8 text-[#48BB78]" />
                </div>
              </foreignObject>
              <text x={400} y={258} textAnchor="middle" fill="#276749" fontSize="11" fontWeight="600">Protected Data</text>
            </motion.g>

            {/* Security features on the right */}
            <motion.g
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <rect x={730} y={50} width={150} height={350} rx={12} fill="white" stroke="#E2E8F0" filter="url(#shadow)" />
              <rect x={730} y={50} width={150} height={10} rx={12} fill="url(#gradient-48BB78)" />
              
              <text x={805} y={85} textAnchor="middle" fill="#1A202C" fontSize="13" fontWeight="700">Security Features</text>
              
              {[
                { icon: Shield, label: 'SOC 2 Type II', color: '#48BB78' },
                { icon: Lock, label: 'AES-256 Encryption', color: '#3182CE' },
                { icon: Key, label: 'SSO / SAML 2.0', color: '#9F7AEA' },
                { icon: Eye, label: 'Audit Logging', color: '#ED8936' },
                { icon: Users, label: 'RBAC Controls', color: '#E53E3E' },
                { icon: Globe, label: 'GDPR Compliant', color: '#38B2AC' },
              ].map((item, i) => (
                <motion.g
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <rect x={745} y={105 + i * 45} width={120} height={38} rx={8} fill={`${item.color}10`} stroke={`${item.color}30`} />
                  <foreignObject x={753} y={112 + i * 45} width={24} height={24}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                  </foreignObject>
                  <text x={810} y={128 + i * 45} fill="#4A5568" fontSize="10">{item.label}</text>
                </motion.g>
              ))}
            </motion.g>

            {/* Threat indicators */}
            {[
              { x: 60, y: 150, label: 'DDoS Attack' },
              { x: 60, y: 250, label: 'SQL Injection' },
              { x: 60, y: 350, label: 'XSS Attack' },
            ].map((threat, i) => (
              <motion.g
                key={threat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.2 }}
              >
                <rect x={threat.x - 35} y={threat.y - 15} width={70} height={30} rx={6} fill="#FED7D7" stroke="#E53E3E" />
                <text x={threat.x} y={threat.y + 3} textAnchor="middle" fill="#C53030" fontSize="9">{threat.label}</text>
                
                {/* Blocked indicator */}
                <motion.line
                  x1={threat.x + 40}
                  y1={threat.y}
                  x2={100}
                  y2={threat.y}
                  stroke="#E53E3E"
                  strokeWidth={2}
                  strokeDasharray="4,4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + i * 0.2 }}
                />
                <motion.circle
                  cx={95}
                  cy={threat.y}
                  r={8}
                  fill="#FED7D7"
                  stroke="#E53E3E"
                  strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + i * 0.2 }}
                />
                <text x={95} y={threat.y + 4} textAnchor="middle" fill="#C53030" fontSize="10" fontWeight="bold">✕</text>
              </motion.g>
            ))}

            {/* Compliance badges at bottom */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <text x={400} y={425} textAnchor="middle" fill="#718096" fontSize="10">Compliance: ISO 27001 • HIPAA • PCI DSS • CCPA • FedRAMP</text>
            </motion.g>
          </>
        )}
      </svg>
    </div>
  );
}

// Main Architecture Page Component
export default function ArchitecturePage() {
  const [activeSection, setActiveSection] = useState('platform');
  const heroRef = useRef<HTMLDivElement>(null);

  const renderDiagram = () => {
    switch (activeSection) {
      case 'platform':
        return <PlatformOverviewDiagram />;
      case 'ai-pipeline':
        return <AIPipelineDiagram />;
      case 'api-gateway':
        return <APIGatewayDiagram />;
      case 'workflow-engine':
        return <WorkflowEngineDiagram />;
      case 'integrations':
        return <IntegrationLayerDiagram />;
      case 'security':
        return <SecurityArchitectureDiagram />;
      default:
        return <PlatformOverviewDiagram />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#1a365d] to-[#2c5282]"
      >
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,178,172,0.2),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(237,137,54,0.1),rgba(255,255,255,0))]" />
          
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium mb-6"
            >
              <Cpu className="w-4 h-4 text-[#ed8936]" />
              <span>Enterprise Architecture</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Built for Scale.
              <br />
              <span className="bg-gradient-to-r from-[#ed8936] via-[#f6ad55] to-[#38b2ac] bg-clip-text text-transparent">
                Designed for Security.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Explore the enterprise-grade architecture that powers millions of automated workflows. 
              Click on each layer to dive deeper into how TaskBot delivers reliability, performance, and security.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/request-demo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#ed8936] to-[#dd6b20] hover:from-[#dd6b20] hover:to-[#c05621] text-white font-semibold px-8 rounded-xl"
                >
                  Schedule Architecture Review
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/resources/documentation">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl"
                >
                  View API Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/50"
          >
            <span className="text-xs uppercase tracking-wider">Explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Architecture Navigation */}
      <section className="sticky top-[72px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide py-4 gap-2">
            {architectureSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Diagram Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Section header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{ backgroundColor: `${architectureSections.find(s => s.id === activeSection)?.color}15` }}
                >
                  {(() => {
                    const Section = architectureSections.find(s => s.id === activeSection);
                    if (!Section) return null;
                    const IconComponent = Section.icon;
                    return (
                      <div style={{ color: Section.color }}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                    );
                  })()}
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {architectureSections.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-gray-600">
                  {architectureSections.find(s => s.id === activeSection)?.subtitle}
                </p>
              </div>

              {/* Diagram container */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
                {renderDiagram()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#ed8936] font-semibold text-sm uppercase tracking-wider">Technical Specifications</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
              Enterprise-Grade Performance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on modern cloud-native infrastructure for unmatched reliability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, label: 'Latency', value: '<50ms', description: 'P99 API response time' },
              { icon: Server, label: 'Uptime SLA', value: '99.99%', description: 'Guaranteed availability' },
              { icon: Globe, label: 'Global Regions', value: '12', description: 'Data center locations' },
              { icon: RefreshCw, label: 'Throughput', value: '1M+', description: 'Requests per second' },
            ].map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#1a365d] to-[#4299e1] rounded-xl flex items-center justify-center mb-4">
                  <spec.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{spec.value}</p>
                <p className="text-sm font-semibold text-gray-700 mb-1">{spec.label}</p>
                <p className="text-xs text-gray-500">{spec.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0d1b2a] via-[#1a365d] to-[#2c5282]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to see it in action?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Schedule a technical deep-dive with our solutions architects to explore how TaskBot can integrate with your infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/request-demo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#ed8936] to-[#dd6b20] hover:from-[#dd6b20] hover:to-[#c05621] text-white font-semibold px-10 py-6 text-lg rounded-xl"
                >
                  Request Technical Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 px-10 py-6 text-lg rounded-xl"
                >
                  Talk to an Architect
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
