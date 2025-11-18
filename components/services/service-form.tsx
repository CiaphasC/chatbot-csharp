'use client';

import { useState } from 'react';
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
import { X } from 'lucide-react';

interface ServiceFormProps {
  service?: any;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}

export function ServiceForm({ service, onSubmit, onClose }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    duration: service?.duration || '30',
    price: service?.price || '',
    status: service?.status || 'activo',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.duration) newErrors.duration = 'La duración es requerida';
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
    // TODO: guardar en Supabase (service_types table)
    console.log('Service data:', formData);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      onSubmit?.(formData);
    }, 1000);
  };

  if (submitted) {
    return (
      <motion.div
        className="glass-effect rounded-xl p-8 text-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {service ? 'Servicio actualizado' : 'Servicio creado'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {service ? 'Los cambios se han guardado' : 'El nuevo servicio está disponible'}
          </p>
        </div>
        <Button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Cerrar
        </Button>
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
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {service ? 'Actualiza los detalles del servicio' : 'Crea un nuevo tipo de servicio'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Service Name */}
      <div className="space-y-2">
        <Label className="text-foreground">Nombre del Servicio</Label>
        <Input
          type="text"
          placeholder="Consulta General"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          className="bg-background border-border text-foreground"
          disabled={isLoading}
        />
        {errors.name && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label className="text-foreground">Duración (minutos)</Label>
        <Input
          type="number"
          placeholder="30"
          min="15"
          step="15"
          value={formData.duration}
          onChange={(e) => {
            setFormData({ ...formData, duration: e.target.value });
            if (errors.duration) setErrors({ ...errors, duration: undefined });
          }}
          className="bg-background border-border text-foreground"
          disabled={isLoading}
        />
        {errors.duration && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.duration}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label className="text-foreground">Precio (opcional)</Label>
        <Input
          type="number"
          placeholder="0.00"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          className="bg-background border-border text-foreground"
          disabled={isLoading}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label className="text-foreground">Estado</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger className="bg-background border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="activo" className="text-foreground">
              Activo
            </SelectItem>
            <SelectItem value="inactivo" className="text-foreground">
              Inactivo
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 border-border text-foreground"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? 'Guardando...' : service ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </motion.form>
  );
}

