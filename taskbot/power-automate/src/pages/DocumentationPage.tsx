import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Book,
  Search,
  ChevronRight,
  Rocket,
  Settings,
  Plug,
  Code,
  Shield,
  BarChart3,
  ExternalLink,
  Clock,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Zap,
  Terminal,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const docCategories = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Quick start guides and tutorials for new users',
    articles: 24,
    color: '#3182ce',
    topics: ['Quick Start', 'Installation', 'First Workflow', 'Basic Concepts'],
  },
  {
    icon: Settings,
    title: 'Platform Guide',
    description: 'In-depth platform features and configuration',
    articles: 45,
    color: '#805ad5',
    topics: ['Workflow Builder', 'Variables', 'Error Handling', 'Scheduling'],
  },
  {
    icon: Plug,
    title: 'Integrations',
    description: 'Connect to 500+ apps and services',
    articles: 120,
    color: '#38b2ac',
    topics: ['Microsoft 365', 'Salesforce', 'SAP', 'Custom APIs'],
  },
  {
    icon: Code,
    title: 'API Reference',
    description: 'Complete API documentation for developers',
    articles: 85,
    color: '#ed8936',
    topics: ['REST API', 'Webhooks', 'SDKs', 'Authentication'],
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Enterprise security and compliance guides',
    articles: 32,
    color: '#e53e3e',
    topics: ['Access Control', 'Encryption', 'Audit Logs', 'SOC 2'],
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description: 'Monitoring, analytics, and performance optimization',
    articles: 28,
    color: '#48bb78',
    topics: ['Dashboards', 'Metrics', 'ROI Tracking', 'Alerts'],
  },
];

const popularArticles = [
  {
    title: 'Building Your First Workflow',
    description: 'Step-by-step guide to creating your first automation',
    category: 'Getting Started',
    readTime: '8 min',
    views: '45.2K',
  },
  {
    title: 'Working with Variables and Expressions',
    description: 'Learn how to use dynamic data in your workflows',
    category: 'Platform Guide',
    readTime: '12 min',
    views: '32.1K',
  },
  {
    title: 'REST API Authentication Methods',
    description: 'Implement OAuth, API keys, and JWT authentication',
    category: 'API Reference',
    readTime: '15 min',
    views: '28.5K',
  },
  {
    title: 'Error Handling Best Practices',
    description: 'Build resilient workflows with proper error handling',
    category: 'Platform Guide',
    readTime: '10 min',
    views: '24.3K',
  },
];

const quickLinks = [
  { icon: Zap, title: 'Quick Start', description: '5 min setup', href: '#' },
  { icon: Terminal, title: 'API Docs', description: 'Developer reference', href: '#' },
  { icon: BookOpen, title: 'Tutorials', description: 'Step-by-step guides', href: '#' },
  { icon: Lightbulb, title: 'Best Practices', description: 'Expert tips', href: '#' },
];

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#3182ce] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Book className="w-4 h-4 mr-2" />
              DOCUMENTATION
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              TaskBot Documentation
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Comprehensive guides and references to help you build powerful automations.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-xl shadow-lg border-0"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.title}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors group"
                >
                  <link.icon className="w-6 h-6 text-[#ed8936] mb-2" />
                  <div className="text-white font-medium">{link.title}</div>
                  <div className="text-white/60 text-sm">{link.description}</div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600">
              Find exactly what you need with our organized documentation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <category.icon className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      <Badge variant="secondary">{category.articles} articles</Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-[#3182ce] transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Articles</h2>
              <p className="text-gray-600">Most-read documentation by our community</p>
            </div>
            <Button variant="outline" className="hidden sm:flex">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-0 bg-gray-50 hover:bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-[#3182ce] border-[#3182ce]/30">
                            {article.category}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" /> {article.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3182ce] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{article.description}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-500 flex items-center justify-end">
                            <TrendingUp className="w-4 h-4 mr-1" /> {article.views} views
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#3182ce] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Reference CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] to-[#2c5282]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-[#ed8936]" />
                </div>
                <h2 className="text-3xl font-bold text-white">API Reference</h2>
              </div>
              <p className="text-xl text-white/80 max-w-xl">
                Full API documentation for developers. Build custom integrations and extend TaskBot's capabilities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white">
                <Terminal className="mr-2 w-5 h-5" />
                View API Docs
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <ExternalLink className="mr-2 w-5 h-5" />
                Try API
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
