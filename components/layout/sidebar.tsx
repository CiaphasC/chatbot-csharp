'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, LogOut, Menu, X, MessageSquare, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { label: 'Resumen', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Empleados', href: '/dashboard/admin/employees', icon: Users },
  { label: 'Clientes', href: '/dashboard/admin/clients', icon: Users },
  { label: 'Citas', href: '/dashboard/admin/appointments', icon: Calendar },
  { label: 'Servicios', href: '/dashboard/admin/services', icon: Package },
  { label: 'Chatbot', href: '/dashboard/admin/chatbot', icon: MessageSquare },
];

export function Sidebar() {
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

      <motion.aside
        className="hidden md:flex fixed md:static inset-y-0 left-0 w-64 bg-gradient-to-b from-sidebar/95 to-sidebar/90 backdrop-blur-xl border-r border-sidebar-border/50 flex-col z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo with enhanced animation */}
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
              <span className="text-white font-bold text-sm">SG</span>
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-sidebar-foreground">
                Sistema
              </h1>
              <p className="text-xs text-muted-foreground">Gestión</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Items - no internal scroll */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {sidebarItems.map((item, idx) => {
          const Icon = item.icon;
          const isRoot = item.href === '/dashboard/admin';
          const isActive = isRoot
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
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

        {/* Logout Button */}
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

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.aside
              className="md:hidden fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-sidebar/95 to-sidebar/90 backdrop-blur-xl border-r border-sidebar-border/50 flex flex-col z-40"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <motion.div 
                className="p-6 border-b border-sidebar-border/30 bg-gradient-to-b from-sidebar/80 to-sidebar/40 backdrop-blur-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-white font-bold text-sm">SG</span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-sidebar-foreground">
                      Sistema
                    </h1>
                    <p className="text-xs text-muted-foreground">Gestión</p>
                  </div>
                </div>
              </motion.div>

              <nav className="flex-1 px-4 py-6 space-y-1">
                {sidebarItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.button
                        onClick={() => setIsMobileOpen(false)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/30 to-accent/20 border-l-2 border-primary shadow-md shadow-primary/10 text-sidebar-primary'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/10 border-l-2 border-transparent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </motion.button>
                    </Link>
                  );
                })}
              </nav>

              <motion.div 
                className="p-4 border-t border-sidebar-border/30 bg-gradient-to-t from-sidebar/50 to-transparent"
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

            {/* Mobile Overlay */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
