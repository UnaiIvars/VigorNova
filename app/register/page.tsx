"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { signup } from '../auth/actions';
import { ArrowRight, CheckCircle2, User, Mail, Lock, Activity, Scale, Ruler } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    edad: '',
    peso: '',
    altura: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create a new FormData object to pass to the server action
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    
    await signup(data);
    setLoading(false);
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Gradient */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95))',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 42, 42, 0.15) 0%, transparent 60%), linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95))',
        zIndex: -1
      }} />

      <div className="glass-card animate-fade-in-up" style={{ 
        width: '100%', 
        maxWidth: '450px',
        padding: '3rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'white', letterSpacing: '2px', marginBottom: '2rem' }}>
          VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
        </div>

        {/* Progress Tracker */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
          <div style={{ flex: 1, height: '4px', background: step >= 1 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
        </div>
        
        {step === 1 ? (
          <div className="animate-fade-in-right" style={{ width: '100%' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', textAlign: 'center', textTransform: 'uppercase', fontFamily: 'Oswald' }}>
              Paso 1: Tu Cuenta
            </h1>
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} /> Nombre Completo
                </label>
                <input 
                  name="fullName"
                  type="text" 
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} /> Correo Electrónico
                </label>
                <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={16} /> Contraseña
                </label>
                <input 
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                CONTINUAR <ArrowRight size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in-right" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle2 color="#4ade80" size={48} style={{ marginBottom: '1rem' }} />
              <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)', textTransform: 'uppercase', fontFamily: 'Oswald', margin: 0 }}>
                ¡Registro Completo!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Ahora personaliza tu perfil con tus datos biométricos.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={16} /> Edad
                </label>
                <input 
                  name="edad"
                  type="number" 
                  value={formData.edad}
                  onChange={handleChange}
                  placeholder="25"
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Scale size={16} /> Peso (kg)
                  </label>
                  <input 
                    name="peso"
                    type="number"
                    step="0.1"
                    value={formData.peso}
                    onChange={handleChange}
                    placeholder="75"
                    required
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Ruler size={16} /> Altura (cm)
                  </label>
                  <input 
                    name="altura"
                    type="number"
                    value={formData.altura}
                    onChange={handleChange}
                    placeholder="180"
                    required
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="btn-glass" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  ATRÁS
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary" 
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  {loading ? 'REGISTRANDO...' : 'FINALIZAR'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ¿Ya tienes una cuenta? <Link href="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Inicia sesión aquí</Link>
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
