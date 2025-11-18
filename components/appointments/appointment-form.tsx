'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { api, type ServiceDto } from '@/lib/api';

interface AppointmentFormProps {
  onSubmit?: (data: any) => void;
  services?: ServiceDto[];
  clientId?: string;
}

export function AppointmentForm({ onSubmit, services = [], clientId }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const timeSlots = useMemo(() => {
    const slots: string[] = []
    for (let h = 9; h <= 17; h++) {
      for (const m of [0, 30]) {
        if (h === 17 && m > 0) continue
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
      }
    }
    return slots
  }, []);

  useEffect(() => {
    if (services.length && !formData.service) {
      setFormData((prev) => ({ ...prev, service: services[0].id }));
    }
  }, [services]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.service) newErrors.service = 'Selecciona un servicio';
    if (!formData.date) newErrors.date = 'Selecciona una fecha';
    if (!formData.time) newErrors.time = 'Selecciona una hora';
    if (!clientId) newErrors.client = 'No hay cliente autenticado';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await api.createAppointment({
        client_id: clientId!,
        service_id: formData.service,
        date: formData.date,
        time: formData.time,
      });
      setSubmitted(true);
      onSubmit?.(formData);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Error al agendar' });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="glass-effect rounded-xl p-8 text-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-center">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            ¡Cita Reservada Exitosamente!
          </h3>
          <p className="text-muted-foreground text-sm">
            Tu cita ha sido registrada. Recibirás una confirmación por correo si el admin la aprueba.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-effect rounded-xl p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reservar una Cita</h2>
        <p className="text-muted-foreground text-sm">
          Completa el formulario para agendar tu próxima cita
        </p>
      </div>

      {/* Service Selection */}
      <div className="space-y-2">
        <Label htmlFor="service" className="text-foreground">
          Tipo de Servicio
        </Label>
        <Select
          value={formData.service}
          onValueChange={(value) => {
            setFormData({ ...formData, service: value });
            if (errors.service) setErrors({ ...errors, service: undefined });
          }}
        >
          <SelectTrigger className="bg-background border-border text-foreground">
            <SelectValue placeholder="Selecciona un servicio" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id} className="text-foreground">
                {service.name} ({service.duration_minutes} min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.service && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.service}
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <Label htmlFor="date" className="text-foreground">
          Fecha
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => {
            setFormData({ ...formData, date: e.target.value });
            if (errors.date) setErrors({ ...errors, date: undefined });
          }}
          className="bg-background border-border text-foreground"
          disabled={isLoading}
        />
        {errors.date && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.date}
          </div>
        )}
      </div>

      {/* Time Selection */}
      <div className="space-y-2">
        <Label htmlFor="time" className="text-foreground">
          Hora
        </Label>
        <Select
          value={formData.time}
          onValueChange={(value) => {
            setFormData({ ...formData, time: value });
            if (errors.time) setErrors({ ...errors, time: undefined });
          }}
        >
          <SelectTrigger className="bg-background border-border text-foreground">
            <SelectValue placeholder="Selecciona una hora" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot} className="text-foreground">
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.time && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.time}
          </div>
        )}
      </div>

      {errors.submit && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          {errors.submit}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10"
      >
        {isLoading ? 'Reservando...' : 'Reservar Cita'}
      </Button>
    </motion.form>
  );
}
