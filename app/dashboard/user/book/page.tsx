'use client';

import { UserSidebar } from '@/components/layout/user-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AppointmentForm } from '@/components/appointments/appointment-form';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api, type ServiceDto } from '@/lib/api';
import { useProfile } from '@/hooks/use-profile';

export default function BookAppointmentPage() {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const { profile } = useProfile();

  useEffect(() => {
    api.listServices().then(setServices).catch(console.error);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={profile?.full_name || 'Cliente'} userRole="Cliente" />
        <main className="flex-1 overflow-auto scrollbar-hide">
          <motion.div
            className="p-6 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AppointmentForm
              services={services}
              clientId={profile?.id}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
