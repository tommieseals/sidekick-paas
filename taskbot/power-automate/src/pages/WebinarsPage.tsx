import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Search,
  Calendar,
  Clock,
  Users,
  Play,
  ArrowRight,
  Bell,
  Sparkles,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const tabs = ['All', 'Upcoming', 'On-Demand', 'Series'];

const upcomingWebinars = [
  {
    id: 1,
    title: 'AI-Powered Document Processing: From OCR to Intelligence',
    description: 'Learn how to leverage AI for intelligent document extraction at scale.',
    date: 'March 15, 2026',
    time: '11:00 AM EST',
    duration: '60 min',
    speakers: [
      { name: 'Dr. Sarah Chen', role: 'Chief AI Officer', avatar: 'SC' },
      { name: 'Mike Rodriguez', role: 'Solutions Engineer', avatar: 'MR' },
    ],
    registrations: 1247,
    topics: ['AI/ML', 'Document Processing'],
    featured: true,
  },
  {
    id: 2,
    title: 'Building Enterprise-Grade Workflows: Security & Compliance',
    description: 'Deep dive into building secure, compliant automation workflows.',
    date: 'March 22, 2026',
    time: '2:00 PM EST',
    duration: '45 min',
    speakers: [{ name: 'Jennifer Walsh', role: 'Security Director', avatar: 'JW' }],
    registrations: 856,
    topics: ['Security', 'Compliance'],
    featured: false,
  },
  {
    id: 3,
    title: 'TaskBot 4.0 Launch: What\'s New and What\'s Next',
    description: 'Exclusive look at the latest features and our 2026 roadmap.',
    date: 'March 29, 2026',
    time: '10:00 AM EST',
    duration: '45 min',
    speakers: [
      { name: 'David Park', role: 'VP Product', avatar: 'DP' },
      { name: 'Lisa Martinez', role: 'Product Manager', avatar: 'LM' },
    ],
    registrations: 2134,
    topics: ['Product Update', 'Roadmap'],
    featured: true,
  },
];

const onDemandWebinars = [
  {
    id: 4,
    title: 'Getting Started with TaskBot: Beginner Workshop',
    description: 'A comprehensive introduction to the TaskBot platform.',
    duration: '90 min',
    views: '15.2K',
    rating: 4.9,
    speakers: [{ name: 'Tom Wilson', avatar: 'TW' }],
    topics: ['Beginner', 'Getting Started'],
  },
  {
    id: 5,
    title: 'Advanced Error Handling and Recovery Patterns',
    description: 'Expert techniques for building resilient workflows.',
    duration: '55 min',
    views: '8.7K',
    rating: 4.8,
    speakers: [{ name: 'Emma Davis', avatar: 'ED' }],
    topics: ['Advanced', 'Best Practices'],
  },
  {
    id: 6,
    title: 'Integrating with SAP: A Complete Guide',
    description: 'Step-by-step walkthrough of SAP connector capabilities.',
    duration: '75 min',
    views: '6.3K',
    rating: 4.7,
    speakers: [{ name: 'Hans Mueller', avatar: 'HM' }],
    topics: ['Integration', 'SAP'],
  },
  {
    id: 7,
    title: 'Process Mining for Automation Discovery',
    description: 'Use data-driven insights to identify automation opportunities.',
    duration: '50 min',
    views: '5.1K',
    rating: 4.9,
    speakers: [{ name: 'Rachel Kim', avatar: 'RK' }],
    topics: ['Process Mining', 'Analytics'],
  },
];

const webinarSeries = [
  { title: 'Automation Masterclass', episodes: 12, description: 'Complete curriculum from beginner to advanced', color: '#3182ce' },
  { title: 'Integration Deep Dives', episodes: 8, description: 'Detailed walkthroughs of popular connectors', color: '#805ad5' },
  { title: 'Industry Solutions', episodes: 6, description: 'Industry-specific automation strategies', color: '#ed8936' },
];

