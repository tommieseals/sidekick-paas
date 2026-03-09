import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Lightbulb, Target, BarChart3, CheckCircle, ArrowRight,
  Clock, DollarSign, Users, Zap, Brain, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import NewsletterModal from '@/components/NewsletterModal';

const discoverySteps = [
  {
    icon: Search,
    title: 'Process Discovery',
    description: 'Our experts analyze your current workflows to identify automation opportunities and bottlenecks.',
  },
  {
    icon: Target,
    title: 'Prioritization',
    description: 'We rank processes by ROI potential, complexity, and business impact to create an optimal automation roadmap.',
  },
  {
    icon: Lightbulb,
    title: 'Solution Design',
    description: 'Custom automation blueprints tailored to your unique business requirements and technology stack.',
  },
  {
    icon: BarChart3,
    title: 'ROI Projection',
    description: 'Detailed cost-benefit analysis showing expected savings, efficiency gains, and payback period.',
  },
];

const benefits = [
  { icon: Clock, value: '70%', label: 'Time Saved on Manual Tasks' },
  { icon: DollarSign, value: '45%', label: 'Cost Reduction' },
  { icon: Users, value: '3x', label: 'Team Productivity Increase' },
  { icon: Zap, value: '99.9%', label: 'Accuracy Rate' },
];

const automationAreas = [
  {
    icon: Brain,
    title: 'AI-Powered Document Processing',
    description: 'Extract data from invoices, contracts, and forms with intelligent OCR and machine learning.',
    useCases: ['Invoice processing', 'Contract analysis', 'Form digitization'],
  },
  {
    icon: Layers,
    title: 'Workflow Orchestration',
    description: 'Connect disparate systems and automate multi-step processes across your organization.',
    useCases: ['Employee onboarding', 'Order fulfillment', 'Approval workflows'],
  },
  {
    icon: BarChart3,
    title: 'Reporting & Analytics',
    description: 'Automate data collection, report generation, and dashboard updates.',
    useCases: ['Financial reporting', 'KPI dashboards', 'Compliance reports'],
  },
];

export default function DiscoveryPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Newsletter Modal */}
      <NewsletterModal triggerOnScroll scrollPercentage={60} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#38b2ac] py-24 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <Search className="w-4 h-4 mr-2" />
                FREE AUTOMATION DISCOVERY
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Discover Your{' '}
                <span className="text-[#ed8936]">Automation Potential</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Let our experts analyze your business processes and uncover opportunities 
                to save time, reduce costs, and boost productivity with intelligent automation.
              </p>
              <div className="flex flex-wrap gap-4">
                {['Free Assessment', 'No Commitment', 'Expert Consultation'].map((item) => (
                  <div key={item} className="flex items-center text-white/90">
                    <CheckCircle className="w-5 h-5 mr-2 text-[#48bb78]" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LeadCaptureForm
                source="discovery"
                title="Schedule Your Free Discovery Session"
                subtitle="Talk to an automation expert today"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-[#1a365d]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-[#1a365d]" />
                </div>
                <div className="text-4xl font-bold text-[#1a365d] mb-2">{benefit.value}</div>
                <div className="text-gray-600 text-sm">{benefit.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Discovery Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A structured approach to understanding your automation needs and delivering maximum value
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {discoverySteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1a365d] to-[#4299e1] rounded-xl flex items-center justify-center mb-6 text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < discoverySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#1a365d] to-[#4299e1]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Areas */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Can You Automate?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the key areas where TaskBot delivers transformative results
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {automationAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#ed8936] to-[#dd6b20] rounded-2xl flex items-center justify-center mb-6">
                  <area.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{area.title}</h3>
                <p className="text-gray-600 mb-6">{area.description}</p>
                <div className="space-y-2">
                  {area.useCases.map((useCase) => (
                    <div key={useCase} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#48bb78]" />
                      {useCase}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#1a365d] to-[#2c5282]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join hundreds of companies that have already discovered their automation potential with TaskBot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/request-demo">
                <Button
                  size="lg"
                  className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8 py-6 text-lg"
                >
                  Schedule Discovery Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
