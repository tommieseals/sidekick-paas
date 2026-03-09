import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Book,
  FileText,
  Layout,
  Users,
  Video,
  Award,
  ArrowRight,
  Sparkles,
  Search,
  TrendingUp,
  Download,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const resourceCategories = [
  {
    icon: Book,
    title: 'Documentation',
    description: 'Comprehensive guides, API references, and technical documentation to help you build powerful automations.',
    link: '/resources/documentation',
    count: '200+ articles',
    color: '#3182ce',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Layout,
    title: 'Templates',
    description: 'Pre-built workflow templates for common business processes. Get started in minutes, not hours.',
    link: '/resources/templates',
    count: '150+ templates',
    color: '#805ad5',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: FileText,
    title: 'Blog',
    description: 'Latest news, best practices, tips & tricks, and automation insights from our expert team.',
    link: '/resources/blog',
    count: 'Weekly updates',
    color: '#38b2ac',
    gradient: 'from-teal-500 to-teal-600',
  },
  {
    icon: Award,
    title: 'Case Studies',
    description: 'Real-world success stories from enterprises transforming their operations with TaskBot.',
    link: '/resources/case-studies',
    count: '50+ stories',
    color: '#ed8936',
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    icon: Video,
    title: 'Webinars',
    description: 'Live and on-demand webinars covering automation strategies, product updates, and expert sessions.',
    link: '/resources/webinars',
    count: 'Monthly events',
    color: '#e53e3e',
    gradient: 'from-red-500 to-red-600',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join thousands of automation professionals. Ask questions, share solutions, and connect with experts.',
    link: '/resources/community',
    count: '25K+ members',
    color: '#48bb78',
    gradient: 'from-green-500 to-green-600',
  },
];

const featuredResources = [
  {
    type: 'Guide',
    title: 'Getting Started with TaskBot',
    description: 'Everything you need to build your first automation',
    readTime: '15 min read',
    icon: Book,
  },
  {
    type: 'Template',
    title: 'Invoice Processing Workflow',
    description: 'Automate invoice extraction and approval',
    downloads: '12.5K downloads',
    icon: Download,
  },
  {
    type: 'Webinar',
    title: 'AI in Enterprise Automation',
    description: 'Learn how AI is transforming business processes',
    duration: '45 min',
    icon: Video,
  },
];

const stats = [
  { value: '500+', label: 'Documentation Pages' },
  { value: '150+', label: 'Ready Templates' },
  { value: '25K+', label: 'Community Members' },
  { value: '1M+', label: 'Monthly Visitors' },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#38b2ac] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              RESOURCE CENTER
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Everything you need to
              <span className="block text-[#ed8936]">master automation</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Explore our comprehensive library of guides, templates, tutorials, and community resources 
              to accelerate your automation journey.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documentation, templates, guides..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-[#ed8936]"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ed8936] hover:bg-[#dd6b20]">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Resource Categories Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From getting started guides to advanced tutorials, find everything you need to succeed with TaskBot.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={category.link}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
                    <CardHeader className="pb-2">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <category.icon className="w-7 h-7" style={{ color: category.color }} />
                      </div>
                      <CardTitle className="text-xl group-hover:text-[#3182ce] transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">{category.count}</span>
                        <span className="text-[#3182ce] group-hover:translate-x-2 transition-transform flex items-center text-sm font-medium">
                          Explore <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Resources</h2>
              <p className="text-gray-600">Hand-picked content to help you get started</p>
            </div>
            <Link to="/resources/all">
              <Button variant="outline" className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#3182ce]/10 flex items-center justify-center">
                        <resource.icon className="w-5 h-5 text-[#3182ce]" />
                      </div>
                      <span className="text-sm font-medium text-[#3182ce] bg-[#3182ce]/10 px-3 py-1 rounded-full">
                        {resource.type}
                      </span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-[#3182ce] transition-colors">
                      {resource.title}
                    </CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {resource.readTime || resource.downloads || resource.duration}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-24 bg-gradient-to-br from-[#1a365d] to-[#2c5282]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Connect with 25,000+ automation professionals. Get help, share ideas, and learn from experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/resources/community">
                <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white">
                  <Users className="mr-2 w-5 h-5" />
                  Join Community
                </Button>
              </Link>
              <Link to="/resources/documentation">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
