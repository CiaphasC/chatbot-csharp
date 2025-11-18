'use client';

import { motion } from 'framer-motion';
import { Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export function Topbar({
  userName = 'Administrador',
  userRole = 'Admin',
  userAvatar,
}: TopbarProps) {
  return (
    <motion.header
      className="sticky top-0 w-full bg-gradient-to-b from-background/80 via-background/50 to-background/30 backdrop-blur-xl border-b border-border/30 z-30"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
    >
      <div className="pl-16 pr-4 md:px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </motion.div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:bg-card/50 relative"
            >
              <Bell className="w-5 h-5" />
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Button>
          </motion.div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-foreground hover:bg-card/50"
                >
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-sm font-bold text-primary-foreground">
                      {userName.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </motion.div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">{userName}</span>
                    <span className="text-xs text-muted-foreground">{userRole}</span>
                  </div>
                  <motion.div animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-card border-border/50 backdrop-blur-xl"
            >
              <DropdownMenuItem className="text-foreground cursor-pointer">
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => {
                  window.location.href = '/auth/login';
                }}
              >
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
