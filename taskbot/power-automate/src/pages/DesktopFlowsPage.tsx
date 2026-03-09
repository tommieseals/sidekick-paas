import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  Square,
  Mouse,
  AppWindow,
  Globe,
  Bot,
  Eye,
  Lock,
  Download,
  FileSpreadsheet,
  Database,
  Mail,
  Circle,
  Settings,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Layers,
  Copy,
  Trash2,
  GripVertical,
  Image,
  Type,
  MousePointer2,
  ExternalLink,
  RotateCcw,
  User,
  Timer,
  Activity,
  Cpu,
  Box,
  GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Simulated recorded actions for the RPA interface
const recordedActions = [
  { 
    id: 1, 
    type: 'click', 
    target: 'Login Button', 
    selector: '#btn-login',
    status: 'completed',
    timestamp: '00:00.42',
    screenshot: true,
    coordinates: { x: 245, y: 312 }
  },
  { 
    id: 2, 
    type: 'type', 
    target: 'Username Field', 
    value: 'admin@company.com',
    selector: 'input[name="email"]',
    status: 'completed',
    timestamp: '00:01.18'
  },
  { 
    id: 3, 
    type: 'type', 
    target: 'Password Field', 
    value: '••••••••',
    selector: 'input[type="password"]',
    status: 'completed',
    timestamp: '00:02.05'
  },
  { 
    id: 4, 
    type: 'click', 
    target: 'Submit Form', 
    selector: 'button[type="submit"]',
    status: 'completed',
    timestamp: '00:02.89',
    screenshot: true,
    coordinates: { x: 340, y: 428 }
  },
  { 
    id: 5, 
    type: 'wait', 
    target: 'Page Load', 
    value: '2000ms',
    status: 'completed',
    timestamp: '00:04.92'
  },
  { 
    id: 6, 
    type: 'extract', 
    target: 'Dashboard Data', 
    selector: '.data-table tbody',
    status: 'running',
    timestamp: '00:05.15',
    screenshot: true
  },
  { 
    id: 7, 
    type: 'condition', 
    target: 'Check Data Exists', 
    value: 'rows.length > 0',
    status: 'pending',
    timestamp: '--:--',
    hasBranch: true
  },
  { 
    id: 8, 
    type: 'click', 
    target: 'Export Button', 
    selector: '#export-csv',
    status: 'pending',
    timestamp: '--:--'
  },
];

const desktopApps = [
  { name: 'Excel', icon: FileSpreadsheet, color: '#217346', connected: true },
  { name: 'SAP', icon: Box, color: '#0FAAFF', connected: true },
  { name: 'Outlook', icon: Mail, color: '#0078D4', connected: false },
  { name: 'Legacy ERP', icon: Database, color: '#8B5CF6', connected: true },
  { name: 'Chrome', icon: Globe, color: '#4285F4', connected: true },
];

const ActionIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    click: MousePointer2,
    type: Type,
    extract: Copy,
    wait: Clock,
    condition: GitBranch,
    navigate: ExternalLink,
    loop: RotateCcw,
  };
  const IconComponent = iconMap[type] || Zap;
  return <IconComponent className="w-4 h-4" />;
};

