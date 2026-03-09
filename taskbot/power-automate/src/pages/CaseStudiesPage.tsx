import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Search,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  Factory,
  Heart,
  ShoppingBag,
  Landmark,
  GraduationCap,
  Truck,
  Quote,
  Play,
  Download,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const industries = [
  { id: 'all', label: 'All Industries', icon: Building2 },
  { id: 'finance', label: 'Financial Services', icon: Landmark },
  { id: 'healthcare', label: 'Healthcare', icon: Heart },
  { id: 'retail', label: 'Retail', icon: ShoppingBag },
  { id: 'manufacturing', label: 'Manufacturing', icon: Factory },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'logistics', label: 'Logistics', icon: Truck },
];

const featuredCaseStudy = {
  id: 1,
  company: 'Global Financial Corp',
  logo: 'GFC',
  industry: 'Financial Services',
  title: 'How Global Financial Corp Automated 80% of Their Invoice Processing',
  excerpt: 'By implementing TaskBot\'s intelligent document processing, Global Financial Corp transformed their accounts payable department.',
  results: [
    { metric: '80%', label: 'Reduction in manual processing' },
    { metric: '$2.5M', label: 'Annual cost savings' },
    { metric: '95%', label: 'Accuracy improvement' },
    { metric: '4hrs', label: 'Average processing time' },
  ],
  quote: 'TaskBot has completely transformed how we handle financial operations. What used to take our team a week now happens in hours.',
  author: 'Jennifer Martinez',
  role: 'CFO, Global Financial Corp',
  hasVideo: true,
};

const caseStudies = [
  {
    id: 2,
    company: 'HealthFirst Medical',
    logo: 'HF',
    industry: 'Healthcare',
    title: 'Streamlining Patient Intake with Intelligent Automation',
    excerpt: 'HealthFirst reduced patient wait times by 60% through automated form processing.',
    metric: '60%',
    metricLabel: 'Faster intake',
    employees: '5,000+',
  },
  {
    id: 3,
    company: 'RetailMax Global',
    logo: 'RM',
    industry: 'Retail',
    title: 'Omnichannel Order Processing at Scale',
    excerpt: 'Managing 100,000+ daily orders across 12 countries with zero-touch automation.',
    metric: '100K+',
    metricLabel: 'Daily orders',
    employees: '25,000+',
  },
  {
    id: 4,
    company: 'TechManufacture Inc',
    logo: 'TM',
    industry: 'Manufacturing',
    title: 'Quality Control Automation in Electronics Manufacturing',
    excerpt: 'AI-powered visual inspection reduced defect rates by 75%.',
    metric: '75%',
    metricLabel: 'Fewer defects',
    employees: '8,000+',
  },
  {
    id: 5,
    company: 'University of Progress',
    logo: 'UP',
    industry: 'Education',
    title: 'Automating Student Services for 50,000 Students',
    excerpt: 'From enrollment to graduation, streamlined processes improved satisfaction.',
    metric: '45%',
    metricLabel: 'Time saved',
    employees: '3,000+',
  },
  {
    id: 6,
    company: 'FastLogistics Co',
    logo: 'FL',
    industry: 'Logistics',
    title: 'Real-time Supply Chain Visibility and Automation',
    excerpt: 'End-to-end supply chain automation reduced delivery delays by 40%.',
    metric: '40%',
    metricLabel: 'Fewer delays',
    employees: '15,000+',
  },
];

const stats = [
  { value: '500+', label: 'Enterprise Customers' },
  { value: '$1B+', label: 'Combined Savings' },
  { value: '10M+', label: 'Hours Automated' },
  { value: '99.9%', label: 'Customer Satisfaction' },
];

const industryColors: Record<string, string> = {
  'Financial Services': 'bg-blue-100 text-blue-700',
  'Healthcare': 'bg-red-100 text-red-700',
  'Retail': 'bg-purple-100 text-purple-700',
  'Manufacturing': 'bg-orange-100 text-orange-700',
  'Education': 'bg-green-100 text-green-700',
  'Logistics': 'bg-teal-100 text-teal-700',
};

export default function CaseStudiesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudies = caseStudies.filter((study) => {
    const matchesIndustry = selectedIndustry === 'all' || 
      study.industry.toLowerCase().includes(selectedIndustry);
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#c53030] via-[#e53e3e] to-[#ed8936] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              CUSTOMER SUCCESS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Real Results from
              <span className="block text-[#fbd38d]">Real Customers</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              See how leading organizations transform their operations with TaskBot automation.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-xl shadow-lg border-0"
                />
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

      {/* Featured Case Study */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-[#e53e3e]" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Success Story</h2>
            </div>

            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 lg:p-12 relative">
                  <div className="absolute top-6 left-6">
                    <Badge className={industryColors[featuredCaseStudy.industry]}>
                      {featuredCaseStudy.industry}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center h-full min-h-[300px]">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl font-bold text-white">{featuredCaseStudy.logo}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{featuredCaseStudy.company}</h3>
                      {featuredCaseStudy.hasVideo && (
                        <Button className="mt-4 bg-[#ed8936] hover:bg-[#dd6b20]">
                          <Play className="w-4 h-4 mr-2" /> Watch Video
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 p-8 lg:p-12">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {featuredCaseStudy.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-8">{featuredCaseStudy.excerpt}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {featuredCaseStudy.results.map((result) => (
                      <div key={result.label} className="bg-gray-50 rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#e53e3e]">{result.metric}</div>
                        <div className="text-sm text-gray-600">{result.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#1a365d]/5 rounded-xl p-6 mb-6">
                    <Quote className="w-8 h-8 text-[#1a365d]/30 mb-3" />
                    <p className="text-gray-700 italic mb-4">{featuredCaseStudy.quote}</p>
                    <div>
                      <div className="font-semibold text-gray-900">{featuredCaseStudy.author}</div>
                      <div className="text-sm text-gray-500">{featuredCaseStudy.role}</div>
                    </div>
                  </div>

                  <Button size="lg" className="bg-[#e53e3e] hover:bg-[#c53030]">
                    Read Full Story <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedIndustry === industry.id
                    ? 'bg-[#e53e3e] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <industry.icon className="w-4 h-4" />
                {industry.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-[#1a365d] rounded-xl flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{study.logo}</span>
                      </div>
                      <Badge className={industryColors[study.industry]}>
                        {study.industry}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{study.company}</div>
                    <CardTitle className="text-xl group-hover:text-[#e53e3e] transition-colors line-clamp-2">
                      {study.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {study.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-2xl font-bold text-[#e53e3e]">{study.metric}</div>
                        <div className="text-xs text-gray-500">{study.metricLabel}</div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" /> {study.employees}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] to-[#2c5282]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-[#ed8936]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join hundreds of enterprises transforming their operations with TaskBot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#ed8936] hover:bg-[#dd6b20] text-white">
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Download className="w-5 h-5 mr-2" /> Download All Case Studies
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
