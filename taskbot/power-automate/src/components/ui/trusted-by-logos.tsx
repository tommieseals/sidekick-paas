import { motion } from 'framer-motion';

interface Company {
  name: string;
  logo?: string;
}

const defaultCompanies: Company[] = [
  { name: 'FinanceFlow' },
  { name: 'TalentScale' },
  { name: 'CloudMetrics' },
  { name: 'RetailOps' },
  { name: 'DataSphere' },
  { name: 'InnovateTech' },
  { name: 'GlobalBank' },
  { name: 'HealthFirst' },
  { name: 'ManufacturePro' },
  { name: 'SecureNet' },
  { name: 'EduLearn' },
  { name: 'LogiChain' },
];

interface TrustedByLogosProps {
  companies?: Company[];
  title?: string;
  subtitle?: string;
  variant?: 'scroll' | 'grid' | 'static';
  showCount?: boolean;
}

export function TrustedByLogos({ 
  companies = defaultCompanies, 
  title = 'Trusted by industry leaders worldwide',
  subtitle,
  variant = 'scroll',
  showCount = true 
}: TrustedByLogosProps) {
  
  if (variant === 'grid') {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gray-600 text-lg font-medium">{title}</p>
            {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
          </motion.div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center justify-center"
              >
                {company.logo ? (
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="h-10 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                ) : (
                  <div className="h-14 px-6 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                    <span className="text-gray-700 font-semibold text-sm whitespace-nowrap">{company.name}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {showCount && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8 text-gray-500"
            >
              And <span className="font-semibold text-[#1a365d]">500+ more</span> enterprises worldwide
            </motion.p>
          )}
        </div>
      </div>
    );
  }
  
  // Scrolling variant (default)
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-8 text-lg font-medium"
        >
          {title}
        </motion.p>
        
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          
          <div className="flex animate-scroll">
            {[...companies, ...companies].map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              >
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-12" />
                ) : (
                  <div className="h-14 px-8 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">{company.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {showCount && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 text-gray-500"
          >
            Trusted by <span className="font-semibold text-[#1a365d]">10,000+</span> enterprises
          </motion.p>
        )}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

export default TrustedByLogos;
