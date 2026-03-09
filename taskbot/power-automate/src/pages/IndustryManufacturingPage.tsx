import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Factory,
  CheckCircle2,
  Play,
  Package,
  Truck,
  ClipboardCheck,
  Wrench,
  BarChart3,
  Cog,
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const useCases = [
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Real-time inventory tracking, automatic reorder triggers, and stock level optimization across warehouses.',
    benefits: ['Auto-reorder points', 'Multi-location sync', 'Demand forecasting', 'Stock alerts'],
    savings: '30% inventory reduction',
  },
  {
    icon: Truck,
    title: 'Supply Chain Automation',
    description: 'Streamline supplier communications, purchase orders, and shipment tracking with intelligent workflows.',
    benefits: ['PO generation', 'Supplier portals', 'Shipment tracking', 'Invoice matching'],
    savings: '45% faster procurement',
  },
  {
    icon: ClipboardCheck,
    title: 'Quality Control',
    description: 'Automate inspection workflows, defect tracking, and corrective action processes for consistent quality.',
    benefits: ['Inspection checklists', 'Defect logging', 'CAPA workflows', 'Compliance reports'],
    savings: '50% fewer defects',
  },
  {
    icon: Wrench,
    title: 'Maintenance Management',
    description: 'Predictive maintenance scheduling, work order automation, and equipment lifecycle tracking.',
    benefits: ['Preventive scheduling', 'Work orders', 'Parts tracking', 'Downtime analysis'],
    savings: '40% less downtime',
  },
  {
    icon: Cog,
    title: 'Production Scheduling',
    description: 'Optimize production schedules based on demand, capacity, and resource availability.',
    benefits: ['Capacity planning', 'Shift scheduling', 'Resource allocation', 'Bottleneck detection'],
    savings: '25% increased throughput',
  },
  {
    icon: FileText,
    title: 'Compliance & Documentation',
    description: 'Automate regulatory documentation, certifications, and audit preparation workflows.',
    benefits: ['Document control', 'Audit trails', 'Certification tracking', 'Report generation'],
    savings: '60% audit prep time saved',
  },
];

const stats = [
  { value: '35%', label: 'Cost Reduction' },
  { value: '99.7%', label: 'Inventory Accuracy' },
  { value: '40%', label: 'Less Downtime' },
  { value: '2x', label: 'Faster Order Processing' },
];

const testimonials = [
  {
    quote: "TaskBot transformed our inventory management. We went from 85% accuracy to 99.7%, reducing carrying costs by over $2M annually.",
    author: "Jennifer Walsh",
    role: "VP of Operations",
    company: "Industrial Dynamics Corp",
    rating: 5,
  },
  {
    quote: "Predictive maintenance automation reduced our unplanned downtime by 65%. Our OEE has never been higher.",
    author: "Carlos Rodriguez",
    role: "Plant Manager",
    company: "Precision Manufacturing Inc",
    rating: 5,
  },
  {
    quote: "Quality control workflows caught defects 50% earlier in the process. Customer complaints dropped to near zero.",
    author: "Angela Thompson",
    role: "Quality Director",
    company: "Advanced Components Ltd",
    rating: 5,
  },
];

export default function IndustryManufacturingPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#4a5568] to-[#805ad5] py-24 relative overflow-hidden">
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
                <Factory className="w-4 h-4 mr-2" />
                MANUFACTURING AUTOMATION
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Industry 4.0
                <span className="block text-[#ed8936]">automation solutions</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                From shop floor to supply chain, TaskBot automates critical manufacturing 
                processes to increase efficiency, reduce costs, and improve quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-demo">
                  <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white px-8">
                    <Play className="mr-2 w-5 h-5" />
                    See Manufacturing Demo
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
                    { icon: Package, label: 'Units Tracked', value: '50M+' },
                    { icon: Truck, label: 'POs Automated', value: '2M+' },
                    { icon: Clock, label: 'Hours Saved', value: '1.5M' },
                    { icon: Factory, label: 'Plants Connected', value: '500+' },
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Manufacturing automation use cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end automation solutions for modern manufacturing operations.
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
                <div className="w-14 h-14 bg-[#805ad5]/10 rounded-xl flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-[#805ad5]" />
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

      {/* Integration Diagram */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Connected manufacturing ecosystem</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              TaskBot integrates with your existing systems to create a unified automation layer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'ERP Systems',
                items: ['SAP', 'Oracle', 'Microsoft Dynamics', 'NetSuite'],
                icon: BarChart3,
                color: '#3182ce',
              },
              {
                title: 'Shop Floor',
                items: ['SCADA', 'MES', 'PLC Integration', 'IoT Sensors'],
                icon: Cog,
                color: '#805ad5',
              },
              {
                title: 'Supply Chain',
                items: ['WMS', 'TMS', 'Supplier Portals', 'EDI'],
                icon: Truck,
                color: '#38b2ac',
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 text-center"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <category.icon className="w-8 h-8" style={{ color: category.color }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Teaser */}
      <section className="py-24 bg-gradient-to-r from-[#805ad5] to-[#553c9a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Calculate your automation ROI
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Manufacturing automation typically delivers 200-400% ROI in the first year. 
                See what TaskBot can do for your operations.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Labor cost savings from automated processes',
                  'Reduced inventory carrying costs',
                  'Quality improvement savings',
                  'Downtime reduction value',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-[#48bb78]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/request-demo">
                <Button size="lg" className="bg-white text-[#805ad5] hover:bg-gray-100">
                  Get ROI Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8"
            >
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">$1.5M</div>
                <div className="text-white/80 mb-6">Average first-year savings</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">35%</div>
                    <div className="text-sm text-white/70">Cost Reduction</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">40%</div>
                    <div className="text-sm text-white/70">Less Downtime</div>
                  </div>
                </div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by manufacturers worldwide</h2>
            <p className="text-lg text-gray-600">See how manufacturers are transforming with TaskBot</p>
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
            <Factory className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to modernize your manufacturing?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a personalized demo to see TaskBot's manufacturing automation in action.
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
