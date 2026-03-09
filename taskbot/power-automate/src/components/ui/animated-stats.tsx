import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, Clock, Zap, Award, Target, CheckCircle, BarChart3 } from 'lucide-react';

const iconMap = {
  workflows: Zap,
  customers: Users,
  hours: Clock,
  accuracy: Target,
  uptime: CheckCircle,
  savings: TrendingUp,
  awards: Award,
  default: BarChart3,
};

interface Stat {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: keyof typeof iconMap;
  description?: string;
}

interface AnimatedStatsProps {
  stats?: Stat[];
  variant?: 'default' | 'cards' | 'gradient' | 'minimal';
  columns?: 2 | 3 | 4;
  showIcons?: boolean;
}

function AnimatedCounter({ 
  value, 
  prefix = '', 
  suffix = '' 
}: { 
  value: string; 
  prefix?: string; 
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
      const hasDecimal = value.includes('.');
      const decimalPart = hasDecimal ? value.split('.')[1]?.replace(/[^0-9]/g, '') : '';
      
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          const formatted = Math.floor(current).toLocaleString();
          setDisplayValue(hasDecimal ? `${formatted}.${decimalPart}` : formatted);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref}>
      {prefix}{displayValue}{suffix}
    </div>
  );
}

const defaultStats: Stat[] = [
  { 
    value: '10000', 
    label: 'Workflows Automated', 
    suffix: '+', 
    icon: 'workflows',
    description: 'Enterprise processes running daily'
  },
  { 
    value: '500', 
    label: 'Enterprise Customers', 
    suffix: '+', 
    icon: 'customers',
    description: 'Fortune 500 companies trust us'
  },
  { 
    value: '5', 
    label: 'Hours Saved', 
    suffix: 'M+', 
    icon: 'hours',
    description: 'Employee productivity gained'
  },
  { 
    value: '99.9', 
    label: 'Accuracy Rate', 
    suffix: '%', 
    icon: 'accuracy',
    description: 'Process execution precision'
  },
];

export function AnimatedStats({ 
  stats = defaultStats, 
  variant = 'default',
  columns = 4,
  showIcons = true
}: AnimatedStatsProps) {
  
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  if (variant === 'gradient') {
    return (
      <section className="py-24 bg-gradient-to-r from-[#0d1b2a] via-[#1a365d] to-[#2c5282]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid ${gridCols[columns]} gap-8`}>
            {stats.map((stat, index) => {
              const Icon = iconMap[stat.icon || 'default'];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-8"
                >
                  {showIcons && (
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
                      className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <Icon className="w-8 h-8 text-[#ed8936]" />
                    </motion.div>
                  )}
                  <div 
                    className="text-4xl lg:text-5xl font-bold text-white mb-3"
                    style={{ textShadow: '0 0 30px rgba(237, 137, 54, 0.4)' }}
                  >
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix} 
                    />
                  </div>
                  <div className="text-white/80 font-medium text-lg">{stat.label}</div>
                  {stat.description && (
                    <div className="text-white/50 text-sm mt-2">{stat.description}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'cards') {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid ${gridCols[columns]} gap-6`}>
            {stats.map((stat, index) => {
              const Icon = iconMap[stat.icon || 'default'];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
                >
                  {showIcons && (
                    <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-[#1a365d] to-[#4299e1] rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <div className="text-4xl font-bold text-[#1a365d] mb-2">
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix} 
                    />
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                  {stat.description && (
                    <div className="text-gray-400 text-sm mt-2">{stat.description}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'minimal') {
    return (
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid ${gridCols[columns]} gap-8`}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-[#ed8936] mb-2">
                  <AnimatedCounter 
                    value={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix} 
                  />
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className="py-20 bg-[#1a365d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon || 'default'];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-center p-6"
              >
                {showIcons && (
                  <Icon className="w-8 h-8 text-[#ed8936] mx-auto mb-4" />
                )}
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter 
                    value={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix} 
                  />
                </div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AnimatedStats;
