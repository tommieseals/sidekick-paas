import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
  FileText,
  Image,
  MessageSquare,
  Scan,
  Wand2,
  Layers,
  BarChart3,
  Zap,
  Target,
  BookOpen,
  Receipt,
  CreditCard,
  Users,
  Eye,
  Cpu,
  Loader2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

const models = [
  {
    icon: FileText,
    title: 'Document Processing',
    description: 'Extract information from invoices, receipts, contracts, and more with pre-trained models.',
    color: '#38b2ac',
  },
  {
    icon: Scan,
    title: 'Form Processing',
    description: 'Automatically extract data from forms, surveys, and structured documents.',
    color: '#3182ce',
  },
  {
    icon: Image,
    title: 'Object Detection',
    description: 'Identify and locate objects in images for quality control, inventory, and more.',
    color: '#805ad5',
  },
  {
    icon: MessageSquare,
    title: 'Text Classification',
    description: 'Categorize text, analyze sentiment, and route messages automatically.',
    color: '#ed8936',
  },
];

const prebuiltModels = [
  {
    icon: Receipt,
    name: 'Invoice Processing',
    description: 'Extract vendor, dates, line items, and totals from invoices.',
  },
  {
    icon: CreditCard,
    name: 'Receipt Processing',
    description: 'Capture merchant, amounts, and items from receipts.',
  },
  {
    icon: Users,
    name: 'Business Card Reader',
    description: 'Extract contact info from business cards.',
  },
  {
    icon: BookOpen,
    name: 'ID Document Reader',
    description: 'Process passports, driver licenses, and ID cards.',
  },
];

const capabilities = [
  {
    icon: Wand2,
    title: 'No-Code Training',
    description: 'Train custom AI models without writing a single line of code.',
  },
  {
    icon: Layers,
    title: 'Continuous Learning',
    description: 'Models improve automatically as you correct predictions.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Monitor model accuracy and identify improvement opportunities.',
  },
  {
    icon: Zap,
    title: 'Flow Integration',
    description: 'Add AI to any Cloud Flow or Desktop Flow seamlessly.',
  },
];

const useCases = [
  {
    title: 'Accounts Payable',
    description: 'Automatically extract data from invoices, match to POs, and route for approval.',
    metrics: '90% faster processing',
  },
  {
    title: 'Customer Support',
    description: 'Classify incoming tickets by topic, sentiment, and urgency for intelligent routing.',
    metrics: '75% reduction in response time',
  },
  {
    title: 'Quality Control',
    description: 'Detect defects in manufacturing using computer vision models.',
    metrics: '99.5% detection accuracy',
  },
];

