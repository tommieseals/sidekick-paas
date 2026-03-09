import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Users,
  CheckCircle2,
  Play,
  UserPlus,
  FileText,
  Calendar,
  Clock,
  GraduationCap,
  Award,
  Briefcase,
  DollarSign,
  UserCheck,
  ClipboardList,
  Heart,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const useCases = [
  {
    icon: UserPlus,
    title: 'Employee Onboarding',
    description: 'Automate the entire onboarding journey from offer letter to first-day setup with personalized workflows.',
    benefits: ['Document collection', 'System provisioning', 'Welcome emails', 'Training assignments'],
    savings: '70% faster onboarding',
  },
  {
    icon: Briefcase,
    title: 'Recruitment Automation',
    description: 'Streamline candidate sourcing, screening, interview scheduling, and offer management.',
    benefits: ['Resume parsing', 'Candidate scoring', 'Interview scheduling', 'Offer generation'],
    savings: '50% time-to-hire reduction',
  },
  {
    icon: Calendar,
    title: 'Leave & Attendance',
    description: 'Automate PTO requests, approvals, balance tracking, and attendance management.',
    benefits: ['Request workflows', 'Auto-approvals', 'Calendar sync', 'Accrual calculation'],
    savings: '90% request automation',
  },
  {
    icon: DollarSign,
    title: 'Payroll Processing',
    description: 'Streamline payroll data collection, validation, and integration with payroll systems.',
    benefits: ['Time data sync', 'Expense integration', 'Deduction management', 'Report generation'],
    savings: '80% less manual entry',
  },
  {
    icon: GraduationCap,
    title: 'Learning & Development',
    description: 'Automate training assignments, completion tracking, and certification management.',
    benefits: ['Course assignments', 'Progress tracking', 'Certification alerts', 'Compliance training'],
    savings: '100% compliance tracking',
  },
  {
    icon: Award,
    title: 'Performance Management',
    description: 'Streamline review cycles, goal tracking, and feedback collection processes.',
    benefits: ['Review reminders', 'Goal cascading', '360 feedback', 'Rating calibration'],
    savings: '60% admin time saved',
  },
];

const stats = [
  { value: '70%', label: 'Faster Onboarding' },
  { value: '90%', label: 'Process Automation' },
  { value: '$500K', label: 'Avg. Annual Savings' },
  { value: '4.8/5', label: 'Employee Satisfaction' },
];

const testimonials = [
  {
    quote: "Employee onboarding went from a 2-week manual process to a 2-day automated experience. New hires are productive faster than ever.",
    author: "Sarah Mitchell",
    role: "VP of Human Resources",
    company: "TechCorp Global",
    rating: 5,
  },
  {
    quote: "TaskBot automated 90% of our leave management. HR now focuses on strategic initiatives instead of processing PTO requests.",
    author: "Michael Rodriguez",
    role: "HR Director",
    company: "Pinnacle Industries",
    rating: 5,
  },
  {
    quote: "Recruitment automation cut our time-to-hire in half. We're hiring better candidates faster while reducing recruiter workload.",
    author: "Jennifer Lee",
    role: "Talent Acquisition Lead",
    company: "Innovation Labs",
    rating: 5,
  },
];

const employeeJourney = [
  { stage: 'Recruit', icon: Briefcase, tasks: ['Job posting', 'Screening', 'Interviews'] },
  { stage: 'Onboard', icon: UserPlus, tasks: ['Documents', 'Training', 'Setup'] },
  { stage: 'Develop', icon: GraduationCap, tasks: ['Learning', 'Goals', 'Reviews'] },
  { stage: 'Retain', icon: Heart, tasks: ['Recognition', 'Growth', 'Wellness'] },
  { stage: 'Offboard', icon: UserCheck, tasks: ['Exit interview', 'Knowledge transfer', 'Access removal'] },
];

export default function FunctionHRPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#285e61] to-[#38b2ac] py-24 relative overflow-hidden">
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
                <Users className="w-4 h-4 mr-2" />
                HR AUTOMATION
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Transform your
                <span className="block text-[#ed8936]">employee experience</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                From recruiting to retiring, TaskBot automates the employee lifecycle so 
                HR can focus on people, not paperwork.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-demo">
                  <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                    <Play className="mr-2 w-5 h-5" />
                    See HR Demo
                  </Button>
                </Link>
                <Link to="/resources/templates">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Browse HR Templates
                  </Button>
                </Link>
              </div>
            </div>
            {/* Stats Grid - Mobile Responsive */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: Users, label: 'Employees Onboarded', value: '500K+' },
                    { icon: FileText, label: 'HR Processes', value: '2M+' },
                    { icon: Clock, label: 'Hours Saved', value: '1.2M' },
                    { icon: Building, label: 'HR Teams', value: '1,500+' },
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

      {/* Employee Journey */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Automate the entire employee journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              TaskBot streamlines every stage of the employee lifecycle.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {employeeJourney.map((phase, index) => (
              <motion.div
                key={phase.stage}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 w-48"
              >
                <div className="w-12 h-12 bg-[#38b2ac]/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <phase.icon className="w-6 h-6 text-[#38b2ac]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-3">{phase.stage}</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {phase.tasks.map((task) => (
                    <li key={task} className="text-center">{task}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">HR automation use cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions for modern HR teams.
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
                <div className="w-14 h-14 bg-[#38b2ac]/10 rounded-xl flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-[#38b2ac]" />
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

      {/* HRIS Integrations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Connects to your HRIS</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pre-built connectors for leading HR platforms and tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Workday', 'SAP SuccessFactors', 'ADP', 'BambooHR', 'Namely', 'Gusto'].map((hris, index) => (
              <motion.div
                key={hris}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Building className="w-8 h-8 text-[#1a365d] mx-auto mb-2" />
                <span className="font-semibold text-gray-700 text-sm">{hris}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Spotlight */}
      <section className="py-24 bg-gradient-to-r from-[#38b2ac] to-[#285e61]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Onboarding that delights
              </h2>
              <p className="text-xl text-white/80 mb-8">
                First impressions matter. TaskBot creates a seamless, personalized onboarding 
                experience that makes new hires feel welcome and productive from day one.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Pre-boarding tasks before day one',
                  'Automated document collection and e-signatures',
                  'IT provisioning and access setup',
                  'Personalized welcome messages and introductions',
                  'Training and compliance assignments',
                  'Check-in surveys at 30/60/90 days',
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
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="font-semibold text-gray-900">Offer letter signed</div>
                    <div className="text-sm text-gray-600">Documents collected automatically</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="font-semibold text-gray-900">IT equipment ordered</div>
                    <div className="text-sm text-gray-600">Laptop shipping to home address</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="font-semibold text-gray-900">Day 1 orientation scheduled</div>
                    <div className="text-sm text-gray-600">Calendar invite sent to new hire</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <ClipboardList className="w-8 h-8 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-900">Training assignments pending</div>
                    <div className="text-sm text-gray-600">Will activate on start date</div>
                  </div>
                </div>
              </div>
            </motion.div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by HR leaders</h2>
            <p className="text-lg text-gray-600">See how HR teams are transforming with TaskBot</p>
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
            <Users className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform HR operations?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a personalized demo to see TaskBot's HR automation in action.
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
                  Explore HR Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
