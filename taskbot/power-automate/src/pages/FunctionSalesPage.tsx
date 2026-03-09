import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Play,
  Users,
  FileText,
  Mail,
  Calendar,
  Target,
  DollarSign,
  BarChart3,
  Briefcase,
  Zap,
  RefreshCw,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const useCases = [
  {
    icon: Users,
    title: 'Lead Management',
    description: 'Automate lead capture, scoring, routing, and nurturing to accelerate your pipeline.',
    benefits: ['Lead scoring', 'Auto-routing', 'Nurture sequences', 'CRM sync'],
    savings: '3x more qualified leads',
  },
  {
    icon: FileText,
    title: 'Quote & Proposal Generation',
    description: 'Generate professional quotes and proposals automatically with dynamic pricing and terms.',
    benefits: ['Dynamic pricing', 'Template automation', 'Approval workflows', 'E-signatures'],
    savings: '80% faster quotes',
  },
  {
    icon: Mail,
    title: 'Email & Outreach Automation',
    description: 'Automate personalized outreach, follow-ups, and engagement tracking.',
    benefits: ['Sequence automation', 'Personalization', 'Response tracking', 'A/B testing'],
    savings: '5x response rate',
  },
  {
    icon: Calendar,
    title: 'Meeting Scheduling',
    description: 'Eliminate back-and-forth scheduling with intelligent calendar automation.',
    benefits: ['Calendar sync', 'Availability matching', 'Reminders', 'No-show follow-up'],
    savings: '2 hours saved daily',
  },
  {
    icon: RefreshCw,
    title: 'CRM Data Management',
    description: 'Keep your CRM clean and updated with automated data entry and enrichment.',
    benefits: ['Data entry automation', 'Enrichment', 'Duplicate detection', 'Activity logging'],
    savings: '90% cleaner data',
  },
  {
    icon: BarChart3,
    title: 'Sales Reporting',
    description: 'Automate pipeline reports, forecasts, and performance dashboards.',
    benefits: ['Pipeline reports', 'Forecast automation', 'Rep scorecards', 'Custom dashboards'],
    savings: '5 hours saved weekly',
  },
];

const stats = [
  { value: '35%', label: 'More Revenue' },
  { value: '3x', label: 'Faster Quotes' },
  { value: '50%', label: 'Less Admin Time' },
  { value: '25%', label: 'Higher Win Rates' },
];

const testimonials = [
  {
    quote: "TaskBot automated our quote generation process. What used to take 2 days now happens in 15 minutes. Our sales cycle shortened by 40%.",
    author: "Jason Mitchell",
    role: "VP of Sales",
    company: "TechVentures Inc",
    rating: 5,
  },
  {
    quote: "Lead scoring automation tripled our qualified pipeline. Our reps now focus on the right prospects at the right time.",
    author: "Michelle Torres",
    role: "Sales Director",
    company: "Growth Partners",
    rating: 5,
  },
  {
    quote: "CRM automation freed up 2 hours per rep per day. That's $500K in additional selling time annually for our team.",
    author: "Brian Williams",
    role: "Chief Revenue Officer",
    company: "Enterprise Solutions",
    rating: 5,
  },
];

const crmIntegrations = [
  'Salesforce', 'HubSpot', 'Microsoft Dynamics', 'Pipedrive',
  'Zoho CRM', 'Freshsales', 'Monday CRM', 'Close',
];

export default function FunctionSalesPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#276749] to-[#48bb78] py-24 relative overflow-hidden">
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
                <TrendingUp className="w-4 h-4 mr-2" />
                SALES AUTOMATION
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Close more deals
                <span className="block text-[#ed8936]">faster</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Automate the busywork so your sales team can focus on what they do best—
                building relationships and closing deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-demo">
                  <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                    <Play className="mr-2 w-5 h-5" />
                    See Sales Demo
                  </Button>
                </Link>
                <Link to="/resources/templates">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Browse Sales Templates
                  </Button>
                </Link>
              </div>
            </div>
            {/* Stats Grid - Mobile Responsive */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: Target, label: 'Leads Processed', value: '10M+' },
                    { icon: FileText, label: 'Quotes Generated', value: '2M+' },
                    { icon: DollarSign, label: 'Revenue Influenced', value: '$5B+' },
                    { icon: Building, label: 'Sales Teams', value: '3,000+' },
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

      {/* Use Cases */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sales automation use cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions to accelerate every stage of your sales cycle.
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
                <div className="w-14 h-14 bg-[#48bb78]/10 rounded-xl flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-[#48bb78]" />
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

      {/* Sales Pipeline Automation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-[#48bb78]/10 rounded-full text-[#48bb78] text-sm font-medium mb-4">
                <Target className="w-4 h-4 mr-2" />
                PIPELINE ACCELERATION
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Move deals through the pipeline faster
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TaskBot automates every touchpoint in your sales process—from first 
                contact to closed-won. Your reps spend more time selling and less 
                time on administrative tasks.
              </p>
              <ul className="space-y-4">
                {[
                  'Automated lead qualification and scoring',
                  'Instant quote generation with dynamic pricing',
                  'Smart follow-up sequences that never miss',
                  'Contract automation with e-signature integration',
                  'Automatic CRM updates and activity logging',
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
              <div className="bg-gray-50 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Pipeline</h3>
                <div className="space-y-4">
                  {[
                    { stage: 'Lead', count: 1250, color: '#4299e1', width: '100%' },
                    { stage: 'Qualified', count: 520, color: '#48bb78', width: '42%' },
                    { stage: 'Proposal', count: 245, color: '#ed8936', width: '20%' },
                    { stage: 'Negotiation', count: 98, color: '#805ad5', width: '8%' },
                    { stage: 'Won', count: 72, color: '#38b2ac', width: '6%' },
                  ].map((stage) => (
                    <div key={stage.stage}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">{stage.stage}</span>
                        <span className="text-gray-600">{stage.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500" 
                          style={{ width: stage.width, backgroundColor: stage.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">35% higher conversion with automation</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 bg-gradient-to-r from-[#48bb78] to-[#276749]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Calculate your sales automation ROI
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Most sales teams see 200-300% ROI in the first year from TaskBot automation.
                See what it could mean for your team.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { metric: '2 hours/day', label: 'Admin time saved per rep' },
                  { metric: '35%', label: 'Increase in qualified leads' },
                  { metric: '3x faster', label: 'Quote generation' },
                  { metric: '25%', label: 'Higher win rates' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{item.metric}</div>
                    <div className="text-sm text-white/70">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Annual Value</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-[#48bb78]">$420K</div>
                <div className="text-gray-600">per 10 sales reps</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Time savings</span>
                  <span className="font-semibold text-gray-900">$260K</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Pipeline increase</span>
                  <span className="font-semibold text-gray-900">$120K</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Higher win rates</span>
                  <span className="font-semibold text-gray-900">$40K</span>
                </div>
              </div>
              <Link to="/request-demo" className="block mt-6">
                <Button className="w-full bg-[#48bb78] hover:bg-[#38a169] text-white">
                  Get Your Custom ROI Assessment
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CRM Integrations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Integrates with your CRM</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pre-built connectors for leading CRM and sales platforms.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {crmIntegrations.map((platform, index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Briefcase className="w-8 h-8 text-[#1a365d] mx-auto mb-2" />
                <span className="font-semibold text-gray-700">{platform}</span>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by sales leaders</h2>
            <p className="text-lg text-gray-600">See how sales teams are crushing quota with TaskBot</p>
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
            <TrendingUp className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to accelerate your sales?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a personalized demo to see TaskBot's sales automation in action.
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
                  Explore Sales Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
