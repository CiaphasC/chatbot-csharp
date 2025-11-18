'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useState } from 'react';
import { UserTable } from '@/components/users/user-table';
import { mockClients } from '@/lib/mocks';
import { UserModal } from '@/components/users/user-modal';

// TODO: fetchClients from Supabase

export default function ClientsPage() {
  const [clients, setClients] = useState(mockClients);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApprove = (id: number) => {
    setClients(
      clients.map((cli) =>
        cli.id === id ? { ...cli, status: 'activo' as const } : cli
      )
    );
    // TODO: handleApproveUser in Supabase
    setIsModalOpen(false);
  };

  const handleReject = (id: number) => {
    setClients(
      clients.map((cli) =>
        cli.id === id ? { ...cli, status: 'desactivado' as const } : cli
      )
    );
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
            users={clients}
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

