import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Zap, 
  Workflow, 
  Brain, 
  Shield, 
  Star,
  CheckCircle2,
  Sparkles,
  Building2,
  Users,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Workflow,
    title: 'Cloud Flows',
    description: 'Automate cloud-based processes with pre-built connectors to 500+ services.',
    color: '#3182ce',
    link: '/products/cloud-flows',
  },
  {
    icon: Zap,
    title: 'Desktop Flows',
    description: 'Automate repetitive desktop tasks with AI-powered RPA technology.',
    color: '#805ad5',
    link: '/products/desktop-flows',
  },
  {
    icon: Brain,
    title: 'AI Builder',
    description: 'Add intelligence to your workflows with no-code AI models.',
    color: '#38b2ac',
    link: '/products/ai-builder',
  },
  {
    icon: TrendingUp,
    title: 'Process Mining',
    description: 'Discover, analyze, and optimize your business processes.',
    color: '#ed8936',
    link: '/products/process-mining',
  },
];

const testimonials = [
  {
    quote: "TaskBot transformed our operations. We've automated 80% of our manual processes and saved over 10,000 hours annually.",
    author: "Sarah Chen",
    role: "VP of Operations",
    company: "TechCorp Global",
    avatar: "SC",
  },
  {
    quote: "The AI Builder feature is a game-changer. We built custom document processing in days, not months.",
    author: "Michael Rivera",
    role: "IT Director",
    company: "FinanceFirst Inc",
    avatar: "MR",
  },
  {
    quote: "Implementation was seamless. TaskBot's enterprise security gave our compliance team peace of mind.",
    author: "Jennifer Park",
    role: "CISO",
    company: "HealthPlus Systems",
    avatar: "JP",
  },
];

const trustedLogos = [
  { name: 'Microsoft', color: '#00a4ef' },
  { name: 'Salesforce', color: '#00a1e0' },
  { name: 'Adobe', color: '#ff0000' },
  { name: 'SAP', color: '#008fd3' },
  { name: 'Oracle', color: '#f80000' },
  { name: 'IBM', color: '#0530ad' },
];

const stats = [
  { value: '10M+', label: 'Workflows Executed Daily' },
  { value: '500+', label: 'Pre-built Connectors' },
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '50%', label: 'Average Time Saved' },
];

