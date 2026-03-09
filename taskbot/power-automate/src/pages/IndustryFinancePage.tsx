import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Building2,
  CheckCircle2,
  Play,
  FileText,
  Shield,
  CreditCard,
  Users,
  Clock,
  DollarSign,
  Lock,
  BarChart3,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const useCases = [
  {
    icon: FileText,
    title: 'Invoice Processing',
    description: 'Automatically extract, validate, and process invoices with AI-powered document understanding. Reduce manual entry by 90%.',
    benefits: ['Intelligent data extraction', 'Three-way matching', 'Exception handling', 'ERP integration'],
    savings: '85% faster processing',
  },
  {
    icon: Shield,
    title: 'KYC & Compliance',
    description: 'Streamline customer onboarding with automated identity verification, risk assessment, and regulatory compliance checks.',
    benefits: ['ID document verification', 'Watchlist screening', 'Risk scoring', 'Audit trail'],
    savings: '70% compliance cost reduction',
  },
  {
    icon: AlertTriangle,
    title: 'Fraud Detection',
    description: 'Real-time transaction monitoring with AI-powered anomaly detection to identify and prevent fraudulent activities.',
    benefits: ['Pattern recognition', 'Real-time alerts', 'Case management', 'ML model integration'],
    savings: '60% faster detection',
  },
  {
    icon: CreditCard,
    title: 'Loan Processing',
    description: 'Accelerate loan origination with automated document collection, credit checks, and approval workflows.',
    benefits: ['Document gathering', 'Credit bureau integration', 'Decision automation', 'Customer communication'],
    savings: '50% faster approvals',
  },
  {
    icon: BarChart3,
    title: 'Financial Reporting',
    description: 'Automate report generation, data consolidation, and distribution across multiple systems and stakeholders.',
    benefits: ['Data aggregation', 'Report generation', 'Scheduled delivery', 'Version control'],
    savings: '40 hours saved weekly',
  },
  {
    icon: Users,
    title: 'Account Management',
    description: 'Streamline account opening, maintenance, and closure processes with intelligent workflow automation.',
    benefits: ['Customer onboarding', 'Account updates', 'Status notifications', 'Cross-system sync'],
    savings: '65% faster onboarding',
  },
];

const stats = [
  { value: '85%', label: 'Faster Invoice Processing' },
  { value: '$2.4M', label: 'Avg. Annual Savings' },
  { value: '99.7%', label: 'Accuracy Rate' },
  { value: '3 weeks', label: 'Avg. Implementation' },
];

const testimonials = [
  {
    quote: "TaskBot transformed our accounts payable process. We went from processing 200 invoices per day to over 2,000 with the same team.",
    author: "Robert Martinez",
    role: "VP of Finance",
    company: "Atlantic Capital Group",
    rating: 5,
  },
  {
    quote: "The KYC automation reduced our customer onboarding time from 5 days to just 4 hours. Our compliance team can now focus on complex cases.",
    author: "Lisa Wong",
    role: "Chief Compliance Officer",
    company: "Pacific Trust Bank",
    rating: 5,
  },
  {
    quote: "We've prevented over $3M in fraudulent transactions since implementing TaskBot's fraud detection automation.",
    author: "David Kim",
    role: "Director of Risk",
    company: "Horizon Financial",
    rating: 5,
  },
];

const complianceLogos = [
  { name: 'SOC 2', desc: 'Type II Certified' },
  { name: 'GDPR', desc: 'Compliant' },
  { name: 'PCI DSS', desc: 'Level 1' },
  { name: 'ISO 27001', desc: 'Certified' },
];

export default function IndustryFinancePage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#3182ce] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                FINANCIAL SERVICES
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Automation for
                <span className="block text-[#ed8936]">modern finance</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                From invoice processing to compliance automation, TaskBot helps financial 
                institutions reduce costs, minimize risk, and accelerate operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-demo">
                  <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </Link>
                <Link to="/resources/case-studies">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </div>
            {/* Stats Grid - Mobile Responsive */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: FileText, label: 'Invoices Processed', value: '2.5M+' },
                    { icon: Shield, label: 'Compliance Checks', value: '500K+' },
                    { icon: Clock, label: 'Hours Saved', value: '1.2M' },
                    { icon: DollarSign, label: 'Client Savings', value: '$50M+' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#ed8936] mx-auto mb-1.5 sm:mb-2" />
                      <div className="text-lg sm:text-2xl font-bold text-white">{item.value}</div>
                      <div className="text-xs sm:text-sm text-white/70">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#1a365d] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Financial automation use cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions for the unique challenges of financial services.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-[#3182ce]/10 rounded-xl flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-[#3182ce]" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{useCase.title}</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {useCase.savings}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-[#48bb78]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-[#3182ce]/10 rounded-full text-[#3182ce] text-sm font-medium mb-4">
                <Lock className="w-4 h-4 mr-2" />
                SECURITY & COMPLIANCE
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for regulated industries
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TaskBot meets the stringent security and compliance requirements of financial 
                institutions. Our platform is designed with security-first architecture and 
                maintains certifications across major regulatory frameworks.
              </p>
              <ul className="space-y-4">
                {[
                  'End-to-end encryption for data at rest and in transit',
                  'Complete audit trail for all automated actions',
                  'Role-based access control and SSO integration',
                  'Data residency options for regional compliance',
                  'Regular third-party security audits',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#48bb78]" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-6">
                {complianceLogos.map((cert) => (
                  <div
                    key={cert.name}
                    className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="w-16 h-16 bg-[#1a365d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-[#1a365d]" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{cert.name}</div>
                    <div className="text-sm text-gray-600">{cert.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by leading financial institutions</h2>
            <p className="text-lg text-gray-600">See how organizations are transforming with TaskBot</p>
          </motion.div>
          
          <TestimonialGrid testimonials={testimonials} columns={3} />
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
            <Briefcase className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform your financial operations?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a personalized demo to see TaskBot's financial automation in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/request-demo">
                <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                  Request Demo
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
