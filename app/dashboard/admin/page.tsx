'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { api, type AppointmentDto, type ServiceDto } from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, type: 'spring', stiffness: 100 },
  },
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [services, setServices] = useState<ServiceDto[]>([]);

  useEffect(() => {
    api.listAppointments().then(setAppointments).catch(console.error);
    api.listServices().then(setServices).catch(console.error);
  }, []);

  const serviceName = (id?: string) => services.find((s) => s.id === id)?.name ?? id;

  return (
    <DashboardLayout>
      <motion.div
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-foreground">Bienvenido, Administrador</h1>
          <p className="text-muted-foreground mt-2">Aquí tienes un resumen de tu sistema</p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          <MetricCard
            icon={Users}
            label="Total Servicios"
            value={services.length}
            change=""
            changeType="neutral"
          />
          <MetricCard
            icon={Users}
            label="Total Citas"
            value={appointments.length}
            change=""
            changeType="neutral"
          />
          <MetricCard
            icon={Calendar}
            label="Citas Hoy"
            value={appointments.filter((a) => a.start_at?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length}
            change=""
            changeType="neutral"
          />
          <MetricCard
            icon={TrendingUp}
            label="Tasa Ocupación"
            value="-"
            change=""
            changeType="neutral"
          />
        </motion.div>

        {/* Recent Appointments */}
        <motion.div
          className="backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/20 border border-border/30 rounded-2xl p-6"
          variants={itemVariants}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Citas recientes</h3>
                <p className="text-sm text-muted-foreground">Próximas citas programadas</p>
              </div>
              <Link href="/dashboard/admin/appointments">
                <Button variant="ghost" className="text-primary hover:text-accent">
                  Ver todas
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              {appointments.slice(0, 3).map((apt, idx) => (
                <motion.div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-card/50 to-card/20 hover:from-card/70 hover:to-card/40 rounded-xl border border-border/20 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 100 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex-1 space-y-1">
                    <motion.p 
                      className="font-medium text-foreground group-hover:text-primary transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {serviceName(apt.service_id)}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                    >
                      {apt.client_name ?? apt.client_id}
                    </motion.p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {apt.start_at?.slice(0,10)} {new Date(apt.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <motion.span
                      className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                        apt.status === 'confirmada'
                          ? 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {apt.status}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
