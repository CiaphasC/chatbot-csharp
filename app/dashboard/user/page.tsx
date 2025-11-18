'use client';

import { motion } from 'framer-motion';
import { UserSidebar } from '@/components/layout/user-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AppointmentTable } from '@/components/appointments/appointment-table';
import { mockUserAppointments } from '@/lib/mocks';
import { useState } from 'react';

// TODO: fetchUserAppointments from Supabase

export default function UserDashboard() {
  const [appointments, setAppointments] = useState(mockUserAppointments);

  const handleCancel = (id: number) => {
    // TODO: cancelAppointment in Supabase
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: 'cancelada' as const } : apt
      )
    );
  };

  const handleView = (appointment: any) => {
    // TODO: Open appointment details modal
    console.log('View appointment:', appointment);
  };

  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName="María García" userRole="Cliente" />
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
              <h1 className="text-3xl font-bold text-foreground">
                Mis Citas
              </h1>
              <p className="text-muted-foreground">
                Aquí están todas tus citas programadas
              </p>
            </motion.div>

            <AppointmentTable
              appointments={appointments}
              onCancel={handleCancel}
              onView={handleView}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}


