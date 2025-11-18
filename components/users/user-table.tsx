'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye, Check, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  status: 'activo' | 'pendiente' | 'desactivado';
}

interface UserTableProps {
  users: User[];
  isEmployees?: boolean;
  onView?: (user: User) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export function UserTable({
  users,
  isEmployees = false,
  onView,
  onApprove,
  onReject,
}: UserTableProps) {
  return (
    <div className="glass-effect rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Correo
              </th>
              {isEmployees && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Rol
                </th>
              )}
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user, idx) => (
              <motion.tr
                key={user.id}
                className="hover:bg-card/50 smooth-transition"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {user.email}
                </td>
                {isEmployees && (
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.role}
                  </td>
                )}
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'activo'
                        ? 'bg-green-500/20 text-green-400'
                        : user.status === 'pendiente'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView?.(user)}
                    className="text-primary hover:text-accent"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {user.status === 'pendiente' && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onApprove?.(user.id)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onReject?.(user.id)}
                        className="text-destructive hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
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