// Main RPA Interface Component
const RPARecordingInterface = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'attended' | 'unattended'>('attended');
  const [_currentStep, _setCurrentStep] = useState(6);
  const [cursorPos, setCursorPos] = useState({ x: 180, y: 120 });
  const [showHighlight, setShowHighlight] = useState(true);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);

  // Animate cursor movement
  useEffect(() => {
    if (!isRecording) return;
    const positions = [
      { x: 180, y: 120 },
      { x: 280, y: 85 },
      { x: 320, y: 180 },
      { x: 150, y: 200 },
      { x: 250, y: 150 },
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % positions.length;
      setCursorPos(positions[index]);
      setShowHighlight(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="bg-gray-950 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Top Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-3 lg:px-4 py-2 lg:py-3 flex items-center justify-between gap-2 flex-wrap lg:flex-nowrap">
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Window controls */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer" />
            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer" />
            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer" />
          </div>
          
          {/* Title */}
          <div className="flex items-center gap-2 text-gray-400">
            <Bot className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
            <span className="font-medium text-white text-sm lg:text-base">TaskBot Desktop</span>
            <span className="text-gray-500 hidden sm:inline">—</span>
            <span className="text-xs lg:text-sm hidden sm:inline truncate max-w-[150px] lg:max-w-none">Invoice_Processing_Flow.tbf</span>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Record Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium text-sm transition-all ${
              isRecording 
                ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            <motion.div
              animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Circle className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${isRecording ? 'fill-red-500' : ''}`} />
            </motion.div>
            <span className="hidden sm:inline">{isRecording ? 'Recording' : 'Record'}</span>
          </motion.button>

          {/* Play Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium text-sm transition-all ${
              isPlaying 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                : 'bg-purple-600 text-white hover:bg-purple-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">Run Flow</span>
              </>
            )}
          </motion.button>

          {/* Stop Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 lg:p-2 rounded-lg bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-white"
          >
            <Square className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          </motion.button>

          {/* Mode Toggle - Hidden on small screens */}
          <div className="hidden md:flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setMode('attended')}
              className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all ${
                mode === 'attended' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span className="hidden lg:inline">Attended</span>
            </button>
            <button
              onClick={() => setMode('unattended')}
              className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all ${
                mode === 'unattended' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span className="hidden lg:inline">Unattended</span>
            </button>
          </div>

          <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 hover:text-white cursor-pointer hidden sm:block" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[480px] max-h-[600px]">
        {/* Left Sidebar - Actions List */}
        <div className="w-full lg:w-72 xl:w-80 bg-gray-900/50 border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col max-h-[200px] lg:max-h-none overflow-hidden">
          {/* Sidebar Header */}
          <div className="px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="font-medium text-white text-sm">Recorded Actions</span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                {recordedActions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-800 rounded">
                <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
              </button>
            </div>
          </div>

          {/* Actions List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {recordedActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedAction(action.id)}
                className={`group relative px-2 lg:px-3 py-2 lg:py-3 border-b border-gray-800/50 cursor-pointer transition-all ${
                  selectedAction === action.id 
                    ? 'bg-purple-600/20 border-l-2 border-l-purple-500' 
                    : 'hover:bg-gray-800/50'
                } ${action.status === 'running' ? 'bg-blue-500/10' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <GripVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 mt-0.5 cursor-grab" />
                  
                  {/* Step Number */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    action.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    action.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {action.status === 'completed' ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : action.status === 'running' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Activity className="w-3.5 h-3.5" />
                      </motion.div>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Action Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        action.type === 'click' ? 'bg-blue-500/20 text-blue-400' :
                        action.type === 'type' ? 'bg-amber-500/20 text-amber-400' :
                        action.type === 'extract' ? 'bg-emerald-500/20 text-emerald-400' :
                        action.type === 'wait' ? 'bg-gray-500/20 text-gray-400' :
                        action.type === 'condition' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        <ActionIcon type={action.type} />
                      </span>
                      <span className="text-white text-sm font-medium truncate">{action.target}</span>
                    </div>
                    
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      {action.selector && (
                        <code className="bg-gray-800 px-1.5 py-0.5 rounded truncate max-w-[140px]">
                          {action.selector}
                        </code>
                      )}
                      {action.value && !action.selector && (
                        <span className="text-gray-400">{action.value}</span>
                      )}
                    </div>

                    {/* Branch indicator for conditions */}
                    {action.hasBranch && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <ChevronRight className="w-3 h-3" />
                          <span>True: Continue</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-400">
                          <ChevronRight className="w-3 h-3" />
                          <span>False: Error Handle</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp & Screenshot */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500 font-mono">{action.timestamp}</span>
                    {action.screenshot && (
                      <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center">
                        <Image className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Action Button */}
          <div className="p-2 lg:p-3 border-t border-gray-800 flex-shrink-0">
            <button className="w-full py-1.5 lg:py-2 rounded-lg border border-dashed border-gray-700 text-gray-500 hover:border-purple-500 hover:text-purple-400 text-xs lg:text-sm font-medium transition-all flex items-center justify-center gap-2">
              <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              Add Action
            </button>
          </div>
        </div>

        {/* Center - Visual Recording Area */}
        <div className="flex-1 bg-gray-950 relative overflow-hidden min-h-[280px] lg:min-h-0">
          {/* Recording Badge */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-full"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-red-400 text-sm font-medium">Recording Actions</span>
              <span className="text-red-400/60 text-xs font-mono">01:23:45</span>
            </motion.div>
          )}

          {/* Simulated Browser/App Window */}
          <div className="absolute inset-2 sm:inset-3 lg:inset-4 bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-1 text-gray-400">
                  <ArrowRight className="w-3 h-3 rotate-180" />
                  <ArrowRight className="w-3 h-3" />
                  <RotateCcw className="w-3 h-3" />
                </div>
                <div className="flex-1 bg-white rounded-full px-4 py-1 text-xs text-gray-600 border border-gray-200">
                  https://erp.company.com/invoices/dashboard
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="p-4 bg-gray-50 h-full">
              {/* Fake Dashboard */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Invoice Dashboard</h3>
                  <div className="flex items-center gap-2">
                    <motion.button
                      animate={showHighlight ? { boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.5)' } : {}}
                      className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded font-medium"
                    >
                      Export CSV
                    </motion.button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                      Filter
                    </button>
                  </div>
                </div>

                {/* Fake Table */}
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">Invoice #</th>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">Client</th>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">Amount</th>
                        <th className="px-3 py-2 text-left text-gray-600 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'INV-001', client: 'Acme Corp', amount: '$12,500', status: 'Paid' },
                        { id: 'INV-002', client: 'Tech Solutions', amount: '$8,750', status: 'Pending' },
                        { id: 'INV-003', client: 'Global Inc', amount: '$24,000', status: 'Paid' },
                      ].map((row, i) => (
                        <motion.tr
                          key={row.id}
                          animate={i === 1 ? { backgroundColor: ['#ffffff', '#faf5ff', '#ffffff'] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="border-t border-gray-100"
                        >
                          <td className="px-3 py-2 text-gray-800">{row.id}</td>
                          <td className="px-3 py-2 text-gray-600">{row.client}</td>
                          <td className="px-3 py-2 text-gray-800 font-medium">{row.amount}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Element Highlight Overlay */}
              <AnimatePresence>
                {showHighlight && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute hidden sm:block pointer-events-none"
                    style={{ 
                      top: '52px', 
                      right: '15%', 
                      width: '80px', 
                      height: '28px',
                      border: '2px solid #a855f7',
                      borderRadius: '4px',
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.3)' 
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-purple-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      🎯 Export CSV
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Animated Cursor */}
            <motion.div
              animate={cursorPos}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute z-30 pointer-events-none"
              style={{ left: cursorPos.x, top: cursorPos.y }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z"
                  fill="#1a1a1a"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>
              {/* Click ripple effect */}
              <motion.div
                animate={{ scale: [0, 1.5], opacity: [0.8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-purple-500"
              />
            </motion.div>
          </div>
        </div>

        {/* Right Sidebar - Properties & Integrations */}
        <div className="hidden xl:flex w-64 2xl:w-72 bg-gray-900/50 border-l border-gray-800 flex-col">
          {/* Connected Apps */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Connected Apps</span>
              <button className="text-xs text-purple-400 hover:text-purple-300">+ Add</button>
            </div>
            <div className="space-y-2">
              {desktopApps.map((app) => (
                <motion.div
                  key={app.name}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800"
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${app.color}20` }}
                  >
                    <app.icon className="w-4 h-4" style={{ color: app.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">{app.name}</div>
                    <div className={`text-xs ${app.connected ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {app.connected ? '● Connected' : '○ Not connected'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Run Statistics */}
          <div className="p-4 border-b border-gray-800">
            <div className="text-sm font-medium text-white mb-3">Run Statistics</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">147</div>
                <div className="text-xs text-gray-400">Total Runs</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-emerald-400">98.6%</div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">2.3s</div>
                <div className="text-xs text-gray-400">Avg Duration</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-amber-400">2</div>
                <div className="text-xs text-gray-400">Errors Today</div>
              </div>
            </div>
          </div>

          {/* Error Handling */}
          <div className="p-4 flex-1">
            <div className="text-sm font-medium text-white mb-3">Error Handling</div>
            <div className="space-y-2">
              <div className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-amber-500">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-white">On Element Not Found</span>
                </div>
                <div className="text-xs text-gray-400">Retry 3 times, then skip</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-white">On Timeout</span>
                </div>
                <div className="text-xs text-gray-400">Send alert, stop flow</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-purple-500">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-white">On Condition Failed</span>
                </div>
                <div className="text-xs text-gray-400">Execute fallback branch</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="bg-gray-900 border-t border-gray-800 px-3 lg:px-4 py-2 lg:py-3">
        <div className="flex items-center gap-3 lg:gap-4">
          <Timer className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-500 flex-shrink-0" />
          <div className="flex-1 h-1.5 lg:h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '75%' }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full relative"
            >
              {/* Progress markers - hide on small screens */}
              {[20, 35, 50, 65, 75].map((pos, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-white border-2 border-purple-600 hidden sm:block"
                  style={{ left: `${(pos / 75) * 100}%`, transform: 'translate(-50%, -50%)' }}
                />
              ))}
            </motion.div>
          </div>
          <div className="text-[10px] lg:text-xs text-gray-400 font-mono flex-shrink-0">6/8 steps</div>
        </div>
      </div>
    </div>
  );
};

// Feature cards data
const features = [
  {
    icon: Mouse,
    title: 'Record & Playback',
    description: 'Simply record your mouse clicks and keyboard inputs, then play them back automatically.',
    color: '#805ad5',
  },
  {
    icon: AppWindow,
    title: 'Any Application',
    description: 'Automate desktop apps, legacy systems, virtual machines—anything with a UI.',
    color: '#3182ce',
  },
  {
    icon: Globe,
    title: 'Web Automation',
    description: 'Scrape data from websites, fill forms, and interact with web applications.',
    color: '#38b2ac',
  },
  {
    icon: Eye,
    title: 'AI-Powered Recognition',
    description: 'Use AI to identify UI elements reliably, even when screens change.',
    color: '#ed8936',
  },
];

const modes = [
  {
    title: 'Attended Mode',
    description: 'Runs with user interaction—perfect for tasks that need human oversight or input during execution.',
    icon: User,
    benefits: [
      'User triggers the flow',
      'Can request user input',
      'Visual feedback during runs',
      'Ideal for assisted automation',
    ],
  },
  {
    title: 'Unattended Mode',
    description: 'Runs completely autonomously—schedule flows to run 24/7 without any human intervention.',
    icon: Cpu,
    benefits: [
      'Scheduled execution',
      'Runs on virtual machines',
      'No user interaction needed',
      'Scale to thousands of bots',
    ],
  },
];

const useCases = [
  {
    icon: FileSpreadsheet,
    title: 'Data Entry',
    description: 'Transfer data between systems, update spreadsheets, and populate forms automatically.',
  },
  {
    icon: Database,
    title: 'Legacy Systems',
    description: 'Automate old systems that lack APIs—mainframes, terminal apps, and more.',
  },
  {
    icon: Mail,
    title: 'Report Generation',
    description: 'Generate reports from multiple sources, format them, and distribute automatically.',
  },
  {
    icon: Download,
    title: 'Data Extraction',
    description: 'Scrape websites, extract data from PDFs, and consolidate information.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Record',
    description: 'Use the recorder to capture your actions as you perform them manually.',
  },
  {
    number: '02',
    title: 'Edit',
    description: 'Fine-tune your recording with the visual designer—add logic, error handling, and more.',
  },
  {
    number: '03',
    title: 'Test',
    description: 'Run your flow in test mode to ensure everything works perfectly.',
  },
  {
    number: '04',
    title: 'Deploy',
    description: 'Schedule your flow to run automatically or trigger it on demand.',
  },
];

export default function DesktopFlowsPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#805ad5] via-[#6b46c1] to-[#553c9a] py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-medium mb-4 lg:mb-6">
              <Monitor className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-2" />
              DESKTOP FLOWS (RPA)
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              Automate your desktop.
              <span className="block text-[#ffc83d]">Free your time.</span>
            </h1>
            <p className="text-base lg:text-xl text-white/90 mb-6 lg:mb-8 leading-relaxed max-w-3xl mx-auto px-4">
              Record repetitive tasks on your desktop and play them back automatically. 
              Perfect for legacy systems, data entry, and any UI-based work.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#553c9a] font-semibold px-6 lg:px-8 w-full sm:w-auto">
                  <Download className="mr-2 w-4 h-4 lg:w-5 lg:h-5" />
                  Download Free
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
          
          {/* RPA Interface Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto px-0 sm:px-4"
          >
            <RPARecordingInterface />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 lg:mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful RPA Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate repetitive desktop tasks with ease.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 lg:mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create your first Desktop Flow in four simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-[#805ad5]/10 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-[#805ad5]/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Attended vs Unattended */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 lg:mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Two Modes of Operation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose how your Desktop Flows run based on your automation needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {modes.map((mode, index) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full border-2 border-[#805ad5]/20 hover:border-[#805ad5] transition-colors">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-[#805ad5]/10 rounded-2xl flex items-center justify-center mb-6">
                      <mode.icon className="w-8 h-8 text-[#805ad5]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{mode.title}</h3>
                    <p className="text-gray-600 mb-6">{mode.description}</p>
                    <ul className="space-y-3">
                      {mode.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#48bb78]" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
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
              See what you can automate with Desktop Flows.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-[#805ad5]/10 rounded-xl flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-[#805ad5]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 lg:py-24 bg-[#805ad5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Lock className="w-16 h-16 text-[#ffc83d] mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">
                Enterprise-grade security
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Your Desktop Flows run securely with role-based access, credential management, 
                and full audit trails.
              </p>
              <ul className="space-y-4">
                {[
                  'Secure credential storage',
                  'Role-based access control',
                  'Full audit logging',
                  'Machine group management',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-[#ffc83d]" />
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
                <div className="text-6xl font-bold text-white mb-4">24/7</div>
                <div className="text-xl font-semibold text-white mb-2">Unattended Automation</div>
                <p className="text-white/80">
                  Run your Desktop Flows around the clock on dedicated machines or virtual infrastructure.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 text-[#805ad5] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Start automating your desktop today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Download TaskBot Desktop for free and create your first flow in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#805ad5] hover:bg-[#6b46c1] text-white px-8">
                  <Download className="mr-2 w-5 h-5" />
                  Download Free
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-[#805ad5] text-[#805ad5] hover:bg-[#805ad5] hover:text-white">
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
