import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check,
  X,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Zap,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Shield,
  Headphones,
  CreditCard,
  Lock,
  Award,
  RefreshCw,
  Clock,
  Globe,
  CheckCircle2,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started with automation',
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Zap,
    color: '#718096',
    gradient: 'from-gray-500 to-gray-600',
    popular: false,
    cta: 'Get Started Free',
    ctaVariant: 'outline' as const,
    features: [
      { text: '750 flow runs/month', included: true },
      { text: 'Cloud flows only', included: true },
      { text: '5 active flows', included: true },
      { text: 'Standard connectors (100+)', included: true },
      { text: 'Community support', included: true },
      { text: 'Desktop flows (RPA)', included: false },
      { text: 'AI Builder credits', included: false },
      { text: 'Premium connectors', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'For professionals and growing teams',
    monthlyPrice: 15,
    annualPrice: 12,
    icon: Users,
    color: '#0078d4',
    gradient: 'from-[#0078d4] to-[#005a9e]',
    popular: true,
    cta: 'Start Free Trial',
    ctaVariant: 'default' as const,
    features: [
      { text: 'Unlimited flow runs', included: true },
      { text: 'Cloud & Desktop flows', included: true },
      { text: 'Unlimited active flows', included: true },
      { text: 'Premium connectors (300+)', included: true },
      { text: '5,000 AI Builder credits/mo', included: true },
      { text: 'Attended RPA', included: true },
      { text: 'Custom connectors', included: true },
      { text: 'Priority email support', included: true },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For organizations with advanced needs',
    monthlyPrice: null,
    annualPrice: null,
    icon: Building2,
    color: '#6b21a8',
    gradient: 'from-purple-600 to-purple-800',
    popular: false,
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unattended RPA', included: true },
      { text: 'Full Process Mining', included: true },
      { text: 'Unlimited AI Builder', included: true },
      { text: 'SSO & advanced security', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Custom SLAs (99.99%)', included: true },
      { text: 'On-premise deployment', included: true },
    ],
  },
];

const faqs = [
  {
    question: 'What counts as a flow run?',
    answer: 'A flow run is counted each time a flow is triggered and executes. If a flow runs 100 times per month, that counts as 100 flow runs. Runs are tracked monthly and reset at the start of each billing cycle.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you get immediate access to new features. When you downgrade, the change takes effect at the start of your next billing cycle.',
  },
  {
    question: "What's the difference between attended and unattended RPA?",
    answer: 'Attended RPA runs while a user is logged in and can interact with the bot. Unattended RPA runs autonomously on dedicated machines without human intervention, perfect for 24/7 automation.',
  },
  {
    question: 'Do you offer educational or nonprofit discounts?',
    answer: 'Yes! We offer significant discounts for educational institutions and registered nonprofits. Contact our sales team for more information about eligibility and pricing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for annual Enterprise plans. Invoicing is available for Enterprise customers.',
  },
  {
    question: 'Is there a free trial for Pro features?',
    answer: 'Yes! We offer a 14-day free trial of the Pro plan. No credit card required to start. You get full access to all Pro features during the trial period.',
  },
];

const comparisonFeatures = [
  { feature: 'Cloud Flows', free: true, pro: true, enterprise: true },
  { feature: 'Desktop Flows (RPA)', free: false, pro: 'Attended', enterprise: 'Attended & Unattended' },
  { feature: 'Flow Runs/Month', free: '750', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Active Flows', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI Builder Credits', free: false, pro: '5,000/mo', enterprise: 'Unlimited' },
  { feature: 'Process Mining', free: false, pro: 'Basic', enterprise: 'Full' },
  { feature: 'Premium Connectors', free: false, pro: true, enterprise: true },
  { feature: 'Custom Connectors', free: false, pro: true, enterprise: true },
  { feature: 'SSO/SAML', free: false, pro: false, enterprise: true },
  { feature: 'Audit Logging', free: 'Basic', pro: '30 days', enterprise: 'Unlimited' },
  { feature: 'Support', free: 'Community', pro: 'Priority Email', enterprise: '24/7 Dedicated' },
  { feature: 'SLA Guarantee', free: '99%', pro: '99.9%', enterprise: '99.99%' },
];

const trustBadges = [
  { icon: Shield, label: 'SOC 2 Certified', sublabel: 'Type II' },
  { icon: Lock, label: 'GDPR Compliant', sublabel: 'EU Ready' },
  { icon: Award, label: 'ISO 27001', sublabel: 'Certified' },
  { icon: Globe, label: '99.9% Uptime', sublabel: 'Guaranteed' },
];

const guarantees = [
  { icon: RefreshCw, title: '30-Day Money Back', description: 'Not satisfied? Get a full refund within 30 days.' },
  { icon: CreditCard, title: 'No Credit Card Required', description: 'Start your free trial without payment info.' },
  { icon: Clock, title: 'Cancel Anytime', description: 'No long-term contracts or cancellation fees.' },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) return null;
    return billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0078d4] py-20 lg:py-28 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0078d4]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/10"
            >
              <Sparkles className="w-4 h-4 mr-2 text-[#ffc83d]" />
              SIMPLE, TRANSPARENT PRICING
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Choose the plan that
              <span className="block bg-gradient-to-r from-[#ffc83d] to-[#ff9500] bg-clip-text text-transparent">
                fits your needs
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Start free and scale as you grow. All paid plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 border border-white/10"
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  billingCycle === 'annual' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Annual
                <span className="text-xs bg-gradient-to-r from-[#ffc83d] to-[#ff9500] text-gray-900 px-2 py-0.5 rounded-full font-bold">
                  -20%
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-20 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => {
              const price = getPrice(plan);
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                >
                  {/* Most Popular Badge */}
                  {plan.popular && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <div className="bg-gradient-to-r from-[#ffc83d] to-[#ff9500] text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        MOST POPULAR
                      </div>
                    </motion.div>
                  )}
                  
                  <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-2 border-[#0078d4] shadow-xl shadow-[#0078d4]/10 bg-white' 
                      : 'border border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <CardHeader className="text-center pb-6 pt-8">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <plan.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-500 text-sm mt-1.5 h-10">{plan.description}</p>
                      
                      {/* Price */}
                      <div className="mt-6">
                        {price === null ? (
                          <div>
                            <span className="text-4xl font-bold text-gray-900">Custom</span>
                            <p className="text-sm text-gray-500 mt-1">Tailored to your needs</p>
                          </div>
                        ) : price === 0 ? (
                          <div>
                            <span className="text-4xl font-bold text-gray-900">$0</span>
                            <p className="text-sm text-gray-500 mt-1">Free forever</p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-baseline justify-center gap-1">
                              <span className="text-lg text-gray-400">$</span>
                              <span className="text-5xl font-bold text-gray-900">{price}</span>
                              <span className="text-gray-500">/user/mo</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'}
                            </p>
                            {billingCycle === 'annual' && plan.monthlyPrice && (
                              <p className="text-xs text-green-600 font-medium mt-1">
                                Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-8">
                      {/* CTA Button */}
                      <Link to={plan.name === 'Enterprise' ? '/contact' : '/signup'}>
                        <Button 
                          className={`w-full mb-8 h-12 text-base font-semibold transition-all duration-200 ${
                            plan.popular 
                              ? 'bg-gradient-to-r from-[#0078d4] to-[#005a9e] hover:from-[#005a9e] hover:to-[#004280] text-white shadow-lg shadow-[#0078d4]/25' 
                              : plan.ctaVariant === 'outline'
                              ? 'border-2 border-gray-900 text-gray-900 bg-transparent hover:bg-gray-900 hover:text-white'
                              : 'bg-gray-900 hover:bg-gray-800 text-white'
                          }`}
                          size="lg"
                        >
                          {plan.cta}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                      
                      {/* Features List */}
                      <ul className="space-y-3.5">
                        {plan.features.map((feature, i) => (
                          <motion.li 
                            key={feature.text}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + i * 0.03 }}
                            className="flex items-start gap-3"
                          >
                            {feature.included ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                              {feature.text}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Trusted by 50,000+ companies worldwide
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#0078d4]/10 flex items-center justify-center mb-3">
                  <badge.icon className="w-6 h-6 text-[#0078d4]" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">{badge.label}</span>
                <span className="text-xs text-gray-500">{badge.sublabel}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Compare All Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See exactly what's included in each plan to make the right choice.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            {/* Mobile: Scrollable hint */}
            <div className="lg:hidden px-4 py-3 bg-gray-50 text-center text-sm text-gray-500 border-b">
              ← Scroll horizontally to compare →
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900 w-1/4">Feature</th>
                    <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600 w-1/4">Free</th>
                    <th className="px-6 py-5 text-center text-sm font-semibold text-[#0078d4] w-1/4 bg-[#0078d4]/5 relative">
                      <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0078d4] to-[#005a9e]" />
                      Pro
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600 w-1/4">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisonFeatures.map((row, index) => (
                    <tr 
                      key={row.feature} 
                      className={`transition-colors hover:bg-gray-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-600">{row.free}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-[#0078d4]/5">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-medium text-[#0078d4]">{row.pro}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-600">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={guarantee.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <guarantee.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{guarantee.title}</h3>
                <p className="text-gray-600 text-sm">{guarantee.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-14 h-14 rounded-full bg-[#0078d4]/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-7 h-7 text-[#0078d4]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full bg-white rounded-xl p-5 text-left shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-gray-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 text-gray-600 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0078d4] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffc83d]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffc83d] to-[#ff9500] flex items-center justify-center mb-6 shadow-lg">
                <Building2 className="w-8 h-8 text-gray-900" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                Need enterprise-grade
                <span className="block text-[#ffc83d]">automation?</span>
              </h2>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Get custom pricing, dedicated support, advanced security, 
                and professional services tailored to your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-[#ffc83d] to-[#ff9500] hover:from-[#e6b435] hover:to-[#e68500] text-gray-900 font-semibold px-8 h-12 shadow-lg">
                    <MessageSquare className="mr-2 w-5 h-5" />
                    Contact Sales
                  </Button>
                </Link>
                <Link to="/request-demo">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 h-12 px-8">
                    Request Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 lg:gap-6"
            >
              {[
                { icon: Shield, title: 'Enterprise Security', description: 'SSO, SAML, custom encryption' },
                { icon: Headphones, title: '24/7 Support', description: 'Dedicated success manager' },
                { icon: Building2, title: 'On-Premise', description: 'Deploy in your environment' },
                { icon: Users, title: 'Volume Licensing', description: 'Flexible enterprise pricing' },
              ].map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <item.icon className="w-8 h-8 text-[#ffc83d] mb-3" />
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0078d4] to-[#005a9e] flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to automate your workflow?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already saving hours every week with TaskBot. 
              Start your free trial today.
            </p>
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#0078d4] to-[#005a9e] hover:from-[#005a9e] hover:to-[#004280] text-white px-10 h-14 text-lg font-semibold shadow-lg shadow-[#0078d4]/25"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                No credit card required
              </span>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                14-day Pro trial included
              </span>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