export default function WebinarsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#742a2a] via-[#c53030] to-[#e53e3e] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Video className="w-4 h-4 mr-2" />
              WEBINARS & EVENTS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Learn from the
              <span className="block text-[#fbd38d]">automation experts</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Live webinars, on-demand sessions, and masterclasses to accelerate your journey.
            </p>

            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search webinars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-xl shadow-lg border-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-[#c53030] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      {(activeTab === 'All' || activeTab === 'Upcoming') && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-[#c53030]" />
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Webinars</h2>
                  </div>
                  <p className="text-gray-600">Register now to save your spot</p>
                </div>
                <Button variant="outline">
                  <Bell className="w-4 h-4 mr-2" /> Get Reminders
                </Button>
              </div>

              <div className="space-y-6">
                {upcomingWebinars.map((webinar, index) => (
                  <motion.div
                    key={webinar.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className={`overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                      webinar.featured ? 'ring-2 ring-[#ed8936]' : ''
                    }`}>
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-48 bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-6 flex flex-col items-center justify-center text-white">
                          <div className="text-sm opacity-70">LIVE</div>
                          <div className="text-3xl font-bold">{webinar.date.split(',')[0].split(' ')[1]}</div>
                          <div className="text-sm">{webinar.date.split(',')[0].split(' ')[0]}</div>
                          <div className="mt-2 text-sm opacity-70">{webinar.time}</div>
                        </div>

                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {webinar.featured && (
                                <Badge className="bg-[#ed8936] text-white">
                                  <Sparkles className="w-3 h-3 mr-1" /> Featured
                                </Badge>
                              )}
                              {webinar.topics.map((topic) => (
                                <Badge key={topic} variant="secondary">{topic}</Badge>
                              ))}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" /> {webinar.duration}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#c53030] transition-colors">
                            {webinar.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{webinar.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                {webinar.speakers.map((speaker) => (
                                  <Avatar key={speaker.name} className="w-10 h-10 border-2 border-white">
                                    <AvatarFallback className="bg-[#1a365d] text-white text-sm">
                                      {speaker.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {webinar.speakers.map(s => s.name).join(', ')}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {webinar.speakers.map(s => s.role).join(' | ')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-gray-500 flex items-center">
                                <Users className="w-4 h-4 mr-1" /> {webinar.registrations.toLocaleString()} registered
                              </div>
                              <Button className="bg-[#c53030] hover:bg-[#9c2a2a]">
                                Register Free <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* On-Demand Webinars */}
      {(activeTab === 'All' || activeTab === 'On-Demand') && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-12">
                <Play className="w-6 h-6 text-[#c53030]" />
                <h2 className="text-2xl font-bold text-gray-900">On-Demand Library</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {onDemandWebinars.map((webinar, index) => (
                  <motion.div
                    key={webinar.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0">
                      <div className="relative h-40 bg-gradient-to-br from-[#1a365d] to-[#38b2ac] rounded-t-xl overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {webinar.duration}
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          {webinar.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">{topic}</Badge>
                          ))}
                        </div>
                        <CardTitle className="text-base group-hover:text-[#c53030] transition-colors line-clamp-2">
                          {webinar.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" /> {webinar.rating}
                          </span>
                          <span>{webinar.views} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Webinar Series */}
      {(activeTab === 'All' || activeTab === 'Series') && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Webinar Series</h2>
                <p className="text-gray-600">Structured learning paths for in-depth knowledge</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {webinarSeries.map((series, index) => (
                  <motion.div
                    key={series.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 overflow-hidden">
                      <div className="h-2" style={{ backgroundColor: series.color }} />
                      <CardHeader>
                        <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                          style={{ backgroundColor: `${series.color}15` }}>
                          <Video className="w-6 h-6" style={{ color: series.color }} />
                        </div>
                        <CardTitle className="text-xl group-hover:text-[#c53030] transition-colors">
                          {series.title}
                        </CardTitle>
                        <CardDescription>{series.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{series.episodes} episodes</span>
                          <Button variant="ghost" size="sm" className="text-[#c53030]">
                            Start Series <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] to-[#2c5282]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Video className="w-8 h-8 text-[#ed8936]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Host Your Own Webinar
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Are you a TaskBot expert? Share your knowledge with our global community.
            </p>
            <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white">
              Apply to Speak <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
