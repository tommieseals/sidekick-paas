import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Handshake, ArrowRight, Award, TrendingUp, Users, Globe, CheckCircle2,
  Star, Crown, Shield, Zap, BookOpen, HeadphonesIcon, Gift,
  BarChart3, Percent, DollarSign, Building2, Quote, ExternalLink,
  Laptop, Lock, Rocket, BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Partner Program Tiers
const partnerTiers = [
  {
    name: 'Silver',
    icon: Award,
    color: 'from-slate-400 to-slate-500',
    borderColor: 'border-slate-300',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    revenue: '10%',
    description: 'Perfect for getting started with TaskBot partnership',
    requirements: ['2+ certified consultants', '$50K annual revenue', 'Basic training completion'],
    benefits: [
      { icon: Percent, text: '10% revenue share' },
      { icon: BookOpen, text: 'Partner portal access' },
      { icon: HeadphonesIcon, text: 'Email support' },
      { icon: Gift, text: 'Marketing starter kit' },
    ],
    popular: false,
  },
  {
    name: 'Gold',
    icon: Star,
    color: 'from-amber-400 to-amber-600',
    borderColor: 'border-amber-400',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    revenue: '20%',
    description: 'For established partners driving significant value',
    requirements: ['5+ certified consultants', '$250K annual revenue', 'Advanced certification'],
    benefits: [
      { icon: Percent, text: '20% revenue share' },
      { icon: Zap, text: 'Priority deal registration' },
      { icon: HeadphonesIcon, text: '24/7 phone support' },
      { icon: Users, text: 'Co-selling opportunities' },
      { icon: BarChart3, text: 'Advanced analytics' },
      { icon: Gift, text: 'MDF funds ($5K/quarter)' },
    ],
    popular: true,
  },
  {
    name: 'Platinum',
    icon: Crown,
    color: 'from-violet-500 to-purple-700',
    borderColor: 'border-violet-400',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    revenue: '30%',
    description: 'Elite partnership with maximum benefits & exclusivity',
    requirements: ['10+ certified consultants', '$1M+ annual revenue', 'Executive sponsor'],
    benefits: [
      { icon: Percent, text: '30% revenue share' },
      { icon: Shield, text: 'Dedicated partner manager' },
      { icon: Rocket, text: 'Early access to features' },
      { icon: Building2, text: 'Joint go-to-market' },
      { icon: Crown, text: 'Executive briefings' },
      { icon: Gift, text: 'MDF funds ($25K/quarter)' },
      { icon: Globe, text: 'Global event invitations' },
      { icon: BadgeCheck, text: 'Premium badge & listings' },
    ],
    popular: false,
  },
];

// Partner Logos
const partnerLogos = [
  { name: 'Accenture', logo: 'A' },
  { name: 'Deloitte', logo: 'D' },
  { name: 'PwC', logo: 'PwC' },
  { name: 'KPMG', logo: 'K' },
  { name: 'Capgemini', logo: 'C' },
  { name: 'Infosys', logo: 'I' },
  { name: 'Wipro', logo: 'W' },
  { name: 'TCS', logo: 'TCS' },
  { name: 'Cognizant', logo: 'C' },
  { name: 'HCL', logo: 'HCL' },
  { name: 'Tech Mahindra', logo: 'TM' },
  { name: 'NTT Data', logo: 'NTT' },
];

// Success Stories
const successStories = [
  {
    company: 'GlobalTech Solutions',
    logo: 'GT',
    quote: "Partnering with TaskBot transformed our automation practice. We've grown revenue by 340% in just 18 months and expanded to 3 new markets.",
    author: 'Sarah Chen',
    role: 'VP of Partnerships',
    metric: '340%',
    metricLabel: 'Revenue Growth',
    tier: 'Platinum',
  },
  {
    company: 'Innovate Consulting',
    logo: 'IC',
    quote: "The partner program's training and support helped us deliver exceptional customer outcomes. Our NPS score jumped from 45 to 78.",
    author: 'Marcus Williams',
    role: 'Managing Director',
    metric: '78',
    metricLabel: 'NPS Score',
    tier: 'Gold',
  },
  {
    company: 'Digital Dynamics',
    logo: 'DD',
    quote: "From Silver to Gold in just one year. The co-marketing support and lead referrals have been game-changers for our business.",
    author: 'Emma Rodriguez',
    role: 'CEO',
    metric: '150+',
    metricLabel: 'New Clients',
    tier: 'Gold',
  },
];