// Animation variants for consistent timing
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0078d4] via-[#005a9e] to-[#004578] py-16 sm:py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        {/* Floating Elements - more subtle */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-[12%] w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-32 left-[8%] w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-[5%] w-10 h-10 bg-white/5 rounded-xl backdrop-blur-sm hidden xl:block"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4 mr-2 text-[#ffc83d]" />
                AI-POWERED AUTOMATION PLATFORM
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-5 lg:mb-6 leading-[1.1]"
              >
                Automate anything.
                <span className="block text-[#ffc83d] mt-1">Achieve everything.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-xl"
              >
                TaskBot empowers everyone to build automated workflows between apps and services—no code required. 
                Save time, reduce errors, and focus on what matters most.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link to="/signup">
                  <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#004578] font-semibold px-8 h-12 w-full sm:w-auto shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/request-demo">
                  <Button size="lg" variant="outline" className="border-white/80 text-white hover:bg-white/10 h-12 w-full sm:w-auto transition-all duration-200">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-6 text-white/60 text-sm flex flex-wrap gap-x-4 gap-y-1"
              >
                <span>✓ No credit card required</span>
                <span>✓ 14-day free trial</span>
                <span>✓ Cancel anytime</span>
              </motion.p>
            </motion.div>
            
            {/* Mobile Flow Diagram - Simplified version for small screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:hidden mt-8"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    <span className="ml-auto text-xs text-gray-400 font-medium">TaskBot Flow</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-8 h-8 bg-[#0078d4] rounded-md flex items-center justify-center flex-shrink-0">
                        <Workflow className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 truncate">Email</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <div className="flex-1 flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="w-8 h-8 bg-[#805ad5] rounded-md flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 truncate">AI</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <div className="flex-1 flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-8 h-8 bg-[#38a169] rounded-md flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 truncate">CRM</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Desktop Flow Diagram - Full version for large screens */}
            {/* Workflow Diagram - Mobile Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 sm:p-6 xl:p-8 border border-white/20 shadow-2xl">
                <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-5 xl:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                    <span className="ml-auto text-[10px] sm:text-xs text-gray-400 font-medium">TaskBot Flow</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0078d4] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Workflow className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">New email received</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Trigger: Outlook 365</div>
                      </div>
                    </motion.div>
                    
                    <div className="flex justify-center py-0.5">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 rotate-90" />
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-purple-50 rounded-lg sm:rounded-xl border border-purple-100"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#805ad5] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Extract data with AI</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Action: AI Builder</div>
                      </div>
                    </motion.div>
                    
                    <div className="flex justify-center py-0.5">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 rotate-90" />
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl border border-green-100"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#38a169] rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Update CRM record</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Action: Salesforce</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 lg:py-14 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-400 text-xs font-semibold tracking-wider mb-6 lg:mb-8"
          >
            TRUSTED BY LEADING COMPANIES WORLDWIDE
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 lg:gap-14"
          >
            {trustedLogos.map((logo) => (
              <motion.div 
                key={logo.name} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors duration-200 cursor-default"
              >
                {logo.name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="text-center py-4 lg:py-6"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0078d4] mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-500 leading-snug">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              One platform. Endless possibilities.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From simple task automation to complex enterprise workflows, TaskBot has everything you need.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                transition={{ duration: 0.4 }}
              >
                <Link to={feature.link} className="block h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white group">
                    <CardContent className="p-6 lg:p-7 flex flex-col h-full">
                      <div
                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${feature.color}12` }}
                      >
                        <feature.icon className="w-6 h-6 lg:w-7 lg:h-7" style={{ color: feature.color }} />
                      </div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm lg:text-base mb-4 flex-grow leading-relaxed">{feature.description}</p>
                      <div className="flex items-center text-[#0078d4] font-medium text-sm lg:text-base group-hover:gap-2 transition-all duration-200">
                        Learn more <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why TaskBot Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
                Why choose TaskBot?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                TaskBot combines the power of enterprise automation with the simplicity 
                of a consumer app. Here's what sets us apart:
              </p>
              <div className="space-y-5">
                {[
                  { icon: Shield, title: 'Enterprise-grade security', description: 'SOC 2 Type II certified with end-to-end encryption' },
                  { icon: Users, title: 'Built for teams', description: 'Collaborate seamlessly with role-based access controls' },
                  { icon: Building2, title: 'Scales with you', description: 'From startup to Fortune 500, TaskBot grows with your needs' },
                  { icon: Brain, title: 'AI-first approach', description: 'Intelligent automation that learns and improves over time' },
                ].map((item, index) => (
                  <motion.div 
                    key={item.title} 
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-11 h-11 lg:w-12 lg:h-12 bg-[#0078d4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#0078d4]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-0.5">{item.title}</h3>
                      <p className="text-gray-600 text-sm lg:text-base">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#0078d4] to-[#005a9e] rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white shadow-xl">
                <div className="text-5xl lg:text-6xl font-bold mb-3">90%</div>
                <div className="text-lg lg:text-xl font-semibold mb-2">Reduction in manual tasks</div>
                <p className="text-white/80 mb-6 text-sm lg:text-base leading-relaxed">
                  On average, TaskBot customers automate 90% of their repetitive tasks within the first 6 months.
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/20">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm lg:text-base">
                    TC
                  </div>
                  <div>
                    <div className="font-medium text-sm lg:text-base">TechCorp Global</div>
                    <div className="text-white/70 text-xs lg:text-sm">Enterprise Customer</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Loved by teams everywhere
            </h2>
            <p className="text-lg text-gray-600">
              See what our customers have to say about TaskBot
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-5 lg:gap-6"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.author}
                variants={fadeInUp}
                transition={{ duration: 0.4 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 lg:p-7 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 lg:w-5 lg:h-5 fill-[#ffc83d] text-[#ffc83d]" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm lg:text-base flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 lg:w-11 lg:h-11 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm lg:text-base">{testimonial.author}</div>
                        <div className="text-xs lg:text-sm text-gray-500 truncate">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-[#0078d4] to-[#005a9e] relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Ready to automate your work?
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join over 100,000 organizations automating with TaskBot. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#ffc83d] hover:bg-[#e6b435] text-[#004578] font-semibold px-8 h-12 shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/80 text-white hover:bg-white/10 h-12 transition-all duration-200 w-full sm:w-auto">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
