import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LineChart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
  Search,
  GitBranch,
  Clock,
  AlertTriangle,
  TrendingUp,
  PieChart,
  BarChart3,
  Zap,
  Eye,
  RefreshCw,
  FileSearch,
  Target,
  Lightbulb,
  Activity,
  AlertCircle,
  Timer,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

const capabilities = [
  {
    icon: Search,
    title: 'Process Discovery',
    description: 'Automatically visualize how work actually flows through your organization.',
    color: '#ed8936',
  },
  {
    icon: AlertTriangle,
    title: 'Bottleneck Detection',
    description: 'Identify delays, inefficiencies, and problem areas in your processes.',
    color: '#e53e3e',
  },
  {
    icon: Clock,
    title: 'Time Analysis',
    description: 'Understand cycle times, waiting times, and process duration patterns.',
    color: '#3182ce',
  },
  {
    icon: TrendingUp,
    title: 'ROI Calculation',
    description: 'Quantify the potential savings from automating discovered processes.',
    color: '#38a169',
  },
];

const features = [
  {
    icon: GitBranch,
    title: 'Process Variants',
    description: 'See all the different paths work takes and identify the most efficient routes.',
  },
  {
    icon: PieChart,
    title: 'Conformance Checking',
    description: 'Compare actual processes to ideal workflows and measure compliance.',
  },
  {
    icon: BarChart3,
    title: 'Performance Dashboards',
    description: 'Monitor KPIs with real-time dashboards and custom reports.',
  },
  {
    icon: Zap,
    title: 'Automation Opportunities',
    description: 'AI-powered recommendations for where automation has the biggest impact.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Connect Data',
    description: 'Import event logs from your existing systems—ERP, CRM, ticketing, and more.',
    icon: FileSearch,
  },
  {
    number: '02',
    title: 'Discover Processes',
    description: 'Automatically generate visual process maps from your data.',
    icon: Eye,
  },
  {
    number: '03',
    title: 'Analyze & Optimize',
    description: 'Identify bottlenecks, inefficiencies, and automation opportunities.',
    icon: Target,
  },
  {
    number: '04',
    title: 'Take Action',
    description: 'Create automated workflows to fix problems and track improvements.',
    icon: Lightbulb,
  },
];

const metrics = [
  { value: '40%', label: 'Average efficiency gain', description: 'Customers see significant improvements' },
  { value: '2-4x', label: 'Faster analysis', description: 'Compared to manual process mapping' },
  { value: '100%', label: 'Process visibility', description: 'See how work really happens' },
];

