import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { subscribeNewsletter, isValidEmail } from '@/lib/leads';

interface NewsletterModalProps {
  triggerOnScroll?: boolean;
  scrollPercentage?: number;
  triggerOnExit?: boolean;
  delayMs?: number;
}

export default function NewsletterModal({
  triggerOnScroll = true,
  scrollPercentage = 50,
  triggerOnExit = true,
  delayMs = 5000,
}: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Check if user has already seen/dismissed the modal
  const hasSeenModal = () => {
    return localStorage.getItem('taskbot_newsletter_modal_seen') === 'true';
  };

  const markAsSeen = () => {
    localStorage.setItem('taskbot_newsletter_modal_seen', 'true');
  };

  // Scroll trigger
  useEffect(() => {
    if (!triggerOnScroll || hasTriggered || hasSeenModal()) return;

    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrolled >= scrollPercentage && !hasTriggered) {
        setHasTriggered(true);
        setTimeout(() => setIsOpen(true), delayMs);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerOnScroll, scrollPercentage, delayMs, hasTriggered]);

  // Exit intent trigger
  useEffect(() => {
    if (!triggerOnExit || hasTriggered || hasSeenModal()) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setHasTriggered(true);
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [triggerOnExit, hasTriggered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await subscribeNewsletter(email);
      setIsSubmitted(true);
      markAsSeen();
    } catch (err) {
      if (err instanceof Error && err.message === 'Email already subscribed') {
        setError('This email is already subscribed!');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    markAsSeen();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-blue-50 border-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You're In!</h3>
              <p className="text-gray-600">
                Welcome to the TaskBot community. Watch your inbox for automation insights and exclusive offers.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#ed8936]/20 to-[#38b2ac]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-[#1a365d]/10 to-[#4299e1]/20 rounded-full blur-2xl" />

              <DialogHeader className="relative">
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#4299e1] rounded-2xl flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <DialogTitle className="text-center text-2xl">
                  Stay Ahead of the Curve
                </DialogTitle>
                <DialogDescription className="text-center">
                  Get exclusive automation tips, industry insights, and early access to new features delivered to your inbox.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6 relative">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`pl-10 py-6 ${error ? 'border-red-500' : ''}`}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-500"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#1a365d] to-[#2c5282] hover:from-[#2c5282] hover:to-[#1a365d] text-white py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Export a simpler trigger button for manual use
export function NewsletterTrigger({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      await subscribeNewsletter(email);
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof Error && err.message === 'Email already subscribed') {
        setError('Already subscribed!');
      } else {
        setError('Error. Try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="border-white/30 text-white hover:bg-white/10"
      >
        {children || 'Subscribe to Newsletter'}
      </Button>
      <DialogContent className="sm:max-w-md">
        {isSubmitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Subscribed!</h3>
            <p className="text-gray-600">Thanks for joining us.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Subscribe to Newsletter</DialogTitle>
              <DialogDescription>
                Get automation tips and updates delivered to your inbox.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
