'use client';

import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: any;
  onStatusChange?: (appointmentId: number, newStatus: string) => void;
}

export function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  onStatusChange,
}: AppointmentModalProps) {
  const [status, setStatus] = useState(appointment?.status || 'pendiente');

  const handleStatusUpdate = () => {
    onStatusChange?.(appointment.id, status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Detalles de Cita
          </DialogTitle>
        </DialogHeader>

        {appointment && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Cliente
              </p>
              <p className="text-foreground">{appointment.client}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Fecha
                </p>
                <p className="text-foreground">{appointment.date}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Hora
                </p>
                <p className="text-foreground">{appointment.time}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Servicio
              </p>
              <p className="text-foreground">{appointment.service}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Estado
              </p>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="pendiente" className="text-foreground">
                    Pendiente
                  </SelectItem>
                  <SelectItem value="confirmada" className="text-foreground">
                    Confirmada
                  </SelectItem>
                  <SelectItem value="cancelada" className="text-foreground">
                    Cancelada
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-card"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleStatusUpdate}
              >
                Actualizar
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
