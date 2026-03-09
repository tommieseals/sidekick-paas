import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Monitor,
  CheckCircle2,
  Play,
  Ticket,
  UserPlus,
  Shield,
  Server,
  AlertTriangle,
  Settings,
  Key,
  RefreshCw,
  Database,
  Lock,
  Clock,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const useCases = [
  {
    icon: Ticket,
    title: 'Service Desk Automation',
    description: 'Automate ticket routing, categorization, escalation, and resolution for common IT requests.',
    benefits: ['Smart ticket routing', 'Auto-categorization', 'SLA monitoring', 'Knowledge suggestions'],
    savings: '80% tier-1 automation',
  },
  {
    icon: UserPlus,
    title: 'User Provisioning',
    description: 'Automate account creation, access provisioning, and onboarding across all systems.',
    benefits: ['AD/Azure AD sync', 'Application access', 'Email setup', 'Hardware requests'],
    savings: '90% faster provisioning',
  },
  {
    icon: Key,
    title: 'Password & Access Management',
    description: 'Self-service password resets, access requests, and MFA enrollment automation.',
    benefits: ['Self-service resets', 'Access workflows', 'MFA automation', 'Audit logging'],
    savings: '70% fewer tickets',
  },
  {
    icon: AlertTriangle,
    title: 'Incident Management',
    description: 'Automated incident detection, notification, escalation, and resolution workflows.',
    benefits: ['Alert correlation', 'Auto-remediation', 'Escalation chains', 'Post-mortem automation'],
    savings: '60% faster MTTR',
  },
  {
    icon: RefreshCw,
    title: 'Patch Management',
    description: 'Automate patch deployment, testing, rollback, and compliance reporting.',
    benefits: ['Patch scheduling', 'Test automation', 'Rollback triggers', 'Compliance reports'],
    savings: '85% patch compliance',
  },
  {
    icon: Server,
    title: 'Infrastructure Automation',
    description: 'Automate server provisioning, configuration management, and resource optimization.',
    benefits: ['VM provisioning', 'Config management', 'Cost optimization', 'Capacity planning'],
    savings: '50% infrastructure cost',
  },
];

const stats = [
  { value: '80%', label: 'Ticket Automation' },
  { value: '60%', label: 'Faster Resolution' },
  { value: '$750K', label: 'Avg. Annual Savings' },
  { value: '99.9%', label: 'System Uptime' },
];

const testimonials = [
  {
    quote: "TaskBot automated 80% of our tier-1 tickets. Our helpdesk team now handles complex issues while routine requests resolve themselves.",
    author: "David Chen",
    role: "IT Director",
    company: "Enterprise Solutions Inc",
    rating: 5,
  },
  {
    quote: "User provisioning that took 3 days now happens in 15 minutes. New employees are productive from their first hour.",
    author: "Amanda Foster",
    role: "VP of IT Operations",
    company: "Global Tech Corp",
    rating: 5,
  },
  {
    quote: "Password reset tickets dropped 70% after implementing self-service automation. That's thousands of tickets we no longer handle.",
    author: "Robert Kim",
    role: "Service Desk Manager",
    company: "Financial Services Group",
    rating: 5,
  },
];

const itsmIntegrations = [
  'ServiceNow', 'Jira Service Management', 'Zendesk', 'Freshservice',
  'BMC Helix', 'Ivanti', 'ManageEngine', 'ConnectWise',
];

export default function FunctionITPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#4299e1] py-24 relative overflow-hidden">
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
                <Monitor className="w-4 h-4 mr-2" />
                IT OPERATIONS AUTOMATION
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                IT automation that
                <span className="block text-[#ed8936]">just works</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                From service desk to infrastructure, TaskBot automates IT operations 
                so your team can focus on innovation, not tickets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-demo">
                  <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                    <Play className="mr-2 w-5 h-5" />
                    See IT Demo
                  </Button>
                </Link>
                <Link to="/resources/templates">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Browse IT Templates
                  </Button>
                </Link>
              </div>
            </div>
            {/* Stats Grid - Mobile Responsive */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: Ticket, label: 'Tickets Automated', value: '5M+' },
                    { icon: Server, label: 'Servers Managed', value: '100K+' },
                    { icon: Clock, label: 'Hours Saved', value: '2M+' },
                    { icon: Building, label: 'IT Teams', value: '2,000+' },
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">IT automation use cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions for modern IT operations.
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
                <div className="w-14 h-14 bg-[#4299e1]/10 rounded-xl flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-[#4299e1]" />
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

      {/* Service Desk Automation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-[#4299e1]/10 rounded-full text-[#4299e1] text-sm font-medium mb-4">
                <Ticket className="w-4 h-4 mr-2" />
                SERVICE DESK
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Resolve tickets before they're even submitted
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TaskBot's intelligent service desk automation uses AI to route, categorize, 
                and resolve tickets automatically. Common requests like password resets, 
                access requests, and software installations happen without human intervention.
              </p>
              <ul className="space-y-4">
                {[
                  'AI-powered ticket classification and routing',
                  'Self-service portal with automated resolution',
                  'Smart knowledge base suggestions',
                  'Automatic SLA monitoring and escalation',
                  'Integration with ITSM platforms',
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
              className="bg-gray-50 rounded-3xl p-8"
            >
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Incoming Tickets</span>
                    <span className="text-2xl font-bold text-gray-900">1,247</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#4299e1] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-green-600">Auto-Resolved</span>
                    <span className="text-2xl font-bold text-green-600">998</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-600">Escalated to Humans</span>
                    <span className="text-2xl font-bold text-blue-600">249</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <div className="text-3xl font-bold text-[#4299e1]">80%</div>
                  <div className="text-gray-600">Automation Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Automation */}
      <section className="py-24 bg-gradient-to-r from-[#4299e1] to-[#3182ce]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Security automation built-in
              </h2>
              <p className="text-xl text-white/80 mb-8">
                TaskBot includes enterprise-grade security features and automates 
                security operations to keep your organization protected.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Shield, label: 'Threat Detection', desc: 'Automated alerts' },
                  { icon: Lock, label: 'Access Control', desc: 'Policy enforcement' },
                  { icon: Key, label: 'Identity Management', desc: 'Lifecycle automation' },
                  { icon: Database, label: 'Data Protection', desc: 'DLP automation' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <item.icon className="w-8 h-8 text-white mb-2" />
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-sm text-white/70">{item.desc}</div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-6">Security Compliance</h3>
              <div className="space-y-4">
                {[
                  { cert: 'SOC 2 Type II', status: 'Certified' },
                  { cert: 'ISO 27001', status: 'Certified' },
                  { cert: 'GDPR', status: 'Compliant' },
                  { cert: 'HIPAA', status: 'Ready' },
                ].map((item) => (
                  <div key={item.cert} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.cert}</span>
                    <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ITSM Integrations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Integrates with your ITSM</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pre-built connectors for leading IT service management platforms.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {itsmIntegrations.map((platform, index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Settings className="w-8 h-8 text-[#1a365d] mx-auto mb-2" />
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by IT leaders</h2>
            <p className="text-lg text-gray-600">See how IT teams are transforming with TaskBot</p>
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
            <Monitor className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform IT operations?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a personalized demo to see TaskBot's IT automation in action.
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
                  Explore IT Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
