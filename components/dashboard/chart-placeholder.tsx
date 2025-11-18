'use client';

import { motion } from 'framer-motion';

interface ChartPlaceholderProps {
  title: string;
  description?: string;
}

export function ChartPlaceholder({
  title,
  description = 'Gráfica estadística',
}: ChartPlaceholderProps) {
  return (
    <motion.div
      className="glass-effect rounded-xl p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Placeholder Chart */}
      <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border border-border">
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-1">
            {[40, 60, 50, 70, 55].map((height, i) => (
              <motion.div
                key={i}
                className="w-8 rounded-t bg-gradient-to-t from-primary to-accent"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ minHeight: '20px' }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {/* TODO: Integrar con Recharts para gráficas reales */}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
