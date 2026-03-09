import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  Search,
  Filter,
  Download,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  Mail,
  FileSpreadsheet,
  Database,
  MessageSquare,
  Calendar,
  ShoppingCart,
  UserCheck,
  FileText,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = [
  { id: 'all', label: 'All Templates', count: 156 },
  { id: 'productivity', label: 'Productivity', count: 42 },
  { id: 'sales', label: 'Sales & CRM', count: 28 },
  { id: 'hr', label: 'HR & Recruiting', count: 24 },
  { id: 'finance', label: 'Finance', count: 22 },
  { id: 'marketing', label: 'Marketing', count: 18 },
  { id: 'it', label: 'IT & DevOps', count: 22 },
];

const templates = [
  {
    id: 1,
    title: 'Email to Task Automation',
    description: 'Automatically create tasks from incoming emails with AI-powered parsing and categorization.',
    icon: Mail,
    category: 'productivity',
    downloads: '25.4K',
    rating: 4.9,
    reviews: 342,
    difficulty: 'Beginner',
    timeToSetup: '5 min',
    featured: true,
    integrations: ['Outlook', 'Microsoft To Do', 'Teams'],
  },
  {
    id: 2,
    title: 'Invoice Processing Pipeline',
    description: 'Extract data from invoices, validate amounts, and route for approval automatically.',
    icon: FileSpreadsheet,
    category: 'finance',
    downloads: '18.2K',
    rating: 4.8,
    reviews: 256,
    difficulty: 'Intermediate',
    timeToSetup: '15 min',
    featured: true,
    integrations: ['SAP', 'QuickBooks', 'SharePoint'],
  },
  {
    id: 3,
    title: 'CRM Lead Sync',
    description: 'Sync leads between Salesforce, HubSpot, and your email marketing platform in real-time.',
    icon: Database,
    category: 'sales',
    downloads: '15.8K',
    rating: 4.7,
    reviews: 189,
    difficulty: 'Intermediate',
    timeToSetup: '10 min',
    featured: false,
    integrations: ['Salesforce', 'HubSpot', 'Mailchimp'],
  },
  {
    id: 4,
    title: 'Slack Notification Hub',
    description: 'Centralize all your notifications and alerts from multiple services to Slack channels.',
    icon: MessageSquare,
    category: 'productivity',
    downloads: '22.1K',
    rating: 4.9,
    reviews: 421,
    difficulty: 'Beginner',
    timeToSetup: '5 min',
    featured: true,
    integrations: ['Slack', 'GitHub', 'Jira'],
  },
  {
    id: 5,
    title: 'Calendar Sync & Reminders',
    description: 'Sync calendars across platforms and send smart reminders via email, SMS, or push.',
    icon: Calendar,
    category: 'productivity',
    downloads: '19.7K',
    rating: 4.6,
    reviews: 278,
    difficulty: 'Beginner',
    timeToSetup: '8 min',
    featured: false,
    integrations: ['Google Calendar', 'Outlook', 'Twilio'],
  },
  {
    id: 6,
    title: 'E-commerce Order Flow',
    description: 'Automate order processing from receipt to fulfillment with inventory updates.',
    icon: ShoppingCart,
    category: 'sales',
    downloads: '12.3K',
    rating: 4.8,
    reviews: 167,
    difficulty: 'Advanced',
    timeToSetup: '25 min',
    featured: false,
    integrations: ['Shopify', 'WooCommerce', 'ShipStation'],
  },
  {
    id: 7,
    title: 'Employee Onboarding',
    description: 'Streamline new hire onboarding with automated account creation and training assignments.',
    icon: UserCheck,
    category: 'hr',
    downloads: '14.5K',
    rating: 4.7,
    reviews: 198,
    difficulty: 'Intermediate',
    timeToSetup: '20 min',
    featured: true,
    integrations: ['Workday', 'Active Directory', 'DocuSign'],
  },
  {
    id: 8,
    title: 'Document Approval Workflow',
    description: 'Route documents for review and approval with custom rules and escalation paths.',
    icon: FileText,
    category: 'productivity',
    downloads: '21.9K',
    rating: 4.8,
    reviews: 312,
    difficulty: 'Intermediate',
    timeToSetup: '15 min',
    featured: false,
    integrations: ['SharePoint', 'DocuSign', 'Teams'],
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#553c9a] via-[#805ad5] to-[#b794f4] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Layout className="w-4 h-4 mr-2" />
              TEMPLATE GALLERY
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready-to-use
              <span className="block text-[#fbd38d]">workflow templates</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              150+ professionally designed templates to jumpstart your automation. 
              Import, customize, and deploy in minutes.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-xl shadow-lg border-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-[#ed8936]" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Templates</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.filter(t => t.featured).map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-[#805ad5]/20 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#805ad5]/10 flex items-center justify-center">
                        <template.icon className="w-6 h-6 text-[#805ad5]" />
                      </div>
                      <Badge className="bg-[#ed8936] text-white">Featured</Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-[#805ad5] transition-colors line-clamp-1">
                      {template.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" /> {template.rating}
                      </span>
                      <span className="flex items-center">
                        <Download className="w-4 h-4 mr-1" /> {template.downloads}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Template Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-64 flex-shrink-0"
            >
              <Card className="sticky top-24 border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-[#805ad5] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>{category.label}</span>
                        <span className={`text-xs ${selectedCategory === category.id ? 'text-white/70' : 'text-gray-400'}`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Template Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-medium">{filteredTemplates.length}</span> templates
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="text-sm border-0 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#805ad5]">
                    <option>Most Popular</option>
                    <option>Highest Rated</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {filteredTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-[#805ad5]/10 flex items-center justify-center transition-colors">
                              <template.icon className="w-7 h-7 text-gray-600 group-hover:text-[#805ad5] transition-colors" />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[template.difficulty]}`}>
                              {template.difficulty}
                            </span>
                          </div>
                          <CardTitle className="text-xl group-hover:text-[#805ad5] transition-colors">
                            {template.title}
                          </CardTitle>
                          <CardDescription className="text-base line-clamp-2">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {template.integrations.map((integration) => (
                              <Badge key={integration} variant="secondary" className="text-xs">
                                {integration}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" /> {template.rating}
                              </span>
                              <span className="flex items-center">
                                <Download className="w-4 h-4 mr-1" /> {template.downloads}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" /> {template.timeToSetup}
                              </span>
                            </div>
                            <Button size="sm" className="bg-[#805ad5] hover:bg-[#6b46c1]">
                              Use Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Template CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] to-[#2c5282]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-[#ed8936]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Share Your Template
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Built something awesome? Submit your template to help the community and get featured.
            </p>
            <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white">
              Submit a Template <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
