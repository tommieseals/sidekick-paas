import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Heart,
  CheckCircle2,
  Play,
  FileText,
  Shield,
  Users,
  Clock,
  Calendar,
  Stethoscope,
  ClipboardList,
  UserCheck,
  Building,
  Activity,
  Lock,
  Pill
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const useCases = [
  {
    icon: UserCheck,
    title: 'Patient Intake & Registration',
    description: 'Automate patient registration, insurance verification, and form collection to reduce wait times and improve patient experience.',
    benefits: ['Digital form collection', 'Insurance eligibility checks', 'EHR auto-population', 'Appointment scheduling'],
    savings: '75% faster check-in',
  },
  {
    icon: FileText,
    title: 'Claims Processing',
    description: 'Streamline claims submission, adjudication, and denial management with intelligent automation and AI-powered coding.',
    benefits: ['Auto-coding assistance', 'Claim scrubbing', 'Denial tracking', 'Appeals automation'],
    savings: '60% fewer denials',
  },
  {
    icon: ClipboardList,
    title: 'Prior Authorization',
    description: 'Accelerate prior auth requests with automated form completion, status tracking, and payer communication.',
    benefits: ['Auto form completion', 'Status monitoring', 'Escalation workflows', 'Payer integration'],
    savings: '80% faster approvals',
  },
  {
    icon: Calendar,
    title: 'Appointment Scheduling',
    description: 'Intelligent scheduling automation with patient preferences, provider availability, and resource optimization.',
    benefits: ['Smart scheduling', 'Reminder automation', 'Waitlist management', 'Cancellation handling'],
    savings: '35% fewer no-shows',
  },
  {
    icon: Activity,
    title: 'Lab Results & Orders',
    description: 'Automate lab order processing, result delivery, and critical value alerts to improve clinical workflows.',
    benefits: ['Order routing', 'Result notifications', 'Critical alerts', 'Provider queues'],
    savings: '50% faster turnaround',
  },
  {
    icon: Pill,
    title: 'Prescription Management',
    description: 'Streamline e-prescribing, refill requests, and pharmacy coordination with automated workflows.',
    benefits: ['Refill automation', 'Pharmacy coordination', 'Drug interaction checks', 'Patient notifications'],
    savings: '70% less manual work',
  },
];

const stats = [
  { value: '60%', label: 'Reduced Admin Time' },
  { value: '35%', label: 'Fewer No-shows' },
  { value: '99.9%', label: 'HIPAA Compliance' },
  { value: '4.8/5', label: 'Patient Satisfaction' },
];

const testimonials = [
  {
    quote: "TaskBot helped us reduce patient check-in time from 15 minutes to under 3 minutes. Our patient satisfaction scores have never been higher.",
    author: "Dr. Amanda Foster",
    role: "Chief Medical Officer",
    company: "Regional Medical Center",
    rating: 5,
  },
  {
    quote: "Claims denials dropped by 62% after implementing TaskBot. Our revenue cycle team can now focus on complex cases instead of routine submissions.",
    author: "Marcus Johnson",
    role: "Revenue Cycle Director",
    company: "Healthcare Partners Network",
    rating: 5,
  },
  {
    quote: "Prior authorization used to take 3-5 days. With TaskBot, most are approved within hours. It's transformed our ability to deliver timely care.",
    author: "Patricia Chen",
    role: "VP of Operations",
    company: "Integrated Health Systems",
    rating: 5,
  },
];

const complianceFeatures = [
  { name: 'HIPAA', desc: 'Fully Compliant' },
  { name: 'HITRUST', desc: 'CSF Certified' },
  { name: 'SOC 2', desc: 'Type II' },
  { name: 'HL7 FHIR', desc: 'Supported' },
];

export default function IndustryHealthcarePage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#e53e3e] py-24 relative overflow-hidden">
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
                <Heart className="w-4 h-4 mr-2" />
                HEALTHCARE AUTOMATION
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Better care through
                <span className="block text-[#ed8936]">smarter automation</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Free your clinical and administrative staff to focus on what matters most—patient care. 
                TaskBot automates the repetitive tasks that slow down healthcare operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-demo">
                  <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                    <Play className="mr-2 w-5 h-5" />
                    See Healthcare Demo
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
                    { icon: Users, label: 'Patients Served', value: '5M+' },
                    { icon: FileText, label: 'Claims Processed', value: '12M+' },
                    { icon: Clock, label: 'Hours Saved', value: '800K+' },
                    { icon: Stethoscope, label: 'Healthcare Clients', value: '200+' },
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Healthcare automation use cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions for clinical and administrative healthcare workflows.
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
                <div className="w-14 h-14 bg-[#e53e3e]/10 rounded-xl flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-[#e53e3e]" />
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

      {/* HIPAA Compliance */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-[#e53e3e]/10 rounded-full text-[#e53e3e] text-sm font-medium mb-4">
                <Lock className="w-4 h-4 mr-2" />
                HIPAA COMPLIANT
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Security built for healthcare
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TaskBot is designed from the ground up to meet the rigorous security and 
                compliance requirements of healthcare organizations. Protected health information 
                (PHI) is secured at every step.
              </p>
              <ul className="space-y-4">
                {[
                  'HIPAA Business Associate Agreement (BAA) included',
                  'End-to-end encryption for all PHI',
                  'Complete audit logging for compliance',
                  'Role-based access with MFA',
                  'Automatic data retention policies',
                  'EHR system integration with HL7/FHIR',
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
                {complianceFeatures.map((cert) => (
                  <div
                    key={cert.name}
                    className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="w-16 h-16 bg-[#e53e3e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-[#e53e3e]" />
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

      {/* Integration */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Integrates with your EHR</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pre-built connectors for leading healthcare systems ensure seamless integration.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Epic', 'Cerner', 'Allscripts', 'athenahealth', 'Meditech', 'NextGen'].map((ehr, index) => (
              <motion.div
                key={ehr}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Building className="w-8 h-8 text-[#1a365d] mx-auto mb-2" />
                <span className="font-semibold text-gray-700">{ehr}</span>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by healthcare organizations</h2>
            <p className="text-lg text-gray-600">See how providers are transforming with TaskBot</p>
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
            <Heart className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform healthcare operations?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a personalized demo to see TaskBot's healthcare automation in action.
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
