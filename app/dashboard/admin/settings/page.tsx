'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <motion.div
        className="p-6 space-y-6 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Administra la configuración del sistema
          </p>
        </motion.div>

        {/* General Settings */}
        <motion.div
          className="glass-effect rounded-xl p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Configuración General
            </h2>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Nombre de la Empresa</Label>
            <Input
              defaultValue="Sistema de Gestión"
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Email de Contacto</Label>
            <Input
              type="email"
              defaultValue="admin@empresa.com"
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Teléfono</Label>
            <Input
              type="tel"
              defaultValue="+34 900 000 000"
              className="bg-background border-border text-foreground"
            />
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10">
            Guardar Cambios
          </Button>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          className="glass-effect rounded-xl p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Notificaciones
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-foreground">
                Notificar nuevas citas
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-foreground">
                Notificar usuarios pendientes de aprobación
              </span>
            </label>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10">
            Guardar Preferencias
          </Button>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
