'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, User, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Appointment {
  id: number;
  clientName: string;
  serviceName: string;
  employeeName: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  notes?: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
}

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
  onStatusChange?: (id: number, status: string) => void;
}

export function AppointmentDetails({
  appointment,
  onClose,
  onStatusChange,
}: AppointmentDetailsProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border border-border/50 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <motion.div 
          className="flex items-start justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {appointment.serviceName}
            </h2>
            <p className="text-sm text-muted-foreground">Detalles de la cita</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span
            className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
              appointment.status === 'confirmada'
                ? 'bg-green-500/20 text-green-400'
                : appointment.status === 'pendiente'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
            }`}
          >
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </motion.div>

        {/* Details */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Client */}
          <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg backdrop-blur-sm border border-border/20">
            <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Cliente</p>
              <p className="font-medium text-foreground">{appointment.clientName}</p>
            </div>
          </div>

          {/* Employee */}
          <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg backdrop-blur-sm border border-border/20">
            <User className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Empleado</p>
              <p className="font-medium text-foreground">{appointment.employeeName}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg backdrop-blur-sm border border-border/20">
            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Fecha y Hora</p>
              <p className="font-medium text-foreground">
                {appointment.date} a las {appointment.time}
              </p>
              <p className="text-xs text-muted-foreground">
                Duración: {appointment.duration}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg backdrop-blur-sm border border-border/20">
            <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Ubicación</p>
              <p className="font-medium text-foreground">{appointment.location}</p>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg backdrop-blur-sm border border-border/20">
              <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">Notas</p>
                <p className="text-sm text-foreground">{appointment.notes}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex gap-2 pt-4 border-t border-border/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cerrar
          </Button>
          {appointment.status !== 'confirmada' && (
            <Button
              className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30"
              onClick={() => {
                onStatusChange?.(appointment.id, 'confirmada');
                onClose();
              }}
            >
              Confirmar
            </Button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