// Advanced AI Document Processing Diagram
function AIProcessingDiagram() {
  const [stage, setStage] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  
  const fields = [
    { label: 'Vendor', value: 'Acme Corporation', confidence: 99, delay: 0 },
    { label: 'Invoice #', value: 'INV-2024-0847', confidence: 98, delay: 0.3 },
    { label: 'Date', value: 'January 15, 2024', confidence: 97, delay: 0.6 },
    { label: 'Amount', value: '$4,250.00', confidence: 99, delay: 0.9 },
    { label: 'Due Date', value: 'February 14, 2024', confidence: 96, delay: 1.2 },
  ];

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 4000);

    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev + 2) % 100);
    }, 50);

    return () => {
      clearInterval(stageInterval);
      clearInterval(scanInterval);
    };
  }, []);

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
              <Brain className="w-3.5 h-3.5 text-[#38b2ac]" />
              <span className="text-white/80 text-xs font-medium">AI Builder — Document Processing</span>
            </div>
          </div>
          <motion.div 
            className="flex items-center gap-1 px-2 py-0.5 bg-[#38b2ac]/20 rounded text-[9px] text-[#38b2ac]"
            animate={{ opacity: stage === 1 ? [0.5, 1, 0.5] : 1 }}
            transition={{ duration: 0.5, repeat: stage === 1 ? Infinity : 0 }}
          >
            <Cpu className="w-2.5 h-2.5" />
            {stage === 0 ? 'Ready' : stage === 1 ? 'Processing...' : 'Complete'}
          </motion.div>
        </div>

        <div className="flex">
          {/* Left Side - Document Preview */}
          <div className="w-1/2 p-3 border-r border-white/10">
            <div className="text-white/50 text-[10px] mb-1.5 uppercase tracking-wider">Source Document</div>
            <div className="bg-white rounded-lg p-3 relative overflow-hidden aspect-[4/5]">
              {/* Invoice Content */}
              <div className="text-[9px] text-gray-800 h-full flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-sm text-gray-900">INVOICE</div>
                    <div className="text-gray-500 text-[8px] mt-0.5">From: Acme Corporation</div>
                  </div>
                  <motion.div 
                    className="bg-[#38b2ac]/20 px-1.5 py-0.5 rounded text-[8px]"
                    animate={{ 
                      backgroundColor: stage >= 2 ? 'rgba(56, 178, 172, 0.3)' : 'rgba(56, 178, 172, 0.1)',
                      borderWidth: stage >= 2 ? 1 : 0,
                      borderColor: '#38b2ac'
                    }}
                  >
                    <span className="font-mono">INV-2024-0847</span>
                  </motion.div>
                </div>

                <div className="border-t border-b border-gray-200 py-1.5 my-1.5 flex-shrink-0">
                  <div className="grid grid-cols-2 gap-1.5">
                    <motion.div
                      animate={{ 
                        backgroundColor: stage >= 2 ? 'rgba(56, 178, 172, 0.15)' : 'transparent'
                      }}
                      className="p-1 rounded"
                    >
                      <div className="text-gray-500 text-[7px]">Date:</div>
                      <div className="font-medium text-[8px]">January 15, 2024</div>
                    </motion.div>
                    <motion.div
                      animate={{ 
                        backgroundColor: stage >= 2 ? 'rgba(56, 178, 172, 0.15)' : 'transparent'
                      }}
                      className="p-1 rounded"
                    >
                      <div className="text-gray-500 text-[7px]">Due Date:</div>
                      <div className="font-medium text-[8px]">February 14, 2024</div>
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-1 mb-2 flex-1">
                  <div className="flex justify-between text-[8px]">
                    <span>Professional Services</span>
                    <span>$3,500.00</span>
                  </div>
                  <div className="flex justify-between text-[8px]">
                    <span>Materials</span>
                    <span>$750.00</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-1.5 mt-auto">
                  <motion.div 
                    className="flex justify-between font-bold text-[10px] p-1 rounded"
                    animate={{ 
                      backgroundColor: stage >= 2 ? 'rgba(56, 178, 172, 0.2)' : 'transparent',
                      borderWidth: stage >= 2 ? 1 : 0,
                      borderColor: '#38b2ac'
                    }}
                  >
                    <span>Total Amount:</span>
                    <span className="text-[#38b2ac]">$4,250.00</span>
                  </motion.div>
                </div>
              </div>

              {/* Scanning Animation */}
              {stage === 1 && (
                <>
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#38b2ac] to-transparent"
                    style={{ top: `${scanLine}%` }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-[#38b2ac]/5"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </>
              )}

              {/* AI Detection Boxes */}
              {stage >= 2 && (
                <>
                  {[
                    { x: 8, y: 8, w: 35, h: 14 },
                    { x: 58, y: 5, w: 35, h: 10 },
                    { x: 8, y: 32, w: 40, h: 12 },
                    { x: 8, y: 82, w: 80, h: 12 },
                  ].map((box, i) => (
                    <motion.div
                      key={i}
                      className="absolute border border-[#38b2ac] rounded pointer-events-none"
                      style={{ 
                        left: `${box.x}%`, 
                        top: `${box.y}%`, 
                        width: `${box.w}%`, 
                        height: `${box.h}%` 
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <motion.div 
                        className="absolute -top-2.5 -left-0.5 text-[6px] bg-[#38b2ac] text-white px-1 rounded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.15 + 0.2 }}
                      >
                        {['vendor', 'inv_num', 'date', 'total'][i]}
                      </motion.div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Right Side - Extracted Data */}
          <div className="w-1/2 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-[10px] uppercase tracking-wider">Extracted Data</span>
              <div className="flex items-center gap-1">
                <span className="text-[#38b2ac] text-[9px]">Confidence</span>
                <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#38b2ac] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: stage >= 2 ? '98%' : '0%' }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                </div>
                <motion.span 
                  className="text-white/70 text-[9px] font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: stage >= 2 ? 1 : 0 }}
                >
                  98%
                </motion.span>
              </div>
            </div>

            <div className="space-y-1.5">
              {fields.map((field) => (
                <motion.div
                  key={field.label}
                  className="bg-[#1e293b] rounded-md p-2 flex items-center justify-between"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: stage >= 2 ? 1 : 0.3,
                    x: stage >= 2 ? 0 : 20
                  }}
                  transition={{ delay: field.delay }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-white/50 text-[8px] uppercase tracking-wider">{field.label}</div>
                    <motion.div 
                      className="text-white font-medium text-[11px] truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: stage >= 2 ? 1 : 0 }}
                      transition={{ delay: field.delay + 0.2 }}
                    >
                      {stage >= 2 ? field.value : '—'}
                    </motion.div>
                  </div>
                  <motion.div
                    className="flex items-center gap-1 flex-shrink-0 ml-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: stage >= 2 ? 1 : 0 }}
                    transition={{ delay: field.delay + 0.3 }}
                  >
                    <div className="text-[#38b2ac] text-[9px] font-mono">{field.confidence}%</div>
                    <CheckCircle2 className="w-3 h-3 text-[#38b2ac]" />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
            <motion.div 
              className="mt-3 flex gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 2 ? 1 : 0 }}
              transition={{ delay: 1.5 }}
            >
              <button className="flex-1 py-1.5 bg-[#38b2ac] text-white text-[10px] font-medium rounded-md flex items-center justify-center gap-1.5 hover:bg-[#2c9a8f] transition-colors">
                <CheckCircle2 className="w-3 h-3" />
                Confirm & Save
              </button>
              <button className="px-2 py-1.5 bg-white/10 text-white/70 text-[10px] rounded-md hover:bg-white/20 transition-colors">
                Edit
              </button>
            </motion.div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#1e293b] px-3 py-1.5 flex items-center justify-between text-[9px] border-t border-white/10">
          <div className="flex items-center gap-1.5 text-white/50">
            <Eye className="w-2.5 h-2.5" />
            <span>Invoice Processing v2.1</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div 
              className="flex items-center gap-1"
              animate={{ 
                color: stage === 1 ? '#f59e0b' : stage >= 2 ? '#10b981' : '#64748b'
              }}
            >
              {stage === 1 ? (
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
              ) : stage >= 2 ? (
                <CheckCircle2 className="w-2.5 h-2.5" />
              ) : (
                <AlertCircle className="w-2.5 h-2.5" />
              )}
              <span>
                {stage === 0 ? 'Ready' : stage === 1 ? 'Analyzing...' : 'Complete'}
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-1 text-[#38b2ac]"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 2 ? 1 : 0 }}
            >
              <TrendingUp className="w-2.5 h-2.5" />
              <span>5 fields</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIBuilderPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#38b2ac] via-[#319795] to-[#2c7a7b] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        {/* Neural network background animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32"
              style={{ left: `${10 + i * 18}%`, top: `${20 + (i % 2) * 30}%` }}
              animate={{ 
                rotate: [0, 360],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 20 + i * 2, repeat: Infinity }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                <circle cx="50" cy="50" r="3" fill="currentColor" />
                {[0, 60, 120, 180, 240, 300].map((angle, j) => (
                  <g key={j}>
                    <circle 
                      cx={50 + 30 * Math.cos(angle * Math.PI / 180)} 
                      cy={50 + 30 * Math.sin(angle * Math.PI / 180)} 
                      r="2" 
                      fill="currentColor" 
                    />
                    <line 
                      x1="50" y1="50"
                      x2={50 + 30 * Math.cos(angle * Math.PI / 180)}
                      y2={50 + 30 * Math.sin(angle * Math.PI / 180)}
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </g>
                ))}
              </svg>
            </motion.div>
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
                <Brain className="w-4 h-4 mr-2" />
                AI BUILDER
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Add AI to your flows.
                <span className="block text-[#ffc83d]">No expertise required.</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Build and use AI models in your workflows without being a data scientist. 
                Process documents, extract data, and make intelligent decisions automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#2c7a7b] font-semibold px-8 w-full sm:w-auto">
                    Try AI Builder Free
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
            
            {/* AI Processing Diagram - Mobile Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="transform scale-90 sm:scale-100 origin-top">
                <AIProcessingDiagram />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Models */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Model Types</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from pre-built models or train your own to fit your specific needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {models.map((model, index) => (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: `${model.color}15` }}
                    >
                      <model.icon className="w-8 h-8" style={{ color: model.color }} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{model.title}</h3>
                    <p className="text-gray-600">{model.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-built Models */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready-to-Use Models</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start using AI immediately with our pre-built models—no training required.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prebuiltModels.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#38b2ac]/10 rounded-xl flex items-center justify-center mb-4">
                  <model.icon className="w-6 h-6 text-[#38b2ac]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{model.name}</h3>
                <p className="text-sm text-gray-600">{model.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                AI made simple
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                AI Builder puts the power of machine learning in everyone's hands. 
                Train custom models, improve accuracy over time, and integrate AI 
                seamlessly into your workflows.
              </p>
              <div className="space-y-6">
                {capabilities.map((capability) => (
                  <div key={capability.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#38b2ac]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <capability.icon className="w-6 h-6 text-[#38b2ac]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{capability.title}</h3>
                      <p className="text-gray-600">{capability.description}</p>
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
              <div className="bg-gradient-to-br from-[#38b2ac] to-[#2c7a7b] rounded-3xl p-8">
                <div className="text-white">
                  <Target className="w-12 h-12 mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-4">Train Your Own Models</h3>
                  <p className="text-white/80 mb-6">
                    Upload sample documents, tag the data you want to extract, 
                    and let AI Builder create a custom model for your specific use case.
                  </p>
                  <div className="space-y-3">
                    {[
                      'Upload 5-10 sample documents',
                      'Tag the fields you want to extract',
                      'Train with one click',
                      'Test and refine accuracy',
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
                          {i + 1}
                        </div>
                        <span className="text-white/90">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-World Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how organizations are using AI Builder to transform their operations.
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
                    <div className="inline-flex items-center px-3 py-1 bg-[#38b2ac]/10 rounded-full text-[#38b2ac] text-sm font-medium mb-4">
                      {useCase.metrics}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                    <p className="text-gray-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#38b2ac] to-[#2c7a7b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 text-[#ffc83d] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Bring AI to your workflows today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start using pre-built AI models instantly, or train custom models for your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#2c7a7b] font-semibold px-8">
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
