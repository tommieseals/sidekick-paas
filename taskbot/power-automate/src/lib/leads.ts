// Lead capture service
// In production, this would call a backend API
// For now, we use localStorage + export functionality

export interface Lead {
  id: string;
  companyName: string;
  email: string;
  phone?: string;
  companySize: string;
  automationNeeds: string;
  source: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

const LEADS_KEY = 'taskbot_leads';
const NEWSLETTER_KEY = 'taskbot_newsletter';

// Email validation regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get all leads from localStorage
export const getLeads = (): Lead[] => {
  try {
    const data = localStorage.getItem(LEADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save a new lead
export const saveLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> => {
  const leads = getLeads();
  
  const newLead: Lead = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  
  leads.push(newLead);
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  
  // Also try to save to backend if available
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    });
  } catch {
    // Backend not available, localStorage is the fallback
    console.log('Lead saved to localStorage (backend unavailable)');
  }
  
  return newLead;
};

// Get newsletter subscribers
export const getNewsletterSubscribers = (): NewsletterSubscriber[] => {
  try {
    const data = localStorage.getItem(NEWSLETTER_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Subscribe to newsletter
export const subscribeNewsletter = async (email: string): Promise<NewsletterSubscriber> => {
  const subscribers = getNewsletterSubscribers();
  
  // Check if already subscribed
  if (subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already subscribed');
  }
  
  const newSubscriber: NewsletterSubscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    subscribedAt: new Date().toISOString(),
  };
  
  subscribers.push(newSubscriber);
  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers));
  
  // Also try to save to backend if available
  try {
    await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubscriber),
    });
  } catch {
    console.log('Subscriber saved to localStorage (backend unavailable)');
  }
  
  return newSubscriber;
};

// Export leads as CSV
export const exportLeadsAsCSV = (): string => {
  const leads = getLeads();
  const headers = ['ID', 'Company Name', 'Email', 'Phone', 'Company Size', 'Automation Needs', 'Source', 'Created At', 'Status'];
  
  const rows = leads.map(lead => [
    lead.id,
    lead.companyName,
    lead.email,
    lead.phone || '',
    lead.companySize,
    `"${lead.automationNeeds.replace(/"/g, '""')}"`,
    lead.source,
    lead.createdAt,
    lead.status,
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

// Download leads as CSV file
export const downloadLeadsCSV = () => {
  const csv = exportLeadsAsCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskbot_leads_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Update lead status
export const updateLeadStatus = (leadId: string, status: Lead['status']): Lead | null => {
  const leads = getLeads();
  const leadIndex = leads.findIndex(l => l.id === leadId);
  
  if (leadIndex === -1) return null;
  
  leads[leadIndex].status = status;
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  
  return leads[leadIndex];
};

// Delete lead
export const deleteLead = (leadId: string): boolean => {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== leadId);
  
  if (filtered.length === leads.length) return false;
  
  localStorage.setItem(LEADS_KEY, JSON.stringify(filtered));
  return true;
};
