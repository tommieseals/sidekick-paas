import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  { icon: Mail, title: 'Email', value: 'hello@taskbot.com', link: 'mailto:hello@taskbot.com' },
  { icon: Phone, title: 'Phone', value: '+1 (800) 123-4567', link: 'tel:+18001234567' },
  { icon: MapPin, title: 'Address', value: '123 Automation Way\nSan Francisco, CA 94102' },
];

const quickLinks = [
  { icon: MessageSquare, title: 'Live Chat', desc: 'Available 24/7', action: 'Start Chat' },
  { icon: Globe, title: 'Help Center', desc: 'Browse articles', action: 'Visit Help' },
];

export default function ContactPage() {
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#38b2ac] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Mail className="w-4 h-4 mr-2" />
              GET IN TOUCH
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              We'd love to hear from you
            </h1>
            <p className="text-lg sm:text-xl text-white/80">
              Have a question or feedback? Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {quickLinks.map((link) => (
              <motion.button
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1a365d]/30 hover:shadow-lg transition-all text-left"
              >
                <div className="w-12 h-12 bg-[#1a365d]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <link.icon className="w-6 h-6 text-[#1a365d]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.desc}</p>
                </div>
                <span className="text-sm font-medium text-[#1a365d]">{link.action} →</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
              <p className="text-gray-600 mb-8">We'll get back to you within 24 hours.</p>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-gray-600 mb-6">Thank you for reaching out. We'll be in touch soon.</p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-xl">
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <Input
                        placeholder="John"
                        className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <Input
                        placeholder="Doe"
                        className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <Input
                      placeholder="Your company (optional)"
                      className="h-12 rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:border-[#1a365d] focus:ring-2 focus:ring-[#1a365d]/20 outline-none transition-all">
                      <option value="">Select a topic...</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales Question</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <Textarea
                      placeholder="How can we help you?"
                      rows={5}
                      className="rounded-xl border-gray-200 focus:border-[#1a365d] focus:ring-[#1a365d]/20 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-8 bg-[#1a365d] hover:bg-[#2c5282] rounded-xl font-semibold shadow-lg shadow-[#1a365d]/25 hover:shadow-xl transition-all"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-6 mb-10">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1a365d]/10 to-[#38b2ac]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-[#1a365d]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-600 hover:text-[#1a365d] transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Office Hours Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-[#1a365d]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Office Hours</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Live chat available 24/7
                    </span>
                  </p>
                </div>
              </div>

              {/* Response Time */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Average response time:</strong> Under 2 hours during business hours
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
