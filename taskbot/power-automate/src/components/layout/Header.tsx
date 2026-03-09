import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Workflow, 
  Cloud, 
  Monitor, 
  Brain, 
  LineChart,
  Building2,
  Heart,
  Factory,
  ShoppingCart,
  Users,
  Cpu,
  TrendingUp,
  Headphones,
  FileText,
  BookOpen,
  Newspaper,
  Award,
  Video,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    name: 'Products',
    href: '/products',
    children: [
      { name: 'Cloud Flows', href: '/products/cloud-flows', icon: Cloud, description: 'Automate workflows in the cloud' },
      { name: 'Desktop Flows', href: '/products/desktop-flows', icon: Monitor, description: 'RPA for desktop automation' },
      { name: 'AI Builder', href: '/products/ai-builder', icon: Brain, description: 'Build AI models with no code' },
      { name: 'Process Mining', href: '/products/process-mining', icon: LineChart, description: 'Discover automation opportunities' },
    ],
  },
  {
    name: 'Solutions',
    href: '/solutions',
    children: [
      { name: 'Financial Services', href: '/solutions/finance', icon: Building2, description: 'Banking & insurance automation' },
      { name: 'Healthcare', href: '/solutions/healthcare', icon: Heart, description: 'Healthcare workflow solutions' },
      { name: 'Manufacturing', href: '/solutions/manufacturing', icon: Factory, description: 'Industrial automation' },
      { name: 'Retail', href: '/solutions/retail', icon: ShoppingCart, description: 'Retail operations automation' },
      { name: 'HR', href: '/solutions/hr', icon: Users, description: 'Human resources automation' },
      { name: 'IT', href: '/solutions/it', icon: Cpu, description: 'IT operations & helpdesk' },
      { name: 'Sales', href: '/solutions/sales', icon: TrendingUp, description: 'Sales process automation' },
      { name: 'Customer Service', href: '/solutions/customer-service', icon: Headphones, description: 'Support automation' },
    ],
  },
  {
    name: 'Resources',
    href: '/resources',
    children: [
      { name: 'Documentation', href: '/resources/documentation', icon: FileText, description: 'Guides and API docs' },
      { name: 'Templates', href: '/resources/templates', icon: BookOpen, description: 'Pre-built automation templates' },
      { name: 'Blog', href: '/resources/blog', icon: Newspaper, description: 'News and insights' },
      { name: 'Case Studies', href: '/resources/case-studies', icon: Award, description: 'Customer success stories' },
      { name: 'Webinars', href: '/resources/webinars', icon: Video, description: 'On-demand training' },
      { name: 'Community', href: '/resources/community', icon: MessageSquare, description: 'Join the community' },
    ],
  },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Partners', href: '/partners' },
  { name: 'Support', href: '/support' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Track scroll for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setExpandedMobileItem(null);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b transition-shadow duration-300 ${
        scrolled ? 'border-gray-200 shadow-lg shadow-black/5' : 'border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#1a365d] to-[#38b2ac] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#1a365d] tracking-tight">TaskBot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item, index) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname.startsWith(item.href)
                      ? 'text-[#1a365d] bg-[#1a365d]/5'
                      : 'text-gray-600 hover:text-[#1a365d] hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.name && (
                    <>
                      {/* Invisible bridge to prevent menu close on hover gap */}
                      <div className="absolute top-full left-0 h-2 w-full" />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`absolute top-full mt-1 bg-white rounded-xl shadow-xl shadow-black/10 border border-gray-100 p-1.5 ${
                          // Align right for items that would overflow
                          index >= navigation.length - 3 ? 'right-0' : 'left-0'
                        } ${
                          // Wider dropdown for Solutions (more items)
                          item.name === 'Solutions' ? 'w-[340px]' : 'w-[300px]'
                        }`}
                      >
                        <div className={item.name === 'Solutions' ? 'grid grid-cols-1 gap-0.5 max-h-[400px] overflow-y-auto' : 'space-y-0.5'}>
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group/item"
                            >
                              <div className="w-9 h-9 bg-gradient-to-br from-[#1a365d]/10 to-[#38b2ac]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:from-[#1a365d]/15 group-hover/item:to-[#38b2ac]/15 transition-colors">
                                <child.icon className="w-4.5 h-4.5 text-[#1a365d]" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm text-gray-900 group-hover/item:text-[#1a365d] transition-colors">
                                  {child.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                  {child.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/signin">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-[#1a365d] hover:bg-gray-50 font-medium px-4"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/request-demo">
              <Button 
                size="sm"
                className="bg-[#1a365d] hover:bg-[#2c5282] text-white font-medium px-5 shadow-sm hover:shadow-md transition-shadow"
              >
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden"
            >
              <div className="border-t border-gray-100 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {navigation.map((item) => (
                  <div key={item.name} className="border-b border-gray-50 last:border-0">
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setExpandedMobileItem(
                            expandedMobileItem === item.name ? null : item.name
                          )}
                          className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                          <span>{item.name}</span>
                          <ChevronRight 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              expandedMobileItem === item.name ? 'rotate-90' : ''
                            }`} 
                          />
                        </button>
                        <AnimatePresence>
                          {expandedMobileItem === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden bg-gray-50/50"
                            >
                              <div className="py-2 px-2">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-white hover:text-[#1a365d] transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                      <child.icon className="w-4 h-4 text-[#1a365d]" />
                                    </div>
                                    <span className="text-sm font-medium">{child.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile CTAs */}
                <div className="mt-4 px-4 space-y-2.5">
                  <Link 
                    to="/signin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full h-11 font-medium border-gray-200"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link 
                    to="/request-demo" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full h-11 bg-[#1a365d] hover:bg-[#2c5282] font-medium shadow-sm">
                      Request Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
