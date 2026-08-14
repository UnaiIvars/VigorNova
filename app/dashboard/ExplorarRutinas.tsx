"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  Search, Flame, ChevronLeft, ChevronRight, Star, Plus, Download, 
  Activity, Globe, X, Check, User, MapPin, Calendar, Dumbbell, 
  Share2, Eye, EyeOff, Camera, Link as LinkIcon, Repeat, Timer, Target, Upload,
  CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPublicWorkouts, forkWorkout, getPublicProfile, unpublishWorkout } from './actions';
import { createClient } from '@/utils/supabase/client';

const WORKOUT_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&q=80',
];

const GOAL_COLORS: Record<string, string> = { 
  'Hipertrofia': 'var(--accent-primary)',
  'Fuerza': '#ff8a00',
  'Resistencia': '#00d4ff',
  'Pérdida de Peso': '#22c55e',
  'Movilidad': '#a855f7'
};

function ProgramStat({ label, value, sub }: { label: string, value: string, sub?: string }) {
  return (
    <div style={{ flex: 1, background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '25px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
       <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 900, letterSpacing: '2px', marginBottom: '0.5rem' }}>{label}</div>
       <div style={{ fontSize: '2.5rem', fontFamily: 'Oswald', color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
       {sub && <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  );
}

function ProgramTag({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-subtle)', padding: '1rem 2rem', borderRadius: '20px', minWidth: '120px' }}>
       <div style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{icon}</div>
       <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, marginBottom: '0.2rem' }}>{label}</div>
       <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{value}</div>
    </div>
  );
}

function SocialLink({ icon, label, url }: { icon: any, label: string, url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1.5rem', borderRadius: '16px', background: 'var(--bg-subtle)', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.3s' }}>
      {icon} {label}
    </a>
  );
}

