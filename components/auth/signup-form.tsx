'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, User, Mail, Lock, UserCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'cliente',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Correo inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

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
    // TODO: conectar con Supabase Auth
    // TODO: handleSupabaseSignup
    // TODO: actualizar estado a "pending_approval"
    console.log('Signup attempt:', formData);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: custom * 0.05,
        ease: [0.34, 1.56, 0.64, 1],
      },
    }),
  };

  if (submitted) {
    return (
      <motion.div
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-background/40 border border-border/50 p-8 space-y-6 shadow-2xl shadow-primary/10 text-center">
          <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-primary/40 via-transparent to-accent/40 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} custom={0} className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                ¡Cuenta Registrada!
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tu cuenta ha sido registrada exitosamente.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              custom={1}
              className="bg-card/50 border border-border/50 rounded-lg p-4 space-y-2 backdrop-blur-sm"
            >
              <p className="text-foreground font-semibold text-sm">Próximo Paso</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Un administrador deberá aprobar tu acceso. Te enviaremos un correo
                cuando tu cuenta sea aceptada. Esto generalmente toma entre 24 a 48
                horas.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} custom={2}>
              <Link href="/auth/login">
                <Button className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg shadow-primary/20">
                  Volver al Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-background/40 border border-border/50 p-8 space-y-6 shadow-2xl shadow-primary/10">
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-primary/40 via-transparent to-accent/40 pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants} custom={0} className="text-center space-y-3">
            <motion.div 
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Crear Cuenta
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Únete al sistema de gestión
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <motion.div variants={itemVariants} custom={1} className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground text-sm font-medium">
                Nombre Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  className={`pl-10 bg-card/50 border-border/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 smooth-transition ${
                    errors.fullName ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              <AnimatePresence>
                {errors.fullName && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} custom={2} className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`pl-10 bg-card/50 border-border/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 smooth-transition ${
                    errors.email ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Type */}
            <motion.div variants={itemVariants} custom={3} className="space-y-2">
              <Label htmlFor="userType" className="text-foreground text-sm font-medium">
                Tipo de Usuario
              </Label>
              <Select
                value={formData.userType}
                onValueChange={(value) =>
                  setFormData({ ...formData, userType: value })
                }
              >
                <SelectTrigger className="bg-card/50 border-border/50 text-foreground backdrop-blur-sm focus:border-primary focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card/95 border-border/50 backdrop-blur-sm">
                  <SelectItem value="cliente" className="text-foreground">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Cliente
                    </div>
                  </SelectItem>
                  <SelectItem value="empleado" className="text-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Empleado
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} custom={4} className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`pl-10 bg-card/50 border-border/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 smooth-transition ${
                    errors.password ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} custom={5} className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground text-sm font-medium">
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className={`pl-10 bg-card/50 border-border/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 smooth-transition ${
                    errors.confirmPassword ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} custom={6} className="pt-2">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                {isLoading ? (
                  <motion.span 
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Registrando...
                  </motion.span>
                ) : (
                  'Crear Cuenta'
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.div variants={itemVariants} custom={7} className="text-center text-sm">
            <span className="text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/auth/login"
                className="text-primary hover:text-accent transition-colors duration-300 font-semibold"
              >
                Inicia sesión aquí
              </Link>
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

