import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  MessageSquare,
  Award,
  TrendingUp,
  ThumbsUp,
  Eye,
  ArrowRight,
  Globe,
  Code,
  Lightbulb,
  HelpCircle,
  BookOpen,
  Trophy,
  Zap,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const forumCategories = [
  { icon: HelpCircle, title: 'Questions & Answers', description: 'Get help from the community', topics: 8432, posts: 45621, color: '#3182ce' },
  { icon: Lightbulb, title: 'Ideas & Feature Requests', description: 'Share and vote on ideas', topics: 2156, posts: 12847, color: '#ed8936' },
  { icon: BookOpen, title: 'Best Practices', description: 'Learn from experts', topics: 1842, posts: 9523, color: '#48bb78' },
  { icon: Code, title: 'Developer Corner', description: 'APIs, SDKs, and custom code', topics: 3267, posts: 18934, color: '#805ad5' },
  { icon: Sparkles, title: 'Show & Tell', description: 'Share your automations', topics: 1523, posts: 7842, color: '#e53e3e' },
  { icon: Globe, title: 'User Groups', description: 'Regional and industry groups', topics: 456, posts: 3241, color: '#38b2ac' },
];

const topContributors = [
  { name: 'Sarah Chen', avatar: 'SC', points: 15420, badge: 'MVP', solutions: 342 },
  { name: 'Michael Torres', avatar: 'MT', points: 12850, badge: 'Expert', solutions: 287 },
  { name: 'Emily Watson', avatar: 'EW', points: 11230, badge: 'Expert', solutions: 256 },
  { name: 'David Kim', avatar: 'DK', points: 9870, badge: 'Pro', solutions: 198 },
  { name: 'Lisa Park', avatar: 'LP', points: 8540, badge: 'Pro', solutions: 176 },
];

const recentDiscussions = [
  {
    id: 1,
    title: 'How to handle API rate limiting in workflows?',
    category: 'Questions & Answers',
    author: { name: 'Alex Johnson', avatar: 'AJ' },
    replies: 23,
    views: 1240,
    likes: 45,
    solved: true,
    tags: ['API', 'Error Handling'],
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Feature Request: Native GitHub Actions integration',
    category: 'Ideas & Feature Requests',
    author: { name: 'Maria Garcia', avatar: 'MG' },
    replies: 67,
    views: 2890,
    likes: 234,
    solved: false,
    tags: ['Integration', 'DevOps'],
    time: '5 hours ago',
  },
  {
    id: 3,
    title: 'My automated expense reporting workflow - 90% time reduction!',
    category: 'Show & Tell',
    author: { name: 'James Wilson', avatar: 'JW' },
    replies: 45,
    views: 3420,
    likes: 189,
    solved: false,
    tags: ['Finance', 'Case Study'],
    time: '1 day ago',
  },
  {
    id: 4,
    title: 'Best practices for multi-tenant workflow design',
    category: 'Best Practices',
    author: { name: 'Rachel Kim', avatar: 'RK' },
    replies: 34,
    views: 1890,
    likes: 78,
    solved: false,
    tags: ['Enterprise', 'Architecture'],
    time: '2 days ago',
  },
];

const communityStats = [
  { value: '25K+', label: 'Active Members' },
  { value: '150K+', label: 'Discussions' },
  { value: '500K+', label: 'Solutions Shared' },
  { value: '50+', label: 'Countries' },
];

const upcomingEvents = [
  { title: 'Community Call: March Edition', date: 'March 20, 2026', attendees: 234 },
  { title: 'TaskBot Hackathon 2026', date: 'April 5-7, 2026', attendees: 567 },
  { title: 'Automation Summit NYC', date: 'May 15, 2026', attendees: 890 },
];

const badgeColors: Record<string, string> = {
  MVP: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Expert: 'bg-purple-100 text-purple-700 border-purple-300',
  Pro: 'bg-blue-100 text-blue-700 border-blue-300',
};

const categoryColors: Record<string, string> = {
  'Questions & Answers': 'text-[#3182ce]',
  'Ideas & Feature Requests': 'text-[#ed8936]',
  'Best Practices': 'text-[#48bb78]',
  'Developer Corner': 'text-[#805ad5]',
  'Show & Tell': 'text-[#e53e3e]',
};

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#276749] via-[#38a169] to-[#48bb78] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              COMMUNITY
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Join 25,000+ automation
              <span className="block text-[#fbd38d]">professionals</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Connect, learn, and grow with the largest community of workflow automation experts.
            </p>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search discussions, questions, ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-xl shadow-lg border-0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white">
                <MessageSquare className="mr-2 w-5 h-5" />
                Start a Discussion
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Users className="mr-2 w-5 h-5" />
                Join the Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#276749] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Forums</h2>
            <p className="text-lg text-gray-600">Find the right place for your question or idea</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forumCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <category.icon className="w-7 h-7" style={{ color: category.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-[#38a169] transition-colors">
                          {category.title}
                        </CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{category.topics.toLocaleString()} topics</span>
                      <span>{category.posts.toLocaleString()} posts</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Discussions & Sidebar */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Recent Discussions */}
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-[#38a169]" />
                    <h2 className="text-2xl font-bold text-gray-900">Trending Discussions</h2>
                  </div>
                  <Button variant="outline">View All</Button>
                </div>

                <div className="space-y-4">
                  {recentDiscussions.map((discussion, index) => (
                    <motion.div
                      key={discussion.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 bg-gray-50 hover:bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-[#276749] text-white">
                                {discussion.author.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-sm font-medium ${categoryColors[discussion.category] || 'text-gray-500'}`}>
                                  {discussion.category}
                                </span>
                                {discussion.solved && (
                                  <Badge className="bg-green-100 text-green-700">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Solved
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#38a169] transition-colors">
                                {discussion.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{discussion.author.name}</span>
                                <span>•</span>
                                <span>{discussion.time}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                {discussion.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="hidden sm:flex flex-col items-end gap-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" /> {discussion.replies}
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" /> {discussion.views.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="w-4 h-4 mr-1" /> {discussion.likes}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Top Contributors */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Top Contributors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topContributors.map((contributor, index) => (
                        <div key={contributor.name} className="flex items-center gap-3">
                          <span className="w-6 text-center font-bold text-gray-400">{index + 1}</span>
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-[#276749] text-white text-sm">
                              {contributor.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{contributor.name}</div>
                            <div className="text-xs text-gray-500">{contributor.points.toLocaleString()} points</div>
                          </div>
                          <Badge variant="outline" className={badgeColors[contributor.badge]}>
                            {contributor.badge}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="w-5 h-5 text-[#38a169]" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.title} className="border-l-2 border-[#38a169] pl-4">
                          <div className="font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.date}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            <Users className="w-3 h-3 inline mr-1" />
                            {event.attendees} attending
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Join Card */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-[#276749] to-[#38a169] text-white">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Become a Contributor</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Share your knowledge, earn badges, and help others succeed.
                    </p>
                    <Button className="w-full bg-white text-[#276749] hover:bg-white/90">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] to-[#2c5282]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-[#ed8936]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Our support team is here to help. Reach out anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white">
                Contact Support <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit Help Center
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
