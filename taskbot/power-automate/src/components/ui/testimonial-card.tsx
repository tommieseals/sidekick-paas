import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  rating?: number;
  index?: number;
}

export function TestimonialCard({ 
  quote, 
  author, 
  role, 
  company, 
  avatar,
  rating = 5,
  index = 0 
}: TestimonialCardProps) {
  const initials = author.split(' ').map(n => n[0]).join('');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full flex flex-col"
    >
      {/* Quote Icon */}
      <div className="w-12 h-12 bg-gradient-to-br from-[#ed8936] to-[#dd6b20] rounded-xl flex items-center justify-center mb-6">
        <Quote className="w-6 h-6 text-white" />
      </div>
      
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      {/* Quote Text */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6 flex-grow">
        "{quote}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
        {avatar ? (
          <img 
            src={avatar} 
            alt={author} 
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 bg-gradient-to-br from-[#1a365d] to-[#4299e1] rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {initials}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
          <p className="text-sm text-[#ed8936] font-medium">{company}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Grid layout component for multiple testimonials
interface TestimonialGridProps {
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
    avatar?: string;
    rating?: number;
  }>;
  columns?: 2 | 3;
}

export function TestimonialGrid({ testimonials, columns = 3 }: TestimonialGridProps) {
  return (
    <div className={`grid gap-8 ${columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
      {testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} index={index} />
      ))}
    </div>
  );
}

export default TestimonialCard;
