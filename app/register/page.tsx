"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signup, signInWithGoogle } from '../auth/actions';
import { ArrowRight, User, Mail, Lock, Check, X } from 'lucide-react';

function RegisterContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const serverMessage = searchParams.get('message');

  useEffect(() => {
    if (serverMessage) {
      setError(serverMessage);
    }
  }, [serverMessage]);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const emailLocalPart = formData.email.split('@')[0] || '';
  const emailMin6 = emailLocalPart.length >= 6;
  const emailNoBadDots = formData.email.length > 0 && !/\.\./.test(formData.email) && !/\.@/.test(formData.email);
  const emailValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isEmailValid = emailMin6 && emailNoBadDots && emailValidFormat;

  const isPasswordValid = formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar nombre
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(formData.fullName)) {
      setError("El nombre completo solo puede contener letras y espacios.");
      return;
    }

    if (!emailValidFormat) {
      setError("El formato del correo es inválido (ejemplo: usuario@host.com).");
      return;
    }
    if (!emailMin6) {
      setError("El correo debe tener al menos 6 caracteres antes del @.");
      return;
    }
    if (!emailNoBadDots) {
      setError("El correo no puede contener puntos seguidos ni un punto antes del @.");
      return;
    }

    if (!isPasswordValid) {
      setError("La contraseña no cumple con los requisitos mínimos.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      await signup(data);
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT' || err?.digest?.includes('NEXT_REDIRECT')) {
        throw err;
      }
      const rawMsg = err?.message || '';
      if (rawMsg.includes('fetch failed') || rawMsg.includes('ENOTFOUND')) {
        setError('No se pudo conectar con el servidor de base de datos (Supabase). Verifica que el proyecto de Supabase esté activo y configurado en .env.local.');
      } else {
        setError(rawMsg || 'Ha ocurrido un error durante el registro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="force-dark" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/*Imagen de fondo*/}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/dashboard-hero-v2.png"
          alt="VigorNova Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(10, 10, 12, 0.5), rgba(10, 10, 12, 0.85))',
        zIndex: 1
      }} />

      <div className="glass-card animate-fade-in-up" style={{
        width: '100%',
        maxWidth: '600px',
        padding: '2.5rem 3.5rem',
        borderRadius: '35px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'white', letterSpacing: '2px', marginBottom: '1.5rem' }}>
          VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
        </div>

        <div className="animate-fade-in-right" style={{ width: '100%' }}>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', color: 'var(--text-main)', textAlign: 'center', textTransform: 'uppercase', fontFamily: 'Oswald', letterSpacing: '1px' }}>
            Crea tu <span style={{ color: 'var(--accent-primary)' }}>Cuenta</span>
          </h1>

          <form action={signInWithGoogle} style={{ width: '100%', marginBottom: '2rem' }}>
            <button type="submit" className="btn-google" style={{ borderRadius: '15px', padding: '0.8rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar con Google
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginBottom: '1.5rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
            <span style={{ padding: '0 15px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>o registrarse con email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
          </div>

          {error && !error.includes('nombre') && !error.includes('correo') && (
            <div className="animate-fade-in-up" style={{
              padding: '1.2rem', background: 'rgba(255, 77, 77, 0.05)',
              border: '1px solid rgba(255, 77, 77, 0.2)', color: '#ff4d4d',
              borderRadius: '15px', fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              marginBottom: '1.5rem', width: '100%'
            }}>
              <div style={{ background: '#ff4d4d', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.1rem', textTransform: 'uppercase' }}>Error en el registro</div>
                <div style={{ opacity: 0.9, fontSize: '0.85rem' }}>
                  {error.toLowerCase().includes('user already registered') 
                    ? 'Este correo ya está registrado. Intenta iniciar sesión.' 
                    : error}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <User size={18} /> Nombre Completo
              </label>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Introduce tu nombre"
                required
                autoComplete="off"
                className="auth-input"
                style={{ width: '100%', padding: '1rem', borderRadius: '15px', color: 'white', outline: 'none', fontSize: '1rem', borderColor: error?.includes('nombre') ? '#ff4d4d' : undefined, boxShadow: error?.includes('nombre') ? '0 0 0 1px #ff4d4d' : undefined }}
              />
              {error?.includes('nombre') && (
                <div className="animate-fade-in-up" style={{ color: '#ff4d4d', fontSize: '0.85rem', paddingLeft: '0.5rem', marginTop: '-0.2rem' }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} /> Correo Electrónico
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Introduce tu correo"
                required
                autoComplete="off"
                className="auth-input"
                style={{ width: '100%', padding: '1rem', borderRadius: '15px', color: 'white', outline: 'none', fontSize: '1rem', borderColor: error?.includes('correo') ? '#ff4d4d' : undefined, boxShadow: error?.includes('correo') ? '0 0 0 1px #ff4d4d' : undefined }}
              />
              {error?.includes('correo') && (
                <div className="animate-fade-in-up" style={{ color: '#ff4d4d', fontSize: '0.85rem', paddingLeft: '0.5rem', marginTop: '-0.2rem' }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Lock size={18} /> Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Introduce tu contraseña"
                  required
                  autoComplete="new-password"
                  className="auth-input"
                  style={{ width: '100%', padding: '1rem', paddingRight: '3rem', borderRadius: '15px', color: 'white', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--text-muted)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: formData.password.length >= 8 ? '#00ff00' : '#ff3333' }}>
                  {formData.password.length >= 8 ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />} Min: 8 caracteres
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: /[A-Z]/.test(formData.password) ? '#00ff00' : '#ff3333' }}>
                  {/[A-Z]/.test(formData.password) ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />} Mínimo 1 mayúscula (A-Z)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: /[0-9]/.test(formData.password) ? '#00ff00' : '#ff3333' }}>
                  {/[0-9]/.test(formData.password) ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />} Mínimo 1 número (0-9)
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary auth-btn"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '1.2rem', borderRadius: '18px', fontSize: '1.1rem' }}
            >
              {loading ? 'CREANDO CUENTA...' : 'REGISTRARSE'} <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
          ¿Ya tienes una cuenta? <Link href="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Inicia sesión</Link>
        </div>

        <div style={{ marginTop: '1.2rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.7 }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: 'white' }}>
        Cargando...
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