function ProfileWorkoutCard({ workout, onUnpublish, onView, isPublishing }: { workout: any, onUnpublish: () => void, onView: () => void, isPublishing: boolean }) {
  const goalColor = GOAL_COLORS[workout.objetivo] || 'var(--accent-primary)';

  return (
    <div 
      style={{ 
        borderRadius: '40px', 
        background: 'var(--bg-card)', 
        border: '1px solid var(--glass-border)', 
        overflow: 'hidden', 
        display: 'flex',
        height: '340px',
        transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
        cursor: 'default'
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-12px)';
        e.currentTarget.style.borderColor = `${goalColor}44`;
        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ width: '220px', position: 'relative', overflow: 'hidden' }}>
        <img 
          src={workout.imagen_url || WORKOUT_IMAGES[0]} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s' }} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = WORKOUT_IMAGES[0];
          }}
        />
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
          <div style={{ padding: '0.4rem 1rem', borderRadius: '10px', background: goalColor, color: 'var(--text-main)', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {workout.objetivo}
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 0%, rgba(10,10,10,0.4) 100%)' }} />
      </div>

      <div style={{ padding: '3rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ color: goalColor, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.5rem' }}>PROGRAMA PUBLICADO</div>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '2.8rem', margin: 0, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.5px' }}>{workout.nombre}</h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '2rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}><Activity size={14} color={goalColor} /> {workout.nivel}</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}><Timer size={14} color={goalColor} /> {workout.duracion}</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}><Dumbbell size={14} color={goalColor} /> {workout.ejercicios?.length} ex.</div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '1.2rem' }}>
           <button 
              onClick={onView} 
              style={{ 
                flex: 1.5, padding: '1.2rem', borderRadius: '18px', 
                background: 'transparent', border: '2px solid var(--text-main)', 
                color: 'var(--text-main)', fontWeight: 800, fontFamily: 'Oswald', fontSize: '1.1rem', 
                textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', 
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--text-main)';
                e.currentTarget.style.color = 'var(--bg-dark)';
                e.currentTarget.style.transform = 'scale(1.02) translateY(-3px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
              }}
           >Ver Programa</button>
           <button 
              onClick={onUnpublish} 
              disabled={isPublishing} 
              style={{ 
                flex: 1, padding: '1.2rem', borderRadius: '18px', 
                background: 'rgba(var(--text-main-rgb), 0.03)', color: 'var(--text-muted)', 
                fontWeight: 800, fontFamily: 'Oswald', fontSize: '1rem', 
                textTransform: 'uppercase', cursor: 'pointer', 
                border: '1px solid var(--glass-border)', transition: 'all 0.3s' 
              }}
              onMouseOver={e => {
                if (!isPublishing) {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.borderColor = '#ef4444';
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(var(--text-main-rgb), 0.03)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
           >{isPublishing ? '...' : 'Retirar'}</button>
        </div>
      </div>
    </div>
  );
}

function WorkoutCard({ workout, onView, dbExercises }: { workout: any, onView: () => void, dbExercises: any[] }) {
  const goalColor = GOAL_COLORS[workout.objetivo] || 'var(--accent-primary)';

  return (
    <div 
      style={{ 
        minWidth: '400px', 
        borderRadius: '35px', 
        background: 'var(--bg-subtle)', 
        border: '1px solid rgba(255,255,255,0.06)', 
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: '260px', position: 'relative' }}>
        <img src={workout.imagen_url || WORKOUT_IMAGES[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
          <div style={{ padding: '0.5rem 1.2rem', borderRadius: '12px', background: goalColor, color: 'var(--text-main)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: `0 10px 20px ${goalColor}44` }}>
            {workout.objetivo}
          </div>
        </div>
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
          <Star size={14} color="#FFD700" fill="#FFD700" />
          <span style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem' }}>{workout.rating_avg ? workout.rating_avg.toFixed(1) : '0.0'}</span>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', margin: 0, textTransform: 'uppercase', color: 'var(--text-main)', lineHeight: 1 }}>{workout.nombre}</h3>
        </div>
      </div>

      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Activity size={16} color="var(--accent-primary)" /> {workout.nivel}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Timer size={16} color="var(--accent-primary)" /> {workout.duracion}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Dumbbell size={16} color="var(--accent-primary)" /> {workout.ejercicios?.length || 0} ejercicios
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Star size={16} color="#FFD700" fill="#FFD700" /> {workout.rating_count || 0} reseñas
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {Array.from(new Set(workout.ejercicios?.map((exName: string) => {
            const ex = dbExercises.find(e => e.nombre.toLowerCase() === exName.trim().toLowerCase());
            return ex?.grupo_muscular;
          }).filter(Boolean))).map((muscle: any, idx) => (
            <span key={idx} style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid var(--glass-border)' }}>
              {muscle}
            </span>
          ))}
        </div>

        <button 
          onClick={onView} 
          style={{ 
            width: '100%', padding: '1.4rem', borderRadius: '22px', 
            background: 'transparent', border: '2px solid var(--text-main)', 
            color: 'var(--text-main)', fontWeight: 800, fontFamily: 'Oswald', fontSize: '1.2rem',
            textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'var(--text-main)';
            e.currentTarget.style.color = 'var(--bg-dark)';
            e.currentTarget.style.transform = 'scale(1.02) translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(var(--text-main-rgb), 0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Ver Programa
        </button>
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
    <div ref={containerRef} style={{ position: 'relative', minWidth: '180px' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.8rem 1.5rem',
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
        <span>
          {selected.length === 0 ? label : `${selected.length} SELECCIONADOS`}
        </span>
        <ChevronRight 
          size={16} 
          style={{ 
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
            transition: 'transform 0.3s',
            opacity: 0.6
          }} 
        />
      </button>

      {isOpen && (
        <div 
          className="animate-fade-in-up"
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            width: '480px',
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
            zIndex: 1000,
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

export default function ExplorarRutinas({ user, onAdopt, theme }: { user: any, onAdopt: () => void, theme: 'light' | 'dark' }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [publicWorkouts, setPublicWorkouts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterGoals, setFilterGoals] = useState<string[]>([]);
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterMuscles, setFilterMuscles] = useState<string[]>([]);
  const [adopting, setAdopting] = useState<string | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [activeSubTab, setActiveSubTab] = useState<'perfil' | 'comunidad'>('perfil');
  const [userWorkouts, setUserWorkouts] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [showPublisher, setShowPublisher] = useState(false);
  const [selectedToPublish, setSelectedToPublish] = useState<any | null>(null);
  const [publishDesc, setPublishDesc] = useState('');
  const [publishImg, setPublishImg] = useState('');
  const [publishGoal, setPublishGoal] = useState('');
  const [publishLevel, setPublishLevel] = useState('');
  const [publishDuration, setPublishDuration] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [viewingRoutine, setViewingRoutine] = useState<any | null>(null);
  const [routineReviews, setRoutineReviews] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [sharingRoutine, setSharingRoutine] = useState<any | null>(null);
  const [viewingProfile, setViewingProfile] = useState<any | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean, title: string, message: string, onConfirm: () => void } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const scrollRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const GOALS = ['Todas', 'Hipertrofia', 'Fuerza', 'Pérdida de Peso', 'Resistencia', 'Movilidad'];
  const LEVELS = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

  const [dbExercises, setDbExercises] = useState<any[]>([]);

  const fetchUserWorkouts = async () => {
    const { getUserWorkouts, getExercises: getEx, getUserReviews } = await import('./actions');
    const [workoutsData, exercisesData, reviewsData] = await Promise.all([
      getUserWorkouts(user.id),
      getEx(),
      getUserReviews(user.id)
    ]);
    setUserWorkouts(workoutsData || []);
    setDbExercises(exercisesData || []);
    setUserReviews(reviewsData || []);
  };

  const openProfile = async (userId: string) => {
    if (userId === user.id) {
       setActiveSubTab('perfil');
       setViewingRoutine(null);
       return;
    }
    const data = await getPublicProfile(userId);
    if (data) {
       setViewingProfile(data);
       setViewingRoutine(null);
    }
  };

  const openViewingRoutine = async (w: any) => {
    setViewingRoutine(w);
    setRoutineReviews([]);
    const { getReviews } = await import('./actions');
    const data = await getReviews(w.id);
    setRoutineReviews(data);

    const myReview = data.find((r: any) => r.user_id === user.id);
    if (myReview) {
      setReviewRating(myReview.rating);
      setReviewComment(myReview.comment);
    } else {
      setReviewRating(0);
      setReviewComment('');
    }
  };

  useEffect(() => {
    async function load() {
      const data = await getPublicWorkouts();
      setPublicWorkouts(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    fetchUserWorkouts();
  }, [user.id]);

  useEffect(() => {
    if (activeSubTab === 'perfil') {
      fetchUserWorkouts();
    }
  }, [activeSubTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterGoals, filterMuscles]);

  const openDayModal = (w: any) => {
    setSelectedWorkout(w);
    setSelectedDays(w.dias || []);
    setShowDayModal(true);
  };

  const handleAdopt = async () => {
    if (!selectedWorkout) return;
    setAdopting(selectedWorkout.id);
    const res = await forkWorkout(selectedWorkout.id, user.id, selectedDays);
    if (res.success) {
      setShowDayModal(false);
      onAdopt();
    } else {
      alert("Error: " + res.error);
    }
    setAdopting(null);
  };

  const toggleDay = (d: string) => {
    setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('workout-images')
        .upload(fileName, file);

      if (error) {
        if (error.message.includes('bucket')) {
          alert("Error: El bucket 'workout-images' no existe en tu Supabase. Créalo y ponlo como público.");
        }
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('workout-images')
        .getPublicUrl(fileName);

      setPublishImg(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (selectedToPublish) {
      setPublishDesc(selectedToPublish.descripcion || '');
      setPublishImg(selectedToPublish.imagen_url || '');
      setPublishGoal(selectedToPublish.objetivo || '');
      setPublishLevel(selectedToPublish.nivel || 'Intermedio');
      setPublishDuration(selectedToPublish.duracion || '60 min');
    }
  }, [selectedToPublish]);

  const handlePublish = async () => {
    if (!selectedToPublish) return;
    setIsPublishing(selectedToPublish.id);
    const { saveWorkout } = await import('./actions');
    const res = await saveWorkout(selectedToPublish.id, user.id, {
      ...selectedToPublish,
      es_publico: true,
      descripcion: publishDesc,
      imagen_url: publishImg || selectedToPublish.imagen_url,
      objetivo: publishGoal,
      nivel: publishLevel,
      duracion: publishDuration,
      musculos: selectedToPublish.musculos || selectedToPublish.muscles || []
    });
    if (res.success) {
      await Promise.all([
        fetchUserWorkouts(),
        getPublicWorkouts().then(data => setPublicWorkouts(data))
      ]);
      setShowPublisher(false);
      setSelectedToPublish(null);
      setPublishDesc('');
      setPublishImg('');
    }
    setIsPublishing(null);
  };

  const handleUnpublish = async (workout: any) => {
    setIsPublishing(workout.id);
    const res = await unpublishWorkout(workout.id, user.id);
    if (res.success) {
      fetchUserWorkouts();
      const data = await getPublicWorkouts();
      setPublicWorkouts(data);
      showToast("Rutina retirada y valoraciones reseteadas", "success");
    } else {
      showToast(res.error || "Error al retirar la rutina", "error");
    }
    setIsPublishing(null);
  };

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const userPublicReviews = userReviews.filter(r => {
    const workout = userWorkouts.find(w => w.id === r.workout_id);
    return workout?.es_publico;
  });

  const filtered = publicWorkouts.filter(w => {
    if (w.usuario_id === user.id) return false;

    const matchesSearch = w.nombre.toLowerCase().includes(search.toLowerCase()) || 
                         w.objetivo.toLowerCase().includes(search.toLowerCase());
    const matchesGoal = filterGoals.length === 0 || filterGoals.includes(w.objetivo);

    let matchesMuscle = true;
    if (filterMuscles.length > 0) {
      matchesMuscle = w.ejercicios && w.ejercicios.some((exName: string) => {
        const ex = dbExercises.find(e => e.nombre.toLowerCase() === exName.trim().toLowerCase());
        return ex && ex.grupo_muscular && filterMuscles.some(m => ex.grupo_muscular.toLowerCase().includes(m.toLowerCase()));
      });
    }

    return matchesSearch && matchesGoal && matchesMuscle;
  });

  const popular = [...filtered].sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0)).slice(0, 8);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0' }}>
      <div className="animate-spin" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)' }} />
      <p style={{ marginTop: '2.5rem', color: 'var(--text-muted)', fontFamily: 'Oswald', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '1.1rem' }}>Sintonizando el Nexo VigorNova...</p>
    </div>
  );

  return (
    <>
      <div className="animate-fade-in-up" style={{ paddingBottom: '5rem' }}>
        <div className="flex-stack-mobile" style={{ display: 'flex', gap: '3rem', marginBottom: '4rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <button 
            onClick={() => setActiveSubTab('perfil')}
            style={{ 
              background: 'none', border: 'none', color: activeSubTab === 'perfil' ? 'var(--accent-primary)' : 'var(--text-muted)', 
              fontFamily: 'Oswald', fontSize: '1.6rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              position: 'relative', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '0.8rem',
              transform: activeSubTab === 'perfil' ? 'translateY(0)' : 'translateY(2px)'
            }}
            onMouseOver={e => { if(activeSubTab !== 'perfil') { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            onMouseOut={e => { if(activeSubTab !== 'perfil') { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateY(2px)'; } }}
          >
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: activeSubTab === 'perfil' ? 'rgba(var(--accent-primary-rgb), 0.15)' : 'transparent', transition: 'all 0.3s' }}>
              <User size={20} />
            </div>
            Mi Perfil
            {activeSubTab === 'perfil' && <div style={{ position: 'absolute', bottom: '-1.1rem', left: 0, right: 0, height: '4px', background: 'var(--accent-primary)', borderRadius: '2px 2px 0 0', boxShadow: '0 0 15px var(--accent-primary)' }} />}
          </button>
          <button 
            onClick={() => setActiveSubTab('comunidad')}
            style={{ 
              background: 'none', border: 'none', color: activeSubTab === 'comunidad' ? 'var(--accent-primary)' : 'var(--text-muted)', 
              fontFamily: 'Oswald', fontSize: '1.6rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              position: 'relative', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '0.8rem',
              transform: activeSubTab === 'comunidad' ? 'translateY(0)' : 'translateY(2px)'
            }}
            onMouseOver={e => { if(activeSubTab !== 'comunidad') { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            onMouseOut={e => { if(activeSubTab !== 'comunidad') { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateY(2px)'; } }}
          >
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: activeSubTab === 'comunidad' ? 'rgba(var(--accent-primary-rgb), 0.15)' : 'transparent', transition: 'all 0.3s' }}>
              <Globe size={20} />
            </div>
            Explorar Comunidad
            {activeSubTab === 'comunidad' && <div style={{ position: 'absolute', bottom: '-1.1rem', left: 0, right: 0, height: '4px', background: 'var(--accent-primary)', borderRadius: '2px 2px 0 0', boxShadow: '0 0 15px var(--accent-primary)' }} />}
          </button>
        </div>

        {activeSubTab === 'perfil' ? (
          <div className="animate-fade-in-up">
            <div style={{ 
              background: 'var(--bg-subtle)',
              borderRadius: '50px', border: '1px solid var(--glass-border)', padding: '0', marginBottom: '6rem',
              position: 'relative', overflow: 'hidden'
            }}>

              <div className="profile-banner-res" style={{ height: '160px', background: theme === 'dark' ? 'linear-gradient(90deg, #111 0%, #222 100%)' : 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%)', position: 'relative', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
                <div className="profile-avatar-res" style={{ position: 'absolute', bottom: '-50px', left: '4rem', zIndex: 2 }}>
                  <div style={{ 
                    width: '180px', height: '180px', borderRadius: '45px', background: '#0a0a0a', padding: '6px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', border: '1px solid var(--glass-border)'
                  }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '39px', overflow: 'hidden', position: 'relative' }}>
                      {user.foto_perfil ? (
                        <img src={user.foto_perfil} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4.5rem', fontWeight: 900, fontFamily: 'Oswald', color: 'var(--accent-primary)', background: 'var(--bg-subtle)' }}>
                          {user.name?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-info-res" style={{ padding: '4rem', paddingTop: '6rem', display: 'flex', gap: '4rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }} className="w-full-mobile">
                  <div className="flex-stack-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                    <h2 className="profile-name-res" style={{ fontSize: '4.5rem', fontFamily: 'Oswald', margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>{user.name}</h2>
                    {user.verificado && <div style={{ background: '#3b82f6', color: 'var(--text-main)', padding: '0.4rem 1rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Verificado</div>}
                  </div>

                  <div className="flex-stack-mobile" style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <MapPin size={20} color="var(--accent-primary)" />
                      {user.ubicacion || 'Localización no especificada'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Calendar size={20} color="var(--accent-primary)" />
                      Desde {new Date(user.created_at || Date.now()).getFullYear()}
                    </div>
                  </div>

                  <p style={{ fontSize: '1.4rem', color: 'var(--text-main)', lineHeight: 1.6, maxWidth: '800px', fontWeight: 300, opacity: 0.9, fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '2rem', marginBottom: '3rem' }}>
                    "{user.descripcion || 'Sin biografía disponible.'}"
                  </p>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {user.instagram && <SocialLink icon={<Camera size={20} />} label="Instagram" url={`https://instagram.com/${user.instagram}`} />}
                    {user.twitter && <SocialLink icon={<Share2 size={20} />} label="Twitter" url={`https://twitter.com/${user.twitter}`} />}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                   <div style={{ padding: '2.5rem', borderRadius: '35px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', textAlign: 'center', minWidth: '160px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                      <div style={{ color: 'var(--accent-primary)', fontFamily: 'Oswald', fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>{userWorkouts.filter(w => w.es_publico).length}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', letterSpacing: '1px' }}>Rutinas</div>
                   </div>
                   <div style={{ padding: '2.5rem', borderRadius: '35px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', textAlign: 'center', minWidth: '160px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                      <div style={{ color: 'var(--text-main)', fontFamily: 'Oswald', fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>
                        {userReviews.length > 0 ? (userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length).toFixed(1) : "0.0"}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', letterSpacing: '1px' }}>Valoración</div>
                   </div>
                   <div style={{ padding: '2.5rem', borderRadius: '35px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', textAlign: 'center', minWidth: '160px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                      <div style={{ color: 'var(--text-main)', fontFamily: 'Oswald', fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>{userReviews.length}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', letterSpacing: '1px' }}>Reseñas</div>
                   </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                <div className="text-center-mobile">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'inherit', gap: '0.8rem', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '0.8rem' }}>
                    <Share2 size={20} /> Mi Escaparate
                  </div>
                  <h3 style={{ fontFamily: 'Oswald', fontSize: '3.5rem', textTransform: 'uppercase', margin: 0 }}>Mis Rutinas <span style={{ color: 'var(--text-muted)' }}>Publicadas</span></h3>
                </div>
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPublisher(true); }}
                  style={{ 
                    padding: '1rem 2.2rem', borderRadius: '18px', background: '#000', color: 'var(--accent-primary)', border: '2px solid var(--accent-primary)', 
                    fontFamily: 'Oswald', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', gap: '1rem',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 45px rgba(var(--accent-primary-rgb), 0.5)';
                    e.currentTarget.style.background = 'var(--accent-primary)';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
                    e.currentTarget.style.background = '#000';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                >
                  Publicar Nueva
                </button>
              </div>

              <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '3rem' }}>
                {userWorkouts.filter(w => w.es_publico).length > 0 ? userWorkouts.filter(w => w.es_publico).map(w => (
                  <ProfileWorkoutCard 
                    key={w.id} 
                    workout={w} 
                    onUnpublish={() => handleUnpublish(w)}
                    onView={() => openViewingRoutine(w)}
                    isPublishing={isPublishing === w.id}
                  />
                )) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '8rem', background: 'var(--bg-subtle)', border: '2px dashed var(--glass-border)', borderRadius: '40px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.5rem', fontFamily: 'Oswald', letterSpacing: '1px' }}>AÚN NO HAS PUBLICADO NINGUNA RUTINA</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '0.8rem' }}>
                <Star size={20} /> Feedback
              </div>
              <h3 style={{ fontFamily: 'Oswald', fontSize: '3.5rem', textTransform: 'uppercase', marginBottom: '4rem' }}>Reseñas <span style={{ color: 'var(--text-muted)' }}>Recibidas</span></h3>

              <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {userPublicReviews.length > 0 ? userPublicReviews.map((r, i) => (
                  <div key={i} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '30px', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', background: '#333' }}>
                          {r.user_avatar ? <img src={r.user_avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={20} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{r.user_name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>En: {r.workout_name}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={r.rating >= s ? '#ffd700' : 'none'} color={r.rating >= s ? '#ffd700' : '#444'} />)}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{r.comment}"</p>
                    <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#444', fontWeight: 600 }}>{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                )) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: 'var(--bg-subtle)', border: '1px dashed var(--glass-border)', borderRadius: '40px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', fontFamily: 'Oswald' }}>Todavía no has recibido ninguna reseña.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeSubTab === 'comunidad' ? (
          <>
            <div style={{ marginBottom: '6rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-250px', right: '-150px', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(var(--accent-primary-rgb),0.25) 0%, transparent 70%)', opacity: 0.4, filter: 'blur(100px)', pointerEvents: 'none' }} />
              <h1 style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', fontFamily: 'Oswald', textTransform: 'uppercase', margin: '0 0 1rem 0', lineHeight: 0.85, letterSpacing: '-4px', fontWeight: 800 }}>
                DOMINA LA <br />
                <span style={{ background: 'linear-gradient(to right, var(--accent-primary), #ff6b6b, #f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>COMUNIDAD</span>
              </h1>
              <div style={{ position: 'relative', maxWidth: '700px', marginTop: '3rem', zIndex: 100 }}>
                <div style={{ background: theme === 'dark' ? 'rgba(15,15,15,0.7)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(30px)', borderRadius: '20px', display: 'flex', alignItems: 'center', padding: '0.4rem 0.6rem', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                  <Search size={22} color="var(--accent-primary)" style={{ marginLeft: '1.2rem', opacity: 0.8 }} />
                  <input 
                    type="text" placeholder="Buscar rutinas..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1.2rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.1rem', outline: 'none', fontWeight: 500 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
                  <MultiSelect 
                    label="TIPO DE RUTINA"
                    options={GOALS.filter(g => g !== 'Todas')}
                    selected={filterGoals}
                    onChange={setFilterGoals}
                  />
                  <MultiSelect 
                    label="FILTRAR POR MÚSCULO"
                    options={['Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Cardio', 'Cuádriceps', 'Isquiotibiales', 'Core', 'Gemelos']}
                    selected={filterMuscles}
                    onChange={setFilterMuscles}
                  />
                </div>
              </div>
            </div>

            <section>
              <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                <h2 style={{ fontFamily: 'Oswald', fontSize: 'clamp(2.5rem, 8vw, 4.2rem)', textTransform: 'uppercase', margin: 0 }}>MEJOR <span style={{ color: 'var(--accent-primary)' }}>VALORADAS</span></h2>
                <div style={{ display: 'flex', gap: '1.2rem' }} className="hide-mobile">
                   <button 
                     type="button" 
                     onClick={(e) => { e.preventDefault(); scroll('left', scrollRef); }} 
                     style={{ 
                       width: '65px', height: '65px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer',
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                     }}
                     onMouseOver={e => {
                       e.currentTarget.style.transform = 'scale(1.05)';
                       e.currentTarget.style.borderColor = 'var(--accent-primary)';
                       e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb), 0.1)';
                       (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateX(-4px)';
                     }}
                     onMouseOut={e => {
                       e.currentTarget.style.transform = 'scale(1)';
                       e.currentTarget.style.borderColor = 'var(--glass-border)';
                       e.currentTarget.style.background = 'var(--bg-card)';
                       (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateX(0)';
                     }}
                   >
                     <ChevronLeft size={32} style={{ transition: 'transform 0.3s' }} />
                   </button>
                   <button 
                     type="button" 
                     onClick={(e) => { e.preventDefault(); scroll('right', scrollRef); }} 
                     style={{ 
                       width: '65px', height: '65px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer',
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                     }}
                     onMouseOver={e => {
                       e.currentTarget.style.transform = 'scale(1.05)';
                       e.currentTarget.style.borderColor = 'var(--accent-primary)';
                       e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb), 0.1)';
                       (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateX(4px)';
                     }}
                     onMouseOut={e => {
                       e.currentTarget.style.transform = 'scale(1)';
                       e.currentTarget.style.borderColor = 'var(--glass-border)';
                       e.currentTarget.style.background = 'var(--bg-card)';
                       (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateX(0)';
                     }}
                   >
                     <ChevronRight size={32} style={{ transition: 'transform 0.3s' }} />
                   </button>
                </div>
              </div>
              <div ref={scrollRef} style={{ display: 'flex', gap: '2.5rem', overflowX: 'auto', padding: '2rem 0', scrollbarWidth: 'none' }}>
                 {popular.map(w => <WorkoutCard key={w.id} workout={w} onView={() => openViewingRoutine(w)} dbExercises={dbExercises} />)}
              </div>
            </section>

            <section style={{ marginTop: '8rem' }}>
              <div className="flex-stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                <h2 style={{ fontFamily: 'Oswald', fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', textTransform: 'uppercase', margin: 0 }}>EXPLORA EL <span style={{ color: 'var(--accent-primary)' }}>CATÁLOGO</span></h2>
                <div style={{ display: 'flex', gap: '1.2rem' }} className="hide-mobile">
                   <button 
                     type="button" 
                     onClick={(e) => { e.preventDefault(); scroll('left', catalogRef); }} 
                     style={{ 
                       width: '65px', height: '65px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer',
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                     }}
                     onMouseOver={e => {
                       e.currentTarget.style.transform = 'scale(1.05)';
                       e.currentTarget.style.borderColor = 'var(--accent-primary)';
                       e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb), 0.1)';
                       (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateX(-4px)';
                     }}
                     onMouseOut={e => {
                       e.currentTarget.style.transform = 'scale(1)';
                       e.currentTarget.style.borderColor = 'var(--glass-border)';
                       e.currentTarget.style.background = 'var(--bg-card)';
                       (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateX(0)';
                     }}
                   >
                     <ChevronLeft size={32} style={{ transition: 'transform 0.3s' }} />
                   </button>
                   <button 
                     type="button" 
                     onClick={(e) => { e.preventDefault(); scroll('right', catalogRef); }} 
                     style={{ 
                       width: '65px', height: '65px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer',
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                     }}
                     onMouseOver={e => {
                       e.currentTarget.style.transform = 'scale(1.05)';
                       e.currentTarget.style.borderColor = 'var(--accent-primary)';
                       e.currentTarget.style.background = 'rgba(var(--accent-primary-rgb), 0.1)';
                       (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateX(4px)';
                     }}
                     onMouseOut={e => {
                       e.currentTarget.style.transform = 'scale(1)';
                       e.currentTarget.style.borderColor = 'var(--glass-border)';
                       e.currentTarget.style.background = 'var(--bg-card)';
                       (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateX(0)';
                     }}
                   >
                     <ChevronRight size={32} style={{ transition: 'transform 0.3s' }} />
                   </button>
                </div>
              </div>
              <div ref={catalogRef} className="hide-scrollbar" style={{ display: 'flex', gap: '2.5rem', overflowX: 'auto', padding: '2rem 0' }}>
                {filtered.map(w => (
                  <div key={w.id} style={{ minWidth: 'min(400px, 85vw)' }}>
                    <WorkoutCard workout={w} onView={() => openViewingRoutine(w)} dbExercises={dbExercises} />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {showPublisher && ReactDOM.createPortal(
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(40px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => { setShowPublisher(false); setSelectedToPublish(null); setPublishImg(''); }}>
            <div 
              className="modal-content-res"
              style={{ 
                background: 'var(--bg-card)', border: '1px solid var(--glass-border)', 
                borderRadius: '50px', width: '100%', maxWidth: '1100px', 
                maxHeight: '90vh', overflowY: 'auto', padding: '5rem',
                position: 'relative', boxShadow: theme === 'dark' ? '0 50px 150px rgba(0,0,0,1)' : 'var(--card-shadow)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { setShowPublisher(false); setSelectedToPublish(null); setPublishImg(''); }} 
                style={{ 
                  position: 'absolute', top: '3rem', right: '3.5rem', background: 'transparent', 
                  border: '2px solid var(--accent-primary)', borderRadius: '15px', width: '60px', height: '60px', 
                  color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'black';
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <X size={32} />
              </button>

              <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'Oswald', fontSize: '6rem', margin: '0 0 1rem 0', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '-2px', color: 'var(--text-main)', lineHeight: 1 }}>
                  EDITOR DE <span style={{ color: 'var(--accent-primary)' }}>PUBLICACIONES</span>
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2.5rem' }}>
                    1. SELECCIONAR RUTINA
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {userWorkouts.filter(w => !w.es_publico).length > 0 ? userWorkouts.filter(w => !w.es_publico).map(w => (
                      <div 
                        key={w.id} 
                        onClick={() => setSelectedToPublish(w)}
                        style={{ 
                          padding: '1.5rem 2rem', borderRadius: '25px', border: '1px solid',
                          borderColor: selectedToPublish?.id === w.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                          background: selectedToPublish?.id === w.id ? 'rgba(var(--accent-primary-rgb), 0.05)' : 'rgba(255,255,255,0.02)',
                          cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)', 
                          display: 'flex', alignItems: 'center', gap: '2rem',
                          transform: selectedToPublish?.id === w.id ? 'scale(1.02)' : 'scale(1)'
                        }}
                        onMouseOver={e => { if (selectedToPublish?.id !== w.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                        onMouseOut={e => { if (selectedToPublish?.id !== w.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                      >
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Dumbbell size={20} color={selectedToPublish?.id === w.id ? 'var(--accent-primary)' : '#444'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Oswald', textTransform: 'uppercase', color: selectedToPublish?.id === w.id ? 'white' : '#888' }}>{w.nombre}</div>
                          <div style={{ fontSize: '0.8rem', color: '#444', marginTop: '0.4rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500 }}>
                            {w.ejercicios.join(' · ')}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 900, marginTop: '0.5rem', letterSpacing: '1px' }}>{w.ejercicios.length} EJERCICIOS</div>
                        </div>
                        {selectedToPublish?.id === w.id && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 20px var(--accent-primary)' }} />}
                      </div>
                    )) : (
                      <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-subtle)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '30px' }}>
                        <p style={{ color: '#444', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>No hay rutinas privadas en tu biblioteca</p>
                      </div>
                    )}
                  </div>

                  {selectedToPublish && (
                    <div style={{ 
                      marginTop: '2.5rem', padding: '2rem', background: 'var(--bg-subtle)', 
                      border: '1px solid var(--glass-border)', borderRadius: '30px'
                    }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>
                        VISTA PREVIA DE EJERCICIOS
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1.5rem' }}>
                         {selectedToPublish.ejercicios.map((exName: string, i: number) => {
                            const ex = dbExercises.find(e => e.nombre.toLowerCase() === exName.trim().toLowerCase());
                            const exImg = ex?.url_video || ex?.imagen_url || ex?.url_imagen || WORKOUT_IMAGES[i % WORKOUT_IMAGES.length];
                            return (
                              <div key={i} style={{ textAlign: 'center' }}>
                                 <div style={{ width: '100%', aspectRatio: '1', borderRadius: '15px', overflow: 'hidden', background: '#000', marginBottom: '0.8rem', border: '1px solid var(--glass-border)' }}>
                                   <img 
                                     src={exImg} 
                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                     onError={e => { (e.target as HTMLImageElement).src = WORKOUT_IMAGES[i % WORKOUT_IMAGES.length]; }}
                                   />
                                 </div>
                                 <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', fontWeight: 800, fontFamily: 'Oswald', letterSpacing: '0.5px' }}>{exName}</div>
                              </div>
                            );
                         })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>
                    2. DESCRIPCIÓN
                  </label>
                  <textarea 
                    placeholder="Escribe aquí los secretos de este programa..."
                    value={publishDesc}
                    onChange={e => setPublishDesc(e.target.value)}
                    style={{ 
                      width: '100%', height: '180px', background: 'var(--bg-subtle)', 
                      border: '1px solid var(--glass-border)', borderRadius: '30px', 
                      padding: '2rem', color: 'var(--text-main)', fontSize: '1.1rem', 
                      outline: 'none', fontFamily: 'Inter', resize: 'none', lineHeight: 1.6,
                      transition: 'all 0.3s', marginBottom: '2.5rem'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                  />

                  <label style={{ display: 'block', fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>
                    3. IMAGEN DE PORTADA
                  </label>

                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ 
                        width: '120px', height: '120px', borderRadius: '20px', 
                        background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', 
                        overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', cursor: 'pointer', position: 'relative' 
                      }}
                    >
                      {isUploading ? (
                        <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
                      ) : (publishImg || selectedToPublish?.imagen_url) ? (
                        <>
                          <img src={publishImg || selectedToPublish?.imagen_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0'}>
                            <Camera size={24} color="white" />
                          </div>
                        </>
                      ) : (
                        <Camera size={30} color="#333" />
                      )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                      />
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <input 
                          type="text" 
                          placeholder="Pega un link o sube una foto..." 
                          value={publishImg}
                          onChange={e => setPublishImg(e.target.value)}
                          style={{ flex: 1, padding: '1rem 1.5rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '15px', color: 'var(--text-main)', outline: 'none' }}
                        />
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                          style={{ 
                            padding: '0 1.5rem', borderRadius: '15px', background: '#000', border: '2px solid var(--accent-primary)', color: 'var(--accent-primary)', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '0.8rem', fontFamily: 'Oswald',
                            textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s' 
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = 'var(--accent-primary)';
                            e.currentTarget.style.color = '#000';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = '#000';
                            e.currentTarget.style.color = 'var(--accent-primary)';
                          }}
                        >
                          <Upload size={16} /> SUBIR
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        {WORKOUT_IMAGES.map((img, i) => (
                          <button 
                            type="button"
                            key={i} 
                            onClick={(e) => { e.preventDefault(); setPublishImg(img); }}
                            style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', border: publishImg === img ? '2px solid var(--accent-primary)' : '1px solid transparent', padding: 0, cursor: 'pointer' }}
                          >
                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <label style={{ display: 'block', fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>
                    4. MÉTRICAS Y DETALLES
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Nivel</label>
                      <select 
                        value={publishLevel} 
                        onChange={e => setPublishLevel(e.target.value)} 
                        style={{ 
                          width: '100%', padding: '0.8rem 1.2rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', 
                          borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontFamily: 'Oswald', fontSize: '0.9rem',
                          cursor: 'pointer', transition: 'all 0.3s'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                      >
                        {['Principiante', 'Intermedio', 'Avanzado', 'Élite'].map(l => <option key={l} value={l} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Duración</label>
                      <input type="text" value={publishDuration} onChange={e => setPublishDuration(e.target.value)} style={{ width: '100%', padding: '1rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '15px', color: 'var(--text-main)', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Objetivo</label>
                      <select 
                        value={publishGoal} 
                        onChange={e => setPublishGoal(e.target.value)} 
                        style={{ 
                          width: '100%', padding: '0.8rem 1.2rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', 
                          borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontFamily: 'Oswald', fontSize: '0.9rem',
                          cursor: 'pointer', transition: 'all 0.3s'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                      >
                        {GOALS.filter(g => g !== 'Todas').map(g => <option key={g} value={g} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{g}</option>)}
                      </select>
                    </div>
                  </div>

                  <button 
                    disabled={!selectedToPublish || !publishDesc.trim() || !!isPublishing}
                    onClick={handlePublish}
                    style={{ 
                      width: '100%', marginTop: '1rem', padding: '1.8rem', 
                      borderRadius: '30px', 
                      background: !selectedToPublish || !publishDesc.trim() ? 'var(--bg-subtle)' : '#000',
                      color: !selectedToPublish || !publishDesc.trim() ? 'var(--text-muted)' : 'var(--accent-primary)', 
                      fontWeight: 900, fontFamily: 'Oswald', fontSize: '1.8rem',
                      textTransform: 'uppercase', letterSpacing: '3px', cursor: selectedToPublish && publishDesc.trim() ? 'pointer' : 'not-allowed',
                      border: !selectedToPublish || !publishDesc.trim() ? 'none' : '2px solid var(--accent-primary)', 
                      transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)', 
                      boxShadow: !selectedToPublish || !publishDesc.trim() ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.3)',
                      opacity: !selectedToPublish || !publishDesc.trim() ? 0.5 : 1
                    }}
                    onMouseOver={e => { 
                      if (selectedToPublish && publishDesc.trim()) {
                        e.currentTarget.style.background = 'var(--accent-primary)';
                        e.currentTarget.style.color = '#000';
                      }
                    }}
                    onMouseOut={e => { 
                      if (selectedToPublish && publishDesc.trim()) {
                        e.currentTarget.style.background = '#000';
                        e.currentTarget.style.color = 'var(--accent-primary)';
                      }
                    }}
                  >
                    {isPublishing ? 'PUBLICANDO...' : 'SUBIR A MI PERFIL'}
                  </button>
                </div>
              </div>
            </div>
          </div>, document.body
        )}

        {viewingRoutine && ReactDOM.createPortal(
          <div style={{ position: 'fixed', inset: 0, background: theme === 'dark' ? 'rgba(0,0,0,0.98)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(30px)', zIndex: 100000, overflowY: 'auto', padding: '4rem 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <button 
                onClick={() => setViewingRoutine(null)} 
                style={{ 
                  position: 'fixed', top: '2rem', right: '4rem', background: 'transparent', 
                  border: '2px solid var(--accent-primary)', borderRadius: '15px', width: '60px', height: '60px', 
                  color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'black';
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <X size={32} />
              </button>
              <div style={{ position: 'relative', height: '450px', borderRadius: '50px', overflow: 'hidden', marginBottom: '4rem' }}>
                <img src={viewingRoutine.imagen_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '4rem', left: '4rem' }}>
                   <div style={{ color: 'var(--accent-primary)', fontWeight: 900, letterSpacing: '4px' }}>PROGRAMA</div>
                   <h1 style={{ fontSize: '8rem', fontFamily: 'Oswald', textTransform: 'uppercase', margin: 0 }}>{viewingRoutine.nombre}</h1>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '5rem', padding: '0 4rem' }}>
                <div style={{ flex: 2 }}>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem', justifyContent: 'center' }}>
                       <ProgramStat 
                         label="VALORACIÓN" 
                         value={routineReviews.length > 0 ? (routineReviews.reduce((acc, r) => acc + r.rating, 0) / routineReviews.length).toFixed(1) : "0.0"} 
                         sub={"★".repeat(Math.round(routineReviews.length > 0 ? routineReviews.reduce((acc, r) => acc + r.rating, 0) / routineReviews.length : 0)) + "☆".repeat(5 - Math.round(routineReviews.length > 0 ? routineReviews.reduce((acc, r) => acc + r.rating, 0) / routineReviews.length : 0))} 
                       />
                       <ProgramStat label="RESEÑAS" value={routineReviews.length.toString()} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '2rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                         <ProgramTag icon={<Activity size={18}/>} label="Nivel" value={viewingRoutine.nivel} />
                         <ProgramTag icon={<Timer size={18}/>} label="Duración" value={viewingRoutine.duracion} />
                         <ProgramTag icon={<Target size={18}/>} label="Objetivo" value={viewingRoutine.objetivo} />
                      </div>

                      {viewingRoutine.usuarios && (
                        <div 
                          onClick={() => openProfile(viewingRoutine.usuario_id)}
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'var(--bg-subtle)', padding: '0.8rem 1.8rem', borderRadius: '22px', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <div style={{ width: '45px', height: '45px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                            <img 
                              src={viewingRoutine.usuarios.foto_perfil || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          <div style={{ lineHeight: 1.1 }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.2rem' }}>AUTOR</div>
                            <div style={{ fontSize: '1.2rem', fontFamily: 'Oswald', color: 'var(--text-main)', textTransform: 'uppercase' }}>{viewingRoutine.usuarios.nombre}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ marginBottom: '4rem' }}>
                       <h3 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Descripción</h3>
                       <div style={{ color: 'var(--text-muted)', fontSize: '1.3rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{viewingRoutine.descripcion}</div>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '3rem' }}>Ejercicios en el Programa</h3>
                      {viewingRoutine.ejercicios?.map((exName: string, idx: number) => {
                        const exerciseData = dbExercises.find(e => 
                          e.nombre.trim().toLowerCase() === exName.trim().toLowerCase()
                        );

                        const img = exerciseData?.url_video || 
                                    exerciseData?.imagen_url || 
                                    exerciseData?.url_imagen ||
                                    WORKOUT_IMAGES[idx % WORKOUT_IMAGES.length];

                        return (
                          <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '20px', marginBottom: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                             <div style={{ width: '80px', height: '80px', borderRadius: '15px', overflow: 'hidden', flexShrink: 0, background: '#000', border: '1px solid var(--glass-border)' }}>
                                <img 
                                  src={img} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                  alt={exName}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = WORKOUT_IMAGES[idx % WORKOUT_IMAGES.length];
                                  }}
                                />
                             </div>
                             <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'Oswald', textTransform: 'uppercase', color: 'var(--text-main)' }}>{exName}</h4>
                                {exerciseData && (
                                  <div style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {exerciseData.grupo_muscular} • {exerciseData.tipo}
                                  </div>
                                )}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
                <div 
                  style={{ 
                    flex: 1,
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '2rem'
                  }}
                >
                   <div style={{ padding: '3rem', borderRadius: '40px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', alignItems: 'center' }}>
                         <img src={viewingRoutine.imagen_url} style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover' }} />
                         <div>
                            <div style={{ fontWeight: 900, fontFamily: 'Oswald' }}>{viewingRoutine.nombre}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{viewingRoutine.ejercicios?.length} Ejercicios</div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button 
                          onClick={() => { openDayModal(viewingRoutine); setViewingRoutine(null); }}
                          style={{ 
                            width: '100%', padding: '1.2rem', borderRadius: '18px', 
                            background: 'transparent', border: '2px solid var(--accent-primary)', 
                            color: 'var(--accent-primary)', fontWeight: 800, cursor: 'pointer', 
                            fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '2px',
                            fontSize: '1.1rem', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = 'var(--accent-primary)';
                            e.currentTarget.style.color = 'black';
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(var(--accent-primary-rgb), 0.4)';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--accent-primary)';
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Guardar Rutina
                        </button>
                        <button 
                          onClick={() => setSharingRoutine(viewingRoutine)}
                          style={{ 
                            width: '100%', padding: '1.2rem', borderRadius: '18px', 
                            background: 'transparent', border: '2px solid white', 
                            color: 'white', fontWeight: 800, cursor: 'pointer', 
                            fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '2px',
                            fontSize: '1.1rem', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'black';
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(255,255,255,0.2)';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Compartir Rutina
                        </button>
                      </div>
                   </div>

                   <div style={{ padding: '3rem', borderRadius: '40px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)' }}>
                      <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '2rem' }}>Reseñas de la Comunidad</h3>

                      {viewingRoutine.usuario_id !== user.id && (
                        <div style={{ marginBottom: '3rem', padding: '2rem', borderRadius: '25px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                onMouseEnter={() => setReviewHover(star)}
                                onMouseLeave={() => setReviewHover(0)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                <Star 
                                  size={28} 
                                  fill={(reviewHover || reviewRating) >= star ? 'var(--accent-primary)' : 'none'} 
                                  color={(reviewHover || reviewRating) >= star ? 'var(--accent-primary)' : 'var(--text-muted)'} 
                                />
                              </button>
                            ))}
                          </div>
                          <textarea
                            placeholder="Escribe tu opinión..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '15px', padding: '1rem', color: 'var(--text-main)', outline: 'none', resize: 'none', marginBottom: '1rem' }}
                          />
                          <button
                            onClick={async () => {
                              if (reviewRating === 0) return showToast("Por favor, selecciona una valoración.", 'error');
                              setIsSubmittingReview(true);
                              const { addReview } = await import('./actions');
                              const res = await addReview(viewingRoutine.id, reviewRating, reviewComment, user.name, user.foto_perfil);
                              if (res.success) {
                                showToast("¡Reseña publicada con éxito!", 'success');
                                const { getReviews } = await import('./actions');
                                const data = await getReviews(viewingRoutine.id);
                                setRoutineReviews(data);
                                setReviewRating(0);
                                setReviewComment('');
                              } else {
                                showToast("Error: " + res.error, 'error');
                              }
                              setIsSubmittingReview(false);
                            }}
                            disabled={isSubmittingReview || reviewRating === 0}
                            style={{ width: '100%', padding: '1rem', borderRadius: '15px', background: 'var(--accent-primary)', color: 'var(--text-main)', fontWeight: 700, border: 'none', cursor: 'pointer', opacity: (isSubmittingReview || reviewRating === 0) ? 0.6 : 1 }}
                          >
                            {isSubmittingReview ? 'Enviando...' : (routineReviews.some(r => r.user_id === user.id) ? 'Actualizar Reseña' : 'Publicar Reseña')}
                          </button>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {routineReviews.length > 0 ? routineReviews.map((r, i) => (
                          <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: '#333' }}>
                                  {r.user_avatar ? <img src={r.user_avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={16} />}
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{r.user_id === user.id ? 'Tú' : r.user_name}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={r.rating >= s ? '#ffd700' : 'none'} color={r.rating >= s ? '#ffd700' : '#444'} />)}
                                </div>
                                {r.user_id === user.id && (
                                  <button 
                                    onClick={() => {
                                      setConfirmModal({
                                        show: true,
                                        title: "¿BORRAR RESEÑA?",
                                        message: "Esta acción eliminará tu valoración permanentemente. ¿Estás seguro?",
                                        onConfirm: async () => {
                                          const { deleteReview } = await import('./actions');
                                          const res = await deleteReview(r.id);
                                          if (res.success) {
                                            showToast("Reseña borrada", "success");
                                            const { getReviews } = await import('./actions');
                                            const data = await getReviews(viewingRoutine.id);
                                            setRoutineReviews(data);
                                            setReviewRating(0);
                                            setReviewComment('');
                                          } else {
                                            showToast(res.error || "Error al borrar", "error");
                                          }
                                          setConfirmModal(null);
                                        }
                                      });
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}
                                  >
                                    BORRAR
                                  </button>
                                )}
                              </div>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{r.comment}</p>
                          </div>
                        )) : (
                          <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>No hay reseñas todavía.</p>
                        )}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>, document.body
        )}

        {showDayModal && selectedWorkout && ReactDOM.createPortal(
          <div style={{ position: 'fixed', inset: 0, background: theme === 'dark' ? 'rgba(0,0,0,0.92)' : 'rgba(255,255,255,0.92)', backdropFilter: 'blur(15px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowDayModal(false)}>
            <div className="animate-fade-in-up" style={{ background: 'var(--bg-card)', borderRadius: '40px', width: '100%', maxWidth: '550px', padding: '4rem', position: 'relative', border: '1px solid var(--glass-border)', boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(var(--accent-primary-rgb), 0.05)' : 'var(--card-shadow)' }} onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowDayModal(false)} 
                style={{ 
                  position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', 
                  border: '2px solid var(--accent-primary)', color: 'var(--accent-primary)', cursor: 'pointer', 
                  padding: '0.5rem', borderRadius: '12px', width: '45px', height: '45px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                }} 
                onMouseOver={e => { 
                  e.currentTarget.style.background = 'var(--accent-primary)'; 
                  e.currentTarget.style.color = 'black'; 
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                }} 
                onMouseOut={e => { 
                  e.currentTarget.style.background = 'transparent'; 
                  e.currentTarget.style.color = 'var(--accent-primary)'; 
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <X size={24} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '25px', background: 'rgba(var(--accent-primary-rgb),0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(var(--accent-primary-rgb),0.1)' }}>
                  <Calendar size={40} color="var(--accent-primary)" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: 'Oswald', fontSize: '3rem', margin: 0, textTransform: 'uppercase', lineHeight: 1.1 }}>
                  PLANIFICAR <br/><span style={{ color: 'var(--accent-primary)' }}>RUTINA</span>
                </h3>
              </div>

              <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '1.1rem', marginBottom: '2.5rem', padding: '0 1rem' }}>¿En qué días de la semana quieres realizar <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>{selectedWorkout.nombre}</strong>?</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.8rem', marginBottom: '3.5rem' }}>
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => {
                  const sel = selectedDays.includes(d);
                  return (
                    <button 
                      key={d} 
                      onClick={() => toggleDay(d)} 
                      style={{ 
                        width: '95px', padding: '1.2rem 0', borderRadius: '18px', border: '1px solid', 
                        borderColor: sel ? 'var(--accent-primary)' : 'var(--glass-border)', 
                        background: sel ? 'rgba(var(--accent-primary-rgb), 0.08)' : 'var(--bg-subtle)', 
                        color: sel ? 'var(--accent-primary)' : 'var(--text-muted)', 
                        cursor: 'pointer', fontWeight: sel ? 800 : 500, fontSize: '1rem',
                        transition: 'all 0.2s', boxShadow: (sel && theme === 'dark') ? '0 10px 20px rgba(var(--accent-primary-rgb), 0.1)' : 'none'
                      }}
                      onMouseOver={e => { if (!sel) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; } }}
                      onMouseOut={e => { if (!sel) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; } }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={handleAdopt} 
                disabled={!!adopting || selectedDays.length === 0} 
                style={{ 
                  width: '100%', padding: '1.4rem', borderRadius: '20px', 
                  background: adopting || selectedDays.length === 0 ? 'var(--bg-subtle)' : 'var(--accent-primary)', 
                  color: adopting || selectedDays.length === 0 ? 'var(--text-muted)' : 'var(--text-on-accent)', 
                  fontWeight: 900, fontSize: '1.2rem', fontFamily: 'Oswald', letterSpacing: '2px',
                  border: 'none', cursor: adopting || selectedDays.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s', boxShadow: (adopting || selectedDays.length === 0 || theme === 'light') ? 'none' : '0 15px 30px rgba(var(--accent-primary-rgb), 0.3)'
                }}
                onMouseOver={e => { if (!adopting && selectedDays.length > 0) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseOut={e => { if (!adopting && selectedDays.length > 0) e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {adopting ? 'GUARDANDO...' : 'CONFIRMAR Y GUARDAR'}
              </button>
            </div>
          </div>,
          document.body
        )}

         {viewingProfile && ReactDOM.createPortal(
          <div style={{ position: 'fixed', inset: 0, background: theme === 'dark' ? 'rgba(0,0,0,0.98)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(30px)', zIndex: 100000, overflowY: 'auto', padding: '4rem 0' }}>
             <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
                <button 
                  onClick={() => setViewingProfile(null)} 
                  style={{ 
                    position: 'fixed', top: '2rem', right: '4rem', background: 'transparent', 
                    border: '2px solid var(--accent-primary)', borderRadius: '15px', width: '60px', height: '60px', 
                    color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'black';
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}
                >
                  <X size={32} />
                </button>

                <div style={{ background: 'var(--bg-card)', borderRadius: '50px', border: '1px solid var(--glass-border)', padding: '0', marginBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ height: '160px', background: theme === 'dark' ? 'linear-gradient(90deg, #111 0%, #222 100%)' : 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)', position: 'relative', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
                    <div style={{ position: 'absolute', bottom: '-50px', left: '4rem', zIndex: 2 }}>
                      <div style={{ width: '180px', height: '180px', borderRadius: '45px', background: '#0a0a0a', padding: '6px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', border: '1px solid var(--glass-border)' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '39px', overflow: 'hidden', position: 'relative' }}>
                          {viewingProfile.profile.foto_perfil ? <img src={viewingProfile.profile.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4.5rem', fontWeight: 900, fontFamily: 'Oswald', color: 'var(--accent-primary)', background: 'var(--bg-subtle)' }}>{viewingProfile.profile.nombre?.[0].toUpperCase()}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '4rem', paddingTop: '6rem', display: 'flex', gap: '4rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <h2 style={{ fontSize: '4.5rem', fontFamily: 'Oswald', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '-1px', color: 'var(--text-main)' }}>{viewingProfile.profile.nombre}</h2>
                      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={20} color="var(--accent-primary)" /> {viewingProfile.profile.ubicacion || 'Localización no especificada'}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Calendar size={20} color="var(--accent-primary)" /> Desde {new Date(viewingProfile.profile.created_at || Date.now()).getFullYear()}</div>
                      </div>
                      <p style={{ fontSize: '1.4rem', color: 'var(--text-main)', lineHeight: 1.6, maxWidth: '800px', fontWeight: 300, opacity: 0.9, fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '2rem' }}>"{viewingProfile.profile.descripcion || 'Sin biografía disponible.'}"</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                       <div style={{ padding: '2.5rem', borderRadius: '35px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', textAlign: 'center', minWidth: '160px' }}>
                          <div style={{ color: 'var(--accent-primary)', fontFamily: 'Oswald', fontSize: '3rem', fontWeight: 900 }}>{viewingProfile.workouts.length}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Rutinas</div>
                       </div>
                       <div style={{ padding: '2.5rem', borderRadius: '35px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', textAlign: 'center', minWidth: '160px' }}>
                          <div style={{ color: 'var(--text-main)', fontFamily: 'Oswald', fontSize: '3rem', fontWeight: 900 }}>{viewingProfile.workouts.length > 0 ? (viewingProfile.workouts.reduce((acc: number, w: any) => acc + w.rating_avg, 0) / viewingProfile.workouts.length).toFixed(1) : "0.0"}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Valoración</div>
                       </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 2rem' }}>
                  <h3 style={{ fontFamily: 'Oswald', fontSize: '3.5rem', textTransform: 'uppercase', marginBottom: '4rem' }}>Escaparate de <span style={{ color: 'var(--accent-primary)' }}>{viewingProfile.profile.nombre}</span></h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '3rem' }}>
                    {viewingProfile.workouts.map((w: any) => (
                      <WorkoutCard key={w.id} workout={w} onView={() => openViewingRoutine(w)} dbExercises={dbExercises} />
                    ))}
                  </div>
                </div>
             </div>
          </div>,
          document.body
        )}
        {sharingRoutine && ReactDOM.createPortal(
          <ShareRoutineModal 
            user={user} 
            routine={sharingRoutine} 
            onClose={() => setSharingRoutine(null)} 
            showToast={showToast} 
          />, 
          document.body
        )}

        {toast && ReactDOM.createPortal(
          <div style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 200000, background: toast.type === 'error' ? 'rgba(var(--accent-primary-rgb), 0.95)' : 'rgba(34, 197, 94, 0.95)', color: 'var(--text-main)', padding: '1rem 2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', animation: 'fade-in-up 0.3s ease-out forwards' }}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <span style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'Oswald', letterSpacing: '1px' }}>{toast.message}</span>
          </div>,
          document.body
        )}

        {confirmModal && confirmModal.show && ReactDOM.createPortal(
          <div style={{ position: 'fixed', inset: 0, background: theme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', zIndex: 300000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '32px', padding: '3rem', maxWidth: '500px', width: '100%', boxShadow: theme === 'dark' ? '0 30px 100px rgba(0,0,0,0.8)' : 'var(--card-shadow)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <AlertTriangle size={40} color="#ff4444" />
                </div>
                <h3 style={{ fontFamily: 'Oswald', fontSize: '2.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{confirmModal.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3rem' }}>{confirmModal.message}</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button 
                    onClick={() => setConfirmModal(null)}
                    style={{ flex: 1, padding: '1.2rem', borderRadius: '18px', background: 'var(--bg-subtle)', color: 'var(--text-main)', fontWeight: 800, fontFamily: 'Oswald', textTransform: 'uppercase', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.3s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--glass-border)'}
                    onMouseOut={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmModal.onConfirm}
                    style={{ flex: 1, padding: '1.2rem', borderRadius: '18px', background: '#ff4444', color: 'var(--text-main)', fontWeight: 800, fontFamily: 'Oswald', textTransform: 'uppercase', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255, 68, 68, 0.3)', transition: 'all 0.3s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
}

function ShareRoutineModal({ user, routine, onClose, showToast }: any) {
  const [amigos, setAmigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAmigos = async () => {
      const { data: d1 } = await supabase.from('amigos').select('amigo_id, usuarios!amigos_amigo_id_fkey(*)').eq('usuario_id', user.id);
      const { data: d2 } = await supabase.from('amigos').select('usuario_id, usuarios!amigos_usuario_id_fkey(*)').eq('amigo_id', user.id);

      const amigosList = [
        ...(d1?.map((d: any) => d.usuarios) || []),
        ...(d2?.map((d: any) => d.usuarios) || [])
      ];
      setAmigos(amigosList);
      setLoading(false);
    };
    fetchAmigos();
  }, [user.id]);

  const handleShare = async (amigoId: string) => {
    const routineSnapshot = {
      name: routine.nombre,
      goal: routine.objetivo,
      days: routine.dias || [],
      muscles: [],
      exercises: routine.ejercicios || [],
      color: routine.color || 'var(--accent-primary)',
      level: routine.nivel,
      duration: routine.duracion,
      image: routine.imagen_url,
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '2rem', maxWidth: '450px', width: '100%', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '80vh' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', margin: 0, textTransform: 'uppercase' }}>COMPARTIR RUTINA</h3>
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
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
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
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: routine.color || 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={routine.imagen_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{routine.nombre}</div>
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
                    {amigo.foto_perfil ? <img src={amigo.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={20} color="var(--text-muted)" style={{ margin: '10px' }}/>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{amigo.nombre}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{amigo.nivel}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleShare(amigo.id)} 
                  style={{ 
                    padding: '0.6rem 1.2rem', borderRadius: '12px', 
                    background: 'transparent', border: '1px solid var(--accent-primary)', 
                    color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.8rem', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', 
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    textTransform: 'uppercase', letterSpacing: '1px'
                  }} 
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'black';
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(var(--accent-primary-rgb), 0.3)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                   Enviar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


