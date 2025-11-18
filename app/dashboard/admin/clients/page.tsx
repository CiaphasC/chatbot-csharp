'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useEffect, useState } from 'react';
import { UserTable } from '@/components/users/user-table';
import { UserModal } from '@/components/users/user-modal';
import { api, type ClientDto } from '@/lib/api';

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.listClients().then(setClients).catch(console.error);
  }, []);

  const handleApprove = (id: number) => {
    api.approveClient(String(id)).then(() => {
      setClients(
        clients.map((cli) =>
          Number(cli.id) === id ? { ...cli, status: 'active' as const } : cli
        )
      );
      setIsModalOpen(false);
    });
  };

  const handleReject = (id: number) => {
    api.rejectClient(String(id)).then(() => {
      setClients(
        clients.map((cli) =>
          Number(cli.id) === id ? { ...cli, status: 'rejected' as const } : cli
        )
      );
    });
  };

  return (
    <DashboardLayout>
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra todos los clientes del sistema
          </p>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <UserTable
            users={clients.map((c) => ({
              id: Number(c.id),
              name: c.full_name,
              email: c.email,
              status: (c.status as any) ?? 'pendiente',
            }))}
            onView={(client) => {
              setSelectedClient(client);
              setIsModalOpen(true);
            }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </motion.div>

        {/* User Modal */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedClient}
        />
      </motion.div>
    </DashboardLayout>
  );
}
