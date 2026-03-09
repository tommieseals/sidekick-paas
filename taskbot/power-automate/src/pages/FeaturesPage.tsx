import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Workflow, 
  Plug, 
  Shield, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  LineChart,
  Globe,
  Cpu,
  CheckCircle2,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const mainFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Automation',
    description: 'Leverage cutting-edge artificial intelligence to create intelligent workflows that learn and adapt. Our AI engine understands context, processes documents, and makes smart decisions automatically.',
    highlights: [
      'Natural language processing',
      'Intelligent document extraction',
      'Predictive analytics',
      'Auto-suggestions for optimization',
    ],
    color: '#805ad5',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    icon: Workflow,
    title: 'Visual Workflow Builder',
    description: 'Design complex automations with our intuitive drag-and-drop interface. No coding required—build powerful workflows in minutes with our visual canvas.',
    highlights: [
      'Drag-and-drop interface',
      'Pre-built templates',
      'Real-time testing',
      'Version control & rollback',
    ],
    color: '#3182ce',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Plug,
    title: '500+ Integrations',
    description: 'Connect to virtually any application or service. From Microsoft 365 to Salesforce, SAP to custom APIs—TaskBot integrates with your entire tech stack.',
    highlights: [
      'Pre-built connectors',
      'Custom API support',
      'Database connections',
      'Legacy system integration',
    ],
    color: '#38b2ac',
    gradient: 'from-teal-500 to-green-600',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Rest easy with enterprise-grade security. SOC 2 compliant, end-to-end encryption, and granular access controls keep your data safe.',
    highlights: [
      'SOC 2 Type II certified',
      'End-to-end encryption',
      'SSO & MFA support',
      'Audit logging & compliance',
    ],
    color: '#e53e3e',
    gradient: 'from-red-500 to-orange-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description: 'Gain deep insights into your automation performance. Track ROI, identify bottlenecks, and optimize workflows with powerful analytics dashboards.',
    highlights: [
      'Real-time dashboards',
      'ROI tracking',
      'Performance metrics',
      'Custom reports',
    ],
    color: '#ed8936',
    gradient: 'from-orange-500 to-yellow-600',
  },
];

const additionalFeatures = [
  { icon: Zap, title: 'Lightning Fast', description: 'Execute thousands of tasks per minute' },
  { icon: Globe, title: 'Global Scale', description: 'Deploy across regions with low latency' },
  { icon: Cpu, title: 'RPA Capabilities', description: 'Automate desktop and legacy apps' },
  { icon: Lock, title: 'Data Privacy', description: 'GDPR and CCPA compliant' },
  { icon: LineChart, title: 'Process Mining', description: 'Discover automation opportunities' },
  { icon: Sparkles, title: 'Smart Triggers', description: 'Event-driven automation' },
];

const stats = [
  { value: '500+', label: 'Integrations' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '10M+', label: 'Workflows Run Daily' },
  { value: '50%', label: 'Avg. Time Saved' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#38b2ac] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              PLATFORM FEATURES
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Everything you need to
              <span className="block text-[#ed8936]">automate at scale</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              TaskBot combines AI-powered intelligence with enterprise-grade reliability 
              to transform how your organization works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/request-demo">
                <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                  <Play className="mr-2 w-5 h-5" />
                  See It In Action
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#1a365d] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for enterprises, loved by teams. Discover the capabilities that make TaskBot 
              the leading automation platform.
            </p>
          </motion.div>

          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#48bb78]" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 aspect-square max-w-md mx-auto flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                    <feature.icon className="w-32 h-32 text-white/90 relative z-10" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">And Much More</h2>
            <p className="text-lg text-gray-600">Additional capabilities to supercharge your automation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-[#1a365d]/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#1a365d]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a365d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform your workflows?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of organizations already automating with TaskBot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
