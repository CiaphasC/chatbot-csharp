'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Package, Clock, DollarSign } from 'lucide-react';
import { ServiceForm } from '@/components/services/service-form';
import { mockServices } from '@/lib/mocks';


export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const handleAddService = (data: any) => {
    const newService = {
      id: Math.max(...services.map((s) => s.id), 0) + 1,
      ...data,
      price: parseFloat(data.price) || 0,
    };
    setServices([...services, newService]);
    setShowForm(false);
  };

  const handleEditService = (data: any) => {
    setServices(
      services.map((s) =>
        s.id === editingService.id
          ? { ...s, ...data, price: parseFloat(data.price) || 0 }
          : s
      )
    );
    setEditingService(null);
    setShowForm(false);
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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
        <motion.div
          className="flex items-center justify-between flex-wrap gap-4"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tipos de Servicio</h1>
            <p className="text-muted-foreground">
              Gestiona los servicios disponibles en el sistema
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                setEditingService(null);
                setShowForm(true);
              }}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Nuevo Servicio
            </Button>
          </motion.div>
        </motion.div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowForm(false);
                setEditingService(null);
              }}
            >
              <motion.div
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <ServiceForm
                  service={editingService}
                  onClose={() => {
                    setShowForm(false);
                    setEditingService(null);
                  }}
                  onSubmit={
                    editingService ? handleEditService : handleAddService
                  }
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                className="backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/20 border border-border/30 rounded-2xl p-6 hover:border-primary/50 hover:from-card/90 hover:via-card/60 hover:to-card/40 transition-all duration-300 group"
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(141, 56, 156, 0.15)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <motion.div 
                    className="flex items-start justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="space-y-1 flex-1">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <motion.span
                      className={`ml-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        service.status === 'activo'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {service.status}
                    </motion.span>
                  </motion.div>

                  {/* Details */}
                  <motion.div 
                    className="flex items-center gap-6 py-3 border-t border-border/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                  >
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Clock className="w-4 h-4 text-primary/60" />
                      <span className="text-sm font-medium text-foreground">
                        {service.duration} min
                      </span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <DollarSign className="w-4 h-4 text-accent/60" />
                      <span className="text-lg font-bold text-accent">
                        ${service.price.toFixed(2)}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div 
                    className="flex gap-2 pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingService(service);
                        setShowForm(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteService(service.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

