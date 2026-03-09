import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Cloud,
  Monitor,
  Brain,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Workflow,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const products = [
  {
    icon: Cloud,
    title: 'Cloud Flows',
    tagline: 'Connect your apps. Automate your work.',
    description: 'Create automated workflows between your favorite apps and services to synchronize files, collect data, and more—without writing a single line of code.',
    features: [
      '500+ pre-built connectors',
      'Instant and scheduled triggers',
      'Conditional logic & loops',
      'Error handling & retry policies',
    ],
    color: '#0078d4',
    gradient: 'from-[#0078d4] to-[#00bcf2]',
    link: '/products/cloud-flows',
    cta: 'Explore Cloud Flows',
  },
  {
    icon: Monitor,
    title: 'Desktop Flows',
    tagline: 'Automate your desktop. Free your time.',
    description: 'Record and automate repetitive tasks on your desktop with robotic process automation (RPA). Perfect for legacy systems without APIs.',
    features: [
      'Record & playback actions',
      'UI automation for any app',
      'Web scraping capabilities',
      'Attended & unattended modes',
    ],
    color: '#805ad5',
    gradient: 'from-[#805ad5] to-[#b794f4]',
    link: '/products/desktop-flows',
    cta: 'Explore Desktop Flows',
  },
  {
    icon: Brain,
    title: 'AI Builder',
    tagline: 'Add intelligence. No expertise required.',
    description: 'Bring AI to your workflows with pre-built models or train custom models—no machine learning expertise needed.',
    features: [
      'Document processing',
      'Form recognition',
      'Object detection',
      'Text classification',
    ],
    color: '#38b2ac',
    gradient: 'from-[#38b2ac] to-[#4fd1c5]',
    link: '/products/ai-builder',
    cta: 'Explore AI Builder',
  },
  {
    icon: LineChart,
    title: 'Process Mining',
    tagline: 'Discover inefficiencies. Optimize everything.',
    description: 'Visualize and analyze your business processes to identify bottlenecks, redundancies, and automation opportunities.',
    features: [
      'Process visualization',
      'Bottleneck detection',
      'Compliance monitoring',
      'ROI analytics',
    ],
    color: '#ed8936',
    gradient: 'from-[#ed8936] to-[#f6ad55]',
    link: '/products/process-mining',
    cta: 'Explore Process Mining',
  },
];

const platformBenefits = [
  {
    icon: Workflow,
    title: 'Low-code/No-code',
    description: 'Build powerful automations without writing code. Visual designers make it easy for anyone.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2, GDPR, and HIPAA compliant. Your data is protected with enterprise-grade encryption.',
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Deploy across regions with low latency. Handle millions of workflow runs daily.',
  },
  {
    icon: Zap,
    title: 'Instant Integration',
    description: 'Connect to 500+ services out of the box. Custom APIs? We support those too.',
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#3182ce] py-16 sm:py-20 lg:py-24 relative overflow-hidden">
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
              COMPLETE AUTOMATION PLATFORM
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
              Everything you need to
              <span className="block text-[#ffc83d]">automate at scale</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              TaskBot offers a complete suite of automation tools—from cloud workflows 
              to AI-powered document processing. Find the right solution for every challenge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#1a365d] font-semibold px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
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

      {/* Products Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive suite of automation tools designed to work together seamlessly.
            </p>
          </motion.div>

          <div className="space-y-16">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Content */}
                <div className="flex-1 max-w-xl">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${product.color}15` }}
                  >
                    <product.icon className="w-8 h-8" style={{ color: product.color }} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-lg font-medium text-gray-700 mb-4">{product.tagline}</p>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#48bb78]" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={product.link}>
                    <Button className="bg-[#0078d4] hover:bg-[#005a9e] text-white">
                      {product.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Visual Card */}
                <div className="flex-1 w-full max-w-lg">
                  <div className={`bg-gradient-to-br ${product.gradient} rounded-2xl lg:rounded-3xl p-6 lg:p-8 aspect-[16/10] sm:aspect-[4/3] flex items-center justify-center relative overflow-hidden shadow-2xl`}>
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full"></div>
                    <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/10 rounded-full"></div>
                    
                    <div className="relative z-10 text-center text-white">
                      <product.icon className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4 opacity-90" />
                      <div className="text-lg lg:text-xl font-semibold">{product.title}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Benefits</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every TaskBot product is built on our enterprise-grade platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 bg-[#0078d4]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <benefit.icon className="w-7 h-7 text-[#0078d4]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Products */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose the Right Solution</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Not sure which product fits your needs? Here's a quick guide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Mobile scroll hint */}
            <div className="lg:hidden px-4 py-3 bg-gray-50 text-center text-sm text-gray-500 border-b">
              ← Scroll horizontally to compare →
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-[#1a365d] text-white">
                    <th className="px-4 sm:px-6 py-4 text-left text-sm sm:text-base">Use Case</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm sm:text-base whitespace-nowrap">Cloud Flows</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm sm:text-base whitespace-nowrap">Desktop Flows</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm sm:text-base whitespace-nowrap">AI Builder</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm sm:text-base whitespace-nowrap">Process Mining</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { useCase: 'Connect cloud apps (SaaS)', cloud: true, desktop: false, ai: false, mining: false },
                    { useCase: 'Automate desktop applications', cloud: false, desktop: true, ai: false, mining: false },
                    { useCase: 'Process documents with AI', cloud: true, desktop: false, ai: true, mining: false },
                    { useCase: 'Analyze business processes', cloud: false, desktop: false, ai: false, mining: true },
                    { useCase: 'Legacy system automation', cloud: false, desktop: true, ai: false, mining: false },
                    { useCase: 'Trigger-based automation', cloud: true, desktop: true, ai: false, mining: false },
                    { useCase: 'Custom ML models', cloud: false, desktop: false, ai: true, mining: false },
                    { useCase: 'Identify optimization opportunities', cloud: false, desktop: false, ai: false, mining: true },
                  ].map((row, index) => (
                    <tr key={row.useCase} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 text-sm sm:text-base">{row.useCase}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                        {row.cloud ? <CheckCircle2 className="w-5 h-5 text-[#48bb78] mx-auto" /> : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.desktop ? <CheckCircle2 className="w-5 h-5 text-[#48bb78] mx-auto" /> : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.ai ? <CheckCircle2 className="w-5 h-5 text-[#48bb78] mx-auto" /> : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.mining ? <CheckCircle2 className="w-5 h-5 text-[#48bb78] mx-auto" /> : <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
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
              Ready to get started?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Try TaskBot free for 14 days. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#1a365d] font-semibold px-8">
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