// Advanced Process Mining Diagram
function ProcessMiningDiagram() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [flowProgress, setFlowProgress] = useState(0);

  const nodes = [
    { id: 1, x: 30, y: 25, label: 'Order Received', type: 'start', cases: 1247, avgTime: '0.5h' },
    { id: 2, x: 120, y: 25, label: 'Validate Order', type: 'task', cases: 1247, avgTime: '2.1h' },
    { id: 3, x: 120, y: 85, label: 'Credit Check', type: 'decision', cases: 892, avgTime: '4.3h' },
    { id: 4, x: 210, y: 25, label: 'Process Payment', type: 'task', cases: 1180, avgTime: '1.2h' },
    { id: 5, x: 210, y: 85, label: 'Manual Review', type: 'bottleneck', cases: 355, avgTime: '18.5h' },
    { id: 6, x: 300, y: 55, label: 'Ship Order', type: 'task', cases: 1195, avgTime: '3.2h' },
    { id: 7, x: 390, y: 55, label: 'Complete', type: 'end', cases: 1195, avgTime: '0.1h' },
  ];

  const edges = [
    { from: 1, to: 2, volume: 100, color: '#38a169' },
    { from: 2, to: 3, volume: 72, color: '#3182ce' },
    { from: 2, to: 4, volume: 28, color: '#38a169' },
    { from: 3, to: 4, volume: 70, color: '#38a169' },
    { from: 3, to: 5, volume: 30, color: '#e53e3e' },
    { from: 4, to: 6, volume: 95, color: '#38a169' },
    { from: 5, to: 6, volume: 85, color: '#ed8936' },
    { from: 6, to: 7, volume: 100, color: '#38a169' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowProgress((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start': return '#38a169';
      case 'end': return '#38a169';
      case 'bottleneck': return '#e53e3e';
      case 'decision': return '#805ad5';
      default: return '#3182ce';
    }
  };

  const getEdgePath = (from: typeof nodes[0], to: typeof nodes[0]) => {
    const startX = from.x + 35;
    const startY = from.y + 12;
    const endX = to.x;
    const endY = to.y + 12;
    
    if (Math.abs(from.y - to.y) < 10) {
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }
    
    const midX = (startX + endX) / 2;
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 max-w-[560px] mx-auto">
      <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#1e293b] px-3 py-2.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#ed8936]" />
              <span className="text-white/80 text-xs font-medium">Process Mining — Order Fulfillment</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-[#ed8936]/20 rounded text-[9px] text-[#ed8936]">
            <Activity className="w-2.5 h-2.5" />
            Live Analysis
          </div>
        </div>

        <div className="flex">
          {/* Process Map */}
          <div className="flex-1 p-3">
            <div className="relative aspect-[16/9] bg-[#0a0f1a] rounded-lg overflow-hidden">
              {/* Grid */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 450 120" preserveAspectRatio="xMidYMid meet">
                {/* Edges */}
                {edges.map((edge, i) => {
                  const from = nodes.find(n => n.id === edge.from)!;
                  const to = nodes.find(n => n.id === edge.to)!;
                  const path = getEdgePath(from, to);
                  
                  return (
                    <g key={i}>
                      {/* Edge background */}
                      <path
                        d={path}
                        fill="none"
                        stroke={edge.color}
                        strokeWidth={Math.max(1, edge.volume / 30)}
                        strokeOpacity={0.3}
                      />
                      {/* Animated flow */}
                      <motion.path
                        d={path}
                        fill="none"
                        stroke={edge.color}
                        strokeWidth={1.5}
                        strokeDasharray="6 6"
                        strokeDashoffset={-flowProgress * 0.5}
                        strokeOpacity={0.8}
                      />
                      {/* Volume label */}
                      <text
                        x={(from.x + 35 + to.x) / 2}
                        y={(from.y + to.y) / 2 + 12 - 4}
                        fill="#94a3b8"
                        fontSize="6"
                        textAnchor="middle"
                      >
                        {edge.volume}%
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                  <motion.g
                    key={node.id}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <motion.rect
                      x={node.x}
                      y={node.y}
                      width={70}
                      height={24}
                      rx={node.type === 'decision' ? 0 : 4}
                      fill={activeNode === node.id ? getNodeColor(node.type) : '#1e293b'}
                      stroke={getNodeColor(node.type)}
                      strokeWidth={activeNode === node.id ? 2 : 1.5}
                      transform={node.type === 'decision' ? `rotate(45, ${node.x + 35}, ${node.y + 12})` : ''}
                      animate={{
                        scale: node.type === 'bottleneck' ? [1, 1.02, 1] : 1,
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    
                    {/* Node icon based on type */}
                    {node.type === 'start' && (
                      <circle cx={node.x + 12} cy={node.y + 12} r={4} fill={getNodeColor(node.type)} />
                    )}
                    {node.type === 'end' && (
                      <>
                        <circle cx={node.x + 58} cy={node.y + 12} r={5} fill="none" stroke={getNodeColor(node.type)} strokeWidth={1.5} />
                        <circle cx={node.x + 58} cy={node.y + 12} r={3} fill={getNodeColor(node.type)} />
                      </>
                    )}
                    {node.type === 'bottleneck' && (
                      <motion.g
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <AlertCircle className="w-3 h-3" x={node.x + 4} y={node.y + 6} style={{ color: '#e53e3e' }} />
                      </motion.g>
                    )}

                    {/* Label */}
                    <text
                      x={node.x + 35}
                      y={node.y + 15}
                      fill={activeNode === node.id ? 'white' : '#e2e8f0'}
                      fontSize="6"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {node.label}
                    </text>
                  </motion.g>
                ))}
              </svg>

              {/* Legend - positioned inside */}
              <div className="absolute bottom-1.5 left-1.5 flex gap-2 text-[7px]">
                {[
                  { color: '#38a169', label: 'Happy path' },
                  { color: '#e53e3e', label: 'Bottleneck' },
                  { color: '#805ad5', label: 'Decision' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white/50">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="w-40 bg-[#1e293b] p-2.5 border-l border-white/10 flex flex-col">
            <div className="text-white/50 text-[9px] mb-2 uppercase tracking-wider">Analysis</div>
            
            {/* Key Metrics */}
            <div className="space-y-2 mb-3 flex-1">
              <div className="bg-[#0f172a] rounded-md p-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Timer className="w-2.5 h-2.5 text-[#3182ce]" />
                  <span className="text-white/60 text-[8px]">Cycle Time</span>
                </div>
                <div className="text-base font-bold text-white">29.4h</div>
                <div className="flex items-center gap-0.5 text-[8px] text-green-400">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>-12% vs last month</span>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                  <span className="text-red-400/80 text-[8px]">Bottleneck</span>
                </div>
                <div className="text-[11px] font-semibold text-white">Manual Review</div>
                <div className="text-[8px] text-white/60">18.5h avg • 355 cases</div>
              </div>

              <div className="bg-[#0f172a] rounded-md p-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Users className="w-2.5 h-2.5 text-[#805ad5]" />
                  <span className="text-white/60 text-[8px]">Cases</span>
                </div>
                <div className="text-base font-bold text-white">1,247</div>
                <div className="text-[8px] text-white/40">Last 30 days</div>
              </div>
            </div>

            {/* Variants */}
            <div className="text-white/50 text-[8px] mb-1.5 uppercase tracking-wider">Variants</div>
            <div className="space-y-1">
              {[
                { name: 'Happy Path', pct: 72, color: '#38a169' },
                { name: 'With Review', pct: 28, color: '#ed8936' },
              ].map((variant) => (
                <div key={variant.name} className="bg-[#0f172a] rounded-md p-1.5">
                  <div className="flex justify-between text-[8px] mb-0.5">
                    <span className="text-white/70">{variant.name}</span>
                    <span className="text-white/50">{variant.pct}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: variant.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${variant.pct}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#1e293b] px-3 py-1.5 flex items-center justify-between text-[9px] border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-white/50">
              <FileSearch className="w-2.5 h-2.5" />
              <span>SAP ERP</span>
            </div>
            <div className="flex items-center gap-1 text-white/50">
              <Clock className="w-2.5 h-2.5" />
              <span>2 min ago</span>
            </div>
          </div>
          <motion.button
            className="flex items-center gap-1 px-1.5 py-0.5 bg-[#ed8936]/20 text-[#ed8936] rounded hover:bg-[#ed8936]/30 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-2.5 h-2.5" />
            <span>Create Automation</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function ProcessMiningPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#ed8936] via-[#dd6b20] to-[#c05621] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        {/* Flow lines animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ 
                top: `${15 + i * 12}%`, 
                width: '40%',
                left: '-20%'
              }}
              animate={{ 
                x: ['0%', '150%'],
              }}
              transition={{ 
                duration: 4 + i * 0.5, 
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'linear'
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <LineChart className="w-4 h-4 mr-2" />
                PROCESS MINING
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                See how work
                <span className="block text-[#1a365d]">really happens.</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Discover, analyze, and optimize your business processes with data-driven insights. 
                Find bottlenecks, measure efficiency, and prioritize automation opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-[#1a365d] hover:bg-[#2d3748] text-white font-semibold px-8 w-full sm:w-auto">
                    Start Analyzing Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/request-demo">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Process Mining Diagram - Mobile Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="transform scale-[0.85] sm:scale-100 origin-top -mx-4 sm:mx-0">
                <ProcessMiningDiagram />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#ed8936] mb-2">{metric.value}</div>
                <div className="text-lg font-medium text-gray-900 mb-1">{metric.label}</div>
                <div className="text-gray-600 text-sm">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gain complete visibility into your processes and make data-driven decisions.
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
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: `${capability.color}15` }}
                    >
                      <capability.icon className="w-8 h-8" style={{ color: capability.color }} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{capability.title}</h3>
                    <p className="text-gray-600">{capability.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From data to insights in four simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 bg-[#ed8936] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-bold text-[#ed8936] mb-2">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-[#ed8936]/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Deep process insights
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Go beyond basic analytics to understand the true nature of your processes. 
                Uncover hidden patterns, measure compliance, and prioritize improvements.
              </p>
              <div className="space-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#ed8936]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[#ed8936]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-[#ed8936] to-[#c05621] rounded-3xl p-8">
                <div className="text-white">
                  <RefreshCw className="w-12 h-12 mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-4">Continuous Improvement</h3>
                  <p className="text-white/80 mb-6">
                    Process Mining isn't a one-time analysis. Monitor your processes 
                    continuously and track the impact of your optimizations over time.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-3xl font-bold">↓ 45%</div>
                      <div className="text-white/70 text-sm">Cycle time reduction</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-3xl font-bold">↑ 32%</div>
                      <div className="text-white/70 text-sm">Process efficiency</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-24 bg-[#1a365d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Zap className="w-16 h-16 text-[#ed8936] mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">
                From insights to action
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Process Mining seamlessly connects with Cloud Flows and Desktop Flows. 
                Turn discovered insights into automated solutions with one click.
              </p>
              <ul className="space-y-4">
                {[
                  'Identify automation candidates automatically',
                  'Generate flow templates from process patterns',
                  'Track automation ROI in real-time',
                  'Continuous monitoring post-automation',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-[#ed8936]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-6xl font-bold text-white mb-4">$1.2M</div>
                <div className="text-xl font-semibold text-white mb-2">Average Annual Savings</div>
                <p className="text-white/80">
                  Enterprise customers save over $1 million annually by optimizing 
                  processes discovered through Process Mining.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Start discovering your processes today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Connect your data and see how work really flows through your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-[#ed8936] text-[#ed8936] hover:bg-[#ed8936] hover:text-white">
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
