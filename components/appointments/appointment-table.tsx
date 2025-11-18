'use client';

import { motion } from 'framer-motion';
import { Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  employee: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
}

interface AppointmentTableProps {
  appointments: Appointment[];
  onView?: (appointment: Appointment) => void;
  onCancel?: (id: number) => void;
}

export function AppointmentTable({
  appointments,
  onView,
  onCancel,
}: AppointmentTableProps) {
  return (
    <div className="glass-effect rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Hora
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Servicio
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Empleado
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((apt, idx) => (
              <motion.tr
                key={apt.id}
                className="hover:bg-card/50 smooth-transition"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="px-6 py-4 text-sm text-foreground">{apt.date}</td>
                <td className="px-6 py-4 text-sm text-foreground">{apt.time}</td>
                <td className="px-6 py-4 text-sm text-foreground">{apt.service}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {apt.employee}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'confirmada'
                        ? 'bg-green-500/20 text-green-400'
                        : apt.status === 'pendiente'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView?.(apt)}
                    className="text-primary hover:text-accent"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {apt.status !== 'cancelada' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCancel?.(apt.id)}
                      className="text-destructive hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
