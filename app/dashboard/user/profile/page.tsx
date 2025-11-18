'use client';

import { UserSidebar } from '@/components/layout/user-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UserProfilePage() {
  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName="María García" userRole="Cliente" />
        <main className="flex-1 overflow-auto scrollbar-hide">
          <motion.div
            className="p-6 max-w-2xl space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Mi Perfil
              </h1>
              <p className="text-muted-foreground">
                Actualiza tu información personal
              </p>
            </div>

            <motion.div
              className="glass-effect rounded-xl p-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Nombre</Label>
                  <Input
                    defaultValue="María"
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Apellido</Label>
                  <Input
                    defaultValue="García"
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Correo</Label>
                <Input
                  type="email"
                  defaultValue="maria@example.com"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Teléfono</Label>
                <Input
                  type="tel"
                  defaultValue="+34 600 000 000"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10">
                Guardar Cambios
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
