'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppointmentDetails } from '@/components/appointments/appointment-details';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockAdminAppointments } from '@/lib/mocks';


export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(mockAdminAppointments);
  const [filterDate, setFilterDate] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filterDate && apt.date !== filterDate) return false;
    if (filterService !== 'all' && apt.serviceName !== filterService) return false;
    if (filterEmployee !== 'all' && apt.employeeName !== filterEmployee) return false;
    if (searchText && !apt.clientName.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <DashboardLayout>
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
          <p className="text-muted-foreground">
            Visualiza y administra todas las citas del sistema
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="relative"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-12 bg-gradient-to-r from-card/60 to-card/30 backdrop-blur-xl border-border/50 text-foreground placeholder:text-muted-foreground/50"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          className="backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/20 border border-border/30 rounded-2xl p-6 space-y-4"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Filtros avanzados</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div className="space-y-2" whileHover={{ scale: 1.02 }}>
              <Label className="text-foreground text-sm font-medium">Fecha</Label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-background/50 backdrop-blur-sm border-border/50 text-foreground"
              />
            </motion.div>

            <motion.div className="space-y-2" whileHover={{ scale: 1.02 }}>
              <Label className="text-foreground text-sm font-medium">Servicio</Label>
              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger className="bg-background/50 backdrop-blur-sm border-border/50 text-foreground">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Consulta General">Consulta General</SelectItem>
                  <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                  <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div className="space-y-2" whileHover={{ scale: 1.02 }}>
              <Label className="text-foreground text-sm font-medium">Empleado</Label>
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger className="bg-background/50 backdrop-blur-sm border-border/50 text-foreground">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Dr. Juan García">Dr. Juan García</SelectItem>
                  <SelectItem value="Dra. María López">Dra. María López</SelectItem>
                  <SelectItem value="Dr. Carlos Martínez">Dr. Carlos Martínez</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </motion.div>

        {/* Appointments Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            className="grid grid-cols-1 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAppointments.length === 0 ? (
              <motion.div
                className="backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/20 border border-border/30 rounded-2xl p-12 text-center"
                variants={itemVariants}
              >
                <p className="text-muted-foreground text-lg">No hay citas que coincidan con los filtros</p>
              </motion.div>
            ) : (
              filteredAppointments.map((apt, idx) => (
                <motion.button
                  key={apt.id}
                  className="backdrop-blur-xl bg-gradient-to-r from-card/80 via-card/40 to-card/20 border border-border/30 rounded-2xl p-6 hover:from-card/90 hover:via-card/60 hover:to-card/40 hover:border-primary/50 transition-all duration-300 text-left w-full group"
                  variants={itemVariants}
                  onClick={() => setSelectedAppointment(apt)}
                  whileHover={{ x: 4, boxShadow: '0 20px 40px rgba(141, 56, 156, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <motion.p 
                        className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {apt.clientName}
                      </motion.p>
                      <motion.p 
                        className="text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        {apt.serviceName} • {apt.employeeName}
                      </motion.p>
                    </div>

                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="text-right hidden sm:block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="font-medium text-foreground">{apt.date}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </motion.div>

                      <motion.span
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                          apt.status === 'confirmada'
                            ? 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30'
                            : apt.status === 'pendiente'
                              ? 'bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/30'
                              : 'bg-red-500/20 text-red-400 group-hover:bg-red-500/30'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {apt.status}
                      </motion.span>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Appointment Details Modal */}
        <AnimatePresence>
          {selectedAppointment && (
            <AppointmentDetails
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
              onStatusChange={handleStatusChange}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}

