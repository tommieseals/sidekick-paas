import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, ArrowRight, FileText, MessageSquare, Phone, Mail,
  Search, Book, Users, Ticket, MessageCircle, Play, ChevronDown, ChevronUp,
  CheckCircle, Zap, Crown, ExternalLink, Activity, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Support Channels
const supportChannels = [
  { 
    icon: Book, 
    title: 'Documentation', 
    description: 'Browse our comprehensive guides, API references, and best practices',
    href: '/resources/documentation', 
    action: 'Browse Docs',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  { 
    icon: Users, 
    title: 'Community', 
    description: 'Connect with thousands of TaskBot users, share tips, and get answers',
    href: '/resources/community', 
    action: 'Join Community',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  { 
    icon: Ticket, 
    title: 'Support Tickets', 
    description: 'Submit a ticket for technical issues and track your requests',
    href: '/support/tickets', 
    action: 'Create Ticket',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  { 
    icon: MessageCircle, 
    title: 'Live Chat', 
    description: 'Chat with our support team in real-time for immediate assistance',
    href: '#chat', 
    action: 'Start Chat',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
];

// Popular Articles
const popularArticles = [
  { title: 'Getting Started with TaskBot', category: 'Quick Start', readTime: '5 min', views: '12.4K' },
  { title: 'Creating Your First Flow', category: 'Flows', readTime: '8 min', views: '9.8K' },
  { title: 'Connecting to External APIs', category: 'Integrations', readTime: '12 min', views: '7.2K' },
  { title: 'Using AI Actions in Flows', category: 'AI Features', readTime: '10 min', views: '6.5K' },
  { title: 'Scheduling and Triggers', category: 'Automation', readTime: '7 min', views: '5.9K' },
  { title: 'Best Practices for Enterprise', category: 'Enterprise', readTime: '15 min', views: '4.3K' },
];

// Video Tutorials
const videoTutorials = [
  { 
    title: 'TaskBot Fundamentals', 
    duration: '15:24', 
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop',
    views: '45K',
    level: 'Beginner'
  },
  { 
    title: 'Advanced Flow Building', 
    duration: '28:15', 
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    views: '23K',
    level: 'Advanced'
  },
  { 
    title: 'AI Integration Masterclass', 
    duration: '42:30', 
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
    views: '18K',
    level: 'Expert'
  },
  { 
    title: 'Enterprise Deployment', 
    duration: '35:45', 
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=225&fit=crop',
    views: '12K',
    level: 'Enterprise'
  },
];

// FAQ Items
const faqItems = [
  {
    question: 'How do I get started with TaskBot?',
    answer: 'Getting started is easy! Sign up for a free account, then follow our interactive onboarding tutorial that will guide you through creating your first automated flow in under 5 minutes. You can also browse our documentation or watch our getting started video series.'
  },
  {
    question: 'What integrations does TaskBot support?',
    answer: 'TaskBot supports 500+ integrations including Microsoft 365, Google Workspace, Salesforce, SAP, Slack, Teams, and many more. We also offer custom connectors and a robust API for building your own integrations.'
  },
  {
    question: 'Is my data secure with TaskBot?',
    answer: 'Absolutely. TaskBot is SOC 2 Type II certified, GDPR compliant, and offers enterprise-grade security features including end-to-end encryption, SSO, and audit logging. Your data is encrypted at rest and in transit.'
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and you\'ll be credited for any unused time on your current plan. Downgrades take effect at the start of your next billing cycle.'
  },
  {
    question: 'What support is included with each plan?',
    answer: 'Free plans include community support and documentation access. Pro plans add email support with 24-hour response times. Enterprise plans include priority phone support, dedicated account managers, and SLA guarantees.'
  },
  {
    question: 'How do I migrate from another automation platform?',
    answer: 'We offer free migration assistance for Enterprise customers. Our team will help you analyze your existing workflows, plan the migration, and ensure a smooth transition with minimal downtime.'
  },
];

// Support Tiers
const supportTiers = [
  {
    name: 'Standard',
    icon: CheckCircle,
    description: 'For individuals and small teams',
    features: [
      'Community forum access',
      'Documentation & guides',
      'Email support (48h response)',
      'Knowledge base access',
    ],
    color: 'border-gray-200',
    buttonColor: 'bg-gray-900 hover:bg-gray-800',
  },
  {
    name: 'Premium',
    icon: Zap,
    description: 'For growing businesses',
    features: [
      'Everything in Standard',
      'Priority email support (24h)',
      'Live chat support',
      'Phone support (business hours)',
      'Onboarding assistance',
    ],
    color: 'border-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Crown,
    description: 'For large organizations',
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      '24/7 phone support',
      '1-hour response SLA',
      'Custom training sessions',
      'Quarterly business reviews',
    ],
    color: 'border-purple-500',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
];

// Contact Options
const contactOptions = [
  { icon: Mail, title: 'Email Support', description: 'support@taskbot.com', detail: 'Response within 24 hours', href: 'mailto:support@taskbot.com' },
  { icon: Phone, title: 'Phone Support', description: '+1 (800) TASKBOT', detail: 'Mon-Fri, 9am-6pm EST', href: 'tel:+18008275268' },
  { icon: MessageSquare, title: 'Live Chat', description: 'Available 24/7', detail: 'Average wait: 2 minutes', href: '#chat' },
];

// System Status
const systemStatus = {
  overall: 'operational',
  services: [
    { name: 'Flow Engine', status: 'operational' },
    { name: 'AI Services', status: 'operational' },
    { name: 'Connectors', status: 'operational' },
    { name: 'API Gateway', status: 'operational' },
  ]
};

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#3182ce] py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              SUPPORT CENTER
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-white/80 mb-10">
              Search our knowledge base, browse documentation, or contact our support team
            </p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, documentation, tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 text-lg rounded-2xl border-0 shadow-xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-shadow"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-white/60 text-sm">Popular:</span>
                {['Getting started', 'API docs', 'Integrations', 'Billing'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* System Status Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 right-6"
        >
          <Link 
            to="/status" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20 hover:bg-white/20 transition-colors"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            All Systems Operational
          </Link>
        </motion.div>
      </section>

      {/* Support Channels */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Link 
                  to={channel.href} 
                  className="group block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 ${channel.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <channel.icon className={`w-7 h-7 ${channel.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{channel.description}</p>
                  <span className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${channel.color} bg-clip-text text-transparent`}>
                    {channel.action} <ArrowRight className="ml-1 w-4 h-4 text-current opacity-70" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Articles</h2>
              <p className="text-gray-600 mt-2">Most viewed help articles this month</p>
            </div>
            <Link to="/resources/documentation" className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-medium">
              View all articles <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/resources/documentation/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{article.category}</span>
                      <span>{article.readTime} read</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Video Tutorials</h2>
              <p className="text-gray-600 mt-2">Learn TaskBot with step-by-step video guides</p>
            </div>
            <Link to="/resources/webinars" className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-medium">
              View all videos <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTutorials.map((video, index) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to="/resources/webinars" className="group block">
                  <div className="relative rounded-xl overflow-hidden mb-3 aspect-video">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-6 h-6 text-blue-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">
                      {video.level}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{video.views} views</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </motion.div>
          
          <div className="space-y-3">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <span className="flex-shrink-0 text-gray-400">
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the right level of support for your needs
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-8 border-2 ${tier.color} ${tier.popular ? 'shadow-xl' : 'shadow-md'}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tier.popular ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <tier.icon className={`w-6 h-6 ${tier.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-sm text-gray-500">{tier.description}</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${tier.buttonColor} text-white`}>
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">Reach out to our support team directly</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactOptions.map((option, index) => (
              <motion.a
                key={option.title}
                href={option.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <option.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-blue-600 font-medium mb-1">{option.description}</p>
                <p className="text-sm text-gray-500">{option.detail}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">System Status</h3>
                <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  All Systems Operational
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {systemStatus.services.map((service) => (
                <div key={service.name} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">{service.name}</span>
                </div>
              ))}
            </div>
            <Link to="/status" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View Status Page <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#3182ce]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AlertCircle className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Our support team is here to help you succeed with TaskBot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8 w-full sm:w-auto">
                  Contact Support <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/resources/community">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 w-full sm:w-auto">
                  Ask the Community
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
