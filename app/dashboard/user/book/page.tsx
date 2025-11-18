'use client';

import { UserSidebar } from '@/components/layout/user-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AppointmentForm } from '@/components/appointments/appointment-form';
import { motion } from 'framer-motion';

export default function BookAppointmentPage() {
  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName="María García" userRole="Cliente" />
        <main className="flex-1 overflow-auto scrollbar-hide">
          <motion.div
            className="p-6 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AppointmentForm />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
