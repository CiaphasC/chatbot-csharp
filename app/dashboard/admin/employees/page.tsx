'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useState } from 'react';
import { UserTable } from '@/components/users/user-table';
import { mockEmployees } from '@/lib/mocks';
import { UserModal } from '@/components/users/user-modal';

// TODO: fetchEmployees from Supabase

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApprove = (id: number) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, status: 'activo' as const } : emp
      )
    );
    // TODO: handleApproveUser in Supabase
    setIsModalOpen(false);
  };

  const handleReject = (id: number) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, status: 'desactivado' as const } : emp
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
          <h1 className="text-3xl font-bold text-foreground">Gestión de Empleados</h1>
          <p className="text-muted-foreground">
            Administra todos los empleados del sistema
          </p>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <UserTable
            users={employees}
            isEmployees={true}
            onView={(employee) => {
              setSelectedEmployee(employee);
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
          user={selectedEmployee}
        />
      </motion.div>
    </DashboardLayout>
  );
}

