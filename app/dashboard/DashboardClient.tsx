"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { LayoutDashboard, Dumbbell, History, Settings, Eye, EyeOff, LogOut, Activity, Flame, ChevronRight, CheckCircle2, Calculator, Calendar, ChevronLeft, Search, Bookmark, X, Zap, Hammer, Target, Plus, Play, Timer, Check, Info, ArrowLeft, Trash2, Compass, Globe, Star, Users, Download, TrendingUp, BarChart3, ArrowRight, Bot, Send, Trophy, Repeat, AlertTriangle, MessageSquare, Share2, Camera, Lock, Crown, Scale, Moon, Menu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import Model, { IExerciseData, Muscle } from 'react-body-highlighter';
import { Language } from '../i18n/dictionaries';
import SocialMensajes from './SocialMensajes';
import { createClient } from '@/utils/supabase/client';
const MOCK_WORKOUTS: Record<string, any> = {
  "2026-2-3": {
    id: "2026-2-3",
    date: new Date(2026, 1, 3),
    title: 'Pecho y Tríceps',
    duration: '45 min',
    sets: { 'Pecho': 12, 'Tríceps': 8 },
    desc: 'Buen progreso en Press Banca',
    icon: <Flame size={20} color="var(--accent-primary)" />,
    exercises: [
      { name: 'Press de Banca Plano', sets: '4x10', rest: '90s', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
      { name: 'Press Inclinado', sets: '3x12', rest: '60s', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' },
      { name: 'Extensiones de Tríceps', sets: '3x15', rest: '60s', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80' }
    ]
  },
  "2026-2-5": {
    id: "2026-2-5",
    date: new Date(2026, 1, 5),
    title: 'Espalda y Bíceps',
    duration: '50 min',
    sets: { 'Espalda': 14, 'Bíceps': 6 },
    desc: 'Récord personal en peso muerto',
    icon: <Dumbbell size={20} color="var(--accent-primary)" />,
    exercises: [
      { name: 'Peso Muerto', sets: '3x5', rest: '180s', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80' },
      { name: 'Dominadas', sets: '3x10', rest: '120s', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' },
      { name: 'Curl de Bíceps', sets: '3x12', rest: '60s', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' }
    ]
  },
  "2026-2-8": {
    id: "2026-2-8",
    date: new Date(2026, 1, 8),
    title: 'Día de Piernas',
    duration: '60 min',
    sets: { 'Piernas': 16 },
    desc: 'Día duro de sentadillas',
    icon: <Activity size={20} color="var(--accent-primary)" />,
    exercises: [
      { name: 'Sentadillas Libres', sets: '4x8', rest: '150s', img: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=200&q=80' },
      { name: 'Prensa de Piernas', sets: '3x12', rest: '120s', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=80' },
      { name: 'Extensiones', sets: '4x15', rest: '60s', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&q=80' }
    ]
  },
  "2026-2-10": {
    id: "2026-2-10",
    date: new Date(2026, 1, 10),
    title: 'Hombros y Core',
    duration: '40 min',
    sets: { 'Hombros': 10, 'Core': 4 },
    desc: 'Mantenimiento ligero',
    icon: <Flame size={20} color="var(--accent-primary)" />,
    exercises: [
      { name: 'Press Militar', sets: '3x10', rest: '90s', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80' },
      { name: 'Elevaciones Laterales', sets: '3x15', rest: '60s', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' }
    ]
  },
  "2026-2-15": {
    id: "2026-2-15",
    date: new Date(2026, 1, 15),
    title: 'Pecho y Tríceps',
    duration: '55 min',
    sets: { 'Pecho': 14, 'Tríceps': 6 },
    desc: 'Fuerte congestión, aumento de repeticiones',
    icon: <Dumbbell size={20} color="var(--accent-primary)" />,
    exercises: [
      { name: 'Press con Mancuernas', sets: '4x10', rest: '90s', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
      { name: 'Cruces en Polea', sets: '3x15', rest: '60s', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' }
    ]
  },
  "2026-3-5": {
    id: "2026-3-5",
    date: new Date(2026, 2, 5),
    title: 'Entrenamiento Futuro',
    duration: '60 min',
    sets: { 'Piernas': 15 },
    desc: 'Programado: Día de Pierna pesada',
    icon: <Activity size={20} color="var(--accent-primary)" />,
    exercises: [
      { name: 'Sentadillas Profundas', sets: '5x5', rest: '180s', img: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=200&q=80' }
    ]
  }
};
import { signOut } from '../auth/actions';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getExercises, getUserFavorites, toggleFavorite, getUserWorkouts, saveWorkout, deleteWorkout, saveSession, getUserHistory, deleteHistoryEntry, getPublicWorkouts, forkWorkout, updateUserProfile, addExerciseToWorkout, getChatMessages, saveChatMessage, deleteConversation, togglePinConversation, getWeightHistory, saveWeightEntry, deleteWeightEntry } from './actions';
import { cancelProSubscription } from '../checkout/actions';
import ExplorarRutinas from './ExplorarRutinas';
function SesionActiva({ user, workout, onBack, setHasCompletedToday, setConfirmModal, unidades, onSessionSaved }: { user: any, workout: any, onBack: () => void, setHasCompletedToday: (val: boolean) => void, setConfirmModal: (val: any) => void, unidades: string, onSessionSaved?: () => void }) {
  const [sets, setSets] = useState<any>({});
  const [startTime] = useState<number>(Date.now());
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    if (workout?.exercises) {
      const initSets: any = {};
      workout.exercises.forEach((ex: string) => {
        initSets[ex] = [{ idx: 1, repeticiones: '', peso: '', completado: false }];
      });
      setSets(initSets);
    }
  }, [workout]);
  const addSet = (ex: string) => {
    setSets((prev: any) => {
      const lst = prev[ex] || [];
      return { ...prev, [ex]: [...lst, { idx: lst.length + 1, repeticiones: '', peso: '', completado: false }] };
    });
  };
  const updateSet = (ex: string, idx: number, field: string, value: any) => {
    setSets((prev: any) => {
      const lst = prev[ex].map((s: any) => s.idx === idx ? { ...s, [field]: value } : s);
      return { ...prev, [ex]: lst };
    });
  };
  const removeSet = (ex: string, idx: number) => {
    setSets((prev: any) => {
      const filtered = prev[ex].filter((s: any) => s.idx !== idx);
      const reindexed = filtered.map((s: any, i: number) => ({ ...s, idx: i + 1 }));
      return { ...prev, [ex]: reindexed };
    });
  };
  const handleFinish = async () => {
    const allSets = Object.values(sets).flat() as any[];
    const hasAnyData = allSets.some(s => s.peso && s.repeticiones && parseFloat(s.peso) > 0 && parseInt(s.repeticiones) > 0);
    if (!hasAnyData) {
      setConfirmModal({
        show: true,
        title: 'Entrenamiento Vacío',
        message: 'No puedes finalizar un entrenamiento sin registrar al menos una serie válida con peso y repeticiones.',
        type: 'error'
      });
      return;
    }
    const duration = Math.floor((Date.now() - startTime) / 60000);
    const datos_ejercicios = Object.keys(sets).map(ex => ({
      ejercicio: ex,
      series: sets[ex]
        .filter((s: any) => s.peso && s.repeticiones)
        .map((s: any) => ({
          ...s,
          peso: unidades === 'lbs' ? (parseFloat(s.peso) / 2.20462).toFixed(1) : s.peso
        }))
    })).filter(ex => ex.series.length > 0);
    const sessionData = {
      entrenamiento_id: workout.id,
      nombre_entrenamiento: workout.name,
      duracion: duration < 1 ? 1 : duration,
      notas: '',
      datos_ejercicios
    };
    const res = await saveSession(user.id, sessionData);
    if (res.success) {
      setShowSuccess(true);
      setHasCompletedToday(true);
      if (onSessionSaved) onSessionSaved();
      setTimeout(() => {
        onBack();
      }, 2500);
    } else {
      setConfirmModal({ show: true, title: 'Error', message: "Error guardando sesión: " + res.error, type: 'error' });
    }
  };
  return (
    <>
      {showSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transition: 'all 0.5s' }} className="animate-fade-in-up">
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #22c55e', marginBottom: '2rem', boxShadow: '0 0 60px rgba(34, 197, 94, 0.3)' }}>
            <Check size={60} color="#22c55e" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'Oswald', margin: '0 0 1rem 0', color: 'var(--text-main)', letterSpacing: '2px', textTransform: 'uppercase' }}>Sesión <span style={{ color: '#22c55e' }}>Completada</span></h2>
          <p style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-muted)', margin: 0 }}>Guardando progreso en tu historial...</p>
        </div>
      )}
      <div className="animate-fade-in-up" style={{ paddingBottom: '120px', maxWidth: '900px', margin: '0 auto', filter: showSuccess ? 'blur(10px)' : 'none', transition: 'filter 0.5s' }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} /> Volver a Rutinas
        </button>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '20px', background: 'rgba(var(--accent-primary-rgb), 0.1)', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', border: '1px solid rgba(var(--accent-primary-rgb), 0.2)' }}>
            <Activity size={14} /> Registrando sesión
          </div>
          <h1 style={{ fontSize: '4rem', fontFamily: 'Oswald, sans-serif', margin: '0 0 1rem 0', lineHeight: 1, letterSpacing: '1px', color: 'var(--text-main)' }}>{workout.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>Registra tus marcas para llevar un control exacto de tu progreso y sobrecarga progresiva.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {workout.exercises.map((ex: string, exIdx: number) => {
            const sList = sets[ex] || [];
            return (
              <div key={ex} style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-card)', opacity: 0.9 }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(var(--accent-primary-rgb), 0.1)', border: '1px solid rgba(var(--accent-primary-rgb), 0.2)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Oswald' }}>
                    {exIdx + 1}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 600, fontFamily: 'Oswald', letterSpacing: '1px', color: 'var(--text-main)' }}>{ex}</h3>
                </div>
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 50px', gap: '1.5rem', marginBottom: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}>
                    <div>Set</div>
                    <div>{unidades === 'lbs' ? 'LBS' : 'KG'}</div>
                    <div>Reps</div>
                    <div></div>
                  </div>
                  {sList.map((s: any) => (
                    <div key={s.idx} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 50px', gap: '1.5rem', alignItems: 'center', marginBottom: '1rem', borderRadius: '16px', padding: '0.5rem', transition: 'all 0.3s', border: '1px solid transparent' }}>
                      <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', fontSize: '1.2rem', fontFamily: 'Oswald' }}>
                        {s.idx}
                      </div>
                      <input type="number" placeholder="--" value={s.peso} onChange={e => updateSet(ex, s.idx, 'peso', e.target.value)} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '1rem', borderRadius: '12px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, outline: 'none', transition: 'all 0.3s', fontFamily: 'Oswald' }} />
                      <input type="number" placeholder="--" value={s.repeticiones} onChange={e => updateSet(ex, s.idx, 'repeticiones', e.target.value)} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '1rem', borderRadius: '12px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, outline: 'none', transition: 'all 0.3s', fontFamily: 'Oswald' }} />
                      <button onClick={() => removeSet(ex, s.idx)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addSet(ex)} style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: 'transparent', border: '1px dashed var(--glass-border)', color: 'var(--text-muted)', borderRadius: '16px', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }} onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                    + Añadir Serie
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '90%', maxWidth: '600px' }}>
          <button className="auth-btn" onClick={handleFinish} style={{ width: '100%', padding: '1.4rem', color: 'white', borderRadius: '20px', fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>
            FINALIZAR ENTRENAMIENTO
          </button>
        </div>
      </div>
    </>
  );
}
function LockedFeatureOverlay({ feature, icon, title, description }: { feature: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="animate-fade-in-up" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ maxWidth: '800px', width: '100%', padding: '4rem', textAlign: 'center', background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 100%)', border: '1px solid var(--glass-border)', borderRadius: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'rgba(var(--accent-primary-rgb),0.1)', border: '1px solid rgba(var(--accent-primary-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            {icon}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', borderRadius: '20px', background: 'var(--bg-subtle)', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', border: '1px solid rgba(var(--accent-primary-rgb),0.2)' }}>
            <Lock size={14} /> Función Premium
          </div>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'Oswald', color: 'var(--text-main)', marginBottom: '1rem', textTransform: 'uppercase', lineHeight: 1.1 }}>{title}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>{description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left', marginBottom: '4rem', padding: '0 2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}><CheckCircle2 size={20} /></div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 500 }}>Acceso ilimitado sin restricciones.</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}><CheckCircle2 size={20} /></div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 500 }}>Sincronización en la nube en tiempo real.</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}><CheckCircle2 size={20} /></div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 500 }}>Soporte prioritario 24/7.</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}><CheckCircle2 size={20} /></div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 500 }}>Nuevas funciones exclusivas cada mes.</div>
            </div>
          </div>
          <Link href="/checkout" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1.5rem 3rem', background: 'var(--accent-primary)', color: 'black', textDecoration: 'none', borderRadius: '20px', fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '2px', boxShadow: '0 20px 40px rgba(var(--accent-primary-rgb),0.4)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(var(--accent-primary-rgb),0.5)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(var(--accent-primary-rgb),0.4)'; }}>
            OBTENER VIGORNOVA PRO <ArrowRight size={24} />
          </Link>
          <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Solo $9.00 al mes. Cancela cuando quieras.</div>
        </div>
      </div>
    </div>
  );
}
const GOAL_COLORS: Record<string, string> = {
  'Fuerza': 'var(--accent-primary)',
  'Hipertrofia': 'var(--accent-primary)',
  'Resistencia': '#22d3ee',
  'Pérdida de Peso': '#f59e0b',
  'Movilidad': '#22c55e'
};
function CalculadoraDietetica({ user, unidades }: { user: any, unidades: 'kg' | 'lbs' }) {
  const { theme } = useTheme();
  const [datos, setDatos] = useState({
    peso: '',
    altura: '',
    edad: '',
    genero: 'hombre',
    actividad: '1.2',
    objetivo: 'mantenimiento'
  });
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const calcular = () => {
    setError(null);
    const p = parseFloat(datos.peso);
    const a = parseFloat(datos.altura);
    const e = parseInt(datos.edad);
    if (!p || !a || !e) return setError("Por favor rellena todos los campos");
    const weightInKg = unidades === 'lbs' ? p / 2.20462 : p;
    if (weightInKg < 30 || weightInKg > 400) return setError(`Peso fuera de rango (${unidades === 'lbs' ? '66-880 lbs' : '30-400 kg'})`);
    if (a < 100 || a > 250) return setError("Altura: 100-250 cm");
    if (e < 12 || e > 100) return setError("Edad: 12-100 años");
    let tmb = (10 * weightInKg) + (6.25 * a) - (5 * e);
    if (datos.genero === 'hombre') tmb += 5;
    else tmb -= 161;
    const tdee = tmb * parseFloat(datos.actividad);
    let objetivoCal = tdee;
    if (datos.objetivo === 'perder') objetivoCal -= 500;
    if (datos.objetivo === 'ganar') objetivoCal += 500;
    setResultado({
      mantenimiento: Math.round(tdee),
      objetivo: Math.round(objetivoCal),
      proteina: Math.round(weightInKg * 2.2),
      grasas: Math.round(weightInKg * 0.8),
      carbos: Math.round((objetivoCal - (weightInKg * 2.2 * 4) - (weightInKg * 0.8 * 9)) / 4)
    });
  };
  const labelStyle: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' };
  const bigInputStyle: React.CSSProperties = { width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none', fontSize: '1.1rem', fontFamily: 'Oswald', transition: 'all 0.3s' };
  const optionStyle = { background: 'var(--bg-dark)', color: 'var(--text-main)' };
  return (
    <div className="animate-fade-in-up" style={{ width: '100%', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Oswald', fontSize: '4rem', lineHeight: 1, letterSpacing: '-2px', margin: 0 }}>CENTRO DE <span style={{ color: 'var(--accent-primary)' }}>NUTRICIÓN</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.8rem', fontWeight: 300 }}>Optimización biométrica de macronutrientes para el máximo rendimiento.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '28px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}><Dumbbell size={14} /> Peso ({unidades.toUpperCase()})</label>
              <input type="number" style={bigInputStyle} value={datos.peso} onChange={e => setDatos({ ...datos, peso: e.target.value })} placeholder={unidades === 'lbs' ? "165" : "75"} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}><TrendingUp size={14} /> Altura (cm)</label>
              <input type="number" style={bigInputStyle} value={datos.altura} onChange={e => setDatos({ ...datos, altura: e.target.value })} placeholder="180" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}><Users size={14} /> Edad</label>
              <input type="number" style={bigInputStyle} value={datos.edad} onChange={e => setDatos({ ...datos, edad: e.target.value })} placeholder="25" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}><Activity size={14} /> Género</label>
              <select
                style={{ ...bigInputStyle, transition: 'all 0.3s', cursor: 'pointer' }}
                value={datos.genero}
                onChange={e => setDatos({ ...datos, genero: e.target.value })}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <option value="hombre" style={optionStyle}>MASCULINO</option>
                <option value="mujer" style={optionStyle}>FEMENINO</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}><Timer size={14} /> Nivel de Actividad Semanal</label>
              <select
                style={{ ...bigInputStyle, transition: 'all 0.3s', cursor: 'pointer' }}
                value={datos.actividad}
                onChange={e => setDatos({ ...datos, actividad: e.target.value })}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <option value="1.2" style={optionStyle}>SEDENTARIO (SIN ACTIVIDAD)</option>
                <option value="1.375" style={optionStyle}>LIGERO (1-2 DÍAS ENTRENAMIENTO)</option>
                <option value="1.55" style={optionStyle}>MODERADO (3-5 DÍAS ENTRENAMIENTO)</option>
                <option value="1.725" style={optionStyle}>INTENSO (6-7 DÍAS ENTRENAMIENTO)</option>
                <option value="1.9" style={optionStyle}>ELITE (DOBLE SESIÓN DIARIA)</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}><Target size={14} /> Objetivo Principal</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
                {[{ id: 'perder', l: 'PERDER GRASA', i: <Flame size={14} /> }, { id: 'mantenimiento', l: 'MANTENER PESO', i: <Activity size={14} /> }, { id: 'ganar', l: 'GANAR MÚSCULO', i: <Zap size={14} /> }].map(obj => {
                  const isSelected = datos.objetivo === obj.id;
                  return (
                    <button 
                      key={obj.id} 
                      onClick={() => setDatos({ ...datos, objetivo: obj.id })} 
                      style={{
                        padding: '1rem 0.5rem', borderRadius: '14px', border: '2px solid',
                        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--glass-border)',
                        background: isSelected ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'transparent',
                        color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        gap: '0.6rem', fontWeight: 800, fontSize: '0.65rem'
                      }}
                      onMouseOver={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--accent-primary)';
                          e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb), 0.03)';
                          e.currentTarget.style.transform = 'translateY(-3px)';
                        } else {
                          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                        }
                      }}
                      onMouseOut={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--glass-border)';
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                        } else {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        }
                      }}
                    >
                      {obj.i}{obj.l}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <button 
                onClick={calcular} 
                style={{ 
                  width: '100%', padding: '1.2rem', 
                  background: 'transparent', color: 'var(--accent-primary)', border: '2px solid var(--accent-primary)', 
                  borderRadius: '18px', fontWeight: 900, fontFamily: 'Oswald', fontSize: '1.4rem', 
                  cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                  textTransform: 'uppercase', letterSpacing: '2px' 
                }} 
                onMouseOver={e => { 
                  e.currentTarget.style.background = 'var(--accent-primary)'; 
                  e.currentTarget.style.color = 'black'; 
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(var(--accent-primary-rgb),0.3)';
                }} 
                onMouseOut={e => { 
                  e.currentTarget.style.background = 'transparent'; 
                  e.currentTarget.style.color = 'var(--accent-primary)'; 
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                OBTENER DATOS
              </button>
            </div>
          </div>
          {error && <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', marginTop: '1.5rem', padding: '1rem', background: 'rgba(var(--accent-primary-rgb),0.05)', borderRadius: '12px' }}>{error}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {resultado ? (
            <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', border: `2px solid var(--accent-primary)`, background: theme === 'dark' ? 'linear-gradient(180deg, rgba(var(--accent-primary-rgb),0.08) 0%, transparent 100%)' : 'var(--bg-card)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.8rem' }}>RECOMENDACIÓN CALÓRICA DIARIA</div>
                <div style={{ fontSize: '5rem', fontFamily: 'Oswald', color: 'var(--text-main)', lineHeight: 1 }}>{resultado.objetivo} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontFamily: 'Inter' }}>KCAL</span></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <MacroRowSmall label="Proteína" value={resultado.proteina} color="var(--accent-primary)" icon={<Zap size={20} />} />
                <MacroRowSmall label="Grasas" value={resultado.grasas} color="#f59e0b" icon={<Flame size={20} />} />
                <MacroRowSmall label="Carbos" value={resultado.carbos} color="#22d3ee" icon={<TrendingUp size={20} />} />
              </div>
              <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--bg-subtle)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Info size={24} color="var(--accent-primary)" />
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 300 }}>
                  Este plan se basa en un metabolismo basal de <strong>{resultado.mantenimiento} kcal</strong> ajustado a tu objetivo de <strong>{datos.objetivo === 'perder' ? 'DÉFICIT' : datos.objetivo === 'ganar' ? 'SUPERÁVIT' : 'MANTENIMIENTO'}</strong>.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', border: '3px dashed rgba(255,255,255,0.04)', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-subtle)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <Calculator size={36} style={{ opacity: 0.1 }} />
              </div>
              <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', color: 'var(--glass-border)', textTransform: 'uppercase', letterSpacing: '2px' }}>INTRODUCE TUS DATOS</h3>
              <p style={{ maxWidth: '300px', fontSize: '1rem', fontWeight: 300 }}>Genera un reporte nutricional adaptado a tu fisiología de élite.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function MacroRowSmall({ label, value, color, icon }: { label: string, value: number, color: string, icon: any }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg-subtle)', borderColor: 'rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.8rem', color: color }}>
        {icon}
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
      </div>
      <div style={{ fontSize: '2.8rem', fontFamily: 'Oswald', color: color, lineHeight: 1 }}>{value}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.3rem', fontFamily: 'Inter' }}>g</span></div>
    </div>
  );
}
const WORKOUT_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'https://images.unsplash.com/photo-1540206276207-3f24340d7404?w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
];
export default function DashboardClient({ user }: { user: any }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [unidades, setUnidades] = useState<'kg' | 'lbs'>('kg');
  const [inicioSemana, setInicioSemana] = useState<'lun' | 'dom'>('lun');
  useEffect(() => {
    const savedUnits = localStorage.getItem('vigornova_units');
    if (savedUnits === 'lbs') setUnidades('lbs');
    const savedStartDay = localStorage.getItem('vigornova_start_day');
    if (savedStartDay === 'dom') setInicioSemana('dom');
  }, []);
  const cambiarUnidades = (u: 'kg' | 'lbs') => {
    setUnidades(u);
    localStorage.setItem('vigornova_units', u);
  };
  const cambiarInicioSemana = (d: 'lun' | 'dom') => {
    setInicioSemana(d);
    localStorage.setItem('vigornova_start_day', d);
  };
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [dbExercises, setDbExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [historyTabSessionId, setHistoryTabSessionId] = useState<string | null>(null);
  const [shareRoutine, setShareRoutine] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean, title: string, message: string, onConfirm?: () => void, type: 'error' | 'confirm' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [inactiveRoutines, setInactiveRoutines] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [routinePage, setRoutinePage] = useState(1);
  const routinesPerPage = 12;
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [pendingRequests, setPendingRequests] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      try {
        const supabase = createClient();
        const { count: reqCount } = await supabase.from('solicitudes_amistad')
          .select('*', { count: 'exact', head: true })
          .eq('receptor_id', user.id)
          .eq('estado', 'pendiente');
        const { count: msgCount } = await supabase.from('mensajes')
          .select('*', { count: 'exact', head: true })
          .eq('receptor_id', user.id)
          .eq('leido', false);
        setPendingRequests((reqCount || 0) + (msgCount || 0));
      } catch (err) {
        // Safe silence for notification polling
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);
  useEffect(() => {
    const saved = localStorage.getItem('inactive_routines');
    if (saved) setInactiveRoutines(JSON.parse(saved));
    const completed = localStorage.getItem('completed_today');
    const lastDate = localStorage.getItem('completed_date');
    const today = new Date().toLocaleDateString();
    if (completed === 'true' && lastDate === today) {
      setHasCompletedToday(true);
    }
  }, []);
  const setTodayCompleted = (val: boolean) => {
    setHasCompletedToday(val);
    if (val) {
      localStorage.setItem('completed_today', 'true');
      localStorage.setItem('completed_date', new Date().toLocaleDateString());
    } else {
      localStorage.removeItem('completed_today');
      localStorage.removeItem('completed_date');
    }
  };
  const toggleRoutineActive = (id: string) => {
    const newInactive = inactiveRoutines.includes(id) ? inactiveRoutines.filter(r => r !== id) : [...inactiveRoutines, id];
    setInactiveRoutines(newInactive);
    localStorage.setItem('inactive_routines', JSON.stringify(newInactive));
  };
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    nombre: user.name,
    descripcion: user.descripcion || '',
    foto_perfil: user.foto_perfil || '',
    ubicacion: user.ubicacion || '',
    instagram: user.instagram || '',
    twitter: user.twitter || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    setProfileError(null);
    const result = await updateUserProfile(user.id, profileForm);
    if (result.success) {
      setShowProfileModal(false);
      window.location.reload();
    } else {
      setProfileError(result.error || 'Error al actualizar perfil');
    }
    setIsUpdatingProfile(false);
  };
  const canChangeName = () => {
    if (!user.ultimo_cambio_nombre) return true;
    const lastChange = new Date(user.ultimo_cambio_nombre);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 60;
  };
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', goal: 'Hipertrofia', days: [] as string[], muscles: [] as string[],
    exercises: [] as string[], es_publico: false, descripcion: ''
  });
  useEffect(() => {
    async function initData() {
      setIsLoading(true);
      const exData = await getExercises();
      setDbExercises(exData || []);
      if (user?.id) {
        const data = await getUserWorkouts(user.id);
        const mapped = data.map((w: any) => ({
          id: w.id,
          name: w.nombre,
          goal: w.objetivo,
          days: w.dias || [],
          muscles: w.musculos || [],
          exercises: w.ejercicios || [],
          level: w.nivel || 'Intermedio',
          duration: w.duracion || '45 min',
          color: w.color || 'var(--accent-primary)',
          image: w.imagen_url || WORKOUT_IMAGES[0],
          es_publico: w.es_publico,
          descripcion: w.descripcion
        }));
        setWorkouts(mapped);
        const histData = await getUserHistory(user.id);
        setHistory(histData || []);
      }
      setIsLoading(false);
    }
    initData();
  }, [user?.id]);
  const refreshWorkouts = async () => {
    if (!user?.id) return;
    const data = await getUserWorkouts(user.id);
    const mapped = data.map((w: any) => ({
      id: w.id,
      name: w.nombre,
      goal: w.objetivo,
      days: w.dias || [],
      muscles: w.musculos || [],
      exercises: w.ejercicios || [],
      level: w.nivel || 'Intermedio',
      duration: w.duracion || '45 min',
      color: w.color || 'var(--accent-primary)',
      image: w.imagen_url || WORKOUT_IMAGES[0],
      es_publico: w.es_publico,
      descripcion: w.descripcion
    }));
    setWorkouts(mapped);
  };
  const refreshHistory = async () => {
    if (!user?.id) return;
    const histData = await getUserHistory(user.id);
    setHistory(histData || []);
  };
  const openCreate = () => {
    setForm({ name: '', goal: 'Hipertrofia', days: [], muscles: [], exercises: [], es_publico: false, descripcion: '' });
    setEditId(null); setWizardStep(1); setShowWizard(true);
  };
  const openEdit = (w: any, step: number = 1) => {
    setForm({
      name: w.name, goal: w.goal, days: w.days, muscles: w.muscles || [],
      exercises: w.exercises || [], es_publico: !!w.es_publico, descripcion: w.descripcion || ''
    });
    setEditId(w.id); setWizardStep(step); setShowWizard(true);
  };
  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    const res = await deleteWorkout(id, user.id);
    if (res.success) {
      setWorkouts(prev => prev.filter(w => w.id !== id));
    }
    setDeleteId(null);
  };
  const handleRemoveAssignment = async (workoutId: string, dayToRemove: string) => {
    if (!user?.id) return;
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;
    const newDays = (workout.days || []).filter((d: string) => d !== dayToRemove);
    const workoutData = {
      nombre: workout.name,
      objetivo: workout.goal,
      nivel: workout.level,
      duracion: workout.duration,
      color: workout.color,
      imagen_url: workout.image,
      dias: newDays,
      ejercicios: workout.exercises,
      musculos: workout.muscles || [],
      es_publico: !!workout.es_publico,
      descripcion: workout.descripcion
    };
    const res = await saveWorkout(workoutId, user.id, workoutData);
    if (res.success) {
      setWorkouts(prev => prev.map(w => w.id === workoutId ? { ...w, days: newDays } : w));
    } else {
      showToast(res.error || "Error al actualizar la rutina", "error");
    }
  };
  const handleSave = async () => {
    if (!form.name.trim() || !user?.id) return;
    const imgIdx = workouts.length % WORKOUT_IMAGES.length;
    const workoutData = {
      nombre: form.name,
      objetivo: form.goal,
      nivel: 'Intermedio',
      duracion: `${45 + form.exercises.length * 5} min`,
      color: GOAL_COLORS[form.goal] || 'var(--accent-primary)',
      imagen_url: WORKOUT_IMAGES[imgIdx],
      dias: form.days,
      ejercicios: form.exercises,
      musculos: form.muscles,
      es_publico: form.es_publico,
      descripcion: form.descripcion
    };
    const res = await saveWorkout(editId, user.id, workoutData);
    if (res.success) {
      const savedW = {
        id: editId || res.data?.id,
        name: workoutData.nombre,
        goal: workoutData.objetivo,
        days: workoutData.dias,
        muscles: workoutData.musculos,
        exercises: workoutData.ejercicios,
        level: workoutData.nivel,
        duration: workoutData.duracion,
        color: workoutData.color,
        image: workoutData.imagen_url
      };
      if (editId) {
        setWorkouts(prev => prev.map(w => w.id === editId ? savedW : w));
        showToast("Rutina actualizada con éxito");
      } else {
        setWorkouts(prev => [savedW, ...prev]);
        showToast("Rutina creada con éxito");
      }
      setShowWizard(false);
    } else {
      showToast(res.error || "Error al guardar la rutina", "error");
    }
  };
  const toggleDay = (d: string) => setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d] }));
  const toggleMuscle = (m: string) => {
    setForm(f => {
      if (f.muscles.includes(m)) {
        const newMuscles = f.muscles.filter(x => x !== m);
        const exercisesToRemove = dbExercises.filter(ex => ex.grupo_muscular === m || ex.grupo_muscular?.split(' ')[0] === m).map(ex => ex.nombre);
        return { ...f, muscles: newMuscles, exercises: f.exercises.filter(exName => !exercisesToRemove.includes(exName)) };
      } else {
        return { ...f, muscles: [...f.muscles, m] };
      }
    });
  };
  const toggleExercise = (exName: string) => setForm(f => ({ ...f, exercises: f.exercises.includes(exName) ? f.exercises.filter(x => x !== exName) : [...f.exercises, exName] }));
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.9rem 1rem', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '1rem' };
  const userInitials = (user?.name || 'User')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const renderContent = () => {
    switch (activeTab) {
      case 'inicio': return (
        <InicioOverview
          user={user}
          workouts={workouts}
          isLoading={isLoading}
          openEdit={openEdit}
          setWizardStep={setWizardStep}
          setDeleteId={setDeleteId}
          inactiveRoutines={inactiveRoutines}
          setActiveSession={setActiveSession}
          setActiveTab={setActiveTab}
          hasCompletedToday={hasCompletedToday}
          onRemoveAssignment={handleRemoveAssignment}
          theme={theme}
          inicioSemana={inicioSemana}
          history={history}
          setHistoryTabSessionId={setHistoryTabSessionId}
        />
      );
      case 'progreso':
        if (!user.es_pro) {
          return (
            <LockedFeatureOverlay
              feature="progreso"
              icon={<BarChart3 size={45} color="var(--accent-primary)" />}
              title="ANALÍTICAS DE ÉLITE"
              description="Visualiza tu progreso con gráficas avanzadas de volumen de entrenamiento, marcas personales y sobrecarga progresiva. Toma decisiones basadas en datos reales."
            />
          );
        }
        return <ProgresoRendimiento user={user} setConfirmModal={setConfirmModal} unidades={unidades} />;
      case 'crear': return (
        <CrearEntrenamiento
          user={user}
          workouts={workouts}
          isLoading={isLoading}
          openCreate={openCreate}
          openEdit={openEdit}
          setDeleteId={setDeleteId}
          dbExercises={dbExercises}
          inactiveRoutines={inactiveRoutines}
          toggleActive={toggleRoutineActive}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          setHasCompletedToday={setTodayCompleted}
          routinePage={routinePage}
          setRoutinePage={setRoutinePage}
          routinesPerPage={routinesPerPage}
          setShareRoutine={setShareRoutine}
          setConfirmModal={setConfirmModal}
          unidades={unidades}
          inicioSemana={inicioSemana}
          onSessionSaved={refreshHistory}
        />
      );
      case 'directorio': return <DirectorioEjercicios user={user} workouts={workouts} />;
      case 'social': return <SocialMensajes user={user} workouts={workouts} onRoutineSaved={refreshWorkouts} theme={theme} />;
      case 'historial': return (
        <HistorialEntrenamientos
          user={user}
          dbExercises={dbExercises}
          setConfirmModal={setConfirmModal}
          unidades={unidades}
          theme={theme}
          initialSessionId={historyTabSessionId}
          onNavigateToCalendar={(date, day) => {
            setViewDate(date);
            setSelectedDay(day);
            setActiveTab('calendario');
          }}
        />
      );
      case 'calendario': return (
        <CalendarioEntrenamientos
          user={user}
          viewDate={viewDate}
          setViewDate={setViewDate}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          unidades={unidades}
          inicioSemana={inicioSemana}
        />
      );
      case 'calculadora': return <CalculadoraDietetica user={user} unidades={unidades} />;
      case 'explorar': return (
        <ExplorarRutinas
          user={user}
          onAdopt={() => {
            refreshWorkouts();
            setActiveTab('inicio');
          }}
          theme={theme}
        />
      );
      case 'asistente':
        if (!user.es_pro) {
          return (
            <LockedFeatureOverlay
              feature="asistente"
              icon={<Bot size={45} color="var(--accent-primary)" />}
              title="NOVA IA AVANZADA"
              description="Tu entrenador personal 24/7. Nova analiza tus entrenamientos, responde dudas técnicas y genera planes personalizados usando los modelos de IA más potentes del mercado."
            />
          );
        }
        return <AsistenteIA user={user} setConfirmModal={setConfirmModal} />;
      case 'ajustes': return <AjustesUsuario user={user} unidades={unidades} setUnidades={cambiarUnidades} inicioSemana={inicioSemana} setInicioSemana={cambiarInicioSemana} setShowProfileModal={setShowProfileModal} setConfirmModal={setConfirmModal} />;
      default: return (
        <InicioOverview
          user={user}
          workouts={workouts}
          isLoading={isLoading}
          openEdit={openEdit}
          setWizardStep={setWizardStep}
          setDeleteId={setDeleteId}
          inactiveRoutines={inactiveRoutines}
          setActiveSession={setActiveSession}
          setActiveTab={setActiveTab}
          hasCompletedToday={hasCompletedToday}
          inicioSemana={inicioSemana}
          history={history}
        />
      );
    }
  };
  return (
    <div className="dashboard-layout" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      <div className="mobile-nav">
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'var(--text-main)', textDecoration: 'none', letterSpacing: '1.5px' }}>
          VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />}

      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ width: '300px', borderRight: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', padding: '2rem 0', opacity: 0.98 }}>
        <div style={{ padding: '0 2.5rem', marginBottom: '3rem', textAlign: 'center' }} className="hide-tablet">
          <Link href="/" style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'var(--text-main)', textDecoration: 'none', letterSpacing: '2px', display: 'inline-block' }}>
            VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
          </Link>
        </div>
        <div style={{ padding: '0 2rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ padding: '1.8rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', borderColor: 'rgba(var(--accent-primary-rgb), 0.2)', background: 'rgba(var(--accent-primary-rgb), 0.03)', textAlign: 'center' }}>
            <div
              onClick={() => { setShowProfileModal(true); setIsMobileMenuOpen(false); }}
              style={{
                width: '95px', height: '95px', borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                fontSize: '2.2rem', boxShadow: theme === 'dark' ? `0 0 35px rgba(var(--accent-primary-rgb), 0.4)` : 'var(--card-shadow)',
                color: 'var(--text-on-accent)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden', border: '4px solid rgba(255,255,255,0.1)',
                flexShrink: 0
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = theme === 'dark' ? '0 0 45px rgba(var(--accent-primary-rgb), 0.7)' : '0 0 25px rgba(var(--accent-primary-rgb), 0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = theme === 'dark' ? '0 0 35px rgba(var(--accent-primary-rgb), 0.4)' : 'var(--card-shadow)'; }}
            >
              {user.foto_perfil ? (
                <img src={user.foto_perfil} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : userInitials}
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.5px', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {user.es_pro ? (
                  <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Crown size={12} fill="white" /> PRO
                  </span>
                ) : (
                  <span style={{ opacity: 0.6 }}>BÁSICO</span>
                )}
              </div>
              <form action={signOut}>
                <button type="submit" style={{
                  width: '100%', background: 'var(--bg-subtle)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontSize: '0.8rem', padding: '0.6rem 1rem', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s'
                }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.1)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-primary-rgb),0.3)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  <LogOut size={14} /> Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 1.5rem', gap: '0.5rem', overflowY: 'auto' }}>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Inicio" isActive={activeTab === 'inicio'} onClick={() => setActiveTab('inicio')} />
          <SidebarItem icon={<TrendingUp size={20} />} label="Progreso" isActive={activeTab === 'progreso'} onClick={() => setActiveTab('progreso')} locked={!user.es_pro} />
          <SidebarItem icon={<Dumbbell size={20} />} label="Mis Rutinas" isActive={activeTab === 'crear'} onClick={() => setActiveTab('crear')} />
          <SidebarItem icon={<Search size={20} />} label="Ejercicios" isActive={activeTab === 'directorio'} onClick={() => setActiveTab('directorio')} />
          <SidebarItem icon={<Compass size={20} />} label="Explorar" isActive={activeTab === 'explorar'} onClick={() => setActiveTab('explorar')} />
          <SidebarItem icon={<MessageSquare size={20} />} label="Social" isActive={activeTab === 'social'} onClick={() => setActiveTab('social')} badge={pendingRequests} />
          <SidebarItem icon={<History size={20} />} label="Historial" isActive={activeTab === 'historial'} onClick={() => setActiveTab('historial')} />
          <SidebarItem icon={<Calendar size={20} />} label="Calendario" isActive={activeTab === 'calendario'} onClick={() => setActiveTab('calendario')} />
          <SidebarItem icon={<Calculator size={20} />} label="Calculadora" isActive={activeTab === 'calculadora'} onClick={() => setActiveTab('calculadora')} />
          <SidebarItem icon={<Bot size={20} />} label="Asistente IA" isActive={activeTab === 'asistente'} onClick={() => setActiveTab('asistente')} locked={!user.es_pro} />
          <SidebarItem icon={<Settings size={20} />} label="Ajustes" isActive={activeTab === 'ajustes'} onClick={() => setActiveTab('ajustes')} />
        </nav>
      </aside>
      <main className="dashboard-main" style={{ flex: 1, padding: '3rem 4rem', overflowY: activeTab === 'asistente' ? 'hidden' : 'auto', backgroundColor: 'var(--bg-main)', backgroundImage: theme === 'dark' ? `radial-gradient(circle at 100% 0%, rgba(var(--accent-primary-rgb), 0.05) 0%, transparent 40%)` : 'none' }}>
        {renderContent()}
      </main>
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10000, background: toast.type === 'error' ? 'rgba(var(--accent-primary-rgb), 0.95)' : 'rgba(34, 197, 94, 0.95)', color: 'var(--text-main)', padding: '1rem 2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', animation: 'fade-in-up 0.3s ease-out forwards' }}>
          {toast.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
          <span style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'Oswald', letterSpacing: '1px' }}>{toast.message}</span>
        </div>
      )}
      {shareRoutine !== null && typeof document !== 'undefined' && ReactDOM.createPortal(
        <ShareModal user={user} routine={shareRoutine} onClose={() => setShareRoutine(null)} showToast={showToast} />,
        document.body
      )}
      {deleteId !== null && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, background: theme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setDeleteId(null)}>
          <div style={{ 
            background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', 
            borderRadius: '32px', padding: '3rem', maxWidth: '450px', width: '100%', 
            textAlign: 'center', position: 'relative', overflow: 'hidden',
            boxShadow: '0 30px 100px rgba(0,0,0,0.8)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' 
              }}>
                <Trash2 size={40} color="#ff4444" />
              </div>

              <h3 style={{ fontFamily: 'Oswald', fontSize: '2.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-main)' }}>
                ¿ELIMINAR RUTINA?
              </h3>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3rem' }}>
                Esta acción es irreversible. Se eliminará permanentemente esta rutina de tu biblioteca.
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => setDeleteId(null)} 
                  style={{ 
                    flex: 1, padding: '1.2rem', borderRadius: '18px', 
                    background: 'transparent', color: 'var(--text-main)', 
                    fontWeight: 800, fontFamily: 'Oswald', textTransform: 'uppercase', 
                    border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.3s' 
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'var(--text-main)';
                    e.currentTarget.style.color = 'var(--bg-dark)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  CANCELAR
                </button>
                <button 
                  onClick={() => handleDelete(deleteId)} 
                  style={{ 
                    flex: 1, padding: '1.2rem', borderRadius: '18px', 
                    border: '2px solid #ff4444', background: 'transparent', color: '#ff4444', 
                    fontWeight: 900, fontFamily: 'Oswald', textTransform: 'uppercase', 
                    cursor: 'pointer', transition: 'all 0.3s' 
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#ff4444';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 68, 68, 0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ff4444';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {confirmModal && confirmModal.show && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 300000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setConfirmModal(null)}>
          <div style={{ 
            background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', 
            borderRadius: '32px', padding: '3.5rem', maxWidth: '550px', width: '100%', 
            boxShadow: '0 30px 100px rgba(0,0,0,0.8)', textAlign: 'center', 
            position: 'relative', overflow: 'hidden' 
          }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '85px', height: '85px', borderRadius: '50%', 
                background: confirmModal.type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(var(--accent-primary-rgb), 0.1)', 
                border: `1px solid ${confirmModal.type === 'error' ? 'rgba(255, 68, 68, 0.2)' : 'rgba(var(--accent-primary-rgb), 0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem' 
              }}>
                <AlertTriangle size={42} color={confirmModal.type === 'error' ? '#ff4444' : 'var(--accent-primary)'} />
              </div>

              <h3 style={{ fontFamily: 'Oswald', fontSize: '2.4rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-main)' }}>
                {confirmModal.title}
              </h3>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '3rem', fontWeight: 300 }}>
                {confirmModal.message}
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                {confirmModal.type === 'confirm' && (
                  <button
                    onClick={() => setConfirmModal(null)}
                    style={{ 
                      flex: 1, padding: '1.2rem', borderRadius: '18px', 
                      background: 'transparent', color: 'var(--text-main)', 
                      fontWeight: 800, fontFamily: 'Oswald', textTransform: 'uppercase', 
                      border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.3s' 
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'var(--text-main)';
                      e.currentTarget.style.color = 'var(--bg-dark)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }}
                  >
                    CANCELAR
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                    setConfirmModal(null);
                  }}
                  style={{
                    flex: 1.2,
                    minWidth: confirmModal.type === 'confirm' ? '0' : '200px',
                    padding: '1.2rem', borderRadius: '18px',
                    background: 'transparent',
                    border: `2px solid ${confirmModal.type === 'error' ? '#ff4444' : 'var(--accent-primary)'}`,
                    color: confirmModal.type === 'error' ? '#ff4444' : 'var(--accent-primary)',
                    fontWeight: 900, fontFamily: 'Oswald', textTransform: 'uppercase', 
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = confirmModal.type === 'error' ? '#ff4444' : 'var(--accent-primary)';
                    e.currentTarget.style.color = confirmModal.type === 'error' ? 'white' : 'black';
                    e.currentTarget.style.boxShadow = confirmModal.type === 'error' ? '0 10px 20px rgba(255, 68, 68, 0.3)' : '0 10px 20px rgba(var(--accent-primary-rgb), 0.3)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = confirmModal.type === 'error' ? '#ff4444' : 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {confirmModal.type === 'confirm' ? 'CONFIRMAR' : 'ACEPTAR'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {showWizard && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowWizard(false)}>
          <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '24px', width: '100%', maxWidth: '750px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem' }}>Paso {wizardStep} de 4</div>
                <div style={{ fontFamily: 'Oswald', fontSize: '1.4rem', color: 'var(--text-main)' }}>
                  {wizardStep === 1 ? 'Nombre y Objetivo' : wizardStep === 2 ? 'Días de Entrenamiento' : wizardStep === 3 ? 'Músculos a Trabajar' : 'Selecciona Ejercicios'}
                </div>
              </div>
              <button onClick={() => setShowWizard(false)} style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '10px', width: '36px', height: '36px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>×</button>
            </div>
            <div style={{ height: '3px', background: 'var(--bg-subtle)' }}>
              <div style={{ height: '100%', width: `${(wizardStep / 4) * 100}%`, background: 'var(--accent-primary)', transition: 'width 0.4s ease', borderRadius: '2px' }} />
            </div>
            <div style={{ padding: '2rem', minHeight: '280px' }}>
              {wizardStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>Nombre de la Rutina</label>
                    <input style={inputStyle} placeholder="Ej: Pecho y Tríceps, Pierna Brutal..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.8rem' }}>Objetivo Principal</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
                      {['Fuerza', 'Hipertrofia', 'Resistencia', 'Pérdida de Peso', 'Movilidad'].map(g => {
                        const sel = form.goal === g;
                        const goalColor = GOAL_COLORS[g] || 'var(--accent-primary)';
                        const bgSel = goalColor === 'var(--accent-primary)' ? 'rgba(var(--accent-primary-rgb), 0.15)' : `${goalColor}26`;
                        return (
                          <button 
                            key={g} 
                            onClick={() => setForm(f => ({ ...f, goal: g }))} 
                            style={{ 
                              padding: '0.6rem 1.2rem', borderRadius: '10px', 
                              border: `2px solid ${sel ? goalColor : 'var(--glass-border)'}`, 
                              background: sel ? bgSel : 'transparent', 
                              color: sel ? goalColor : 'var(--text-muted)', 
                              cursor: 'pointer', fontWeight: 700, 
                              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                              fontSize: '0.9rem' 
                            }}
                            onMouseOver={e => {
                              if (!sel) {
                                e.currentTarget.style.borderColor = goalColor;
                                e.currentTarget.style.color = goalColor;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }
                            }}
                            onMouseOut={e => {
                              if (!sel) {
                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }
                            }}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {wizardStep === 2 && (
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Selecciona los días en que realizarás esta rutina:</p>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {(inicioSemana === 'lun' ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']).map(d => {
                      const sel = form.days.includes(d);
                      const goalColor = GOAL_COLORS[form.goal] || 'var(--accent-primary)';
                      const bgSel = goalColor === 'var(--accent-primary)' ? 'rgba(var(--accent-primary-rgb), 0.15)' : `${goalColor}26`;
                      return (
                        <button key={d} onClick={() => toggleDay(d)} style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: `1px solid ${sel ? goalColor : 'var(--glass-border)'}`, background: sel ? bgSel : 'var(--bg-card)', color: sel ? goalColor : 'var(--text-muted)', cursor: 'pointer', fontWeight: sel ? 700 : 500, transition: 'all 0.2s', minWidth: '60px', textAlign: 'center', fontSize: '0.95rem' }}>{d}</button>
                      );
                    })}
                  </div>
                  {form.days.length > 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.2rem' }}>{form.days.length} día{form.days.length > 1 ? 's' : ''} seleccionado{form.days.length > 1 ? 's' : ''}</p>}
                </div>
              )}
              {wizardStep === 3 && (
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>¿Qué grupos musculares vas a incluir en la rutina?</p>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {['Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Cuádriceps', 'Isquiotibiales', 'Core', 'Gemelos', 'Cardio'].map(m => {
                      const sel = form.muscles.includes(m);
                      const goalColor = GOAL_COLORS[form.goal] || 'var(--accent-primary)';
                      const bgSel = goalColor === 'var(--accent-primary)' ? 'rgba(var(--accent-primary-rgb), 0.15)' : `${goalColor}26`;
                      return (
                        <button key={m} onClick={() => toggleMuscle(m)} style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: `1px solid ${sel ? goalColor : 'var(--glass-border)'}`, background: sel ? bgSel : 'var(--bg-card)', color: sel ? goalColor : 'var(--text-muted)', cursor: 'pointer', fontWeight: sel ? 700 : 500, transition: 'all 0.2s', fontSize: '0.95rem' }}>{m}</button>
                      );
                    })}
                  </div>
                  {form.muscles.length > 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.2rem' }}>{form.muscles.length} grupo{form.muscles.length > 1 ? 's' : ''} seleccionado{form.muscles.length > 1 ? 's' : ''}</p>}
                </div>
              )}
              {wizardStep === 4 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                      Añade los ejercicios de esta rutina ({form.exercises.length} seleccionados):
                    </p>
                    <div style={{ position: 'relative', width: '250px' }}>
                      <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Buscar ejercicio..."
                        value={exerciseSearch}
                        onChange={e => setExerciseSearch(e.target.value)}
                        style={{
                          width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '10px',
                          background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
                          color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {dbExercises
                      .filter(ex => form.muscles.length === 0 || form.muscles.includes(ex.grupo_muscular) || form.muscles.includes(ex.grupo_muscular?.split(' ')[0]))
                      .filter(ex => !exerciseSearch || ex.nombre.toLowerCase().includes(exerciseSearch.toLowerCase()))
                      .map(ex => {
                        const sel = form.exercises.includes(ex.nombre);
                        const goalColor = GOAL_COLORS[form.goal] || 'var(--accent-primary)';
                        const selBorder = goalColor === 'var(--accent-primary)' ? 'rgba(var(--accent-primary-rgb), 0.5)' : `${goalColor}80`;
                        const selBg = goalColor === 'var(--accent-primary)' ? 'rgba(var(--accent-primary-rgb), 0.1)' : `${goalColor}1A`;
                        const selShadow = goalColor === 'var(--accent-primary)' ? '0 0 15px rgba(var(--accent-primary-rgb), 0.15)' : `0 0 15px ${goalColor}26`;
                        const imgBorder = goalColor === 'var(--accent-primary)' ? 'rgba(var(--accent-primary-rgb), 0.35)' : `${goalColor}59`;

                        return (
                          <div
                            key={ex.id}
                            onClick={() => toggleExercise(ex.nombre)}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem', borderRadius: '14px', border: `1px solid ${sel ? selBorder : 'var(--glass-border)'}`, background: sel ? selBg : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: sel ? selShadow : 'none' }}
                            onMouseOver={e => { if (!sel) e.currentTarget.style.background = 'var(--glass-border)'; }}
                            onMouseOut={e => { if (!sel) e.currentTarget.style.background = 'var(--bg-card)'; }}
                          >
                            <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: `1px solid ${sel ? imgBorder : 'var(--glass-border)'}`, background: 'var(--bg-dark)' }}>
                              <img src={ex.url_video || ''} alt={ex.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: sel ? 1 : 0.85 }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: sel ? 'white' : 'var(--text-main)', fontWeight: sel ? 700 : 500, fontSize: '1.05rem', lineHeight: 1.3, marginBottom: '0.2rem' }}>{ex.nombre}</div>
                              <div style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ex.grupo_muscular} • {ex.tipo}</div>
                            </div>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', border: `2px solid ${sel ? GOAL_COLORS[form.goal] : 'var(--glass-border)'}`, background: sel ? GOAL_COLORS[form.goal] : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 800, marginRight: '0.5rem' }}>
                              {sel ? '✓' : '+'}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button onClick={() => wizardStep > 1 ? setWizardStep(s => s - 1) : setShowWizard(false)} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
                {wizardStep === 1 ? 'Cancelar' : '← Atrás'}
              </button>
              {wizardStep < 4 ? (
                <button 
                  disabled={wizardStep === 1 && !form.name.trim()} 
                  onClick={() => setWizardStep(s => s + 1)} 
                  style={{ 
                    padding: '0.8rem 2.2rem', borderRadius: '14px', 
                    border: `2px solid ${form.name.trim() || wizardStep > 1 ? (GOAL_COLORS[form.goal] || 'var(--accent-primary)') : 'var(--glass-border)'}`, 
                    background: 'transparent', 
                    color: form.name.trim() || wizardStep > 1 ? (GOAL_COLORS[form.goal] || 'var(--accent-primary)') : 'var(--text-muted)', 
                    cursor: form.name.trim() || wizardStep > 1 ? 'pointer' : 'not-allowed', 
                    fontWeight: 800, fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1.5px',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                  }}
                  onMouseOver={e => {
                    if (form.name.trim() || wizardStep > 1) {
                      e.currentTarget.style.background = GOAL_COLORS[form.goal] || 'var(--accent-primary)';
                      e.currentTarget.style.color = 'black';
                      e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    }
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = form.name.trim() || wizardStep > 1 ? (GOAL_COLORS[form.goal] || 'var(--accent-primary)') : 'var(--text-muted)';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}
                >
                  Siguiente →
                </button>
              ) : (
                <button 
                  onClick={handleSave} 
                  style={{ 
                    padding: '0.8rem 2.2rem', borderRadius: '14px', 
                    border: `2px solid ${GOAL_COLORS[form.goal] || 'var(--accent-primary)'}`, 
                    background: 'transparent', color: GOAL_COLORS[form.goal] || 'var(--accent-primary)', 
                    cursor: 'pointer', fontWeight: 800, fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1.5px',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = GOAL_COLORS[form.goal] || 'var(--accent-primary)';
                    e.currentTarget.style.color = 'black';
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = GOAL_COLORS[form.goal] || 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}
                >
                  {editId !== null ? 'Guardar Cambios' : 'Crear Rutina'}
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
      {showProfileModal && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, background: theme === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowProfileModal(false)}>
          <div
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: '32px', width: '100%', maxWidth: '650px',
              padding: '3rem', position: 'relative', boxShadow: theme === 'dark' ? '0 40px 80px rgba(0,0,0,0.6)' : 'var(--card-shadow)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowProfileModal(false)} 
              style={{ 
                position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', 
                border: '2px solid var(--accent-primary)', borderRadius: '10px', width: '36px', height: '36px', 
                color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--accent-primary)';
                e.currentTarget.style.color = 'black';
                e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
              }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontFamily: 'Oswald', fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)' }}>OPERACIÓN: <span style={{ color: 'var(--accent-primary)' }}>PERFIL</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                <div
                  style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', overflow: 'hidden', boxShadow: '0 0 20px rgba(var(--accent-primary-rgb),0.3)', cursor: 'pointer', position: 'relative' }}
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  {profileForm.foto_perfil ? <img src={profileForm.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : userInitials}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0'}>
                    <Camera size={20} color="white" />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>FOTO DE PERFIL</label>
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.4rem' }}>
                    <input
                      type="text"
                      placeholder="Pegar URL o subir archivo..."
                      style={{ ...inputStyle, flex: 1 }}
                      value={profileForm.foto_perfil}
                      onChange={e => setProfileForm(f => ({ ...f, foto_perfil: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      style={{ padding: '0 1.2rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      SUBIR
                    </button>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileForm(f => ({ ...f, foto_perfil: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>NOMBRE EN CLAVE</label>
                <input
                  type="text"
                  style={{ ...inputStyle, marginTop: '0.4rem', border: !canChangeName() ? '1px solid rgba(255,255,255,0.05)' : '1px solid var(--accent-primary)', opacity: !canChangeName() ? 0.5 : 1 }}
                  value={profileForm.nombre}
                  disabled={!canChangeName()}
                  onChange={e => setProfileForm(f => ({ ...f, nombre: e.target.value }))}
                />
                {!canChangeName() && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700 }}>
                    <Info size={12} /> PROTOCOLO DE SEGURIDAD: Solo un cambio cada 60 días.
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>MANIFIESTO / BIOGRAFÍA</label>
                <textarea
                  placeholder="Define tu propósito..."
                  style={{ ...inputStyle, marginTop: '0.4rem', minHeight: '100px', resize: 'none' }}
                  value={profileForm.descripcion}
                  onChange={e => setProfileForm(f => ({ ...f, descripcion: e.target.value }))}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>UBICACIÓN</label>
                  <input type="text" placeholder="Ej. Madrid, ES" style={{ ...inputStyle, marginTop: '0.4rem' }} value={profileForm.ubicacion} onChange={e => setProfileForm(f => ({ ...f, ubicacion: e.target.value }))} />
                </div>
              </div>
              {profileError && <div style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>⚠️ {profileError}</div>}
              <button
                className="auth-btn"
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                style={{
                  marginTop: '1rem', width: '100%', padding: '1rem', borderRadius: '12px',
                  color: 'white', border: 'none', fontWeight: 800, fontFamily: 'Oswald', fontSize: '1.2rem',
                  cursor: isUpdatingProfile ? 'not-allowed' : 'pointer', transition: 'all 0.3s'
                }}
              >
                {isUpdatingProfile ? 'SINCRONIZANDO...' : 'ACTUALIZAR PERFIL'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
function AsistenteIA({ user, setConfirmModal }: { user: any, setConfirmModal: (val: any) => void }) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<string[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('default');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [deleteConvId, setDeleteConvId] = useState<string | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior
      });
    }
  };
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages]);
  useEffect(() => {
    async function loadHistory() {
      if (!user?.id) return;
      const history = await getChatMessages(user.id);
      setAllMessages(history);
      const uniqueIds = Array.from(new Set(history.map((m: any) => m.conversation_id || 'default'))).filter(Boolean) as string[];
      setConversations(uniqueIds);
      if (uniqueIds.length > 0) {
        setActiveConvId(uniqueIds[uniqueIds.length - 1]);
      } else {
        setActiveConvId(Date.now().toString());
      }
    }
    loadHistory();
  }, [user?.id]);
  useEffect(() => {
    const filtered = allMessages.filter(m => (m.conversation_id || 'default') === activeConvId);
    if (filtered.length > 0) {
      setMessages(filtered.map(m => ({ role: m.role, content: m.content })));
    } else {
      const welcomeMessage = `¡Hola, ${user.name || 'Atleta'}! Soy IA VIGORNOVA, tu asistente inteligente de entrenamiento. Estoy aquí para ayudarte con tu rutina, nutrición o cualquier duda técnica. ¿Qué vamos a forjar hoy?`;
      setMessages([{ role: 'ai', content: welcomeMessage }]);
    }
  }, [activeConvId, allMessages]);
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newUserMsgObj = { role: 'user' as const, content: userMsg, conversation_id: activeConvId };
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setAllMessages(prev => [...prev, newUserMsgObj]);
    setConversations(prev => prev.includes(activeConvId) ? prev : [...prev, activeConvId]);
    setInput('');
    setIsTyping(true);
    if (user?.id) {
      const isPinned = allMessages.filter(m => (m.conversation_id || 'default') === activeConvId).some(m => m.is_pinned);
      await saveChatMessage(user.id, 'user', userMsg, activeConvId, isPinned);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }], userContext: { name: user.name } })
        });
        const data = await res.json();
        let aiResponse = "Ha ocurrido un error al procesar tu solicitud.";
        if (data.response) {
          aiResponse = data.response;
        } else if (data.error) {
          aiResponse = "Error del servidor: " + data.error;
        }
        const newAiMsgObj = { role: 'ai' as const, content: aiResponse, conversation_id: activeConvId, is_pinned: isPinned };
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
        setAllMessages(prev => [...prev, newAiMsgObj]);
        if (user?.id && data.response) {
          await saveChatMessage(user.id, 'ai', aiResponse, activeConvId, isPinned);
        }
      } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { role: 'ai', content: "Lo siento, ha habido un error de red al intentar comunicarme." }]);
      } finally {
        setIsTyping(false);
      }
    }
  };
  const handlePin = async (e: React.MouseEvent, id: string, currentlyPinned: boolean) => {
    e.stopPropagation();
    setAllMessages(prev => prev.map(m => (m.conversation_id || 'default') === id ? { ...m, is_pinned: !currentlyPinned } : m));
    if (user?.id) {
      await togglePinConversation(user.id, id, !currentlyPinned);
    }
  };
  const handleDeleteConvClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConvId(id);
  };
  const confirmDeleteConv = async () => {
    if (!deleteConvId) return;
    const id = deleteConvId;
    setConversations(prev => prev.filter(c => c !== id));
    setAllMessages(prev => prev.filter(m => (m.conversation_id || 'default') !== id));
    if (activeConvId === id) {
      const remaining = conversations.filter(c => c !== id);
      setActiveConvId(remaining.length > 0 ? remaining[remaining.length - 1] : Date.now().toString());
    }
    setDeleteConvId(null);
    if (user?.id) {
      const res = await deleteConversation(user.id, id);
      if (!res.success) {
        setConfirmModal({ show: true, title: 'Error', message: "Error al borrar el chat: " + res.error, type: 'error' });
      }
    }
  };
  const sortedConversations = conversations.slice().reverse().sort((a, b) => {
    const pinnedA = allMessages.some(m => (m.conversation_id || 'default') === a && m.is_pinned);
    const pinnedB = allMessages.some(m => (m.conversation_id || 'default') === b && m.is_pinned);
    if (pinnedA && !pinnedB) return -1;
    if (!pinnedA && pinnedB) return 1;
    return 0;
  });
  return (
    <div className="animate-fade-in-up flex-stack-mobile" style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 120px)', maxWidth: '1200px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
      <div style={{ width: '300px', borderRight: '1px solid var(--glass-border)', background: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column' }} className="hide-mobile">
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <button 
            onClick={() => {
              const newId = Date.now().toString();
              setConversations(prev => [...prev, newId]);
              setActiveConvId(newId);
            }} 
            style={{ 
              width: '100%', padding: '1rem', 
              background: 'transparent', color: 'var(--accent-primary)', border: '2px solid var(--accent-primary)', 
              borderRadius: '16px', cursor: 'pointer', fontWeight: 900, fontFamily: 'Oswald', fontSize: '1rem', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', 
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }} 
            onMouseOver={e => { 
              e.currentTarget.style.background = 'var(--accent-primary)'; 
              e.currentTarget.style.color = 'black'; 
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; 
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(var(--accent-primary-rgb),0.4)'; 
            }} 
            onMouseOut={e => { 
              e.currentTarget.style.background = 'transparent'; 
              e.currentTarget.style.color = 'var(--accent-primary)'; 
              e.currentTarget.style.transform = 'scale(1) translateY(0)'; 
              e.currentTarget.style.boxShadow = 'none'; 
            }}
          >
            <Plus size={18} strokeWidth={3} /> NUEVO CHAT
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {sortedConversations.map((id, idx) => {
            const convMsgs = allMessages.filter(m => (m.conversation_id || 'default') === id);
            const firstUserMsg = convMsgs.find(m => m.role === 'user')?.content || `Conversación ${sortedConversations.length - idx}`;
            const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg;
            const isPinned = convMsgs.some(m => m.is_pinned);
            return (
              <div key={id} onClick={() => setActiveConvId(id)} style={{ position: 'relative', padding: '1.2rem', background: activeConvId === id ? 'rgba(var(--accent-primary-rgb),0.1)' : 'rgba(255,255,255,0.02)', border: activeConvId === id ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s' }} className="group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, paddingRight: '2rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem', color: activeConvId === id ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'break-word', fontFamily: 'Inter' }}>
                      {isPinned && <Bookmark size={12} fill="var(--accent-primary)" color="var(--accent-primary)" style={{ marginRight: '6px', display: 'inline-block' }} />}
                      {title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{convMsgs.length} MENSAJES</div>
                  </div>
                  <div style={{ position: 'absolute', top: '1.2rem', right: '1rem', display: 'flex', gap: '0.5rem', opacity: isPinned || activeConvId === id ? 1 : 0, transition: 'opacity 0.2s' }} className="group-hover:opacity-100">
                    <button 
                      onClick={(e) => handlePin(e, id, isPinned)} 
                      style={{ 
                        background: 'none', border: 'none', 
                        color: isPinned ? 'var(--accent-primary)' : 'var(--text-muted)', 
                        cursor: 'pointer', padding: '0.2rem',
                        transition: 'color 0.4s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                      onMouseOut={e => e.currentTarget.style.color = isPinned ? 'var(--accent-primary)' : 'var(--text-muted)'}
                    >
                      <Bookmark size={14} fill={isPinned ? 'currentColor' : 'none'} color="currentColor" style={{ transition: 'fill 0.4s ease' }} />
                    </button>
                    <button onClick={(e) => handleDeleteConvClick(e, id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at 50% 50%, rgba(var(--accent-primary-rgb),0.03) 0%, transparent 100%)' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(var(--bg-card-rgb), 0.01)', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #b91c1c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', boxShadow: theme === 'dark' ? '0 0 20px rgba(var(--accent-primary-rgb),0.4)' : '0 5px 15px rgba(var(--accent-primary-rgb),0.2)' }}>
                <Bot size={28} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h2 style={{ margin: 0, fontFamily: 'Oswald', fontSize: '1.8rem', color: 'var(--text-main)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>IA VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span></h2>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              v2.4.0-CORE
            </div>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '1rem' }}>
              {msg.role === 'ai' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(var(--accent-primary-rgb),0.1)', border: '1px solid rgba(var(--accent-primary-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '4px' }}>
                  <Bot size={18} color="var(--accent-primary)" />
                </div>
              )}
              <div style={{
                maxWidth: '75%', padding: '1.2rem 1.6rem', borderRadius: '24px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--accent-primary) 0%, #991b1b 100%)' : 'var(--bg-subtle)',
                color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '24px',
                borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '24px',
                lineHeight: 1.6, fontSize: '1rem',
                boxShadow: msg.role === 'user' ? '0 10px 20px rgba(var(--accent-primary-rgb),0.2)' : 'none',
                position: 'relative'
              }}>
                {msg.content}
                <div style={{ fontSize: '0.65rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', marginTop: '0.6rem', textAlign: 'right', fontWeight: 600 }}>
                  {msg.role === 'user' ? 'TÚ' : 'IA VIGORNOVA'}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(var(--accent-primary-rgb),0.1)', border: '1px solid rgba(var(--accent-primary-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '4px' }}>
                <Bot size={18} color="var(--accent-primary)" />
              </div>
              <div style={{ padding: '1.2rem 1.6rem', borderRadius: '24px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderBottomLeftRadius: '4px', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 1.5s infinite' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 1.5s infinite 0.2s' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 1.5s infinite 0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ padding: '2rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(var(--bg-card-rgb), 0.01)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1.2rem', position: 'relative' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Haz una pregunta a la IA VigorNova..."
              style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '15px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', transition: 'all 0.3s', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)' }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.background = 'var(--bg-card)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.background = 'var(--bg-subtle)'; }}
            />
            <button type="submit" disabled={!input.trim() || isTyping} style={{ width: '65px', background: input.trim() && !isTyping ? 'var(--accent-primary)' : 'var(--bg-subtle)', color: 'var(--text-main)', border: 'none', borderRadius: '20px', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed', transition: 'all 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: input.trim() && !isTyping ? '0 10px 20px rgba(var(--accent-primary-rgb),0.3)' : 'none' }} onMouseOver={e => { if (input.trim() && !isTyping) e.currentTarget.style.transform = 'scale(1.05) rotate(5deg)'; }} onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0)'}>
              <Send size={24} strokeWidth={2.5} />
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            IMPULSADO POR GEMINI 1.5 PRO · CONTEXTO DE ENTRENAMIENTO ACTIVO
          </div>
        </div>
      </div>
      {deleteConvId && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} onClick={() => setDeleteConvId(null)}>
          <div
            style={{
              background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '32px',
              padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center', color: 'var(--text-main)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 40px rgba(255, 68, 68, 0.15)', position: 'relative', overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
            className="animate-fade-in-up"
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#ff4444' 
              }}>
                <Trash2 size={36} />
              </div>

              <h3 style={{ fontFamily: 'Oswald', fontSize: '2.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>¿ELIMINAR CHAT?</h3>
              
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 300 }}>
                Esta acción es irreversible. Se borrará todo el historial de esta conversación de forma permanente.
              </p>

              <div style={{ display: 'flex', gap: '1.2rem' }}>
                <button
                  onClick={() => setDeleteConvId(null)}
                  style={{ 
                    flex: 1, padding: '1.2rem', borderRadius: '18px', 
                    border: '1px solid var(--glass-border)', background: 'transparent', 
                    color: 'var(--text-main)', cursor: 'pointer', fontWeight: 800, 
                    fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s' 
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'var(--text-main)';
                    e.currentTarget.style.color = 'var(--bg-dark)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  CANCELAR
                </button>
                <button
                  onClick={confirmDeleteConv}
                  style={{ 
                    flex: 1, padding: '1.2rem', borderRadius: '18px', 
                    border: '2px solid #ff4444', background: 'transparent', color: '#ff4444', 
                    cursor: 'pointer', fontWeight: 900, fontFamily: 'Oswald', 
                    textTransform: 'uppercase', letterSpacing: '1px', 
                    transition: 'all 0.3s' 
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#ff4444';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 68, 68, 0.3)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ff4444';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
function SidebarItem({ icon, label, isActive, onClick, badge, locked }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, badge?: number, locked?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: isActive ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'transparent',
        color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', fontWeight: isActive ? 700 : 500, borderRight: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
        position: 'relative',
        transform: 'translateX(0)'
      }}
      onMouseOver={e => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--text-main)';
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.transform = 'translateX(5px)';
        } else {
          e.currentTarget.style.transform = 'translateX(2px)';
        }
      }}
      onMouseOut={e => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s' }}>{icon}</div>
      <span style={{ flex: 1, fontFamily: 'Inter', fontSize: '0.95rem' }}>{label}</span>
      {locked && <Lock size={14} style={{ opacity: 0.4 }} />}
      {badge !== undefined && badge > 0 && (
        <span style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'var(--accent-primary)', color: 'var(--text-on-accent)', width: '22px', height: '22px', borderRadius: '50%', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 0 10px rgba(var(--accent-primary-rgb), 0.5)' }}>{badge}</span>
      )}
    </button>
  );
}
function CalendarioEntrenamientos({ user, viewDate, setViewDate, selectedDay, setSelectedDay, unidades, inicioSemana }: { user: any, viewDate: Date, setViewDate: (d: Date) => void, selectedDay: number | null, setSelectedDay: (d: number | null) => void, unidades: 'kg' | 'lbs', inicioSemana: 'lun' | 'dom' }) {
  const { theme } = useTheme();
  const [history, setHistory] = useState<any[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [modalSession, setModalSession] = useState<any>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [selectorYear, setSelectorYear] = useState(viewDate.getFullYear());
  useEffect(() => {
    async function fetchCal() {
      if (!user?.id) return;
      const data = await getUserHistory(user.id);
      setHistory(data);
    }
    fetchCal();
  }, [user]);
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const daysOfWeek = inicioSemana === 'lun' ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] : ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const monthNamesEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthNamesUpper = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOffset = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay();
    if (inicioSemana === 'dom') return day;
    return day === 0 ? 6 : day - 1;
  };
  const offset = getFirstDayOffset(viewYear, viewMonth);
  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const now = new Date();
  const todayDay = now.getDate();
  const isCurrentMonth = now.getFullYear() === viewYear && now.getMonth() === viewMonth;
  const handlePrev = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
    setSelectedDay(null);
  };
  const handleNext = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
    setSelectedDay(null);
  };
  const isPrevDisabled = false;
  const isNextDisabled = false;
  const activeDaysMap: Record<number, any[]> = {};
  history.forEach(h => {
    const d = new Date(h.created_at);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate();
      if (!activeDaysMap[day]) activeDaysMap[day] = [];
      activeDaysMap[day].push(h);
    }
  });
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const selectedSessions = selectedDay ? (activeDaysMap[selectedDay] || []) : [];
  useEffect(() => {
    setActiveSessionIndex(0);
  }, [selectedDay]);
  const currentWorkout = selectedSessions[activeSessionIndex] || null;
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < offset; i++) daysArray.push(null);
  for (let d = 1; d <= totalDays; d++) daysArray.push(d);
  const monthSessions = Object.values(activeDaysMap).flat();
  const totalSeriesMonth = monthSessions.reduce((acc, s) =>
    acc + (s.datos_ejercicios || []).reduce((a: number, ex: any) =>
      a + (ex.series || []).length, 0), 0);
  const totalVolMonth = monthSessions.reduce((acc, s) =>
    acc + (s.datos_ejercicios || []).reduce((a: number, ex: any) =>
      a + (ex.series || []).reduce((b: number, set: any) =>
        b + (parseFloat(set.peso) || 0) * (parseInt(set.repeticiones) || 0), 0), 0), 0);
  const getIntensity = (day: number): number => {
    const sessions = activeDaysMap[day];
    if (!sessions?.length) return 0;
    const sets = sessions.reduce((acc, s) =>
      acc + (s.datos_ejercicios || []).reduce((a: number, ex: any) =>
        a + (ex.series || []).length, 0), 0);
    if (sets >= 18) return 3;
    if (sets >= 9) return 2;
    return 1;
  };
  const intensityBg = ['transparent', 'rgba(var(--accent-primary-rgb), 0.12)', 'rgba(var(--accent-primary-rgb), 0.4)', 'rgba(var(--accent-primary-rgb), 0.75)'];
  const intensityBorder = ['var(--glass-border)', 'rgba(var(--accent-primary-rgb), 0.3)', 'rgba(var(--accent-primary-rgb), 0.65)', 'rgba(var(--accent-primary-rgb), 0.95)'];
  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.2rem' }}>
            <Calendar size={12} /> Registro de Actividad
          </div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '2px', margin: 0, lineHeight: 1 }}>
            Tu <span style={{ color: 'var(--accent-primary)', textShadow: theme === 'dark' ? '0 0 20px rgba(var(--accent-primary-rgb),0.3)' : 'none' }}>Calendario</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-subtle)', padding: '0.8rem 1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>INTENSIDAD:</span>
          {([1, 2, 3] as const).map(lvl => (
            <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: intensityBg[lvl], border: `1px solid ${intensityBorder[lvl]}`, boxShadow: (lvl === 3 && theme === 'dark') ? '0 0 10px rgba(var(--accent-primary-rgb), 0.3)' : 'none' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, fontFamily: 'Oswald', textTransform: 'uppercase' }}>{lvl === 1 ? 'Baja' : lvl === 2 ? 'Media' : 'Alta'}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.2rem', alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)' }}>
            <button onClick={handlePrev} disabled={isPrevDisabled}
              style={{ background: 'var(--glass-border)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isPrevDisabled ? 'not-allowed' : 'pointer', color: 'var(--text-main)', opacity: isPrevDisabled ? 0.3 : 1, transition: 'all 0.2s' }}
              onMouseOver={e => { if (!isPrevDisabled) e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb), 0.2)'; }}
              onMouseOut={e => e.currentTarget.style.background = 'var(--glass-border)'}
            ><ChevronLeft size={16} /></button>
            <div
              onClick={() => { setSelectorYear(viewYear); setShowSelector(!showSelector); }}
              style={{ position: 'relative', cursor: 'pointer', padding: '0.4rem 1rem', borderRadius: '10px', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontFamily: 'Oswald', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {monthNamesEs[viewMonth]} <span style={{ color: 'var(--accent-primary)' }}>{viewYear}</span>
                <ChevronRight size={14} style={{ transform: showSelector ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.3s', opacity: 0.5 }} />
              </div>
              {showSelector && (
                <div
                  className="animate-fade-in-up"
                  style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '0.8rem', width: '280px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '18px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 100, padding: '1rem' }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
                    <button onClick={() => setSelectorYear(prev => prev - 1)} style={{ background: 'var(--glass-border)', border: 'none', borderRadius: '6px', color: 'var(--text-main)', padding: '0.3rem 0.6rem', cursor: 'pointer' }}><ChevronLeft size={14} /></button>
                    <span style={{ fontFamily: 'Oswald', fontSize: '1.3rem', color: 'var(--accent-primary)' }}>{selectorYear}</span>
                    <button onClick={() => setSelectorYear(prev => prev + 1)} style={{ background: 'var(--glass-border)', border: 'none', borderRadius: '6px', color: 'var(--text-main)', padding: '0.3rem 0.6rem', cursor: 'pointer' }}><ChevronRight size={14} /></button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {monthNamesEs.map((m, idx) => (
                      <button
                        key={m}
                        onClick={() => {
                          setViewDate(new Date(selectorYear, idx, 1));
                          setShowSelector(false);
                          setSelectedDay(null);
                        }}
                        style={{ padding: '0.6rem 0.3rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: (idx === viewMonth && selectorYear === viewYear) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.02)', color: (idx === viewMonth && selectorYear === viewYear) ? 'black' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={e => { if (!(idx === viewMonth && selectorYear === viewYear)) e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.1)'; }}
                        onMouseOut={e => { if (!(idx === viewMonth && selectorYear === viewYear)) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      >
                        {m.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleNext} disabled={isNextDisabled}
              style={{ background: 'var(--glass-border)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isNextDisabled ? 'not-allowed' : 'pointer', color: 'var(--text-main)', opacity: isNextDisabled ? 0.3 : 1, transition: 'all 0.2s' }}
              onMouseOver={e => { if (!isNextDisabled) e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb), 0.2)'; }}
              onMouseOut={e => e.currentTarget.style.background = 'var(--glass-border)'}
            ><ChevronRight size={16} /></button>
          </div>
          <div style={{ padding: '1rem 1.2rem 1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem', marginBottom: '0.6rem' }}>
              {daysOfWeek.map(d => (
                <div key={d} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
              {daysArray.map((day, i) => {
                if (!day) return <div key={i} />;
                const intensity = getIntensity(day);
                const hasWorkout = intensity > 0;
                const isSelected = selectedDay === day;
                const isToday = isCurrentMonth && day === todayDay;
                const setsCount = (activeDaysMap[day] || []).reduce((acc, s) =>
                  acc + (s.datos_ejercicios || []).reduce((a: number, ex: any) =>
                    a + (ex.series || []).length, 0), 0);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    style={{
                      aspectRatio: '1.2', width: '100%', borderRadius: '10px', position: 'relative',
                      border: isSelected
                        ? '2px solid var(--accent-primary)'
                        : isToday
                          ? `2px solid ${theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'}`
                          : `1px solid ${intensityBorder[intensity]}`,
                      background: isSelected
                        ? `linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.2) 0%, rgba(var(--accent-primary-rgb), 0.05) 100%)`
                        : hasWorkout
                          ? `linear-gradient(135deg, ${intensityBg[intensity]} 0%, transparent 100%)`
                          : 'transparent',
                      color: hasWorkout ? (theme === 'dark' ? 'white' : 'var(--text-on-accent)') : isToday ? 'var(--text-main)' : 'var(--text-muted)',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                      fontSize: '1.1rem', fontFamily: 'Oswald', fontWeight: isToday ? 800 : 500,
                      transition: 'all 0.2s',
                      boxShadow: (isSelected && theme === 'dark') ? '0 0 10px rgba(var(--accent-primary-rgb), 0.2)' : 'none',
                      outline: 'none'
                    }}
                    onMouseOver={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(var(--accent-primary-rgb), 0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                    onMouseOut={e => { if (!isSelected) { e.currentTarget.style.borderColor = isToday ? (theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)') : intensityBorder[intensity]; e.currentTarget.style.transform = 'translateY(0)'; } }}
                  >
                    <span>{day}</span>
                    {hasWorkout && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: intensity === 3 ? '#fff' : 'var(--accent-primary)', letterSpacing: '0.5px', opacity: 0.9 }}>
                        {setsCount}S
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ position: 'sticky', top: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedSessions.length > 0 ? (
            <>
              {selectedSessions.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>SESIONES DEL DÍA</div>
                  {selectedSessions.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSessionIndex(idx)}
                      style={{
                        width: '100%', padding: '0.8rem', borderRadius: '12px', background: activeSessionIndex === idx ? 'rgba(var(--accent-primary-rgb),0.1)' : 'rgba(255,255,255,0.02)', border: activeSessionIndex === idx ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)', color: activeSessionIndex === idx ? 'white' : 'var(--text-muted)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.nombre_entrenamiento}</span>
                      <ChevronRight size={14} opacity={activeSessionIndex === idx ? 1 : 0.3} />
                    </button>
                  ))}
                </div>
              )}
              {currentWorkout && (
                <div className="animate-fade-in-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                  <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb),0.14) 0%, transparent 100%)', borderBottom: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-primary)', filter: 'blur(55px)', opacity: 0.12, pointerEvents: 'none' }} />
                    <div style={{ fontSize: '0.6rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.4rem' }}>
                      {monthNamesEs[viewMonth]} {selectedDay}, {viewYear} • Sesión {activeSessionIndex + 1}
                    </div>
                    <h2 style={{ fontFamily: 'Oswald', fontSize: '1.7rem', margin: '0 0 0.8rem 0', color: 'var(--text-main)', lineHeight: 1, textTransform: 'uppercase' }}>
                      {currentWorkout.nombre_entrenamiento}
                    </h2>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <Zap size={13} color="var(--accent-primary)" /> {(currentWorkout.datos_ejercicios || []).length} EJERCICIOS
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '1.2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Haz clic en el botón inferior para ver el desglose detallado de series, repeticiones y pesos de este entrenamiento.
                    </p>
                    <button
                      onClick={() => { setModalSession(currentWorkout); setShowResultsModal(true); }}
                      style={{ 
                        width: '100%', padding: '1rem', borderRadius: '16px', 
                        background: 'transparent', border: '2px solid var(--accent-primary)', 
                        color: 'var(--accent-primary)', fontWeight: 800, fontFamily: 'Oswald', 
                        fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '2px', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', gap: '0.8rem', 
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = 'var(--accent-primary)';
                        e.currentTarget.style.color = 'black';
                        e.currentTarget.style.transform = 'scale(1.02) translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(var(--accent-primary-rgb),0.4)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--accent-primary)';
                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <BarChart3 size={20} strokeWidth={2.5} /> VER EJERCICIOS Y SERIES
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', opacity: 0.75 }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Calendar size={30} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontFamily: 'Oswald', fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                {selectedDay ? `Día ${selectedDay} — Sin Sesión` : 'Selecciona un día'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                {selectedDay
                  ? 'No hay entrenamientos registrados para este día.'
                  : 'Haz clic en cualquier día del calendario para ver el detalle.'}
              </p>
            </div>
          )}
        </div>
      </div>
      {showResultsModal && modalSession && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setShowResultsModal(false)}
        >
          <div
            style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '28px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--glass-border)', background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb),0.1) 0%, transparent 100%)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.4rem' }}>Resultados del Entrenamiento</div>
                  <h2 style={{ fontFamily: 'Oswald', fontSize: '2.2rem', margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', lineHeight: 1 }}>{modalSession.nombre_entrenamiento}</h2>
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} /> {new Date(modalSession.created_at).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowResultsModal(false)} 
                  style={{ 
                    background: 'transparent', border: '2px solid var(--accent-primary)', borderRadius: '10px', 
                    width: '36px', height: '36px', color: 'var(--accent-primary)', cursor: 'pointer', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, 
                    marginLeft: '1rem', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'black';
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              {(() => {
                const allSeries = (modalSession.datos_ejercicios || []).flatMap((ex: any) => ex.series || []);
                const completed = allSeries;
                const totalKg = completed.reduce((a: number, s: any) => a + (parseFloat(s.peso) || 0) * (parseInt(s.repeticiones) || 0), 0);
                const totalRepsCount = completed.reduce((a: number, s: any) => a + (parseInt(s.repeticiones) || 0), 0);
                return (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Series Realizadas', value: String(completed.length), color: '#22c55e' },
                      { label: 'Repeticiones Realizadas', value: String(totalRepsCount), color: '#44ddee' },
                    ].map(stat => (
                      <div key={stat.label} style={{ flex: '1 1 110px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '0.8rem 1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontFamily: 'Oswald', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div style={{ overflowY: 'auto', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(modalSession.datos_ejercicios || []).map((ex: any, ei: number) => {
                const completed = (ex.series || []);
                const total = (ex.series || []).length;
                const maxW = Math.max(...completed.map((s: any) => parseFloat(s.peso) || 0), 0);
                return (
                  <div key={ei} style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '20px', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(var(--accent-primary-rgb),0.1)', border: '1px solid rgba(var(--accent-primary-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Oswald', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{ei + 1}</div>
                        <h3 style={{ fontFamily: 'Oswald', fontSize: '1.25rem', margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ex.ejercicio}</h3>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        {maxW > 0 && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '0.3rem 0.7rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Trophy size={13} color="#f59e0b" /> {unidades === 'lbs' ? (maxW * 2.20462).toFixed(1) : maxW}{unidades} máx</span>}
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: completed.length === total && total > 0 ? '#22c55e' : 'var(--accent-primary)', fontFamily: 'Oswald' }}>{completed.length}/{total}</span>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                        {ex.series && ex.series.length > 0 ? ex.series.map((s: any, si: number) => (
                          <div key={si} style={{
                            background: s.completado ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${s.completado ? '#22c55e44' : '#ffffff11'}`,
                            borderRadius: '16px', padding: '1.2rem 1rem', textAlign: 'center'
                          }}>
                            <div style={{ color: s.completado ? '#22c55e' : 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>SET {si + 1}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Oswald', color: 'var(--text-main)', lineHeight: 1 }}>
                              {unidades === 'lbs' ? Math.round(parseFloat(s.peso || '0') * 2.20462) : Math.round(parseFloat(s.peso || '0'))}<span style={{ fontSize: '0.8rem', marginLeft: '2px', opacity: 0.6 }}>{unidades.toUpperCase()}</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.4rem' }}>
                              {s.repeticiones || '0'} REPETICIONES
                            </div>
                          </div>
                        )) : (
                          <div style={{ gridColumn: '1 / -1', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                            No hay datos de series registrados para este ejercicio.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
function CalculadoraCalorias({ user }: { user: any }) {
  const [genero, setGenero] = useState('masculino');
  const [edad, setEdad] = useState(user.edad?.toString() || '');
  const [peso, setPeso] = useState(user.peso?.toString() || '');
  const [altura, setAltura] = useState(user.altura?.toString() || '');
  const [actividad, setActividad] = useState('1.2');
  const [objetivo, setObjetivo] = useState('ganar');
  const [resultados, setResultados] = useState<any>(null);
  const calcular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edad || !peso || !altura) return;
    let bmr = (10 * parseFloat(peso)) + (6.25 * parseFloat(altura)) - (5 * parseInt(edad));
    bmr += (genero === 'masculino' ? 5 : -161);
    const tdee = bmr * parseFloat(actividad);
    let targetKcal = tdee;
    if (objetivo === 'perder') targetKcal -= 500;
    if (objetivo === 'ganar') targetKcal += 300;
    const protGramos = parseFloat(peso) * 2.2;
    let fatGramos = parseFloat(peso) * (objetivo === 'perder' ? 0.85 : 1.0);
    const calRestantes = targetKcal - (protGramos * 4) - (fatGramos * 9);
    const carbGramos = calRestantes > 0 ? calRestantes / 4 : 0;
    setResultados({ tdee: Math.round(tdee), target: Math.round(targetKcal), prot: Math.round(protGramos), fat: Math.round(fatGramos), carb: Math.round(carbGramos) });
  };
  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit' };
  const labelStyle = { color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' };
  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Calculadora <span style={{ color: 'var(--accent-primary)' }}>Nutricional</span></h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '800px' }}>Descubre cuántas calorías precisas necesitas consumir según la fórmula científica de Mifflin-St Jeor.</p>
      </div>
      <div className="flex-stack-mobile" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
        <div style={{ flex: '1 1 400px' }}>
          <form className="glass-card" onSubmit={calcular} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Oswald', margin: 0, color: 'var(--text-main)' }}>Tus Datos Biométricos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><label style={labelStyle}>Género</label><select style={inputStyle} value={genero} onChange={e => setGenero(e.target.value)}><option value="masculino">Hombre</option><option value="femenino">Mujer</option></select></div>
              <div><label style={labelStyle}>Edad</label><input type="number" required placeholder="Ej. 25" style={inputStyle} value={edad} onChange={e => setEdad(e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><label style={labelStyle}>Peso (kg)</label><input type="number" step="0.1" required placeholder="Ej. 75" style={inputStyle} value={peso} onChange={e => setPeso(e.target.value)} /></div>
              <div><label style={labelStyle}>Altura (cm)</label><input type="number" required placeholder="Ej. 180" style={inputStyle} value={altura} onChange={e => setAltura(e.target.value)} /></div>
            </div>
            <div>
              <label style={labelStyle}>Nivel de Actividad Diaria</label>
              <select style={inputStyle} value={actividad} onChange={e => setActividad(e.target.value)}>
                <option value="1.2">Sedentario (Poco ejercicio)</option>
                <option value="1.375">Ligero (1-3 días x semana)</option>
                <option value="1.55">Moderado (3-5 días x semana)</option>
                <option value="1.725">Intenso (6-7 días x semana)</option>
                <option value="1.9">Muy Intenso (Atleta profesional)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tu Objetivo Principal</label>
              <select
                value={objetivo}
                onChange={e => setObjetivo(e.target.value)}
                style={{
                  ...inputStyle, border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)',
                  fontWeight: 'bold', transition: 'all 0.3s', cursor: 'pointer'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <option value="perder">Déficit: Perder Peso y Grasa</option>
                <option value="mantener">Mantenimiento: Mantener el Peso</option>
                <option value="ganar">Superávit: Ganar Volumen y Músculo</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>CALCULAR MACROS</button>
          </form>
        </div>
        <div style={{ flex: '1 1 400px' }}>
          {resultados ? (
            <div className="animate-fade-in-up">
              <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--accent-primary)', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Tus Calorías Diarias Objetivo</div>
                  <div style={{ fontSize: '4rem', fontFamily: 'Oswald', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1 }}>{resultados.target} <span style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}>kcal</span></div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.5 }}>
                  {objetivo === 'ganar' ? "Se sumó superávit (+300 kcal)." : objetivo === 'perder' ? "Se implementó déficit (-500 kcal)." : "Mantenimiento estable."}
                </p>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'Oswald', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Reparto de Macronutrientes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--accent-primary)' }}>
                  <div><div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Proteínas</div><div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>2.2g por Kg.</div></div><div style={{ fontSize: '1.5rem', fontFamily: 'Oswald', fontWeight: 700 }}>{resultados.prot}g</div>
                </div>
                <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #eedd44' }}>
                  <div><div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Grasas</div><div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Balance Hormonal.</div></div><div style={{ fontSize: '1.5rem', fontFamily: 'Oswald', fontWeight: 700 }}>{resultados.fat}g</div>
                </div>
                <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #44ddee' }}>
                  <div><div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Carbohidratos</div><div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Energía y Glucógeno.</div></div><div style={{ fontSize: '1.5rem', fontFamily: 'Oswald', fontWeight: 700 }}>{resultados.carb}g</div>
                </div>
              </div>
            </div>
          ) : (<div className="glass-card" style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.6 }}><Calculator size={50} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} /><h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Esperando Datos</h3></div>)}
        </div>
      </div>
    </div>
  );
}
function CrearEntrenamiento({
  user, workouts, isLoading, openCreate, openEdit, setDeleteId,
  dbExercises, inactiveRoutines, toggleActive, activeSession,
  setActiveSession, setHasCompletedToday, routinePage, setRoutinePage, routinesPerPage, setShareRoutine, setConfirmModal, unidades, inicioSemana, onSessionSaved
}: any) {
  const [sessionPrompt, setSessionPrompt] = useState<any | null>(null);
  const activeWorkouts = workouts.filter((w: any) => !inactiveRoutines.includes(w.id));
  if (activeSession) {
    return <SesionActiva user={user} workout={activeSession} onBack={() => setActiveSession(null)} setHasCompletedToday={setHasCompletedToday} setConfirmModal={setConfirmModal} unidades={unidades} onSessionSaved={onSessionSaved} />;
  }
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0', gap: '2rem' }}>
        <div className="animate-pulse" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 1.5s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Oswald', letterSpacing: '2px', textTransform: 'uppercase' }}>Analizando Arsenal...</p>
      </div>
    );
  }
  return (
    <div className="animate-fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '2px', margin: 0, lineHeight: 1 }}>
            Mis <span style={{ color: 'var(--accent-primary)' }}>Rutinas</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dumbbell size={14} color="var(--accent-primary)" /> {workouts.length > 0 ? `${activeWorkouts.length} rutina${activeWorkouts.length !== 1 ? 's' : ''} activa${activeWorkouts.length !== 1 ? 's' : ''} · Sigue construyendo tu mejor versión` : 'Comienza tu transformación creando tu primera rutina'}
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2.2rem', 
            background: 'transparent', color: 'var(--accent-primary)', 
            border: '2px solid var(--accent-primary)', borderRadius: '16px', 
            fontWeight: 800, fontSize: '1rem', cursor: 'pointer', 
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
            textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'Oswald'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'var(--accent-primary)';
            e.currentTarget.style.color = 'black';
            e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(var(--accent-primary-rgb),0.4)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus size={20} strokeWidth={3} /> CREAR ENTRENAMIENTO
        </button>
      </div>
      {workouts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Rutinas Activas', value: activeWorkouts.length, icon: <Dumbbell size={24} />, color: 'var(--accent-primary)' },
            { label: 'Días / Semana', value: [...new Set(activeWorkouts.flatMap((w: any) => w.days || w.dias || []))].length, icon: <Calendar size={24} />, color: '#a855f7' },
            { label: 'Total de ejercicios', value: activeWorkouts.reduce((s: number, w: any) => s + (w.exercises || w.ejercicios || []).length, 0), icon: <Zap size={24} />, color: '#22d3ee' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: stat.color, opacity: 0.8 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '1.8rem', fontFamily: 'Oswald', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {workouts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '24px', background: 'var(--bg-subtle)' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
              <Trophy size={50} color="var(--accent-primary)" opacity={0.5} />
            </div>
          </div>
          <h2 style={{ fontFamily: 'Oswald', fontSize: '2rem', marginBottom: '0.8rem', color: 'var(--text-main)' }}>Tu primer entrenamiento te espera</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            "El secreto del éxito es empezar." Crea tu primera rutina y da el primer paso hacia tu mejor versión.
          </p>
          <button 
            onClick={openCreate} 
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 2.5rem', 
              background: 'transparent', color: 'var(--accent-primary)', 
              border: '2px solid var(--accent-primary)', borderRadius: '18px', 
              fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'Oswald'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(var(--accent-primary-rgb),0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Plus size={24} strokeWidth={3} /> CREAR MI PRIMERA RUTINA
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.8rem' }}>
            {workouts.slice((routinePage - 1) * routinesPerPage, routinePage * routinesPerPage).map((w: any) => {
              const isInactive = inactiveRoutines.includes(w.id);
              const firstExName = w.exercises && w.exercises.length > 0 ? w.exercises[0] : '';
              const exObj = dbExercises?.find((ex: any) => ex.nombre.toLowerCase() === firstExName.toLowerCase());
              const routineImage = exObj?.url_video || exObj?.imagen_url || exObj?.url_imagen || w.image || '/images/default_workout.jpg';
              return (
                <div
                  key={w.id}
                  style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--bg-subtle)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)', cursor: 'default', opacity: isInactive ? 0.4 : 1, filter: isInactive ? 'grayscale(100%)' : 'none' }}
                  onMouseOver={e => { if (!isInactive) { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 24px 50px rgba(0,0,0,0.4), 0 0 0 1px ${w.color || 'var(--accent-primary)'}`; e.currentTarget.style.borderColor = w.color || 'var(--accent-primary)'; } }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <div style={{ height: '180px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => { if (!isInactive) setSessionPrompt(w); }}>
                    <img
                      src={routineImage}
                      alt={w.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseOver={e => { if (!isInactive) e.currentTarget.style.transform = 'scale(1.06)'; }}
                      onMouseOut={e => { if (!isInactive) e.currentTarget.style.transform = 'scale(1)'; }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = WORKOUT_IMAGES[0];
                      }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.2) 0%, rgba(0,0,0,0.7) 100%)' }} />
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: w.color, padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>{w.goal}</div>
                    <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', display: 'flex', gap: '0.4rem' }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleActive(w.id); }} title={isInactive ? "Activar Rutina" : "Desactivar Rutina"} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--glass-border)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-dark)'; }}
                      >{isInactive ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      <button onClick={(e) => { e.stopPropagation(); setShareRoutine(w); }} title="Compartir" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--glass-border)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-dark)'; }}
                      ><Share2 size={16} /></button>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(w); }} title="Editar" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--glass-border)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-dark)'; }}
                      ><Settings size={16} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteId(w.id); }} title="Eliminar" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.4)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-dark)'; }}
                      ><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div style={{ padding: '1.4rem' }}>
                    <h3 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', margin: '0 0 0.8rem 0', color: 'var(--text-main)' }}>{w.name}</h3>
                    <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Dumbbell size={13} color={w.color || 'var(--accent-primary)'} /> {w.exercises.length} ejercicios</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Timer size={13} color={w.color || 'var(--accent-primary)'} /> {w.exercises.length * 10} min</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {(inicioSemana === 'lun' ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']).map(d => {
                        const isDayActive = w.days.includes(d);
                        const activeBg = w.color === 'var(--accent-primary)' || !w.color ? 'rgba(var(--accent-primary-rgb), 0.2)' : `${w.color}33`;
                        const activeBorder = w.color === 'var(--accent-primary)' || !w.color ? 'rgba(var(--accent-primary-rgb), 0.4)' : `${w.color}66`;
                        const activeColor = w.color || 'var(--accent-primary)';
                        return (
                          <span key={d} style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, background: isDayActive ? activeBg : 'var(--bg-card)', color: isDayActive ? activeColor : 'var(--text-muted)', border: `1px solid ${isDayActive ? activeBorder : 'var(--glass-border)'}`, transition: 'all 0.2s' }}>{d}</span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {workouts.length > routinesPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <button
                disabled={routinePage === 1}
                onClick={() => setRoutinePage(prev => Math.max(1, prev - 1))}
                style={{
                  width: '45px', height: '45px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)',
                  color: routinePage === 1 ? 'var(--text-muted)' : 'white', cursor: routinePage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {Array.from({ length: Math.ceil(workouts.length / routinesPerPage) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setRoutinePage(p)}
                    style={{
                      width: '45px', height: '45px', borderRadius: '12px',
                      background: p === routinePage ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
                      border: p === routinePage ? 'none' : '1px solid var(--glass-border)',
                      color: p === routinePage ? 'black' : 'white', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                      fontFamily: 'Oswald'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={routinePage === Math.ceil(workouts.length / routinesPerPage)}
                onClick={() => setRoutinePage(prev => Math.min(Math.ceil(workouts.length / routinesPerPage), prev + 1))}
                style={{
                  width: '45px', height: '45px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)',
                  color: routinePage === Math.ceil(workouts.length / routinesPerPage) ? 'var(--text-muted)' : 'white', cursor: routinePage === Math.ceil(workouts.length / routinesPerPage) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
      {sessionPrompt && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSessionPrompt(null)}>
          <div className="animate-fade-in-up" style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '0', maxWidth: '500px', width: '100%', overflow: 'hidden', color: 'var(--text-main)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '2rem 2rem 1.5rem 2rem', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb),0.1) 0%, transparent 100%)' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(var(--accent-primary-rgb),0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid rgba(var(--accent-primary-rgb),0.2)' }}>
                <Dumbbell size={30} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>{sessionPrompt.name}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Revisa los ejercicios antes de comenzar la sesión.</p>
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="custom-scrollbar">
              {(sessionPrompt.exercises || []).map((exName: string, idx: number) => {
                const exObj = dbExercises?.find((e: any) => e.nombre.toLowerCase() === exName.toLowerCase());
                const img = exObj?.url_video || exObj?.imagen_url || exObj?.url_imagen || '/images/default_workout.jpg';
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-subtle)', padding: '0.8rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--glass-border)' }}>
                      <img src={img} alt={exName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/images/default_workout.jpg'; }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Oswald', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{exName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {exObj?.musculo_principal || 'Ejercicio'}
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!sessionPrompt.exercises || sessionPrompt.exercises.length === 0) && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay ejercicios en esta rutina.</div>
              )}
            </div>
            <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setSessionPrompt(null)} style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', flex: 1, transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Cancelar</button>
              <button className="auth-btn" onClick={() => { setActiveSession(sessionPrompt); setSessionPrompt(null); }} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', color: 'white', fontWeight: 800, cursor: 'pointer', flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Play size={18} fill="white" /> REGISTRAR SESIÓN</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
function ProgresoRendimiento({ user, setConfirmModal, unidades }: { user: any, setConfirmModal: (val: any) => void, unidades: 'kg' | 'lbs' }) {
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [lockedWeight, setLockedWeight] = useState<any>(null);
  useEffect(() => {
    async function loadStats() {
      if (!user?.id) return;
      const [weights, sessions] = await Promise.all([
        getWeightHistory(user.id),
        getUserHistory(user.id)
      ]);
      setWeightHistory(weights);
      setSessionHistory(sessions);
      setLoading(false);
    }
    loadStats();
  }, [user?.id]);
  const handleAddWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) return;
    const weightVal = parseFloat(newWeight);
    const minW = unidades === 'kg' ? 30 : 66;
    const maxW = unidades === 'kg' ? 300 : 660;
    if (weightVal < minW || weightVal > maxW) {
      setConfirmModal({
        show: true,
        title: 'Peso no válido',
        message: `Por favor, introduce un peso válido (entre ${minW} ${unidades} y ${maxW} ${unidades}).`,
        type: 'error'
      });
      return;
    }
    setIsAddingWeight(true);
    const d = new Date();
    const localIsoString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
    const weightToSave = unidades === 'lbs' ? (weightVal / 2.20462) : weightVal;
    const res = await saveWeightEntry(user.id, weightToSave, localIsoString);
    if (res.success) {
      const updated = await getWeightHistory(user.id);
      setWeightHistory(updated);
      setNewWeight('');
    }
    setIsAddingWeight(false);
  };
  const handleDeleteWeight = async (id: string) => {
    if (!id || !user?.id) return;
    const res = await deleteWeightEntry(id, user.id);
    if (res.success) {
      const updated = await getWeightHistory(user.id);
      setWeightHistory(updated);
    } else {
      setConfirmModal({ show: true, title: 'Error', message: "Error eliminando registro: " + res.error, type: 'error' });
    }
  };
  const performanceData = useMemo(() => {
    if (!sessionHistory.length) return [];
    return [...sessionHistory].reverse().map(session => {
      let totalVolume = 0;
      let totalReps = 0;
      session.datos_ejercicios?.forEach((ex: any) => {
        const exName = ex.ejercicio || ex.nombre;
        ex.series?.forEach((s: any) => {
          totalVolume += (parseFloat(s.peso) || 0) * (parseInt(s.repeticiones) || 0);
          totalReps += (parseInt(s.repeticiones) || 0);
        });
      });
      return {
        fecha: new Date(session.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        volumen: Math.round(totalVolume),
        media: totalReps > 0 ? Math.round(totalVolume / totalReps) : 0,
        fullDate: new Date(session.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
      };
    });
  }, [sessionHistory]);
  const exerciseData = useMemo(() => {
    if (!sessionHistory.length) return [];
    const data: any[] = [];
    [...sessionHistory].reverse().forEach(session => {
      const exFound = session.datos_ejercicios?.find((e: any) => {
        const name = e.ejercicio || e.nombre;
        return name && name.toLowerCase() === selectedExercise.toLowerCase();
      });
      if (exFound && exFound.series?.length > 0) {
        const maxWeight = Math.max(...exFound.series.map((s: any) => parseFloat(s.peso) || 0));
        data.push({
          fecha: new Date(session.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
          peso: maxWeight,
          reps: exFound.series[0].repeticiones,
          fullDate: new Date(session.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          isoDate: session.created_at
        });
      }
    });
    return data;
  }, [sessionHistory, selectedExercise]);
  const allExerciseNames = useMemo(() => {
    const names = new Set<string>();
    sessionHistory.forEach(s => {
      s.datos_ejercicios?.forEach((e: any) => {
        const name = e.ejercicio || e.nombre;
        if (name) names.add(name);
      });
    });
    return Array.from(names).filter(n => n && typeof n === 'string' && n.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [sessionHistory, searchQuery]);
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)', fontFamily: 'Oswald', fontSize: '1.5rem', letterSpacing: '2px' }}>SINCRONIZANDO NÚCLEO DE DATOS...</div>;
  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontFamily: 'Oswald', textTransform: 'uppercase', color: 'var(--text-main)', margin: 0, letterSpacing: '2px' }}>PROGRESO <span style={{ color: 'var(--accent-primary)' }}>Y RENDIMIENTO</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Análisis biométrico y táctico de tu evolución física.</p>
      </div>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Evolución de Peso</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>Seguimiento antropométrico mensual</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="number"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                style={{ 
                  width: '95px', padding: '0.75rem 1rem', borderRadius: '10px', 
                  background: 'var(--bg-subtle)', border: '2px solid var(--glass-border)', 
                  color: 'var(--text-main)', textAlign: 'center', outline: 'none',
                  fontSize: '1.1rem', fontWeight: 700, transition: 'all 0.3s'
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.05)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
              />
              <button
                onClick={handleAddWeight}
                disabled={isAddingWeight}
                style={{ 
                  padding: '0.85rem 2.2rem', borderRadius: '14px', 
                  background: 'transparent', border: '2px solid var(--accent-primary)', 
                  color: 'var(--accent-primary)', fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1.5px',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={e => {
                  if (!isAddingWeight) {
                    e.currentTarget.style.background = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'black';
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(var(--accent-primary-rgb),0.3)';
                  }
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isAddingWeight ? '...' : 'REGISTRAR NUEVO PESO'}
              </button>
            </div>
          </div>
          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            {lockedWeight && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(var(--accent-primary-rgb),0.4)', padding: '1rem 1.2rem', borderRadius: '14px', boxShadow: '0 0 24px rgba(var(--accent-primary-rgb),0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '160px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{lockedWeight.fullDate}</span>
                  <button onClick={() => setLockedWeight(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0 }}>X</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 900, fontSize: '1.2rem' }}>{unidades === 'lbs' ? Math.round(lockedWeight.peso * 2.20462) : Math.round(lockedWeight.peso)} {unidades.toUpperCase()}</span>
                  <button onClick={() => { handleDeleteWeight(lockedWeight.id); setLockedWeight(null); }} style={{ background: 'rgba(var(--accent-primary-rgb),0.15)', border: '1px solid rgba(var(--accent-primary-rgb),0.4)', color: 'var(--accent-primary)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'Oswald', textTransform: 'uppercase' }}>Eliminar</button>
                </div>
              </div>
            )}
            {weightHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weightHistory.map((w: any, idx: number) => ({
                    ...w,
                    displayPeso: unidades === 'lbs' ? Math.round(w.peso * 2.20462) : Math.round(w.peso),
                    fullDate: new Date(w.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    isoDate: w.fecha + '_' + idx
                  }))}
                  margin={{ left: 20, right: 10, top: 10, bottom: 0 }}
                  onClick={(cd: any) => { if (cd && cd.activePayload && cd.activePayload.length) setLockedWeight(cd.activePayload[0].payload); }}
                >
                  <defs><linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="isoDate" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => { const d = val.split('_')[0]; return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }); }} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} unit={` ${unidades.toUpperCase()}`} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length && !lockedWeight) {
                      const d = payload[0].payload;
                      const val = payload[0].value as number;
                      return (
                        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
                          <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>{d.fullDate}</p>
                          <p style={{ margin: 0, color: 'var(--accent-primary)', fontWeight: 900, fontSize: '1rem' }}>{Math.round(val)} {unidades.toUpperCase()}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Area type="monotone" dataKey="displayPeso" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPeso)" dot={{ fill: 'var(--accent-primary)', r: 5, cursor: 'pointer' }} activeDot={{ r: 8, fill: 'var(--accent-primary)', stroke: 'white', strokeWidth: 2, cursor: 'pointer' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No hay datos de peso registrados.</div>
            )}
          </div>
          {weightHistory.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.75rem' }}>Registros - pulsa X para eliminar</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {[...weightHistory].reverse().map((w: any) => (
                  <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-subtle)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.4rem 0.7rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(w.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{unidades === 'lbs' ? Math.round(w.peso * 2.20462) : Math.round(w.peso)} {unidades}</span>
                    <button onClick={() => handleDeleteWeight(w.id)} style={{ background: 'none', border: 'none', color: 'rgba(var(--accent-primary-rgb),0.7)', cursor: 'pointer', fontSize: '0.85rem', padding: '0 2px', lineHeight: 1 }} title="Eliminar">X</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="glass-card" style={{ padding: '3rem' }}>
        <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            {selectedExercise && (
              <button
                onClick={() => setSelectedExercise('')}
                style={{ background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '0.6rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '0.2rem' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.1)'; e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-primary-rgb),0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                title="Volver a seleccionar ejercicio"
              >
                <ArrowLeft size={22} />
              </button>
            )}
            <div>
              <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Análisis por Ejercicio</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>Consulta tu 1RM estimado y evolución de fuerza específica.</p>
            </div>
          </div>
          <div style={{ width: '350px', position: 'relative' }}>
            <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Buscar ejercicio..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
            {searchQuery && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                {allExerciseNames.length > 0 ? allExerciseNames.map(name => (
                  <div
                    key={name}
                    onClick={() => { setSelectedExercise(name); setSearchQuery(''); }}
                    style={{ padding: '0.8rem 1.2rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.1)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {name}
                  </div>
                )) : (
                  <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No se encontraron ejercicios con datos.</div>
                )}
              </div>
            )}
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>
              {selectedExercise ? `Viendo: ${selectedExercise}` : 'Esperando selección...'}
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: '550px' }}>
          {exerciseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={exerciseData.map(d => ({
                  ...d,
                  displayPeso: unidades === 'lbs' ? Math.round(d.peso * 2.20462) : Math.round(d.peso)
                }))}
                margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorEx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="isoDate"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} unit={` ${unidades.toUpperCase()}`} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                          <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{payload[0].payload.fullDate}</p>
                          <p style={{ margin: 0, color: '#f59e0b', fontWeight: 900, fontSize: '1.2rem' }}>{Math.round(payload[0].value as number)} {unidades.toUpperCase()}</p>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{payload[0].payload.reps} Repeticiones</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="displayPeso" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorEx)" dot={{ fill: '#f59e0b', r: 5 }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', gap: '1rem' }}>
              {selectedExercise ? (
                <>
                  <Dumbbell size={40} opacity={0.3} />
                  <div>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Sin registros tácticos</p>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>No hemos encontrado series grabadas para "{selectedExercise}".</p>
                  </div>
                </>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px' }}>Tus Ejercicios</p>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem' }}>Selecciona uno para ver su evolución</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', overflowY: 'auto', flex: 1, padding: '0.5rem', alignContent: 'flex-start' }}>
                    {allExerciseNames.length > 0 ? allExerciseNames.map(name => (
                      <div
                        key={name}
                        onClick={() => setSelectedExercise(name)}
                        className="workout-card-hover"
                        style={{
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '12px',
                          padding: '1.2rem 1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '180px',
                          flex: '1 1 auto',
                          maxWidth: '280px'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb), 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(var(--accent-primary-rgb), 0.4)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderColor = 'var(--glass-border)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{name}</span>
                      </div>
                    )) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '3rem', width: '100%' }}>
                        <Dumbbell size={40} opacity={0.3} />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Aún no tienes registros de ejercicios.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function DailyProgressCard({ label, value, goal, unit, color }: { label: string, value: number, goal: number, unit: string, color: string }) {
  const percent = Math.min((value / goal) * 100, 100);
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{value}{unit} / <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{goal}{unit}</span></span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color, transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 15px ${color}33` }} />
      </div>
    </div>
  );
}
function InicioOverview({ user, workouts, isLoading, openEdit, setWizardStep, setDeleteId, inactiveRoutines = [], setActiveSession, setActiveTab, hasCompletedToday, onRemoveAssignment, theme, inicioSemana, history = [], setHistoryTabSessionId }: any) {
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);

  const DAYS_MAP = inicioSemana === 'lun' ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const serverTime = new Date();
  const todayIndex = serverTime.getDay();
  const todayMapIdx = inicioSemana === 'lun' ? (todayIndex === 0 ? 6 : todayIndex - 1) : todayIndex;
  const todayLabel = DAYS_MAP[todayMapIdx];
  const todayWorkouts = workouts.filter((w: any) => w.days.includes(todayLabel) && !inactiveRoutines.includes(w.id));

  const tomorrowMapIdx = (todayMapIdx + 1) % 7;
  const tomorrowLabel = DAYS_MAP[tomorrowMapIdx];
  const tomorrowWorkouts = workouts.filter((w: any) => w.days.includes(tomorrowLabel) && !inactiveRoutines.includes(w.id));

  // KPI Calculations
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  const day = now.getDay();
  const diff = inicioSemana === 'dom' ? day : (day === 0 ? 6 : day - 1);
  startOfWeek.setDate(now.getDate() - diff);

  const weekHistory = history.filter((h: any) => new Date(h.created_at) >= startOfWeek);

  const totalScheduledThisWeek = DAYS_MAP.reduce((acc, day) => {
    const dayWorkouts = workouts.filter((w: any) => w.days.includes(day) && !inactiveRoutines.includes(w.id));
    return acc + (dayWorkouts.length > 0 ? 1 : 0);
  }, 0);

  const completedThisWeek = weekHistory.length;
  const pendingThisWeek = Math.max(0, totalScheduledThisWeek - completedThisWeek);

  // Workout-based Streak Calculation
  const getWorkoutStreak = () => {
    const scheduledDayIndices = DAYS_MAP.reduce((acc: number[], day, idx) => {
      if (workouts.some((w: any) => w.days.includes(day) && !inactiveRoutines.includes(w.id))) {
        acc.push(idx);
      }
      return acc;
    }, []);

    if (scheduledDayIndices.length === 0 || history.length === 0) return 0;

    let streak = 0;
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const d = new Date(checkDate);
      d.setDate(checkDate.getDate() - i);

      const dayIdx = d.getDay();
      const mapIdx = inicioSemana === 'lun' ? (dayIdx === 0 ? 6 : dayIdx - 1) : dayIdx;

      if (scheduledDayIndices.includes(mapIdx)) {
        const isDone = history.some((h: any) => {
          const hDate = new Date(h.created_at);
          return hDate.getDate() === d.getDate() && hDate.getMonth() === d.getMonth() && hDate.getFullYear() === d.getFullYear();
        });

        if (isDone) {
          streak++;
        } else {
          // If today is scheduled but not done, don't break yet
          if (i === 0) continue;
          // Missed a past scheduled workout
          if (streak === 0) return 0;
          break;
        }
      }
    }
    return streak;
  };

  const isCompletedToday = history.some((h: any) => {
    const hDate = new Date(h.created_at);
    return hDate.getDate() === now.getDate() && hDate.getMonth() === now.getMonth() && hDate.getFullYear() === now.getFullYear();
  });

  const currentStreak = getWorkoutStreak();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0', gap: '2rem' }}>
        <div className="animate-pulse" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 1.5s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Oswald', letterSpacing: '2px', textTransform: 'uppercase' }}>Sincronizando Nexos...</p>
      </div>
    );
  }

  const kpiStyle: React.CSSProperties = {
    flex: 1,
    padding: '1.5rem',
    borderRadius: '20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--glass-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    minWidth: '220px',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Reduced Hero Section */}
      <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="text-center-mobile">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'inherit', gap: '0.6rem', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.3rem' }}>
            <Zap size={14} fill="var(--accent-primary)" /> ESTADO DE MISIÓN
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, lineHeight: 1, color: 'var(--text-main)' }}>
            CENTRO <span style={{ color: 'var(--accent-primary)' }}>DE MANDO</span>
          </h1>
        </div>
        <div style={{ textAlign: 'right' }} className="text-center-mobile">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</div>
          <div style={{ fontSize: '1.2rem', fontFamily: 'Oswald', color: 'var(--accent-primary)', letterSpacing: '1px' }}>VIGORNOVA v1.1</div>
        </div>
      </div>

      {/* KPI Section */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }} className="flex-stack-mobile">
        <div style={kpiStyle} className="hover-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <Calendar size={14} /> SEMANA ACTUAL
          </div>
          <div style={{ fontSize: '2rem', fontFamily: 'Oswald', fontWeight: 900, color: 'var(--text-main)' }}>{pendingThisWeek} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>PENDIENTES</span></div>
        </div>
        <div style={kpiStyle} className="hover-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <Flame size={14} /> RACHA ACTUAL
          </div>
          <div style={{ fontSize: '2rem', fontFamily: 'Oswald', fontWeight: 900, color: '#f59e0b' }}>{currentStreak} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ENTRENOS</span></div>
        </div>
        <div style={kpiStyle} className="hover-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <Trophy size={14} /> ENTRENOS COMPLETADOS
          </div>
          <div style={{ fontSize: '2rem', fontFamily: 'Oswald', fontWeight: 900, color: 'var(--accent-primary)' }}>{completedThisWeek}/{totalScheduledThisWeek}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Nexo Semanal (Full Width) */}
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '32px' }}>
          <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
              <Activity size={24} color="var(--accent-primary)" /> NEXO SEMANAL
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }} className="flex-stack-mobile">
              <button 
                onClick={() => setActiveTab('progreso')} 
                style={{ 
                  padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', borderRadius: '12px',
                  background: 'transparent', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', 
                  fontFamily: 'Oswald', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = 'black'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <BarChart3 size={16} /> RENDIMIENTO
              </button>
              <button 
                onClick={() => setActiveTab('crear')} 
                style={{ 
                  padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', borderRadius: '12px',
                  background: 'transparent', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', 
                  fontFamily: 'Oswald', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = 'black'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Dumbbell size={16} /> MIS RUTINAS
              </button>
            </div>
          </div>
          <div className="grid-seven-res" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
            {DAYS_MAP.map((day, idx) => {
              const dayWorkouts = workouts.filter((w: any) => w.days.includes(day) && !inactiveRoutines.includes(w.id));
              const isToday = todayLabel === day;
              const dayDate = new Date(startOfWeek);
              dayDate.setDate(startOfWeek.getDate() + idx);
              const isCompleted = history.some((h: any) => {
                const hDate = new Date(h.created_at);
                return hDate.getDate() === dayDate.getDate() && hDate.getMonth() === dayDate.getMonth() && hDate.getFullYear() === dayDate.getFullYear();
              });
              const isRest = dayWorkouts.length === 0;
              const status = isCompleted ? 'completado' : (isRest ? 'descanso' : 'pendiente');

              return (
                <div key={day} style={{
                  padding: '1.2rem',
                  borderRadius: '24px',
                  background: isToday ? 'linear-gradient(180deg, rgba(var(--accent-primary-rgb), 0.1) 0%, var(--bg-card) 100%)' : 'var(--bg-subtle)',
                  border: `2px solid ${isToday ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                  boxShadow: isToday ? '0 10px 30px rgba(var(--accent-primary-rgb), 0.15)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                  minHeight: '200px'
                }}
                  className="day-card-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isToday ? 'var(--accent-primary)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{day}</div>
                      <div style={{ fontSize: '0.65rem', color: isToday ? 'var(--text-main)' : 'var(--text-muted)', opacity: 0.6, fontWeight: 600 }}>{dayDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    </div>
                    {isToday && (
                      <div style={{ background: 'var(--accent-primary)', color: 'black', fontSize: '0.6rem', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '4px', letterSpacing: '1px' }}>HOY</div>
                    )}
                    {isCompleted && <CheckCircle2 size={16} color="#22c55e" />}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {dayWorkouts.map((w: any) => (
                      <div
                        key={w.id}
                        onClick={() => setSelectedWorkout({ ...w, clickedDay: day })}
                        className="workout-card-hover"
                        style={{
                          padding: '0.8rem', borderRadius: '14px', background: 'rgba(0,0,0,0.2)',
                          border: '1px solid var(--glass-border)', cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        <div style={{ fontSize: '0.9rem', fontFamily: 'Oswald', color: 'var(--text-main)', textTransform: 'uppercase', lineHeight: 1.2 }}>{w.name}</div>
                        <div style={{ fontSize: '0.7rem', color: GOAL_COLORS[w.goal] || 'var(--text-muted)', marginTop: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>{w.goal}</div>
                      </div>
                    ))}
                    {dayWorkouts.length === 0 && (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                        <Moon size={32} />
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: status === 'completado' ? '#22c55e' : (status === 'descanso' ? 'var(--text-muted)' : 'var(--accent-primary)') }}>
                    {status === 'completado' ? 'HECHO' : status.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Cards: Sesión de Hoy & Siguiente Ciclo */}
        <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>

          {/* ── SESIÓN DE HOY ── */}
          <div className="glass-card" style={{
            padding: '2.5rem',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.04) 0%, var(--bg-card) 50%)',
            border: '1px solid rgba(var(--accent-primary-rgb), 0.2)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            {/* Accent glow blob */}
            <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '200px', height: '200px', background: 'var(--accent-primary)', opacity: 0.04, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

            {/* Header badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.8rem' }}>
              <div style={{ width: '28px', height: '2px', background: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '4px' }}>SESIÓN DE HOY</span>
            </div>

            {todayWorkouts.length > 0 ? (
              <>
                {/* Title + Mini Calendar Row */}
                <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem', gap: '1rem' }}>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 12vw, 5rem)', fontFamily: 'Oswald', textTransform: 'uppercase', margin: 0, lineHeight: 1, color: 'var(--text-main)', letterSpacing: '-1px' }}>
                    {todayWorkouts[0].name.split(' ').map((word: string, i: number) => (
                      <span key={i} style={{ display: 'block', color: i === 0 ? 'var(--text-main)' : 'var(--accent-primary)' }}>{word}</span>
                    ))}
                  </h2>

                  {/* Mini Calendar — today */}
                  {(() => {
                    const dayNum = serverTime.getDate();
                    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
                    const monthStr = monthNames[serverTime.getMonth()];
                    const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                    const dayStr = dayNames[serverTime.getDay()];
                    return (
                      <div style={{ flexShrink: 0, borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--glass-border)', width: '62px' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '0.25rem 0', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.55rem', fontWeight: 900, color: 'black', letterSpacing: '2px', textTransform: 'uppercase' }}>{monthStr}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.4rem 0.3rem', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Oswald', lineHeight: 1 }}>{dayNum}</div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginTop: '0.1rem' }}>{dayStr}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Metric chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
                  {[
                    { icon: <Dumbbell size={16} color="var(--accent-primary)" />, label: 'Ejercicios', value: todayWorkouts[0].exercises.length },
                    { icon: <Activity size={16} color="var(--accent-primary)" />, label: 'Enfoque', value: todayWorkouts[0].goal },
                    { icon: <Zap size={16} color="var(--accent-primary)" />, label: 'Músculos', value: (todayWorkouts[0].muscles && todayWorkouts[0].muscles.length > 0) ? todayWorkouts[0].muscles.join(', ') : 'Varios' },
                  ].map((chip, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.6rem 1rem' }}>
                      {chip.icon}
                      <div>
                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{chip.label}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{chip.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main action button — full width at bottom */}
                <button
                  onClick={() => { if (!isCompletedToday) { setActiveSession(todayWorkouts[0]); setActiveTab('crear'); } }}
                  disabled={isCompletedToday}
                  style={{
                    width: '100%',
                    padding: '1.2rem 2rem',
                    borderRadius: '16px',
                    background: isCompletedToday ? 'rgba(34,197,94,0.12)' : 'transparent',
                    color: isCompletedToday ? '#22c55e' : 'var(--accent-primary)',
                    border: isCompletedToday ? '1px solid rgba(34,197,94,0.3)' : '2px solid var(--accent-primary)',
                    fontWeight: 900, fontFamily: 'Oswald', fontSize: '1.2rem',
                    cursor: isCompletedToday ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: isCompletedToday ? 'none' : '0 10px 30px rgba(0,0,0,0.5)',
                    textTransform: 'uppercase', letterSpacing: '2px',
                    marginBottom: isCompletedToday ? '0.8rem' : 0
                  }}
                  onMouseOver={e => { if (!isCompletedToday) { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 15px 45px rgba(var(--accent-primary-rgb), 0.5)'; e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = 'black'; } }}
                  onMouseOut={e => { if (!isCompletedToday) { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-primary)'; } }}
                >
                  {isCompletedToday ? <><CheckCircle2 size={24} /><span>SESIÓN COMPLETADA</span></> : <><Play size={24} fill="currentColor" /><span>COMENZAR ENTRENAMIENTO</span></>}
                </button>

                {isCompletedToday && (
                  <button
                    onClick={() => {
                      const today = new Date();
                      const todaySession = history.find((h: any) => {
                        const d = new Date(h.created_at);
                        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
                      });
                      if (todaySession) { setHistoryTabSessionId(todaySession.id); setActiveTab('historial'); }
                    }}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '0.7rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s', fontFamily: 'Oswald', textTransform: 'uppercase' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <History size={16} /> VER HISTORIAL
                  </button>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
                  <Moon size={28} opacity={0.4} />
                </div>
                <div>
                  <h3 style={{ fontSize: '2.2rem', fontFamily: 'Oswald', margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', lineHeight: 1 }}>DESCANSO</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 400 }}>El descanso es muy importante, no lo olvides.</p>
                </div>
              </div>
            )}
          </div>



          {/* ── SIGUIENTE CICLO ── */}
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: '32px',
              background: tomorrowWorkouts.length > 0
                ? 'linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.04) 0%, var(--bg-card) 50%)'
                : 'var(--bg-card)',
              border: `1px solid ${tomorrowWorkouts.length > 0 ? 'rgba(var(--accent-primary-rgb), 0.2)' : 'var(--glass-border)'}`,
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Accent glow blob */}
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'var(--accent-primary)', opacity: 0.04, borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />

            {/* Header badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.8rem' }}>
              <div style={{ width: '28px', height: '2px', background: tomorrowWorkouts.length > 0 ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: tomorrowWorkouts.length > 0 ? 'var(--accent-primary)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '4px' }}>SIGUIENTE SESIÓN</span>
            </div>

            {tomorrowWorkouts.length > 0 ? (
              <>
                {/* Title + Mini Calendar Row */}
                <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 8vw, 3rem)', fontFamily: 'Oswald', textTransform: 'uppercase', margin: '0 0 0.4rem', lineHeight: 1, color: 'var(--text-main)' }}>
                      {tomorrowWorkouts[0].name}
                    </h2>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: GOAL_COLORS[tomorrowWorkouts[0].goal] || 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                      {tomorrowWorkouts[0].goal}
                    </span>
                  </div>

                  {/* Mini Calendar */}
                  {(() => {
                    const tomorrowDate = new Date(serverTime);
                    tomorrowDate.setDate(serverTime.getDate() + 1);
                    const dayNum = tomorrowDate.getDate();
                    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
                    const monthStr = monthNames[tomorrowDate.getMonth()];
                    const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                    const dayStr = dayNames[tomorrowDate.getDay()];
                    return (
                      <div style={{ flexShrink: 0, borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--glass-border)', width: '62px' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '0.25rem 0', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.55rem', fontWeight: 900, color: 'black', letterSpacing: '2px', textTransform: 'uppercase' }}>{monthStr}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.4rem 0.3rem', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Oswald', lineHeight: 1 }}>{dayNum}</div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginTop: '0.1rem' }}>{dayStr}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Chips row */}
                <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
                  {[
                    { icon: <Dumbbell size={14} color="var(--accent-primary)" />, label: 'Ejercicios', value: tomorrowWorkouts[0].exercises?.length ?? '—' },
                    { icon: <Activity size={14} color="var(--accent-primary)" />, label: 'Enfoque', value: tomorrowWorkouts[0].goal },
                    { icon: <Zap size={14} color="var(--accent-primary)" />, label: 'Músculos', value: (tomorrowWorkouts[0].muscles && tomorrowWorkouts[0].muscles.length > 0) ? tomorrowWorkouts[0].muscles.join(', ') : 'Varios' },
                  ].map((chip, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '0.5rem 0.9rem' }}>
                      {chip.icon}
                      <div>
                        <div style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{chip.label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{chip.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ver Ejercicios button */}
                <button
                  onClick={() => setSelectedWorkout({ ...tomorrowWorkouts[0], clickedDay: tomorrowLabel })}
                  style={{
                    width: '100%',
                    padding: '1.2rem 2rem',
                    borderRadius: '16px',
                    background: 'transparent',
                    color: 'var(--accent-primary)',
                    border: '2px solid var(--accent-primary)',
                    fontWeight: 900, fontFamily: 'Oswald', fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    textTransform: 'uppercase', letterSpacing: '2px'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 15px 45px rgba(var(--accent-primary-rgb), 0.5)'; e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = 'black'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                >
                  <Eye size={24} /> VER EJERCICIOS
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
                  <Moon size={28} opacity={0.35} />
                </div>
                <div>
                  <h3 style={{ fontSize: '2rem', fontFamily: 'Oswald', margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', lineHeight: 1 }}>DESCANSO</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem', fontWeight: 400 }}>Recuperación activa y optimización muscular.</p>
                </div>
              </div>
            )}
          </div>

        </div>


      </div>

      {/* Selected Workout Modal (Portal) */}
      {selectedWorkout && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, background: theme === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(15px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedWorkout(null)}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              borderRadius: '32px',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: theme === 'dark' ? '0 50px 100px rgba(0,0,0,0.8), 0 0 50px rgba(var(--accent-primary-rgb),0.1)' : 'var(--card-shadow)'
            }}
            onClick={e => e.stopPropagation()}
            className="animate-fade-in-up"
          >
            <div style={{ padding: '3rem', position: 'relative', borderBottom: '1px solid var(--glass-border)' }}>
              <button 
                onClick={() => setSelectedWorkout(null)} 
                style={{ 
                  position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', 
                  border: '2px solid var(--accent-primary)', borderRadius: '12px', width: '45px', height: '45px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  color: 'var(--accent-primary)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'black';
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <X size={24} />
              </button>
              <h2 style={{ fontSize: '3.5rem', fontFamily: 'Oswald', textTransform: 'uppercase', margin: 0, color: 'var(--text-main)', lineHeight: 1 }}>{selectedWorkout.name}</h2>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700 }}><Activity size={18} /> {selectedWorkout.goal}</div>
              </div>
            </div>
            <div style={{ padding: '3rem', overflowY: 'auto', flex: 1 }}>
              <h4 style={{ fontFamily: 'Oswald', fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--accent-primary)', letterSpacing: '1px' }}>SECUENCIA DE MOVIMIENTO</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                {selectedWorkout.exercises.map((ex: string, i: number) => (
                  <div key={i} style={{ padding: '1.2rem', background: 'var(--bg-subtle)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 900, fontFamily: 'Oswald', fontSize: '1.2rem', opacity: 0.5 }}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{ex}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {(() => {
                  const todayEntry = history.find((h: any) => {
                    const d = new Date(h.created_at);
                    const now = new Date();
                    return h.nombre_entrenamiento === selectedWorkout.name &&
                      d.getDate() === now.getDate() &&
                      d.getMonth() === now.getMonth() &&
                      d.getFullYear() === now.getFullYear();
                  });

                  return todayEntry ? (
                    <button
                      onClick={async () => {
                        if (confirm('¿Quieres eliminar el registro de esta sesión?')) {
                          const res = await deleteHistoryEntry(todayEntry.id, user.id);
                          if (res.success) {
                            window.location.reload();
                          }
                        }
                      }}
                      style={{ 
                        padding: '1.5rem', borderRadius: '20px', 
                        background: 'transparent', border: '2px solid #ff4444', 
                        color: '#ff4444', cursor: 'pointer', fontWeight: 900, 
                        fontFamily: 'Oswald', fontSize: '1.2rem', textTransform: 'uppercase', 
                        letterSpacing: '1px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = '#ff4444';
                        e.currentTarget.style.color = 'black';
                        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(255,68,68,0.3)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#ff4444';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      ELIMINAR REGISTRO
                    </button>
                  ) : (
                    <button
                      onClick={() => { setActiveSession(selectedWorkout); setActiveTab('crear'); setSelectedWorkout(null); }}
                      style={{ 
                        padding: '1.5rem', borderRadius: '20px', 
                        background: 'transparent', border: '2px solid var(--accent-primary)', 
                        color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 900, 
                        fontFamily: 'Oswald', fontSize: '1.2rem', textTransform: 'uppercase', 
                        letterSpacing: '1px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = 'var(--accent-primary)';
                        e.currentTarget.style.color = 'black';
                        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(var(--accent-primary-rgb),0.3)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--accent-primary)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      REGISTRAR SESIÓN
                    </button>
                  );
                })()}
                <button
                  onClick={() => { if (selectedWorkout.clickedDay && onRemoveAssignment) onRemoveAssignment(selectedWorkout.id, selectedWorkout.clickedDay); setSelectedWorkout(null); }}
                  style={{ 
                    padding: '1.5rem', borderRadius: '20px', 
                    background: 'transparent', border: '2px solid var(--glass-border)', 
                    color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 700, 
                    fontFamily: 'Oswald', textTransform: 'uppercase', 
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'var(--glass-border)';
                    e.currentTarget.style.color = 'var(--text-main)';
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                  }}
                >
                  QUITAR DEL DÍA
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx>{`
        .hover-glow:hover {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 10px 30px rgba(var(--accent-primary-rgb), 0.1);
          transform: translateY(-2px);
        }
        .day-card-hover:hover {
          transform: translateY(-4px);
          border-color: var(--accent-primary) !important;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .workout-card-hover:hover {
          background: rgba(var(--accent-primary-rgb), 0.15) !important;
          transform: scale(1.02);
          border-color: rgba(var(--accent-primary-rgb), 0.3) !important;
        }
      `}</style>
    </div>
  );
}
function HistorialEntrenamientos({ user, onNavigateToCalendar, setConfirmModal, dbExercises = [], unidades, theme, initialSessionId }: { user: any, onNavigateToCalendar: (date: Date, day: number) => void, setConfirmModal: (val: any) => void, dbExercises?: any[], unidades: 'kg' | 'lbs', theme: 'light' | 'dark', initialSessionId?: string | null }) {
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<any>('TODOS');
  const [deleteHistoryId, setDeleteHistoryId] = useState<string | null>(null);
  const muscles = useMemo(() => {
    const m = new Set<string>();
    dbExercises.forEach((ex: any) => {
      if (ex.grupo_muscular) m.add(ex.grupo_muscular);
    });
    return ['TODOS', ...Array.from(m).sort()];
  }, [dbExercises]);
  const availableMonths = useMemo(() => {
    const m = new Set<string>();
    history.forEach((item: any) => {
      const month = new Date(item.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
      m.add(month);
    });
    return ['TODOS', ...Array.from(m)];
  }, [history]);
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.nombre_entrenamiento.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.datos_ejercicios?.some((ex: any) => ex.ejercicio.toLowerCase().includes(searchQuery.toLowerCase()));
      let matchesMuscle = true;
      if (selectedMuscles.length > 0) {
        const sessionMuscles = (item.datos_ejercicios || []).flatMap((ex: any) => {
          const dbEx = dbExercises.find((d: any) => d.nombre?.toLowerCase().trim() === ex.ejercicio?.toLowerCase().trim());
          if (dbEx?.grupo_muscular) return [dbEx.grupo_muscular];
          const partialEx = dbExercises.find((d: any) => {
            const dName = d.nombre?.toLowerCase().trim() || '';
            const exName = ex.ejercicio?.toLowerCase().trim() || '';
            return dName && exName && (dName.includes(exName) || exName.includes(dName));
          });
          return partialEx?.grupo_muscular ? [partialEx.grupo_muscular] : [];
        });
        matchesMuscle = sessionMuscles.some((sm: string) => selectedMuscles.includes(sm));
      }
      let matchesMonth = true;
      if (selectedMonth !== 'TODOS') {
        const d = new Date(item.created_at);
        matchesMonth = d.getMonth() === selectedMonth.month && d.getFullYear() === selectedMonth.year;
      }
      return matchesSearch && matchesMuscle && matchesMonth;
    });
  }, [history, searchQuery, selectedMuscles, selectedMonth, dbExercises]);
  const groupedHistory = useMemo(() => {
    return filteredHistory.reduce((acc: any, item: any) => {
      const month = new Date(item.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [filteredHistory]);
  useEffect(() => {
    async function loadHistory() {
      if (!user?.id) return;
      setLoading(true);
      const data = await getUserHistory(user.id);
      setHistory(data);
      setLoading(false);

      if (initialSessionId && data) {
        const found = data.find((h: any) => h.id === initialSessionId);
        if (found) setSelectedWorkout(found);
      }
    }
    loadHistory();
  }, [user?.id, initialSessionId]);
  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteHistoryId(id);
  };
  const confirmDeleteHistory = async () => {
    if (!deleteHistoryId) return;
    const res = await deleteHistoryEntry(deleteHistoryId, user.id);
    if (res.success) {
      setHistory(prev => prev.filter(h => h.id !== deleteHistoryId));
      if (selectedWorkout && selectedWorkout.id === deleteHistoryId) {
        setSelectedWorkout(null);
      }
    } else {
      setConfirmModal({ show: true, title: 'Error', message: "Error al borrar: " + res.error, type: 'error' });
    }
    setDeleteHistoryId(null);
  };
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0' }}>
        <div className="animate-pulse" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontFamily: 'Oswald', letterSpacing: '2px' }}>RECONSULTANDO EL ARCHIVO...</p>
      </div>
    );
  }
  if (selectedWorkout) {
    const renderDate = new Date(selectedWorkout.created_at);
    return (
      <div className="animate-fade-in-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => setSelectedWorkout(null)} 
            style={{ 
              padding: '0.8rem 1.6rem', display: 'flex', alignItems: 'center', gap: '0.8rem', 
              borderRadius: '14px', background: 'transparent', border: '2px solid var(--accent-primary)', 
              color: 'var(--accent-primary)', fontWeight: 800, fontFamily: 'Oswald', 
              textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
            }}
          >
            <ArrowLeft size={18} /> Volver al Listado
          </button>
          
          <button
            onClick={(e) => { setSelectedWorkout(null); handleDeleteHistory(e, selectedWorkout.id); }}
            style={{ 
              width: '45px', height: '45px', borderRadius: '14px', 
              background: 'transparent', border: '2px solid #ff4444', 
              color: '#ff4444', cursor: 'pointer', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#ff4444';
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,68,68,0.3)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ff4444';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title="Eliminar del Historial"
          >
            <Trash2 size={20} />
          </button>
        </div>
        <div className="glass-card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: 0.05, borderRadius: '50%', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #990000 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(var(--accent-primary-rgb),0.3)' }}>
                  <Activity size={40} color="black" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: '3rem', fontFamily: 'Oswald', margin: 0, textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{selectedWorkout.nombre_entrenamiento}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> {renderDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigateToCalendar(renderDate, renderDate.getDate())}
                style={{ 
                  padding: '1rem 2rem', borderRadius: '16px', 
                  background: 'transparent', border: '2px solid var(--accent-primary)', 
                  color: 'var(--accent-primary)', fontWeight: 800, fontFamily: 'Oswald', 
                  fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--bg-dark)';
                  e.currentTarget.style.transform = 'scale(1.02) translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(var(--accent-primary-rgb), 0.3)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Calendar size={20} /> Localizar en Calendario
              </button>
            </div>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', color: 'var(--text-main)' }}>
              <Zap size={24} color="var(--accent-primary)" /> RESUMEN DE LA INTENSIDAD
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
              {selectedWorkout.datos_ejercicios && selectedWorkout.datos_ejercicios.map((exObj: any, idx: number) => (
                <div key={idx} className="glass-card" style={{ padding: '2rem', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--glass-border)', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: 'bold', fontFamily: 'Oswald', fontSize: '1.2rem', border: '1px solid var(--glass-border)' }}>{idx + 1}</div>
                    <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, fontFamily: 'Oswald', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-main)' }}>{exObj.ejercicio}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {exObj.series.map((set: any, sIdx: number) => (
                      <div key={sIdx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1rem', minWidth: '100px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>SET {sIdx + 1}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{unidades === 'lbs' ? Math.round(parseFloat(set.peso || '0') * 2.20462) : Math.round(parseFloat(set.peso || '0'))}{unidades} x {set.repeticiones}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-in-up" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '500px', background: 'radial-gradient(circle, rgba(var(--accent-primary-rgb),0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ marginBottom: '5rem', position: 'relative', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: 'var(--accent-primary)', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '6px', marginBottom: '1.5rem', background: 'rgba(var(--accent-primary-rgb),0.08)', padding: '0.6rem 1.5rem', borderRadius: '100px', border: '1px solid rgba(var(--accent-primary-rgb),0.1)' }}>
          <History size={18} /> HISTORIAL DE ENTRENAMIENTO
        </div>
        <h1 style={{ fontSize: '5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '4px', margin: '0 0 1rem 0', lineHeight: 0.85, fontWeight: 900 }}>
          CRONOLOGÍA <br />
          <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 40px rgba(var(--accent-primary-rgb),0.3)', position: 'relative' }}>
            DE ENTRENAMIENTO
            <div style={{ position: 'absolute', bottom: '-15px', left: '0', width: '100%', height: '4px', background: 'linear-gradient(to right, transparent, var(--accent-primary), transparent)', opacity: 0.5 }} />
          </span>
        </h1>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '4rem', maxWidth: '1000px', margin: '4rem auto 0', flexWrap: 'wrap', textAlign: 'left', position: 'relative', zIndex: 9999 }}>
          <div style={{ flex: 2, position: 'relative', minWidth: '250px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '0.8rem', textTransform: 'uppercase', opacity: 0.8 }}>Búsqueda de sesión</label>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="EJ: PECHO Y TRICEPS..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '1rem 1.5rem 1rem 4rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '16px', color: 'var(--text-main)', fontFamily: 'Oswald', letterSpacing: '1px', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.background = 'rgba(var(--accent-primary-rgb), 0.03)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.background = 'var(--bg-subtle)'; }}
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '0.8rem', textTransform: 'uppercase', opacity: 0.8 }}>Mes</label>
            <MonthPicker
              selected={selectedMonth}
              onChange={setSelectedMonth}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '0.8rem', textTransform: 'uppercase', opacity: 0.8 }}>Músculos</label>
            <MultiSelect
              label="TODOS LOS MÚSCULOS"
              options={muscles.filter(m => m !== 'TODOS')}
              selected={selectedMuscles}
              onChange={setSelectedMuscles}
            />
          </div>
        </div>
      </div>
      {history.length === 0 ? (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: '10rem 2rem', background: 'var(--bg-subtle)', border: '2px dashed rgba(var(--accent-primary-rgb),0.1)', borderRadius: '50px', backdropFilter: 'blur(20px)' }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(var(--accent-primary-rgb),0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem', border: '1px solid rgba(var(--accent-primary-rgb),0.1)', boxShadow: '0 0 50px rgba(var(--accent-primary-rgb),0.05)' }}>
              <History size={70} color="var(--accent-primary)" opacity={0.2} />
            </div>
            <h2 style={{ fontFamily: 'Oswald', fontSize: '3rem', color: 'var(--text-main)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '3px' }}>ARCHIVO DESIERTO</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', maxWidth: '600px', margin: '0 auto', fontWeight: 300, lineHeight: 1.6 }}>Tu legado aún no ha sido escrito. Cada entrenamiento es una página nueva en este registro de poder.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', position: 'relative' }}>
          {Object.keys(groupedHistory).map((month) => (
            <div key={month}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '3.5rem' }}>
                <div style={{ fontFamily: 'Oswald', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '6px', color: 'var(--text-main)', textTransform: 'uppercase', position: 'relative' }}>
                  {month}
                  <div style={{ position: 'absolute', bottom: '-8px', left: 0, width: '40px', height: '3px', background: 'var(--accent-primary)' }} />
                </div>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, rgba(var(--accent-primary-rgb),0.2), transparent)', opacity: 0.3 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {groupedHistory[month].map((rt: any) => {
                  const parsedDate = new Date(rt.created_at);
                  const numExercises = rt.datos_ejercicios?.length || 0;
                  const totalSets = rt.datos_ejercicios?.reduce((acc: number, ex: any) => acc + (ex.series?.length || 0), 0) || 0;
                  const isIntense = rt.duracion > 45;
                  return (
                    <div
                      key={rt.id}
                      className="glass-card animate-fade-in-up"
                      onClick={() => setSelectedWorkout(rt)}
                      style={{
                        padding: '1.8rem', cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.15, 0.85, 0.35, 1)',
                        position: 'relative', border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', flexDirection: 'column', gap: '1.5rem',
                        background: 'linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(var(--accent-primary-rgb),0.01) 100%)',
                        backdropFilter: 'blur(50px)',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        transformStyle: 'preserve-3d'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                        e.currentTarget.style.borderColor = 'rgba(var(--accent-primary-rgb),0.4)';
                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.4), 0 0 30px rgba(var(--accent-primary-rgb),0.15)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
                      }}
                    >
                      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '120px', height: '120px', background: 'var(--accent-primary)', opacity: 0.05, filter: 'blur(40px)', borderRadius: '50%' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                          <div style={{ position: 'relative', transform: 'translateZ(10px)' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb),0.15) 0%, rgba(var(--accent-primary-rgb),0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(var(--accent-primary-rgb),0.3)', boxShadow: '0 10px 20px rgba(var(--accent-primary-rgb),0.15)' }}>
                              <Activity size={26} color="var(--accent-primary)" strokeWidth={1.5} />
                            </div>
                            {isIntense && (
                              <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--accent-primary)', color: 'black', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a0a0a', boxShadow: '0 0 10px rgba(var(--accent-primary-rgb),0.5)' }}>
                                <Zap size={12} fill="black" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-main)', lineHeight: 1.1, fontWeight: 800 }}>{rt.nombre_entrenamiento}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', background: 'rgba(var(--accent-primary-rgb),0.12)', padding: '0.2rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, fontFamily: 'Oswald', letterSpacing: '1px' }}>
                                <Calendar size={12} /> {parsedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase()}
                              </div>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, opacity: 0.6 }}>@ {parsedDate.toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteHistory(e, rt.id)}
                          style={{ 
                            background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.2)', 
                            color: 'rgba(239, 68, 68, 0.4)', borderRadius: '18px', 
                            width: '45px', height: '45px', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', 
                            cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                          }}
                          onMouseOver={e => { 
                            e.currentTarget.style.background = '#ef4444'; 
                            e.currentTarget.style.color = 'black'; 
                            e.currentTarget.style.borderColor = '#ef4444'; 
                            e.currentTarget.style.transform = 'scale(1.1)'; 
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseOut={e => { 
                            e.currentTarget.style.background = 'transparent'; 
                            e.currentTarget.style.color = 'rgba(239, 68, 68, 0.4)'; 
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'; 
                            e.currentTarget.style.transform = 'scale(1)'; 
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', position: 'relative', zIndex: 1, transform: 'translateZ(10px)' }}>
                        <div style={{ background: 'rgba(255,255,255,0.015)', padding: '1.2rem 0.6rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.03)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.01)' }}>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.5 }}>EJERCICIOS</div>
                          <div style={{ fontSize: '1.6rem', fontFamily: 'Oswald', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{numExercises}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.015)', padding: '1.2rem 0.6rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.03)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.01)' }}>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.5 }}>TOTAL SERIES</div>
                          <div style={{ fontSize: '1.6rem', fontFamily: 'Oswald', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{totalSets}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', position: 'relative', zIndex: 1, transform: 'translateZ(30px)' }}>
                        <button 
                          style={{ 
                            flex: 1, padding: '1rem', borderRadius: '18px', 
                            background: 'transparent', border: '2px solid var(--accent-primary)', 
                            color: 'var(--accent-primary)', fontWeight: 900, fontFamily: 'Oswald', 
                            letterSpacing: '2px', fontSize: '1.1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            gap: '0.8rem', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = 'var(--accent-primary)';
                            e.currentTarget.style.color = 'black';
                            e.currentTarget.style.transform = 'scale(1.02) translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 12px 25px rgba(var(--accent-primary-rgb), 0.3)';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--accent-primary)';
                            e.currentTarget.style.transform = 'scale(1) translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          DESGLOSAR SESIÓN <ArrowRight size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onNavigateToCalendar(parsedDate, parsedDate.getDate()); }}
                          style={{ 
                            width: '55px', height: '55px', borderRadius: '18px', 
                            background: 'transparent', border: '2px solid var(--text-main)', 
                            color: 'var(--text-main)', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', cursor: 'pointer', opacity: 0.7,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = 'var(--text-main)';
                            e.currentTarget.style.color = 'var(--bg-dark)';
                            e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)';
                            e.currentTarget.style.opacity = '1';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-main)';
                            e.currentTarget.style.transform = 'scale(1) translateY(0)';
                            e.currentTarget.style.opacity = '0.7';
                          }}
                        >
                          <Calendar size={24} />
                        </button>
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '2px', background: `linear-gradient(to right, transparent, ${isIntense ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}, transparent)`, opacity: 0.5 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteHistoryId && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setDeleteHistoryId(null)}
        >
          <div
            style={{
              background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '32px',
              padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center', color: 'var(--text-main)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 40px rgba(var(--accent-primary-rgb),0.15)'
            }}
            onClick={e => e.stopPropagation()}
            className="animate-fade-in-up"
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(var(--accent-primary-rgb),0.1)', border: '1px solid rgba(var(--accent-primary-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--accent-primary)' }}>
              <Trash2 size={36} />
            </div>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '2.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>¿BORRAR REGISTRO?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 300 }}>
              Esta acción es irreversible. Se eliminarán permanentemente los datos de esta sesión de tu historial.
            </p>
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <button
                onClick={() => setDeleteHistoryId(null)}
                style={{ flex: 1, padding: '1.2rem', borderRadius: '18px', border: '1px solid var(--glass-border)', background: 'var(--bg-subtle)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 800, fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                CANCELAR
              </button>
              <button
                onClick={confirmDeleteHistory}
                style={{ flex: 1, padding: '1.2rem', borderRadius: '18px', border: 'none', background: 'var(--accent-primary)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 900, fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 10px 25px rgba(var(--accent-primary-rgb),0.3)', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                ELIMINAR
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
function AjustesUsuario({ user, unidades, setUnidades, inicioSemana, setInicioSemana, setShowProfileModal, setConfirmModal }: { user: any, unidades: 'kg' | 'lbs', setUnidades: (u: 'kg' | 'lbs') => void, inicioSemana: 'lun' | 'dom', setInicioSemana: (d: 'lun' | 'dom') => void, setShowProfileModal: (v: boolean) => void, setConfirmModal: (v: any) => void }) {
  const { theme, toggleTheme } = useTheme();
  const { t, language, changeLanguage } = useLanguage();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');
  const handleCancelPro = () => {
    setConfirmModal({
      show: true,
      title: '¿CANCELAR SUSCRIPCIÓN?',
      message: '¿Estás seguro de que quieres cancelar tu suscripción Pro? Perderás el acceso a todas las funciones premium y analíticas avanzadas.',
      type: 'confirm',
      onConfirm: async () => {
        setIsCancelling(true);
        const res = await cancelProSubscription(user.id);
        if (res.success) {
          setCancelMsg('Suscripción cancelada. La página se actualizará en breve.');
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setCancelMsg('Error al cancelar: ' + (res.error || 'Inténtalo de nuevo.'));
          setIsCancelling(false);
        }
      }
    });
  };
  const handleSupport = () => {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=eldohu15@gmail.com&su=Soporte%20VigorNova&body=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta...', '_blank');
  };
  const labelStyle: React.CSSProperties = { color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' };
  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', lineHeight: 1 }}>
          CONFIGURACIÓN <span style={{ color: 'var(--accent-primary)' }}>DE PERFIL</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '1.1rem' }}>Gestiona tus preferencias de entrenamiento y suscripción.</p>
      </div>
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div
            className="glass-card"
            onClick={() => setShowProfileModal(true)}
            style={{ padding: '2rem', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '2rem', border: '1px solid var(--glass-border)' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--accent-primary)', flexShrink: 0 }}>
              {user.foto_perfil ? (
                <img src={user.foto_perfil} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'rgba(var(--accent-primary-rgb), 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', margin: 0, textTransform: 'uppercase' }}>Ajustes de <span style={{ color: 'var(--accent-primary)' }}>Perfil</span></h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>Click aquí para editar tu información personal y foto.</p>
            </div>
            <ChevronRight size={24} color="var(--accent-primary)" />
          </div>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Oswald', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', textTransform: 'uppercase' }}>
              <Dumbbell size={24} color="var(--accent-primary)" /> Configuración General
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>SISTEMA DE UNIDADES</label>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.4rem', borderRadius: '14px', border: '1px solid var(--glass-border)', position: 'relative' }}>
                  <button 
                    onClick={() => setUnidades('kg')} 
                    style={{ 
                      flex: 1, padding: '1rem', borderRadius: '10px', border: 'none', 
                      background: unidades === 'kg' ? 'var(--accent-primary)' : 'transparent', 
                      color: unidades === 'kg' ? (theme === 'dark' ? 'black' : 'white') : 'var(--text-muted)', 
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                      fontWeight: 800, fontSize: '0.9rem', fontFamily: 'Oswald', letterSpacing: '1px'
                    }}
                    onMouseOver={e => { if (unidades !== 'kg') e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { if (unidades !== 'kg') e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    KILOGRAMOS (KG)
                  </button>
                  <button 
                    onClick={() => setUnidades('lbs')} 
                    style={{ 
                      flex: 1, padding: '1rem', borderRadius: '10px', border: 'none', 
                      background: unidades === 'lbs' ? 'var(--accent-primary)' : 'transparent', 
                      color: unidades === 'lbs' ? (theme === 'dark' ? 'black' : 'white') : 'var(--text-muted)', 
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                      fontWeight: 800, fontSize: '0.9rem', fontFamily: 'Oswald', letterSpacing: '1px'
                    }}
                    onMouseOver={e => { if (unidades !== 'lbs') e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { if (unidades !== 'lbs') e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    LIBRAS (LBS)
                  </button>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Interfaz Visual (Tema)</label>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.4rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                  <button 
                    onClick={toggleTheme} 
                    style={{ 
                      flex: 1, padding: '1rem', borderRadius: '10px', border: 'none', 
                      background: theme === 'light' ? 'var(--accent-primary)' : 'transparent', 
                      color: theme === 'light' ? 'white' : 'var(--text-muted)', 
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                      fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                      fontFamily: 'Oswald', letterSpacing: '1px'
                    }}
                    onMouseOver={e => { if (theme !== 'light') e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { if (theme !== 'light') e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <Globe size={18} /> MODO CLARO
                  </button>
                  <button 
                    onClick={toggleTheme} 
                    style={{ 
                      flex: 1, padding: '1rem', borderRadius: '10px', border: 'none', 
                      background: theme === 'dark' ? 'var(--accent-primary)' : 'transparent', 
                      color: theme === 'dark' ? 'white' : 'var(--text-muted)', 
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                      fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                      fontFamily: 'Oswald', letterSpacing: '1px'
                    }}
                    onMouseOver={e => { if (theme !== 'dark') e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { if (theme !== 'dark') e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <Star size={18} /> MODO OSCURO
                  </button>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Día de inicio de semana</label>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.4rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                  <button 
                    onClick={() => setInicioSemana('lun')} 
                    style={{ 
                      flex: 1, padding: '1rem', borderRadius: '10px', border: 'none', 
                      background: inicioSemana === 'lun' ? 'var(--accent-primary)' : 'transparent', 
                      color: inicioSemana === 'lun' ? (theme === 'dark' ? 'black' : 'white') : 'var(--text-muted)', 
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                      fontWeight: 800, fontSize: '0.9rem', fontFamily: 'Oswald', letterSpacing: '1px'
                    }}
                    onMouseOver={e => { if (inicioSemana !== 'lun') e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { if (inicioSemana !== 'lun') e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    LUNES
                  </button>
                  <button 
                    onClick={() => setInicioSemana('dom')} 
                    style={{ 
                      flex: 1, padding: '1rem', borderRadius: '10px', border: 'none', 
                      background: inicioSemana === 'dom' ? 'var(--accent-primary)' : 'transparent', 
                      color: inicioSemana === 'dom' ? (theme === 'dark' ? 'black' : 'white') : 'var(--text-muted)', 
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                      fontWeight: 800, fontSize: '0.9rem', fontFamily: 'Oswald', letterSpacing: '1px'
                    }}
                    onMouseOver={e => { if (inicioSemana !== 'dom') e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { if (inicioSemana !== 'dom') e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    DOMINGO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', border: `1px solid ${user.es_pro ? 'var(--accent-primary)' : 'var(--glass-border)'}`, background: user.es_pro ? 'rgba(var(--accent-primary-rgb), 0.02)' : 'var(--bg-card)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
            {user.es_pro && <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', fontFamily: 'Oswald', color: 'rgba(var(--accent-primary-rgb), 0.03)', fontWeight: 900, pointerEvents: 'none' }}>PRO</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'Oswald', margin: 0, color: 'var(--text-main)' }}>PLAN ACTUAL</h3>
              <span style={{ background: user.es_pro ? 'var(--accent-primary)' : 'var(--glass-border)', color: user.es_pro ? (theme === 'dark' ? 'black' : 'white') : 'var(--text-muted)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{user.es_pro ? 'ACTIVO' : 'GRATIS'}</span>
            </div>
            <div style={{ fontSize: '4rem', fontFamily: 'Oswald', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1 }}>{user.es_pro ? 'PRO' : 'BÁSICO'}</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>{user.es_pro ? 'Disfrutas de todas las funciones premium de VigorNova.' : 'Accede a la base de ejercicios y rutinas básicas.'}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
              {user.es_pro ? (
                <>
                  {cancelMsg && <div style={{ padding: '0.8rem 1rem', borderRadius: '10px', background: cancelMsg.includes('Error') ? 'rgba(var(--accent-primary-rgb),0.1)' : 'rgba(34,197,94,0.1)', color: cancelMsg.includes('Error') ? 'var(--accent-primary)' : '#22c55e', fontSize: '0.85rem', fontWeight: 600, border: `1px solid ${cancelMsg.includes('Error') ? 'rgba(var(--accent-primary-rgb),0.2)' : 'rgba(34,197,94,0.2)'}` }}>{cancelMsg}</div>}
                  <button
                    onClick={handleCancelPro}
                    disabled={isCancelling}
                    style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', border: '1px solid rgba(var(--accent-primary-rgb),0.4)', background: 'rgba(var(--accent-primary-rgb),0.08)', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.95rem', cursor: isCancelling ? 'not-allowed' : 'pointer', fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s', opacity: isCancelling ? 0.6 : 1 }}
                    onMouseOver={e => { if (!isCancelling) { e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.15)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; } }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.08)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-primary-rgb),0.4)'; }}
                  >
                    {isCancelling ? 'CANCELANDO...' : 'CANCELAR PLAN PRO'}
                  </button>
                </>
              ) : (
                <Link href="/checkout" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '14px', padding: '1.2rem' }}>MEJORAR A PRO - $9.00</button>
                </Link>
              )}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>¿Algún problema técnico?</div>
            <button
              onClick={handleSupport}
              style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            >
              <Send size={18} /> Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function DatabaseEjercicios({ muscle, onBack }: { muscle: string, onBack: () => void }) {
  const { theme } = useTheme();
  const isPecho = muscle === 'Pecho';
  const exercises = isPecho ? [
    { name: 'Press de Banca Plano', desc: 'El rey de los ejercicios compuestos para las fibras medias.', type: 'Barra', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
    { name: 'Press Inclinado', desc: 'Enfoca la tensión en el haz clavicular (pecho superior).', type: 'Barra', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' },
    { name: 'Press Declinado', desc: 'Transfiere el torque a la cabeza esternocostal inferior.', type: 'Barra', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80' },
    { name: 'Press Plano con Mancuernas', desc: 'Aumenta el rango de movimiento profundo permitiendo mayor elongación.', type: 'Mancuer.', img: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=200&q=80' },
    { name: 'Press Inclinado con Mancuernas', desc: 'Aísla el pectoral superior y corrige asimetrías de fuerza.', type: 'Mancuer.', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=80' },
    { name: 'Press Declinado con Mancuernas', desc: 'Estímulo para el pecho bajo minimizando estrés articular del hombro.', type: 'Mancuer.', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&q=80' },
    { name: 'Aperturas Planas (Flys)', desc: 'Puramente focalizado en expandir la caja torácica.', type: 'Mancuer.', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
    { name: 'Aperturas Inclinadas', desc: 'Estimula y estira intensamente las fibras superiores.', type: 'Mancuer.', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' },
    { name: 'Cruces en Polea Alta', desc: 'Movimiento convergente constante para pecho inferior y surco medio.', type: 'Poleas', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80' },
    { name: 'Cruces en Polea Baja', desc: 'Tirando desde abajo hacia arriba; resistencia pura al haz clavicular.', type: 'Poleas', img: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=200&q=80' },
    { name: 'Cruces en Polea Media', desc: 'Actúa directamente sobre las fibras esternocostales medias.', type: 'Poleas', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=80' },
    { name: 'Peck Deck (Máquina)', desc: 'Aislamiento seguro para buscar fallo muscular sin riesgo.', type: 'Máquina', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&q=80' },
    { name: 'Press en Máquina Convergente', desc: 'Biomecánica que sigue la vía natural del cierre pectoral.', type: 'Máquina', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
    { name: 'Press en Máquina Inclinada', desc: 'Ideal para sobrecargar pesado la porción superior sin estabilizar.', type: 'Máquina', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' },
    { name: 'Flexiones Clásicas', desc: 'Trabaja estabilizadores, tríceps y masa del pectoral completo.', type: 'Peso Corporal', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80' },
    { name: 'Flexiones Diamante', desc: 'Triángulo que transfiere gran carga a la sección interna y tríceps.', type: 'Peso Corporal', img: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=200&q=80' },
    { name: 'Flexiones Declinadas', desc: 'Pies elevados en cajón para atacar el haz clavicular con fuerza.', type: 'Peso Corporal', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=80' },
    { name: 'Flexiones Inclinadas', desc: 'Manos apoyadas en banco, centrándose más en el pecho bajo/inferior.', type: 'Peso Corporal', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&q=80' },
    { name: 'Flexiones con Lastre', desc: 'Dinámica de hipertrofia con un chaleco pesado para romper estancamientos.', type: 'Peso Corporal', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
    { name: 'Pullover con Mancuerna', desc: 'Activa la expansión torácica, pectoral, serrato y dorsal menor.', type: 'Mancuer.', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' },
    { name: 'Press Guillotina', desc: 'Bajada de barra al cuello para hiper-estirar y aislar fibras pectorales.', type: 'Barra', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80' },
    { name: 'Press Svend con Discos', desc: 'Apretar dos discos frente al pecho isométricamente congestionando el centro.', type: 'Discos', img: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=200&q=80' },
    { name: 'Fondos en Paralelas', desc: 'Con el tronco inclinado hacia adelante ataca críticamente el pecho bajo.', type: 'Peso Corporal', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=80' },
    { name: 'Press de Suelo (Floor Press)', desc: 'Rango parcial acostado para proteger hombros y sobrecargar tríceps.', type: 'Híbrido', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&q=80' },
    { name: 'Flexiones en Anillas', desc: 'Inestabilidad que recluta masivamente las fibras pectorales estabilizadoras.', type: 'Suspensión', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' }
  ] : [
    { name: `${muscle} Básico 1`, desc: 'Ejercicio fundamental para fuerza en ' + muscle, type: 'Básico', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
    { name: `${muscle} Aislamiento`, desc: 'Para hipertrofia específica de ' + muscle, type: 'Aislamiento', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80' }
  ];
  return (
    <div className="animate-fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <ChevronLeft size={18} /> Volver a Grupos
        </button>
        <h1 style={{ fontSize: '2rem', fontFamily: 'Oswald', margin: 0, textTransform: 'uppercase', color: 'var(--text-main)' }}>Ejercicios de <span style={{ color: 'var(--accent-primary)' }}>{muscle}</span></h1>
      </div>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '0 0 380px', padding: '2rem', position: 'sticky', top: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>ANATOMÍA HUMANA</h3>
          <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', filter: `drop-shadow(0 0 15px rgba(var(--accent-primary-rgb),0.6))`, alignContent: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Model
                data={[{ name: 'Objective', muscles: isPecho ? ['chest'] : muscle === 'Espalda' ? ['upper-back', 'lower-back', 'trapezius'] : muscle === 'Hombros' ? ['front-deltoids'] : muscle === 'Piernas' ? ['quadriceps', 'calves'] : muscle === 'Brazos' ? ['biceps', 'forearm'] : muscle === 'Core' ? ['abs', 'obliques'] : [] }]}
                style={{ width: '100%' }}
                highlightedColors={[theme === 'dark' ? 'var(--accent-primary)' : '#1e40af']}
                type="anterior"
              />
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 600, letterSpacing: '2px' }}>FRONTAL</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Model
                data={[{ name: 'Objective', muscles: isPecho ? ['chest'] : muscle === 'Espalda' ? ['upper-back', 'lower-back', 'trapezius'] : muscle === 'Hombros' ? ['back-deltoids'] : muscle === 'Piernas' ? ['hamstring', 'gluteal', 'calves'] : muscle === 'Brazos' ? ['triceps', 'forearm'] : [] }]}
                style={{ width: '100%' }}
                highlightedColors={[theme === 'dark' ? 'var(--accent-primary)' : '#1e40af']}
                type="posterior"
              />
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 600, letterSpacing: '2px' }}>POSTERIOR</div>
            </div>
          </div>
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontFamily: 'Oswald', fontWeight: 'bold', color: 'var(--text-main)' }}>{exercises.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ejercicios Encontrados</div>
          </div>
        </div>
        <div style={{ flex: '1 1 500px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {exercises.map((ex, i) => (
            <div key={i} className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ height: '140px', background: 'black', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', border: '1px solid var(--glass-border)' }}>
                  {ex.type}
                </div>
              </div>
              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{ex.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>{ex.desc}</p>
                <button className="btn-primary" style={{ marginTop: '1rem', padding: '0.6rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  + Añadir a Rutina
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function DirectorioEjercicios({ user, workouts }: { user: any, workouts: any[] }) {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [showRoutinePicker, setShowRoutinePicker] = useState(false);
  const [addingToRoutine, setAddingToRoutine] = useState<string | null>(null);
  const [addFeedback, setAddFeedback] = useState<{ routineId: string, msg: string, ok: boolean } | null>(null);
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, query]);
  useEffect(() => {
    async function loadData() {
      try {
        const exs = await getExercises();
        if (user.id) {
          const favs = await getUserFavorites(user.id);
          if (favs) setFavorites(new Set(favs));
        }
        setExercises(exs || []);
      } catch (err) {
        console.error(err);
        setErrorMsg('Error al cargar catálogo');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user.id]);
  const handleToggleFav = async (id: number) => {
    const isFav = favorites.has(id);
    const newFavs = new Set(favorites);
    if (isFav) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
    if (!user.id) return;
    const res = await toggleFavorite(user.id, id, isFav);
    if (!res.success) {
      console.error("Failed to toggle favorite:", res.error);
      setFavorites(favorites);
    }
  };
  const handleImageError = (id: number) => {
    setBrokenImages(prev => new Set(prev).add(id));
  };
  const dbFilters = [
    { label: 'Todos', val: 'Todos' },
    { label: 'Favoritos', val: 'Favoritos', icon: <Bookmark size={16} fill="white" /> },
    { label: 'Cardio', val: 'Cardio', icon: <Activity size={16} /> },
    { label: 'Pecho', val: 'Pecho' },
    { label: 'Espalda', val: 'Espalda' },
    { label: 'Bíceps', val: 'Bíceps' },
    { label: 'Tríceps', val: 'Tríceps' },
    { label: 'Cuádriceps', val: 'Cuádriceps' },
    { label: 'Isquiotibiales', val: 'Isquiotibiales' },
    { label: 'Hombros', val: 'Hombros' },
    { label: 'Gemelos', val: 'Gemelos' },
    { label: 'Core', val: 'Core' }
  ];
  const filteredExercises = exercises.filter(ex => {
    if (filter === 'Favoritos') {
      if (!favorites.has(ex.id)) return false;
    } else if (filter !== 'Todos') {
      if (ex.grupo_muscular !== filter) return false;
    }
    if (query && !ex.nombre.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);
  const paginatedExercises = filteredExercises.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const muscleMapping: Record<string, string[]> = {
    'Pecho': ['chest'],
    'Espalda': ['trapezius', 'upper-back', 'lower-back'],
    'Bíceps': ['biceps'],
    'Tríceps': ['triceps'],
    'Cuádriceps': ['quadriceps'],
    'Isquiotibiales': ['hamstring'],
    'Hombros': ['front-deltoids', 'back-deltoids', 'trapezius'],
    'Gemelos': ['calves'],
    'Core': ['abs', 'obliques']
  };
  const isPosterior = ['Espalda', 'Tríceps', 'Isquiotibiales', 'Gemelos'].includes(filter);
  const showModel = !['Todos', 'Favoritos', 'Cardio'].includes(filter);
  const highlightedMuscles: IExerciseData[] = (muscleMapping[filter] || []).map(m => ({
    name: m,
    muscles: [m as Muscle],
    frequency: 1
  }));
  return (
    <div className="animate-fade-in-up">
      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', padding: '1rem 1.2rem 1rem 3.2rem', borderRadius: '12px',
            background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
            color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'all 0.3s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(var(--accent-primary-rgb), 0.3)'; e.target.style.background = 'var(--bg-card)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.background = 'var(--bg-card)'; }}
        />
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1.2rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {dbFilters.map(f => {
          const isActive = filter === f.val;
          return (
            <button
              key={f.val}
              onClick={() => setFilter(f.val)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'none', border: 'none', padding: '0.4rem 0',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem', position: 'relative', whiteSpace: 'nowrap'
              }}
            >
              {f.icon && <span style={{ opacity: isActive ? 1 : 0.6 }}>{f.icon}</span>}
              <span>{f.label}</span>
              {isActive && (
                <div style={{ position: 'absolute', bottom: '-1.3rem', left: 0, right: 0, height: '2px', backgroundColor: 'var(--accent-primary)' }} />
              )}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '5rem' }}>Cargando catálogo...</div>
          ) : errorMsg ? (
            <div style={{ textAlign: 'center', color: 'rgba(var(--accent-primary-rgb),0.8)', padding: '5rem', border: '1px solid rgba(var(--accent-primary-rgb),0.2)', borderRadius: '16px', background: 'rgba(var(--accent-primary-rgb),0.05)' }}>{errorMsg}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                {paginatedExercises.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem', gridColumn: '1 / -1' }}>No se encontraron ejercicios.</div>
                ) : paginatedExercises.map(ex => {
                  const isFav = favorites.has(ex.id);
                  const isBroken = brokenImages.has(ex.id);
                  return (
                    <div key={ex.id}
                      onClick={() => setSelectedExercise(ex)}
                      style={{
                        borderRadius: '12px', padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
                        backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)',
                        transition: 'all 0.3s ease', cursor: 'pointer'
                      }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-primary-rgb), 0.3)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleFav(ex.id); }} 
                        style={{ 
                          position: 'absolute', top: '12px', left: '12px', background: 'var(--bg-card)', 
                          backdropFilter: 'blur(4px)', border: '1px solid var(--glass-border)', 
                          borderRadius: '8px', width: '32px', height: '32px', display: 'flex', 
                          alignItems: 'center', justifyContent: 'center', zIndex: 10, cursor: 'pointer',
                          color: isFav ? 'var(--accent-primary)' : 'var(--text-main)',
                          transition: 'all 0.4s ease'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.color = 'var(--accent-primary)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.color = isFav ? "var(--accent-primary)" : "var(--text-main)";
                        }}
                      >
                        <Bookmark 
                          size={16} 
                          fill={isFav ? "currentColor" : "none"} 
                          color="currentColor" 
                          style={{ transition: 'all 0.4s ease' }}
                        />
                      </button>
                      <div style={{ height: '200px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: '#000' }}>
                        {((ex.url_video || ex.imagen_url || ex.url_imagen) && !isBroken) ? (
                          <img
                            src={ex.url_video || ex.imagen_url || ex.url_imagen}
                            alt={ex.nombre}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={() => handleImageError(ex.id)}
                          />
                        ) : (
                          <Dumbbell size={40} color="var(--glass-border)" />
                        )}
                      </div>
                      <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 600, fontFamily: 'Inter, sans-serif', color: 'var(--text-main)', textTransform: 'none', letterSpacing: '0' }}>{ex.nombre}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 400, textTransform: 'none' }}>{ex.grupo_muscular}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    style={{
                      width: '45px', height: '45px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)',
                      color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-main)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                    }}
                    onMouseOver={e => { if (currentPage !== 1) e.currentTarget.style.background = 'var(--glass-border)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                      const isActive = p === currentPage;
                      return (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          style={{
                            width: '45px', height: '45px', borderRadius: '12px',
                            background: isActive ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                            border: isActive ? 'none' : '1px solid var(--glass-border)',
                            color: isActive ? 'var(--text-on-accent)' : 'var(--text-main)', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                            fontFamily: 'Oswald', fontSize: '1rem'
                          }}
                          onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--glass-border)'; }}
                          onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    style={{
                      width: '45px', height: '45px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)',
                      color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-main)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                    }}
                    onMouseOver={e => { if (currentPage !== totalPages) e.currentTarget.style.background = 'var(--glass-border)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {showModel && (
          <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="hide-mobile">
            <div className="glass-card" style={{ padding: '2.5rem', width: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontFamily: 'Oswald', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Foco Muscular</h4>
              <div style={{ width: '100%', height: '400px' }}>
                <Model
                  data={highlightedMuscles}
                  type={isPosterior ? 'posterior' : 'anterior'}
                  highlightedColors={[theme === 'dark' ? 'var(--accent-primary)' : 'var(--accent-primary)']}
                  bodyColor={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <p style={{ marginTop: '2.5rem', color: 'var(--text-main)', fontFamily: 'Oswald', fontSize: '1.6rem', textTransform: 'uppercase', textAlign: 'center' }}>{filter}</p>
            </div>
          </div>
        )}
      </div>
      {selectedExercise && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', boxSizing: 'border-box' }}
          onClick={() => setSelectedExercise(null)}
        >
          <div style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(15px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'relative', width: '100%', height: '380px', overflow: 'hidden' }}>
              {!brokenImages.has(selectedExercise.id) ? (
                <img
                  src={selectedExercise.url_video}
                  alt={selectedExercise.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-subtle)', opacity: 0.5 }}>
                  <Dumbbell size={80} color="var(--accent-primary)" opacity={0.3} />
                </div>
              )}
              <button
                onClick={() => setSelectedExercise(null)}
                style={{ 
                  position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', 
                  border: '2px solid var(--accent-primary)', borderRadius: '12px', width: '45px', height: '45px', 
                  color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', backdropFilter: 'blur(5px)', zIndex: 11, transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'black';
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <X size={24} />
              </button>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to top, var(--bg-card), transparent)' }}></div>
            </div>
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'Oswald', color: 'var(--text-main)', lineHeight: 1.1 }}>{selectedExercise.nombre}</h2>
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleFav(selectedExercise.id); }}
                  style={{ 
                    background: 'var(--bg-card)', border: '1px solid var(--glass-border)', 
                    borderRadius: '12px', width: '45px', height: '45px', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: favorites.has(selectedExercise.id) ? 'var(--accent-primary)' : 'var(--text-main)',
                    transition: 'all 0.4s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.color = favorites.has(selectedExercise.id) ? "var(--accent-primary)" : "var(--text-main)";
                  }}
                >
                  <Bookmark 
                    size={24} 
                    fill={favorites.has(selectedExercise.id) ? "currentColor" : "none"} 
                    color="currentColor"
                    style={{ transition: 'all 0.4s ease' }}
                  />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem' }}>Nivel</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={18} color="var(--accent-primary)" />
                    {selectedExercise.nivel_dificultad || 'Intermedio'}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem' }}>Grupo Muscular</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{selectedExercise.grupo_muscular}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem' }}>Equipamiento</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{selectedExercise.tipo || 'Ninguno'}</div>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-main)', lineHeight: '1.6', margin: 0 }}>
                  {selectedExercise.descripcion || 'No hay descripción disponible para este ejercicio.'}
                </p>
              </div>
              <button
                onClick={() => setShowRoutinePicker(true)}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  backgroundColor: 'transparent',
                  color: 'var(--accent-primary)',
                  border: '2px solid var(--accent-primary)',
                  borderRadius: '16px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontFamily: 'Oswald',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.8rem',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'black';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Plus size={22} />
                Añadir a mi Rutina
              </button>
              {showRoutinePicker && (
                <div
                  style={{
                    position: 'fixed', inset: 0, zIndex: 99999,
                    background: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                  }}
                  onClick={() => { setShowRoutinePicker(false); setAddFeedback(null); }}
                >
                  <div
                    style={{
                      background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
                      borderRadius: '24px', width: '100%', maxWidth: '480px',
                      padding: '2rem', boxShadow: theme === 'dark' ? '0 40px 80px rgba(0,0,0,0.6)' : 'var(--card-shadow)'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem' }}>Añadir ejercicio</div>
                        <h3 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', margin: 0, color: 'var(--text-main)' }}>{selectedExercise.nombre}</h3>
                      </div>
                      <button
                        onClick={() => { setShowRoutinePicker(false); setAddFeedback(null); }}
                        style={{ 
                          background: 'transparent', border: '2px solid var(--accent-primary)', borderRadius: '10px', 
                          width: '36px', height: '36px', color: 'var(--accent-primary)', cursor: 'pointer', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = 'var(--accent-primary)';
                          e.currentTarget.style.color = 'black';
                          e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--accent-primary)';
                          e.currentTarget.style.transform = 'scale(1) translateY(0)';
                        }}
                      ><X size={18} /></button>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Selecciona en qué rutina quieres añadir este ejercicio:</p>
                    {workouts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--glass-border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                        <Dumbbell size={32} style={{ marginBottom: '0.8rem', opacity: 0.4 }} />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>No tienes rutinas creadas aún.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                        {workouts.map((w: any) => {
                          const alreadyAdded = w.exercises.includes(selectedExercise.nombre);
                          const isAddingToThis = addingToRoutine === w.id;
                          const feedback = addFeedback?.routineId === w.id ? addFeedback : null;
                          return (
                            <div
                              key={w.id}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '1rem 1.2rem', borderRadius: '16px',
                                border: `1px solid ${alreadyAdded ? 'rgba(34,197,94,0.3)' : feedback?.ok === false ? 'rgba(var(--accent-primary-rgb),0.3)' : 'var(--glass-border)'}`,
                                background: alreadyAdded ? 'rgba(34,197,94,0.05)' : 'var(--bg-card)',
                                transition: 'all 0.2s'
                              }}
                            >
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: w.color, flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{w.exercises.length} ejercicios · {w.goal}</div>
                                {feedback && (
                                  <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.3rem', color: feedback.ok ? '#22c55e' : 'var(--accent-primary)' }}>
                                    {feedback.ok ? '✓ ' : '⚠ '}{feedback.msg}
                                  </div>
                                )}
                              </div>
                              {alreadyAdded ? (
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                                  <CheckCircle2 size={16} /> Ya añadido
                                </div>
                              ) : (
                                <button
                                  disabled={isAddingToThis}
                                  onClick={async () => {
                                    setAddingToRoutine(w.id);
                                    setAddFeedback(null);
                                    const res = await addExerciseToWorkout(w.id, user.id, selectedExercise.nombre);
                                    setAddingToRoutine(null);
                                    if (res.success) {
                                      w.exercises = [...w.exercises, selectedExercise.nombre];
                                      setAddFeedback({ routineId: w.id, msg: '¡Añadido!', ok: true });
                                    } else {
                                      setAddFeedback({ routineId: w.id, msg: res.error || 'Error', ok: false });
                                    }
                                  }}
                                  style={{
                                    padding: '0.5rem 1rem', borderRadius: '10px', border: 'none',
                                    background: isAddingToThis ? 'var(--glass-border)' : 'var(--accent-primary)',
                                    color: isAddingToThis ? 'var(--text-muted)' : 'black',
                                    fontWeight: 700, fontSize: '0.8rem', cursor: isAddingToThis ? 'not-allowed' : 'pointer',
                                    textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0
                                  }}
                                >
                                  {isAddingToThis ? '...' : '+'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <button
                      onClick={() => { setShowRoutinePicker(false); setAddFeedback(null); }}
                      style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem', borderRadius: '14px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
                    >Cerrar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        , document.body)}
    </div>
  );
}
function ShareModal({ user, routine, onClose, showToast }: any) {
  const [amigos, setAmigos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();
  React.useEffect(() => {
    const fetchAmigos = async () => {
      try {
        const { data: d1 } = await supabase.from('amigos').select('amigo_id, usuarios!amigos_amigo_id_fkey(*)').eq('usuario_id', user.id);
        const { data: d2 } = await supabase.from('amigos').select('usuario_id, usuarios!amigos_usuario_id_fkey(*)').eq('amigo_id', user.id);
        const amigosList = [
          ...(d1?.map((d: any) => d.usuarios) || []),
          ...(d2?.map((d: any) => d.usuarios) || [])
        ];
        setAmigos(amigosList);
      } catch (err) {
        console.error("Error fetching amigos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAmigos();
  }, [user.id]);
  const handleShare = async (amigoId: string) => {
    const routineSnapshot = {
      name: routine.name,
      goal: routine.goal,
      days: routine.days,
      muscles: routine.muscles || [],
      exercises: routine.exercises,
      color: routine.color,
      level: routine.level,
      duration: routine.duration,
      image: routine.image,
      descripcion: routine.descripcion
    };
    const { error } = await supabase.from('mensajes').insert({
      remitente_id: user.id,
      receptor_id: amigoId,
      contenido: `RUTINA_DATA|${JSON.stringify(routineSnapshot)}`,
      tipo: 'rutina',
      referencia_id: routine.id
    });
    if (error) {
      showToast('Error al compartir la rutina', 'error');
    } else {
      showToast('Rutina compartida con éxito', 'success');
    }
    onClose();
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '2rem', maxWidth: '450px', width: '100%', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '80vh' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', margin: 0 }}>COMPARTIR RUTINA</h3>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'transparent', border: '2px solid var(--accent-primary)', borderRadius: '10px', 
              width: '36px', height: '36px', color: 'var(--accent-primary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: routine.color || 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2 size={24} color="var(--bg-dark)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{routine.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Selecciona a quién se la envías</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando amigos...</div>
          ) : amigos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No tienes amigos agregados aún.</div>
          ) : (
            amigos.map(amigo => (
              <div key={amigo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '16px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-border)', overflow: 'hidden' }}>
                    {amigo.foto_perfil ? <img src={amigo.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={20} color="var(--text-muted)" style={{ margin: '10px' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{amigo.nombre}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{amigo.nivel}</div>
                  </div>
                </div>
                <button onClick={() => handleShare(amigo.id)} style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'var(--accent-primary)', border: 'none', color: 'black', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <Send size={14} /> Enviar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
function MultiSelect({ label, options, selected, onChange }: { label: string, options: string[], selected: string[], onChange: (val: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: isOpen ? 10000 : 1 }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.8rem 1.2rem',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          color: selected.length > 0 ? 'var(--accent-primary)' : 'var(--text-main)',
          outline: 'none',
          fontFamily: 'Oswald',
          letterSpacing: '1px',
          fontSize: '0.9rem',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          fontWeight: selected.length > 0 ? 800 : 400
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = 'var(--accent-primary)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '10px' }}>
          {selected.length === 0 ? label : `${selected.length} SELECCIONADOS`}
        </span>
        <ChevronRight
          size={16}
          style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
            opacity: 0.6,
            flexShrink: 0
          }}
        />
      </button>

      {isOpen && (
        <div
          className="animate-fade-in-up"
          style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            width: '480px',
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
            zIndex: 10000,
            padding: '1.2rem',
            maxHeight: '500px',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {options.map(option => (
              <div
                key={option}
                onClick={() => toggleOption(option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selected.includes(option) ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'transparent'
                }}
                onMouseOver={e => e.currentTarget.style.background = selected.includes(option) ? 'rgba(var(--accent-primary-rgb), 0.15)' : 'rgba(255,255,255,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = selected.includes(option) ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'transparent'}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: '2px solid',
                  borderColor: selected.includes(option) ? 'var(--accent-primary)' : 'var(--glass-border)',
                  background: selected.includes(option) ? 'var(--accent-primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}>
                  {selected.includes(option) && <Check size={12} color="black" strokeWidth={4} />}
                </div>
                <span style={{
                  fontFamily: 'Oswald',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px',
                  color: selected.includes(option) ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: selected.includes(option) ? 700 : 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {option.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MonthPicker({ selected, onChange }: { selected: any, onChange: (val: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectorYear, setSelectorYear] = useState(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);
  const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  useEffect(() => {
    if (isOpen && selected !== 'TODOS') {
      setSelectorYear(selected.year);
    }
  }, [isOpen, selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: any) => {
    onChange(val);
    setIsOpen(false);
  };

  const getLabel = () => {
    if (selected === 'TODOS') return 'TODOS LOS MESES';
    return `${monthNames[selected.month]} DE ${selected.year}`;
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: isOpen ? 10000 : 1 }}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        style={{
          width: '100%',
          padding: '0.8rem 1.2rem',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          color: selected !== 'TODOS' ? 'var(--accent-primary)' : 'var(--text-main)',
          fontFamily: 'Oswald',
          letterSpacing: '1px',
          fontSize: '0.9rem',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s'
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {getLabel()}
        </span>
        <ChevronRight size={16} style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s', opacity: 0.6 }} />
      </button>

      {isOpen && (
        <div
          className="animate-fade-in-up"
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            width: '320px',
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            zIndex: 10000,
            padding: '1.2rem'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
            <button type="button" onClick={(e) => { e.preventDefault(); setSelectorYear(prev => prev - 1); }} style={{ background: 'var(--bg-subtle)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', color: 'var(--text-main)', cursor: 'pointer' }}><ChevronLeft size={14} /></button>
            <span style={{ fontFamily: 'Oswald', fontSize: '1.4rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{selectorYear}</span>
            <button type="button" onClick={(e) => { e.preventDefault(); setSelectorYear(prev => prev + 1); }} style={{ background: 'var(--bg-subtle)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', color: 'var(--text-main)', cursor: 'pointer' }}><ChevronRight size={14} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => handleSelect('TODOS')}
              style={{
                padding: '0.8rem 0.4rem',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: selected === 'TODOS' ? 'var(--accent-primary)' : 'var(--glass-border)',
                background: selected === 'TODOS' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.02)',
                color: selected === 'TODOS' ? 'black' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 800,
                fontFamily: 'Oswald',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { if (selected !== 'TODOS') e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.1)'; }}
              onMouseOut={e => { if (selected !== 'TODOS') e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              TODOS
            </button>
            {monthNames.map((m, idx) => {
              const isSelected = selected !== 'TODOS' && selected.month === idx && selected.year === selectorYear;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelect({ month: idx, year: selectorYear })}
                  style={{
                    padding: '0.8rem 0.4rem',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--glass-border)',
                    background: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.02)',
                    color: isSelected ? 'black' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: 'Oswald',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb),0.1)'; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  {m.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
