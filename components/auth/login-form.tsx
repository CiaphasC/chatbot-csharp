'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Mail, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'El correo es requerido';
    else if (!email.includes('@')) newErrors.email = 'Correo inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
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
    // const { data, error } = await handleEmailPasswordLogin(email, password);
    console.log('Login attempt:', { email, password });
    
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/dashboard/admin';
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // TODO: conectar con Supabase Auth OAuth
    console.log('Google login clicked');
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-background/40 border border-border/50 p-8 space-y-6 shadow-2xl shadow-primary/10">
        {/* Gradient border overlay */}
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-primary/40 via-transparent to-accent/40 pointer-events-none" />
        
        {/* Content wrapper */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
            <div className="flex justify-center mb-4 hover:scale-105 transition-transform duration-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Accede a tu sistema de gestión
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`pl-10 bg-card/50 border-border/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 smooth-transition ${
                    errors.email ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-destructive text-sm animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
              <Label htmlFor="password" className="text-foreground text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`pl-10 bg-card/50 border-border/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 smooth-transition ${
                    errors.password ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-destructive text-sm animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-101 active:scale-99"
              >
                {isLoading ? (
                  <span className="inline-block animate-pulse">
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-250">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-xs text-muted-foreground/70">O continúa con</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Google Login */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-11 rounded-lg border border-border/50 bg-card/50 hover:bg-card/70 text-foreground font-medium transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-101 active:scale-99"
            >
              {/* TODO: conectar con Supabase Auth OAuth - Google */}
              Iniciar con Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-350">
            <span className="text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link
                href="/auth/signup"
                className="text-primary hover:text-accent transition-colors duration-300 font-semibold"
              >
                Regístrate aquí
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

