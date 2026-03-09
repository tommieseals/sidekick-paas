import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Headphones,
  CheckCircle2,
  Play,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Heart,
  BarChart3,
  Users,
  Star,
  RefreshCw,
  Bot,
  FileText,
  Building,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const useCases = [
  {
    icon: Bot,
    title: 'Intelligent Chatbots',
    description: 'Deploy AI-powered chatbots that resolve common inquiries instantly, 24/7.',
    benefits: ['Natural language understanding', '24/7 availability', 'Seamless handoff', 'Multi-language support'],
    savings: '60% self-service rate',
  },
  {
    icon: MessageSquare,
    title: 'Ticket Routing & Triage',
    description: 'Automatically categorize, prioritize, and route tickets to the right agents.',
    benefits: ['AI categorization', 'Priority scoring', 'Skill-based routing', 'SLA monitoring'],
    savings: '50% faster routing',
  },
  {
    icon: Mail,
    title: 'Email Response Automation',
    description: 'Generate personalized email responses and handle routine inquiries automatically.',
    benefits: ['Response suggestions', 'Template automation', 'Sentiment analysis', 'Auto-responses'],
    savings: '70% faster responses',
  },
  {
    icon: RefreshCw,
    title: 'Case Management',
    description: 'Streamline case creation, updates, escalation, and resolution workflows.',
    benefits: ['Auto case creation', 'Status updates', 'Escalation triggers', 'Resolution tracking'],
    savings: '45% resolution improvement',
  },
  {
    icon: FileText,
    title: 'Knowledge Management',
    description: 'Automatically surface relevant knowledge articles and update documentation.',
    benefits: ['Article suggestions', 'Gap detection', 'Auto-updates', 'Usage analytics'],
    savings: '80% faster answers',
  },
  {
    icon: BarChart3,
    title: 'Customer Analytics',
    description: 'Automate satisfaction surveys, sentiment tracking, and performance reporting.',
    benefits: ['CSAT automation', 'Sentiment analysis', 'Trend detection', 'Agent performance'],
    savings: '25 NPS improvement',
  },
];

const stats = [
  { value: '65%', label: 'Faster Resolution' },
  { value: '60%', label: 'Self-Service Rate' },
  { value: '92%', label: 'CSAT Score' },
  { value: '$2.3M', label: 'Avg. Annual Savings' },
];

const testimonials = [
  {
    quote: "TaskBot chatbots resolve 60% of inquiries without human intervention. Our agents now handle complex cases while routine questions answer themselves.",
    author: "Patricia Johnson",
    role: "VP of Customer Experience",
    company: "ServiceFirst Inc",
    rating: 5,
  },
  {
    quote: "Response times dropped from 4 hours to 15 minutes. Customer satisfaction jumped 25 points. TaskBot transformed our support organization.",
    author: "Kevin Martinez",
    role: "Customer Support Director",
    company: "TechSupport Global",
    rating: 5,
  },
  {
    quote: "Intelligent routing ensures every ticket reaches the right agent immediately. First-contact resolution is up 40% since implementing TaskBot.",
    author: "Sandra Lee",
    role: "Head of Support Operations",
    company: "CustomerCare Partners",
    rating: 5,
  },
];

const channels = [
  { icon: MessageSquare, name: 'Live Chat', color: '#4299e1' },
  { icon: Mail, name: 'Email', color: '#ed8936' },
  { icon: Phone, name: 'Phone', color: '#48bb78' },
  { icon: Users, name: 'Social', color: '#805ad5' },
];

const supportPlatforms = [
  'Zendesk', 'Salesforce Service Cloud', 'Freshdesk', 'ServiceNow',
  'Intercom', 'HubSpot Service', 'Zoho Desk', 'Help Scout',
];