// Stats
const stats = [
  { value: '2,500+', label: 'Partners Worldwide', icon: Handshake },
  { value: '85+', label: 'Countries', icon: Globe },
  { value: '$500M+', label: 'Partner Revenue', icon: DollarSign },
  { value: '98%', label: 'Partner Satisfaction', icon: Star },
];

// Partner Portal Features
const portalFeatures = [
  { icon: BarChart3, title: 'Deal Dashboard', description: 'Track opportunities, registrations, and pipeline in real-time' },
  { icon: BookOpen, title: 'Learning Center', description: 'On-demand training, certifications, and best practices' },
  { icon: Gift, title: 'Marketing Hub', description: 'Co-branded assets, campaigns, and MDF management' },
  { icon: HeadphonesIcon, title: 'Support Center', description: 'Technical resources, escalation paths, and knowledge base' },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#38b2ac] py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#38b2ac] rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 border border-white/20"
            >
              <Handshake className="w-4 h-4 mr-2" />
              PARTNER PROGRAM
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Grow Your Business
              <span className="block bg-gradient-to-r from-[#ed8936] to-[#f6ad55] bg-clip-text text-transparent">
                with TaskBot
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/85 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join 2,500+ partners worldwide and unlock new revenue streams, 
              exclusive resources, and enterprise opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8 py-6 text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
              >
                Become a Partner
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg backdrop-blur-sm"
              >
                View Partner Portal
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-b shadow-sm -mt-6 relative z-10 mx-4 lg:mx-auto max-w-6xl rounded-2xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div 
                key={stat.label}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1a365d]/10 rounded-xl mb-4">
                  <stat.icon className="w-6 h-6 text-[#1a365d]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-[#1a365d] mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Partner Tiers Section */}
      <section className="py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-[#1a365d]/10 rounded-full text-[#1a365d] text-sm font-semibold mb-4">
              PARTNERSHIP TIERS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Partnership Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three tiers designed to match your business goals. Higher tiers unlock more benefits, 
              resources, and revenue opportunities.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {partnerTiers.map((tier) => (
              <motion.div
                key={tier.name}
                variants={scaleIn}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`relative bg-white rounded-3xl p-8 border-2 ${tier.borderColor} ${
                  tier.popular ? 'shadow-2xl shadow-amber-200/50' : 'shadow-lg'
                } transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-sm font-bold rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                {/* Tier Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${tier.color} mb-4 shadow-lg`}>
                    <tier.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </div>

                {/* Revenue Share */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center">
                  <div className="text-sm text-gray-500 mb-1">Revenue Share</div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#1a365d] to-[#2c5282] bg-clip-text text-transparent">
                    {tier.revenue}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${tier.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <benefit.icon className={`w-4 h-4 ${tier.iconColor}`} />
                      </div>
                      <span className="text-gray-700 text-sm">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Requirements */}
                <div className="border-t pt-6 mb-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Requirements</div>
                  <ul className="space-y-2">
                    {tier.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className={`w-full py-6 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg' 
                      : 'bg-[#1a365d] hover:bg-[#2c5282] text-white'
                  }`}
                >
                  Apply for {tier.name}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-600">
              Join world-class organizations in our partner ecosystem
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {partnerLogos.map((partner) => (
              <motion.div
                key={partner.name}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group flex items-center justify-center h-24 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#1a365d]/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#1a365d] to-[#2c5282] rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                  {partner.logo}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-4">
              SUCCESS STORIES
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Partners Thriving with TaskBot
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our partners are growing their businesses and delivering exceptional results.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {successStories.map((story) => (
              <motion.div
                key={story.company}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Company Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1a365d] to-[#38b2ac] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {story.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{story.company}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      story.tier === 'Platinum' 
                        ? 'bg-violet-100 text-violet-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {story.tier} Partner
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#1a365d]/10" />
                  <p className="text-gray-600 italic pl-6 leading-relaxed">
                    "{story.quote}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <div>
                    <div className="font-semibold text-gray-900">{story.author}</div>
                    <div className="text-sm text-gray-500">{story.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#38b2ac]">{story.metric}</div>
                    <div className="text-xs text-gray-500">{story.metricLabel}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partner Portal Preview Section */}
      <section className="py-28 bg-[#1a365d] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#38b2ac] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#ed8936] rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-white/80 text-sm font-semibold mb-6">
                PARTNER PORTAL
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Everything You Need
                <span className="block text-[#38b2ac]">In One Place</span>
              </h2>
              <p className="text-xl text-white/80 mb-10">
                Access your dedicated partner portal with deal tracking, training resources, 
                marketing assets, and technical support — all designed to help you succeed.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {portalFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[#38b2ac]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-white/60">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Portal Preview */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser Header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-gray-400 flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      partners.taskbot.com
                    </div>
                  </div>
                </div>
                
                {/* Portal Content */}
                <div className="p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-gray-500">Welcome back,</div>
                      <div className="font-bold text-gray-900">Acme Solutions</div>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">
                      Gold Partner
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-[#1a365d]">$127K</div>
                      <div className="text-xs text-gray-500">Pipeline Value</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-xs text-gray-500">Active Deals</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-[#38b2ac]">8</div>
                      <div className="text-xs text-gray-500">Certifications</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Enterprise Corp - Implementation', status: 'In Progress', value: '$45,000' },
                      { label: 'Global Industries - License', status: 'Pending', value: '$32,000' },
                    ].map((deal, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{deal.label}</div>
                          <div className="text-xs text-gray-500">{deal.status}</div>
                        </div>
                        <div className="font-bold text-[#1a365d]">{deal.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 bg-[#ed8936] text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2"
              >
                <Laptop className="w-5 h-5" />
                <span className="font-semibold">24/7 Access</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Commission Structure Section */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-4">
              REVENUE SHARING
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Transparent Commission Structure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earn competitive margins on every deal. Higher tiers unlock better rates and additional incentives.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'License Revenue',
                description: 'Earn on every new and renewed license sold through your pipeline',
                rates: [
                  { tier: 'Silver', rate: '10%' },
                  { tier: 'Gold', rate: '15%' },
                  { tier: 'Platinum', rate: '20%' },
                ],
                icon: DollarSign,
              },
              {
                title: 'Services Revenue',
                description: 'Keep more margin on implementation and professional services',
                rates: [
                  { tier: 'Silver', rate: '15%' },
                  { tier: 'Gold', rate: '25%' },
                  { tier: 'Platinum', rate: '35%' },
                ],
                icon: TrendingUp,
              },
              {
                title: 'Referral Bonus',
                description: 'Earn additional bonuses for referring qualified opportunities',
                rates: [
                  { tier: 'Silver', rate: '5%' },
                  { tier: 'Gold', rate: '7%' },
                  { tier: 'Platinum', rate: '10%' },
                ],
                icon: Gift,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-[#1a365d]/10 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-[#1a365d]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                
                <div className="space-y-3">
                  {item.rates.map((rate) => (
                    <div key={rate.tier} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                      <span className="text-gray-700">{rate.tier}</span>
                      <span className="font-bold text-[#38b2ac] text-lg">{rate.rate}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#1a365d] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#38b2ac]/20 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto px-4 text-center relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-8"
          >
            <Rocket className="w-10 h-10 text-[#ed8936]" />
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Accelerate
            <span className="block text-[#38b2ac]">Your Growth?</span>
          </h2>
          
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of partners who are building successful automation practices with TaskBot. 
            Apply today and start earning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-10 py-6 text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
              >
                Apply to Partner Program
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg"
            >
              Download Partner Guide
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-10 border-t border-white/10">
            <p className="text-white/60 text-sm mb-6">Trusted by partners in 85+ countries</p>
            <div className="flex justify-center gap-8 flex-wrap">
              {['SOC 2', 'GDPR', 'ISO 27001', 'HIPAA'].map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-white/80">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
