import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Mail, Building2, Download, Trash2, RefreshCw,
  CheckCircle, Clock, Filter, Search, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  getLeads,
  getNewsletterSubscribers,
  downloadLeadsCSV,
  updateLeadStatus,
  deleteLead,
} from '@/lib/leads';
import type { Lead, NewsletterSubscriber } from '@/lib/leads';

const statusColors: Record<Lead['status'], string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  converted: 'bg-green-100 text-green-800',
};

const statusIcons: Record<Lead['status'], typeof CheckCircle> = {
  new: Clock,
  contacted: Mail,
  qualified: Users,
  converted: CheckCircle,
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'newsletter'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    setIsLoading(true);
    setLeads(getLeads());
    setSubscribers(getNewsletterSubscribers());
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (leadId: string, status: Lead['status']) => {
    updateLeadStatus(leadId, status);
    loadData();
  };

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(leadId);
      loadData();
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    newsletter: subscribers.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">View and manage captured leads and newsletter subscribers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: stats.total, icon: Users, color: 'bg-gray-100' },
            { label: 'New', value: stats.new, icon: Clock, color: 'bg-blue-100' },
            { label: 'Contacted', value: stats.contacted, icon: Mail, color: 'bg-yellow-100' },
            { label: 'Qualified', value: stats.qualified, icon: Users, color: 'bg-purple-100' },
            { label: 'Converted', value: stats.converted, icon: CheckCircle, color: 'bg-green-100' },
            { label: 'Newsletter', value: stats.newsletter, icon: Mail, color: 'bg-orange-100' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${stat.color} rounded-xl p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs & Actions */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b">
            <div className="flex gap-2 mb-4 sm:mb-0">
              <Button
                variant={activeTab === 'leads' ? 'default' : 'outline'}
                onClick={() => setActiveTab('leads')}
              >
                <Users className="w-4 h-4 mr-2" />
                Leads ({leads.length})
              </Button>
              <Button
                variant={activeTab === 'newsletter' ? 'default' : 'outline'}
                onClick={() => setActiveTab('newsletter')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Newsletter ({subscribers.length})
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={downloadLeadsCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by email or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === 'leads' && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {activeTab === 'leads' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        {isLoading ? 'Loading...' : 'No leads found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => {
                      const StatusIcon = statusIcons[lead.status];
                      return (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{lead.companyName || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="w-3 h-3 text-gray-400" />
                                {lead.email}
                              </div>
                              {lead.phone && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{lead.companySize}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.source}</Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={lead.status}
                              onValueChange={(value) => handleStatusChange(lead.id, value as Lead['status'])}
                            >
                              <SelectTrigger className="w-32">
                                <Badge className={statusColors[lead.status]}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {lead.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-12 text-gray-500">
                        {isLoading ? 'Loading...' : 'No subscribers found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {sub.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(sub.subscribedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Leads are saved to localStorage and will persist in this browser</li>
            <li>• Use "Export CSV" to download all leads for your CRM</li>
            <li>• Update status to track your sales pipeline</li>
            <li>• The form includes honeypot spam protection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