export default function FunctionCustomerServicePage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#553c9a] to-[#9f7aea] py-24 relative overflow-hidden">
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
                <Headphones className="w-4 h-4 mr-2" />
                CUSTOMER SERVICE AUTOMATION
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Delight customers
                <span className="block text-[#ed8936]">at scale</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Deliver exceptional customer experiences with intelligent automation. 
                Resolve issues faster, reduce costs, and keep customers happy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-demo">
                  <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                    <Play className="mr-2 w-5 h-5" />
                    See Support Demo
                  </Button>
                </Link>
                <Link to="/resources/templates">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
            {/* Stats Grid - Mobile Responsive */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: MessageSquare, label: 'Tickets Handled', value: '15M+' },
                    { icon: Clock, label: 'Hours Saved', value: '3M+' },
                    { icon: Star, label: 'CSAT Improvement', value: '+25pts' },
                    { icon: Building, label: 'Support Teams', value: '2,500+' },
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

      {/* Omnichannel Support */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Omnichannel automation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Deliver consistent, automated support across every channel your customers use.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {channels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${channel.color}15` }}
                >
                  <channel.icon className="w-8 h-8" style={{ color: channel.color }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{channel.name}</h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#9f7aea] mb-2">Unified</div>
                <p className="text-gray-600">Single queue across all channels</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#9f7aea] mb-2">Contextual</div>
                <p className="text-gray-600">Full customer history in every interaction</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#9f7aea] mb-2">Seamless</div>
                <p className="text-gray-600">Continue conversations across channels</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Customer service automation use cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions for world-class customer support.
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
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-[#9f7aea]/10 rounded-xl flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-[#9f7aea]" />
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

      {/* AI Chatbot Spotlight */}
      <section className="py-24 bg-gradient-to-r from-[#9f7aea] to-[#553c9a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                AI chatbots that actually help
              </h2>
              <p className="text-xl text-white/80 mb-8">
                TaskBot's AI-powered chatbots understand natural language, resolve complex 
                inquiries, and seamlessly hand off to human agents when needed.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Understands intent, not just keywords',
                  'Resolves 60% of inquiries automatically',
                  'Learns from every interaction',
                  'Seamless handoff with full context',
                  'Available 24/7 in 50+ languages',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-[#48bb78]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 shadow-2xl"
            >
              <div className="bg-gray-100 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#9f7aea] rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">TaskBot Assistant</div>
                    <div className="text-xs text-green-600">Online</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-3 ml-12">
                    <p className="text-gray-700 text-sm">Hi! How can I help you today?</p>
                  </div>
                  <div className="bg-[#9f7aea] rounded-xl p-3 mr-12">
                    <p className="text-white text-sm">I need to change my shipping address</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 ml-12">
                    <p className="text-gray-700 text-sm">I found order #12345. I'll update the address to 456 New Street. Is this correct?</p>
                  </div>
                  <div className="bg-[#9f7aea] rounded-xl p-3 mr-12">
                    <p className="text-white text-sm">Yes, that's right</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 ml-12">
                    <p className="text-gray-700 text-sm">Done! Your shipping address has been updated. Is there anything else I can help with?</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Issue resolved in 45 seconds</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Integrations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Integrates with your support stack</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pre-built connectors for leading customer service platforms.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {supportPlatforms.map((platform, index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Headphones className="w-8 h-8 text-[#1a365d] mx-auto mb-2" />
                <span className="font-semibold text-gray-700 text-sm">{platform}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Satisfaction */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-[#9f7aea]/10 rounded-full text-[#9f7aea] text-sm font-medium mb-4">
                <Heart className="w-4 h-4 mr-2" />
                CUSTOMER SATISFACTION
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Happy customers, happy business
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TaskBot helps you measure, track, and improve customer satisfaction 
                at every touchpoint. Automatic surveys, sentiment analysis, and 
                actionable insights drive continuous improvement.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { metric: '+25 pts', label: 'NPS improvement' },
                  { metric: '92%', label: 'CSAT score' },
                  { metric: '40%', label: 'FCR improvement' },
                  { metric: '65%', label: 'Faster resolution' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#9f7aea]">{item.metric}</div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#9f7aea] to-[#805ad5] rounded-3xl p-8 text-center"
            >
              <Star className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <div className="text-6xl font-bold text-white mb-2">4.9</div>
              <div className="text-white/80 mb-4">Average Customer Rating</div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by support leaders</h2>
            <p className="text-lg text-gray-600">See how support teams are transforming with TaskBot</p>
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
            <Headphones className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform customer service?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a personalized demo to see TaskBot's customer service automation in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/request-demo">
                <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                  Request Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/resources/templates">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore Support Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
