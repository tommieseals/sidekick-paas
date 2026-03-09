import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Clock,
  Sparkles,
  TrendingUp,
  Bookmark,
  Share2,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const categories = [
  'All Posts',
  'Automation Tips',
  'Product Updates',
  'Case Studies',
  'Industry Insights',
  'Tutorials',
];

const featuredPost = {
  id: 1,
  title: 'The Future of Enterprise Automation: AI-Powered Workflows in 2026',
  excerpt: 'Discover how artificial intelligence is revolutionizing business process automation and what it means for your organization. From intelligent document processing to predictive analytics, explore the cutting-edge capabilities.',
  author: { name: 'Sarah Chen', role: 'VP of Product', avatar: 'SC' },
  date: 'February 28, 2026',
  readTime: '12 min read',
  category: 'Industry Insights',
  comments: 47,
};

const blogPosts = [
  {
    id: 2,
    title: '10 Workflow Automation Best Practices for Enterprise Teams',
    excerpt: 'Learn the proven strategies that help large organizations scale their automation initiatives effectively.',
    author: { name: 'Michael Torres', role: 'Solutions Architect', avatar: 'MT' },
    date: 'February 26, 2026',
    readTime: '8 min read',
    category: 'Automation Tips',
    comments: 23,
  },
  {
    id: 3,
    title: 'TaskBot 4.0: Introducing AI Co-Pilot and Enhanced Analytics',
    excerpt: 'Explore the new features in our latest release including the AI co-pilot and advanced reporting dashboards.',
    author: { name: 'Emily Watson', role: 'Product Manager', avatar: 'EW' },
    date: 'February 24, 2026',
    readTime: '6 min read',
    category: 'Product Updates',
    comments: 89,
  },
  {
    id: 4,
    title: 'How Acme Corp Saved $2M with Intelligent Invoice Processing',
    excerpt: 'A deep dive into how one of our enterprise customers transformed their accounts payable process.',
    author: { name: 'David Kim', role: 'Customer Success', avatar: 'DK' },
    date: 'February 22, 2026',
    readTime: '10 min read',
    category: 'Case Studies',
    comments: 34,
  },
  {
    id: 5,
    title: 'Building Your First AI-Powered Document Extraction Workflow',
    excerpt: 'Step-by-step tutorial on setting up intelligent document processing with TaskBot.',
    author: { name: 'Lisa Park', role: 'Developer Advocate', avatar: 'LP' },
    date: 'February 20, 2026',
    readTime: '15 min read',
    category: 'Tutorials',
    comments: 56,
  },
  {
    id: 6,
    title: 'RPA vs Intelligent Automation: Understanding the Difference',
    excerpt: 'A comprehensive comparison of traditional RPA and modern intelligent automation platforms.',
    author: { name: 'James Wilson', role: 'CTO', avatar: 'JW' },
    date: 'February 18, 2026',
    readTime: '9 min read',
    category: 'Industry Insights',
    comments: 41,
  },
];

const trendingTopics = [
  { name: 'AI Automation', count: 45 },
  { name: 'Document Processing', count: 32 },
  { name: 'Low-Code', count: 28 },
  { name: 'Enterprise Integration', count: 24 },
  { name: 'Process Mining', count: 19 },
];

const categoryColors: Record<string, string> = {
  'Automation Tips': 'bg-blue-100 text-blue-700',
  'Product Updates': 'bg-purple-100 text-purple-700',
  'Case Studies': 'bg-orange-100 text-orange-700',
  'Industry Insights': 'bg-green-100 text-green-700',
  'Tutorials': 'bg-teal-100 text-teal-700',
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#38b2ac] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <FileText className="w-4 h-4 mr-2" />
              BLOG
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Insights & Updates
            </h1>
            <p className="text-xl text-white/80 mb-8">
              The latest news, tips, and best practices from the TaskBot team and community.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-xl shadow-lg border-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#1a365d] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 shadow-xl cursor-pointer group">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2">
                  <div className="h-64 lg:h-full bg-gradient-to-br from-[#1a365d] to-[#38b2ac] relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-[#ed8936] text-white">
                        <Sparkles className="w-3 h-3 mr-1" /> Featured
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <Badge className={categoryColors[featuredPost.category]}>
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-4 mb-4 group-hover:text-[#3182ce] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-[#1a365d] text-white">
                          {featuredPost.author.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{featuredPost.author.name}</div>
                        <div className="text-sm text-gray-500">{featuredPost.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {featuredPost.readTime}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" /> {featuredPost.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Blog Posts */}
            <div className="flex-1">
              <div className="space-y-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          <div className="hidden sm:block w-16 h-16 rounded-xl bg-gradient-to-br from-[#1a365d]/10 to-[#38b2ac]/10 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className={categoryColors[post.category]}>
                                {post.category}
                              </Badge>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="w-4 h-4 mr-1" /> {post.readTime}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#3182ce] transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-[#1a365d] text-white text-xs">
                                    {post.author.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900">{post.author.name}</span>
                                  <span className="text-gray-500 mx-2">·</span>
                                  <span className="text-gray-500">{post.date}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                  <Bookmark className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                  <Share2 className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-32 space-y-8">
                {/* Trending Topics */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-[#ed8936]" />
                      Trending Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trendingTopics.map((topic) => (
                        <Link
                          key={topic.name}
                          to="#"
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-gray-700 font-medium">{topic.name}</span>
                          <span className="text-sm text-gray-400">{topic.count} posts</span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-[#1a365d] to-[#2c5282]">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Subscribe to Newsletter</h3>
                    <p className="text-white/70 text-sm mb-4">
                      Get the latest automation insights delivered to your inbox weekly.
                    </p>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="mb-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Button className="w-full bg-[#ed8936] hover:bg-[#dd6b20] text-white">
                      Subscribe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
