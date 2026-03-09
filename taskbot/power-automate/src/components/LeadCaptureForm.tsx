import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2, Building2, Mail, Phone, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveLead, isValidEmail } from '@/lib/leads';

interface LeadCaptureFormProps {
  source?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

export default function LeadCaptureForm({
  source = 'website',
  title = 'Request a Demo',
  subtitle = 'See how TaskBot can transform your business automation',
  compact = false,
  onSuccess,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    companySize: '',
    automationNeeds: '',
    // Honeypot field - should remain empty
    website: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.companySize) {
      newErrors.companySize = 'Please select your company size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (formData.website) {
      // Silently fail for bots
      setIsSubmitted(true);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await saveLead({
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        companySize: formData.companySize,
        automationNeeds: formData.automationNeeds,
        source,
      });

      setIsSubmitted(true);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving lead:', error);
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl ${compact ? 'p-6' : 'p-8 lg:p-12'} text-center`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
        <p className="text-gray-600 mb-2">
          We've received your request and our team will reach out within 24 hours.
        </p>
        <p className="text-sm text-gray-500">
          Check your email for a confirmation message.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-xl ${compact ? 'p-6' : 'p-8'}`}
    >
      {!compact && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot field - hidden from users, visible to bots */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="text"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className={compact ? 'space-y-4' : 'grid md:grid-cols-2 gap-4'}>
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              Company Name
            </Label>
            <Input
              id="companyName"
              placeholder="Your company"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={compact ? 'space-y-4' : 'grid md:grid-cols-2 gap-4'}>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize" className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              Company Size <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.companySize}
              onValueChange={(value) => handleChange('companySize', value)}
            >
              <SelectTrigger className={errors.companySize ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AnimatePresence>
              {errors.companySize && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.companySize}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="automationNeeds" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            What would you like to automate?
          </Label>
          <Textarea
            id="automationNeeds"
            placeholder="Tell us about your automation challenges and goals..."
            rows={compact ? 3 : 4}
            value={formData.automationNeeds}
            onChange={(e) => handleChange('automationNeeds', e.target.value)}
          />
        </div>

        {errors.form && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 text-center"
          >
            {errors.form}
          </motion.p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#1a365d] to-[#2c5282] hover:from-[#2c5282] hover:to-[#1a365d] text-white py-6 text-lg font-semibold transition-all duration-300 hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Request Demo
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to our{' '}
          <a href="/privacy" className="text-[#1a365d] hover:underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms" className="text-[#1a365d] hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </form>
    </motion.div>
  );
}
