import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Workflow, Twitter, Linkedin, Youtube, Github, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = {
  products: [
    { name: 'Cloud Flows', href: '/products/cloud-flows' },
    { name: 'Desktop Flows', href: '/products/desktop-flows' },
    { name: 'AI Builder', href: '/products/ai-builder' },
    { name: 'Process Mining', href: '/products/process-mining' },
    { name: 'All Products', href: '/products' },
  ],
  solutions: [
    { name: 'Financial Services', href: '/solutions/finance' },
    { name: 'Healthcare', href: '/solutions/healthcare' },
    { name: 'Manufacturing', href: '/solutions/manufacturing' },
    { name: 'Retail', href: '/solutions/retail' },
    { name: 'All Solutions', href: '/solutions' },
  ],
  resources: [
    { name: 'Documentation', href: '/resources/documentation' },
    { name: 'Templates', href: '/resources/templates' },
    { name: 'Blog', href: '/resources/blog' },
    { name: 'Case Studies', href: '/resources/case-studies' },
    { name: 'Community', href: '/resources/community' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Partners', href: '/partners' },
    { name: 'Contact', href: '/contact' },
    { name: 'Support', href: '/support' },
  ],
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || subscribed) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setSubscribed(true);
    setIsSubmitting(false);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-[#1a365d] to-[#152951] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-xl lg:text-2xl font-semibold mb-2">
                Stay ahead with automation insights
              </h3>
              <p className="text-white/60 text-sm lg:text-base">
                Get the latest automation tips, product updates, and industry news delivered to your inbox.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 text-[#38b2ac] bg-[#38b2ac]/10 px-4 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Thanks for subscribing!</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full sm:w-72 h-12 px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#38b2ac]/50 focus:border-[#38b2ac] transition-all"
                    />
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-6 bg-[#38b2ac] hover:bg-[#319795] text-white font-medium shadow-lg shadow-[#38b2ac]/20 hover:shadow-[#38b2ac]/30 transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Subscribe
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#38b2ac] to-[#ed8936] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">TaskBot</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering organizations to automate workflows and transform productivity with intelligent automation.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <social.icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/90 mb-4">
              Products
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/90 mb-4">
              Solutions
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/90 mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/90 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm order-2 sm:order-1">
              © {new Date().getFullYear()} TaskBot. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm order-1 sm:order-2">
              <Link 
                to="/privacy" 
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                Cookie Policy
              </Link>
              <Link 
                to="/security" 
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
