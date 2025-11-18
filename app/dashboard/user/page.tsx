'use client';

import { motion } from 'framer-motion';
import { UserSidebar } from '@/components/layout/user-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AppointmentTable } from '@/components/appointments/appointment-table';
import { useEffect, useState } from 'react';
import { api, type AppointmentDto, type ServiceDto } from '@/lib/api';
import { useProfile } from '@/hooks/use-profile';

export default function UserDashboard() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [services, setServices] = useState<ServiceDto[]>([]);
  const { profile } = useProfile();

  useEffect(() => {
    api.listAppointments().then(setAppointments).catch(console.error);
    api.listServices().then(setServices).catch(console.error);
  }, []);

  const handleCancel = (id: number) => {
    api
      .cancelAppointment(String(id))
      .then(() => setAppointments((prev) => prev.map((a) => (String(a.id) === String(id) ? { ...a, status: 'cancelada' as const } : a))))
      .catch(console.error);
  };

  const handleView = (appointment: any) => {
    console.log('View appointment:', appointment);
  };

  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={profile?.full_name || 'Cliente'} userRole="Cliente" />
        <main className="flex-1 overflow-auto scrollbar-hide">
          <motion.div
            className="p-6 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-foreground">Mis Citas</h1>
              <p className="text-muted-foreground">
                Aquí están todas tus citas programadas
              </p>
            </motion.div>

            <AppointmentTable
              appointments={appointments.map((a) => ({
                id: Number(a.id),
                date: a.start_at.slice(0, 10),
                time: new Date(a.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                service: services.find((s) => s.id === a.service_id)?.name || a.service_name || a.service_id,
                status: (a.status as any) || 'pendiente',
              }))}
              onCancel={handleCancel}
              onView={handleView}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
