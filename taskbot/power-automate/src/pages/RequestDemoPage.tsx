import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, Sparkles, Users, Clock, Calendar, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const benefits = [
  { text: 'Personalized walkthrough of TaskBot features', icon: Play },
  { text: 'See how automation applies to your use cases', icon: Sparkles },
  { text: 'Get answers to your specific questions', icon: Users },
  { text: 'Learn about pricing and implementation', icon: Building2 },
  { text: 'No commitment required', icon: CheckCircle2 },
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1000 employees',
  '1000+ employees',
];

const stats = [
  { value: '15 min', label: 'Average demo time' },
  { value: '94%', label: 'Satisfaction rate' },
  { value: '24h', label: 'Response time' },
];

export default function RequestDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#38b2ac] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-32"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                REQUEST A DEMO
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                See TaskBot<br />in action
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed">
                Get a personalized demo from our automation experts. See how TaskBot can transform your workflows and boost productivity.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#ed8936] flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="hidden lg:grid grid-cols-3 gap-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Demo Requested!</h2>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Thank you! Our team will reach out within 24 hours to schedule your personalized demo.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
                    <Calendar className="w-4 h-4" />
                    <span>Check your email for confirmation</span>
                  </div>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Request another demo
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Schedule Your Demo</h2>
                    <p className="text-gray-600">Fill out the form and we'll be in touch shortly.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="John"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Doe"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                          required
                        />
                      </div>
                    </div>

                    {/* Work Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                        required
                      />
                    </div>

                    {/* Company & Job Title */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Your company"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                        <Input
                          placeholder="Your role"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                      />
                    </div>

                    {/* Company Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                      <select className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:border-[#1a365d] focus:ring-2 focus:ring-[#1a365d]/20 outline-none transition-all text-gray-900 appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                      >
                        <option value="">Select company size...</option>
                        {companySizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    {/* Automation Goals */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What would you like to automate?
                      </label>
                      <Textarea
                        placeholder="Tell us about your automation goals and challenges..."
                        rows={4}
                        className="rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-[#ed8936] hover:bg-[#dd6b20] text-base font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#ed8936]/25 hover:shadow-xl hover:shadow-[#ed8936]/30"
                      size="lg"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Play className="mr-2 w-5 h-5" />
                          Request Demo
                        </>
                      )}
                    </Button>

                    {/* Privacy Note */}
                    <p className="text-xs text-gray-500 text-center pt-2">
                      By submitting this form, you agree to our{' '}
                      <a href="/privacy" className="text-[#1a365d] hover:underline">Privacy Policy</a>.
                      We'll never share your information.
                    </p>
                  </form>
                </>
              )}

              {/* Trust Badges */}
              {!isSuccess && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>15 min demo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>No obligation</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Mobile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:hidden mt-8 grid grid-cols-3 gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
