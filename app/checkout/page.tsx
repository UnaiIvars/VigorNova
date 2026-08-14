'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ArrowLeft, CreditCard, ShieldCheck, Zap, BarChart3, Globe, Star, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { upgradeToPro } from './actions';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cardType, setCardType] = useState<'visa' | 'mastercard'>('visa');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data?.user) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user in checkout:", err);
      }
    }
    getUser();
  }, []);

  const advantages = [
    { icon: <Star size={24} />, title: 'Nova IA Avanzada', desc: 'Análisis de técnica y sugerencias inteligentes personalizadas.' },
    { icon: <BarChart3 size={24} />, title: 'Analíticas Pro', desc: 'Gráficas detalladas de volumen, fuerza y sobrecarga progresiva.' },
    { icon: <Globe size={24} />, title: 'Sincronización Total', desc: 'Tus datos siempre seguros y accesibles desde cualquier lugar.' },
  ];

  const validate = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';

    const num = formData.number.replace(/\s/g, '');
    if (num.length !== 16 || !/^\d+$/.test(num)) {
      newErrors.number = 'Introduce los 16 dígitos de la tarjeta';
    }

    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Usa el formato MM/YY';
    } else {
      const [m, y] = formData.expiry.split('/').map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = Number(now.getFullYear().toString().slice(-2));
      if (m < 1 || m > 12) newErrors.expiry = 'Mes no válido';
      else if (y < currentYear || (y === currentYear && m < currentMonth)) newErrors.expiry = 'Tarjeta caducada';
    }

    if (formData.cvc.length !== 3 || !/^\d+$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC no válido (3 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user) {
      alert("Debes iniciar sesión para realizar el pago.");
      return;
    }

    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await upgradeToPro(user.id);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      setIsProcessing(false);
      alert("Hubo un error al procesar el pago: " + (result.error || "Inténtalo de nuevo."));
    }
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return v;
  };

  const inputStyle = (errorKey: string) => ({
    width: '100%',
    padding: '1.2rem',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: errors[errorKey] ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    outline: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s'
  });

  if (isSuccess) {
    return (
      <div className="force-dark" style={{ height: '100vh', backgroundColor: '#0a0a0c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #22c55e', marginBottom: '2rem' }} className="animate-pulse">
          <Check size={50} color="#22c55e" />
        </div>
        <h1 style={{ fontSize: '3rem', fontFamily: 'Oswald', color: 'white', marginBottom: '1rem' }}>¡PAGO CONFIRMADO!</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Desbloqueando funciones premium...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0c', color: 'white', fontFamily: 'Inter, sans-serif', padding: '2rem 1rem' }}>

      {isProcessing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 10, 12, 0.9)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', border: '4px solid rgba(var(--accent-primary-rgb),0.1)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
            <div style={{ position: 'absolute', top: '20px', left: '20px', width: '80px', height: '80px', borderRadius: '50%', border: '4px solid rgba(var(--accent-primary-rgb),0.05)', borderBottomColor: 'var(--accent-primary)', animation: 'spin 1.5s linear reverse infinite' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Zap size={30} color="var(--accent-primary)" className="animate-pulse" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Oswald', marginTop: '2rem', letterSpacing: '2px' }}>TRAMITANDO PAGO</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 500 }}>Estamos comunicando con tu banco, no cierres esta ventana...</p>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <ArrowLeft size={18} /> Cancelar y Volver
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>

          {/* Parte Izquierda: Resumen */}
          <div>
            <h1 style={{ fontSize: '3rem', fontFamily: 'Oswald', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              RESUMEN DE <span style={{ color: 'var(--accent-primary)' }}>SUSCRIPCIÓN</span>
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              {advantages.map((adv, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-primary)' }}>
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', display: 'block' }}>{adv.title}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{adv.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '2.5rem', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', fontFamily: 'Oswald', color: 'rgba(var(--accent-primary-rgb),0.03)', fontWeight: 900 }}>PRO</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>TOTAL A PAGAR</div>
                <div style={{ fontSize: '3.5rem', fontFamily: 'Oswald', fontWeight: 900, lineHeight: 1 }}>$9.00<span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.3)', marginLeft: '0.5rem' }}>/mes</span></div>
                <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>Suscripción mensual recurrente. Puedes cancelar en cualquier momento desde tu panel de ajustes.</p>
              </div>
            </div>
          </div>

          {/* Parte Derecha: Formulario de Pago */}
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'Oswald', letterSpacing: '2px', textAlign: 'center', marginBottom: '1.5rem', lineHeight: 1 }}>
              VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span> <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>PRO</span>
            </div>
            <div style={{ background: '#111114', borderRadius: '40px', padding: '3rem', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 50px 100px rgba(0,0,0,0.6)' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Detalles del Pago</h2>

              {/* Seleccion de Tarjeta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                <button
                  onClick={() => setCardType('visa')}
                  style={{
                    padding: '1.5rem', borderRadius: '24px', border: cardType === 'visa' ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                    background: cardType === 'visa' ? 'rgba(var(--accent-primary-rgb),0.12)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.3s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                    boxShadow: cardType === 'visa' ? '0 10px 20px rgba(var(--accent-primary-rgb),0.15)' : 'none'
                  }}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '24px', filter: cardType === 'visa' ? 'none' : 'brightness(0) invert(1) opacity(0.3)' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cardType === 'visa' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }} />
                </button>

                <button
                  onClick={() => setCardType('mastercard')}
                  style={{
                    padding: '1.5rem', borderRadius: '24px', border: cardType === 'mastercard' ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                    background: cardType === 'mastercard' ? 'rgba(var(--accent-primary-rgb),0.12)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.3s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                    boxShadow: cardType === 'mastercard' ? '0 10px 20px rgba(var(--accent-primary-rgb),0.15)' : 'none'
                  }}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '32px', filter: cardType === 'mastercard' ? 'none' : 'brightness(0) invert(1) opacity(0.3)' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cardType === 'mastercard' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }} />
                </button>
              </div>

              <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Nombre en la Tarjeta</label>
                    {errors.name && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}>{errors.name}</span>}
                  </div>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                    type="text" placeholder="EJ: JUAN PÉREZ"
                    style={inputStyle('name')}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Número de Tarjeta</label>
                    {errors.number && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}>{errors.number}</span>}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      value={formData.number}
                      onChange={e => setFormData({ ...formData, number: formatCardNumber(e.target.value) })}
                      maxLength={19}
                      type="text" placeholder="0000 0000 0000 0000"
                      style={{ ...inputStyle('number'), paddingRight: '4.5rem' }}
                    />
                    <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {cardType === 'visa' ?
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '18px' }} /> :
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '24px' }} />
                      }
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Expiración</label>
                      {errors.expiry && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}>{errors.expiry}</span>}
                    </div>
                    <input
                      value={formData.expiry}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                        setFormData({ ...formData, expiry: v });
                      }}
                      maxLength={5}
                      type="text" placeholder="MM/YY"
                      style={inputStyle('expiry')}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>CVC</label>
                      {errors.cvc && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}>{errors.cvc}</span>}
                    </div>
                    <input
                      value={formData.cvc}
                      onChange={e => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                      maxLength={3}
                      type="text" placeholder="123"
                      style={inputStyle('cvc')}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '16px', border: '1px solid rgba(34, 197, 94, 0.2)', marginTop: '1rem' }}>
                  <Lock size={20} color="#22c55e" />
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>Pago seguro procesado por VigorNova SSL. Tus datos están a salvo.</p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: '100%', padding: '1.6rem', borderRadius: '20px', background: isProcessing ? 'var(--glass-border)' : 'var(--accent-primary)', color: isProcessing ? 'var(--text-muted)' : 'black', border: 'none',
                    fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Oswald', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                    boxShadow: isProcessing ? 'none' : '0 20px 40px rgba(var(--accent-primary-rgb),0.3)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
                  }}
                  onMouseOver={e => !isProcessing && (e.currentTarget.style.transform = 'translateY(-5px)')}
                  onMouseOut={e => !isProcessing && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      PROCESANDO...
                    </>
                  ) : 'PAGAR Y COMENZAR'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '6rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
          <p>© 2026 VigorNova. Todos los pagos están sujetos a nuestros términos de suscripción.</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
