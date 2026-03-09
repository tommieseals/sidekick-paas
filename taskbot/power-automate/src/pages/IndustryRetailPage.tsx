import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  ShoppingCart,
  CheckCircle2,
  Play,
  Package,
  Tag,
  RotateCcw,
  Users,
  Percent,
  Store,
  Clock,
  Heart,
  Star,
  Boxes
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialGrid } from '@/components/ui/testimonial-card';

const useCases = [
  {
    icon: Package,
    title: 'Order Fulfillment',
    description: 'Automate order processing, inventory allocation, picking instructions, and shipment notifications.',
    benefits: ['Auto order routing', 'Inventory allocation', 'Pick list generation', 'Shipping automation'],
    savings: '50% faster fulfillment',
  },
  {
    icon: Boxes,
    title: 'Inventory Management',
    description: 'Real-time inventory sync across channels, automatic reorder triggers, and stock optimization.',
    benefits: ['Omnichannel sync', 'Auto-replenishment', 'Demand forecasting', 'Stock alerts'],
    savings: '25% less overstock',
  },
  {
    icon: RotateCcw,
    title: 'Returns Processing',
    description: 'Streamline returns authorization, refund processing, and inventory restocking workflows.',
    benefits: ['RMA automation', 'Refund processing', 'Restock workflows', 'Customer communication'],
    savings: '60% faster returns',
  },
  {
    icon: Tag,
    title: 'Price & Promotion Management',
    description: 'Automate price updates, promotional campaigns, and competitive pricing adjustments.',
    benefits: ['Price sync', 'Promotion scheduling', 'Competitive monitoring', 'Markdown automation'],
    savings: '4% margin improvement',
  },
  {
    icon: Users,
    title: 'Customer Service',
    description: 'Automate order inquiries, return requests, and customer communication across channels.',
    benefits: ['Order status bots', 'Return initiation', 'Review responses', 'Loyalty updates'],
    savings: '70% fewer tickets',
  },
  {
    icon: Store,
    title: 'Store Operations',
    description: 'Streamline store communications, task management, and reporting workflows.',
    benefits: ['Task distribution', 'Compliance tracking', 'Report aggregation', 'Alert management'],
    savings: '3 hours saved daily',
  },
];

const stats = [
  { value: '50%', label: 'Faster Fulfillment' },
  { value: '$4.2M', label: 'Avg. Annual Savings' },
  { value: '99.5%', label: 'Order Accuracy' },
  { value: '35%', label: 'Fewer Returns Issues' },
];

const testimonials = [
  {
    quote: "TaskBot transformed our omnichannel fulfillment. We went from 48-hour to same-day processing, and our customer satisfaction scores jumped 20 points.",
    author: "Michelle Park",
    role: "VP of E-Commerce",
    company: "Urban Style Collective",
    rating: 5,
  },
  {
    quote: "Returns processing used to take 5-7 days. With TaskBot, customers get their refunds within 24 hours. It's been a game-changer for loyalty.",
    author: "James Chen",
    role: "Operations Director",
    company: "TechGear Retail",
    rating: 5,
  },
  {
    quote: "Dynamic pricing automation increased our margins by 4% while keeping us competitive. The ROI was realized in the first quarter.",
    author: "Amanda Richards",
    role: "Chief Merchandising Officer",
    company: "National Home Goods",
    rating: 5,
  },
];

const integrations = [
  'Shopify', 'Magento', 'Salesforce Commerce', 'SAP Commerce',
  'BigCommerce', 'WooCommerce', 'Square', 'Stripe',
];

export default function IndustryRetailPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#c05621] to-[#ed8936] py-24 relative overflow-hidden">
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
                <ShoppingCart className="w-4 h-4 mr-2" />
                RETAIL AUTOMATION
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Retail automation for
                <span className="block text-white">the modern shopper</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Meet rising customer expectations with intelligent automation. From order 
                fulfillment to returns, TaskBot streamlines every retail operation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-demo">
                  <Button size="lg" className="bg-white text-[#ed8936] hover:bg-gray-100 px-8">
                    <Play className="mr-2 w-5 h-5" />
                    See Retail Demo
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
                    { icon: Package, label: 'Orders Processed', value: '25M+' },
                    { icon: Store, label: 'Retail Clients', value: '800+' },
                    { icon: Clock, label: 'Hours Saved', value: '2M+' },
                    { icon: Star, label: 'Avg. Rating', value: '4.9/5' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-1.5 sm:mb-2" />
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Retail automation use cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end automation solutions for omnichannel retail operations.
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
                <div className="w-14 h-14 bg-[#ed8936]/10 rounded-xl flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-[#ed8936]" />
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

      {/* Omnichannel */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-[#ed8936]/10 rounded-full text-[#ed8936] text-sm font-medium mb-4">
                <Store className="w-4 h-4 mr-2" />
                OMNICHANNEL READY
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Unified retail operations
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TaskBot connects your online stores, brick-and-mortar locations, and fulfillment 
                centers into a single automated workflow. No more siloed operations.
              </p>
              <ul className="space-y-4">
                {[
                  'Real-time inventory sync across all channels',
                  'Unified order management and fulfillment',
                  'Consistent pricing and promotions',
                  'Single view of customer interactions',
                  'Cross-channel returns and exchanges',
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
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#ed8936] to-[#dd6b20] rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-12 h-12 text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {['Online', 'Mobile', 'Store'].map((channel) => (
                      <div key={channel} className="bg-white/20 rounded-xl p-3 text-center">
                        <div className="text-white font-semibold">{channel}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-white/80">Unified Operations</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Integrates with your e-commerce stack</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pre-built connectors for leading retail and e-commerce platforms.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((platform, index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Store className="w-8 h-8 text-[#1a365d] mx-auto mb-2" />
                <span className="font-semibold text-gray-700">{platform}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Experience */}
      <section className="py-24 bg-gradient-to-r from-[#ed8936] to-[#c05621]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Deliver exceptional customer experiences
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Happy customers come back. TaskBot automation ensures every order is fulfilled 
                quickly, every return is handled smoothly, and every question gets answered.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Clock, label: 'Same-Day Fulfillment', value: '2x faster' },
                  { icon: RotateCcw, label: 'Return Processing', value: '24 hours' },
                  { icon: Heart, label: 'Customer Satisfaction', value: '+20 NPS' },
                  { icon: Percent, label: 'Repeat Purchase Rate', value: '+15%' },
                ].map((metric) => (
                  <div key={metric.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <metric.icon className="w-6 h-6 text-white mb-2" />
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-sm text-white/70">{metric.label}</div>
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
              <div className="text-center">
                <Star className="w-16 h-16 text-[#ed8936] mx-auto mb-4" />
                <div className="text-5xl font-bold text-gray-900 mb-2">4.9/5</div>
                <div className="text-gray-600 mb-6">Average Customer Rating</div>
                <p className="text-gray-500 italic">
                  "The fastest shipping I've ever experienced. Order placed at 10am, 
                  delivered by 5pm. Incredible!"
                </p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by leading retailers</h2>
            <p className="text-lg text-gray-600">See how retailers are transforming with TaskBot</p>
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
            <ShoppingCart className="w-16 h-16 text-[#ed8936] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform your retail operations?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a personalized demo to see TaskBot's retail automation in action.
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
