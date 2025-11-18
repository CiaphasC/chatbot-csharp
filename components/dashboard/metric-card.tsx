'use client';

import { motion } from 'framer-motion';
import { Type as type, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'neutral',
}: MetricCardProps) {
  return (
    <motion.div
      className="backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/20 border border-border/30 rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-all duration-300 cursor-pointer"
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(141, 56, 156, 0.15)' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <motion.p 
            className="text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {label}
          </motion.p>
          <motion.p 
            className="text-3xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}
          >
            {value}
          </motion.p>
        </div>
        <motion.div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center backdrop-blur-sm border border-primary/20"
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Icon className="w-6 h-6 text-primary" />
        </motion.div>
      </div>

      {change && (
        <motion.div
          className={`text-xs font-medium ${
            changeType === 'positive'
              ? 'text-green-400'
              : changeType === 'negative'
                ? 'text-red-400'
                : 'text-muted-foreground'
          }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {change}
        </motion.div>
      )}
    </motion.div>
  );
}
