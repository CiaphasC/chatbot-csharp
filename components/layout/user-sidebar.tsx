'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Plus, User, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { label: 'Mis Citas', href: '/dashboard/user', icon: Calendar },
  { label: 'Reservar Cita', href: '/dashboard/user/book', icon: Plus },
  { label: 'Perfil', href: '/dashboard/user/profile', icon: User },
  { label: 'Chatbot', href: '/dashboard/user/chatbot', icon: MessageSquare },
];

export function UserSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-foreground"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      <AnimatePresence>
        <motion.aside
          className={`fixed md:static inset-y-0 left-0 w-64 bg-gradient-to-b from-sidebar/95 to-sidebar/90 backdrop-blur-xl border-r border-sidebar-border/50 flex flex-col z-40 ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          animate={{ x: isMobileOpen ? 0 : -256, opacity: isMobileOpen ? 1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div 
            className="p-6 border-b border-sidebar-border/30 bg-gradient-to-b from-sidebar/80 to-sidebar/40 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-sm">SC</span>
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  Sistema
                </h1>
                <p className="text-xs text-muted-foreground">Citas</p>
              </div>
            </div>
          </motion.div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    onClick={() => setIsMobileOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/30 to-accent/20 border-l-2 border-primary shadow-md shadow-primary/10 text-sidebar-primary'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/10 border-l-2 border-transparent'
                    }`}
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: isActive ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </Link>
              );
            })}
          </nav>

          <motion.div 
            className="p-4 border-t border-sidebar-border/30 bg-gradient-to-t from-sidebar/50 to-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              className="w-full flex items-center gap-2 bg-gradient-to-r from-destructive/30 to-destructive/10 text-destructive hover:from-destructive/40 hover:to-destructive/20 transition-all duration-300"
              onClick={() => {
                window.location.href = '/auth/login';
              }}
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </motion.div>
        </motion.aside>
      </AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 md:hidden z-30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
