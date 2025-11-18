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
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction
} from '@/components/ui/toast';
import { useState } from 'react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const [showApprovalToast, setShowApprovalToast] = useState(false);

  const handleApprove = () => {
    // TODO: updateUserStatus in Supabase
    // TODO: enviar correo con Supabase + servicio de correo
    console.log('Approve user:', user.id);
    setShowApprovalToast(true);
    setTimeout(() => {
      onClose();
      setShowApprovalToast(false);
    }, 2000);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Detalles del Usuario
            </DialogTitle>
          </DialogHeader>

          {user && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre
                </p>
                <p className="text-foreground">{user.name}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Correo
                </p>
                <p className="text-foreground">{user.email}</p>
              </div>

              {user.role && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Rol
                  </p>
                  <p className="text-foreground">{user.role}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Estado
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                    user.status === 'activo'
                      ? 'bg-green-500/20 text-green-400'
                      : user.status === 'pendiente'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              {user.status === 'pendiente' && (
                <div className="pt-4">
                  <Button
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Aprobar Cuenta
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-card"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {showApprovalToast && (
        <motion.div
          className="fixed bottom-4 right-4 glass-effect-strong rounded-lg p-4 text-green-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          Cuenta aprobada. Se enviará un correo al usuario.
        </motion.div>
      )}
    </>
  );
}

