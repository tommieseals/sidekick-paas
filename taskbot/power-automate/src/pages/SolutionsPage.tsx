import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Sparkles,
  Building2,
  Heart,
  Factory,
  ShoppingCart,
  Users,
  Monitor,
  TrendingUp,
  Headphones,
  CheckCircle2,
  Play,
  Briefcase,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const industries = [
  {
    icon: Building2,
    title: 'Financial Services',
    description: 'Automate compliance, fraud detection, loan processing, and customer onboarding with AI-powered workflows.',
    link: '/solutions/finance',
    color: '#3182ce',
    stats: '45% faster processing',
    useCases: ['KYC Automation', 'Invoice Processing', 'Risk Assessment'],
  },
  {
    icon: Heart,
    title: 'Healthcare',
    description: 'Streamline patient intake, claims processing, appointment scheduling, and EHR data management.',
    link: '/solutions/healthcare',
    color: '#e53e3e',
    stats: '60% reduced admin time',
    useCases: ['Patient Onboarding', 'Claims Management', 'Lab Results'],
  },
  {
    icon: Factory,
    title: 'Manufacturing',
    description: 'Optimize supply chain, quality control, inventory management, and production workflows.',
    link: '/solutions/manufacturing',
    color: '#805ad5',
    stats: '35% cost reduction',
    useCases: ['Inventory Control', 'Quality Assurance', 'Supply Chain'],
  },
  {
    icon: ShoppingCart,
    title: 'Retail',
    description: 'Transform inventory management, order fulfillment, customer service, and pricing optimization.',
    link: '/solutions/retail',
    color: '#ed8936',
    stats: '50% faster fulfillment',
    useCases: ['Order Processing', 'Returns Management', 'Price Updates'],
  },
];

const functions = [
  {
    icon: Users,
    title: 'Human Resources',
    description: 'Automate recruitment, onboarding, payroll, leave management, and employee lifecycle processes.',
    link: '/solutions/hr',
    color: '#38b2ac',
    stats: '70% faster onboarding',
  },
  {
    icon: Monitor,
    title: 'IT Operations',
    description: 'Streamline service desk, user provisioning, security monitoring, and infrastructure management.',
    link: '/solutions/it',
    color: '#4299e1',
    stats: '80% ticket automation',
  },
  {
    icon: TrendingUp,
    title: 'Sales',
    description: 'Accelerate lead management, quote generation, contract processing, and CRM data sync.',
    link: '/solutions/sales',
    color: '#48bb78',
    stats: '3x faster quotes',
  },
  {
    icon: Headphones,
    title: 'Customer Service',
    description: 'Transform case routing, response automation, sentiment analysis, and knowledge management.',
    link: '/solutions/customer-service',
    color: '#9f7aea',
    stats: '65% faster resolution',
  },
];

const stats = [
  { value: '500+', label: 'Enterprise Clients' },
  { value: '12M', label: 'Processes Automated' },
  { value: '40%', label: 'Avg. Cost Savings' },
  { value: '99.9%', label: 'Uptime SLA' },
];

const testimonials = [
  {
    quote: "TaskBot transformed our financial operations. We've reduced invoice processing time by 75% and virtually eliminated errors.",
    author: "Sarah Chen",
    role: "CFO",
    company: "Global Finance Corp",
    rating: 5,
  },
  {
    quote: "The healthcare-specific automations helped us become HIPAA compliant while cutting administrative costs by 40%.",
    author: "Dr. Michael Torres",
    role: "CIO",
    company: "Metro Health System",
    rating: 5,
  },
  {
    quote: "Our manufacturing floor runs like clockwork now. Inventory accuracy went from 85% to 99.7%.",
    author: "Jennifer Walsh",
    role: "VP Operations",
    company: "Industrial Dynamics",
    rating: 5,
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#805ad5] py-16 sm:py-20 lg:py-24 relative overflow-hidden">
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
              SOLUTIONS BY INDUSTRY & FUNCTION
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
              Automation solutions for
              <span className="block text-[#ed8936]">every business need</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8">
              Whether you're in finance, healthcare, retail, or manufacturing—TaskBot has 
              purpose-built automation solutions to transform your operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/request-demo">
                <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                  <Play className="mr-2 w-5 h-5" />
                  See Solutions Demo
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Talk to an Expert
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

      {/* Industries Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#1a365d]/10 rounded-full text-[#1a365d] text-sm font-medium mb-4">
              <Building2 className="w-4 h-4 mr-2" />
              BY INDUSTRY
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industry-specific solutions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built automation templates and workflows designed for the unique 
              challenges of your industry.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={industry.link}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                    <div className="flex items-start gap-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${industry.color}15` }}
                      >
                        <industry.icon className="w-8 h-8" style={{ color: industry.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{industry.title}</h3>
                          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                            {industry.stats}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{industry.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {industry.useCases.map((useCase) => (
                            <span
                              key={useCase}
                              className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                            >
                              {useCase}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center text-[#ed8936] font-semibold">
                          Explore solutions <ArrowRight className="ml-2 w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Functions Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#ed8936]/10 rounded-full text-[#ed8936] text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4 mr-2" />
              BY FUNCTION
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Departmental automation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Empower every team with automation tailored to their specific workflows and challenges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {functions.map((func, index) => (
              <motion.div
                key={func.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={func.link}>
                  <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-full border border-gray-100">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${func.color}15` }}
                    >
                      <func.icon className="w-7 h-7" style={{ color: func.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{func.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{func.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-green-700">{func.stats}</span>
                      <ArrowRight className="w-4 h-4 text-[#ed8936]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How we deliver results</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our proven methodology ensures successful automation deployment and measurable ROI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'We analyze your processes and identify automation opportunities' },
              { step: '02', title: 'Design', desc: 'Custom workflows built around your specific requirements' },
              { step: '03', title: 'Deploy', desc: 'Seamless implementation with minimal business disruption' },
              { step: '04', title: 'Optimize', desc: 'Continuous improvement based on performance analytics' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-[#ed8936]/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by industry leaders</h2>
            <p className="text-lg text-gray-600">See what our customers have to say</p>
          </motion.div>
          
          <TestimonialGrid testimonials={testimonials} columns={3} />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-[#1a365d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Why businesses choose TaskBot
              </h2>
              <p className="text-xl text-white/80 mb-8">
                From startups to Fortune 500 companies, organizations trust TaskBot 
                to deliver measurable automation results.
              </p>
              <ul className="space-y-4">
                {[
                  'Pre-built industry templates for faster deployment',
                  'AI-powered process discovery and optimization',
                  'Enterprise-grade security and compliance',
                  'Dedicated customer success team',
                  '24/7 global support coverage',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#48bb78]" />
                    <span className="text-white">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8"
            >
              <div className="text-center">
                <Zap className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
                <p className="text-white/80 mb-6">
                  Schedule a personalized demo to see how TaskBot can transform your operations.
                </p>
                <Link to="/request-demo">
                  <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white w-full">
                    Request Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
