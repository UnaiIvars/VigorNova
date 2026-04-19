"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Dumbbell, History, Settings, LogOut, Activity, Flame, ChevronRight, CheckCircle2, Calculator, Calendar, ChevronLeft } from 'lucide-react';
import Model from 'react-body-highlighter';

// -- Mock Database Centralizado --
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

export default function DashboardClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('inicio');
  const [viewDate, setViewDate] = useState(new Date(2026, 2, 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(15);

  const userInitials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const renderContent = () => {
    switch(activeTab) {
      case 'inicio': return <InicioOverview user={user} />;
      case 'crear': return <CrearEntrenamiento />;
      case 'historial': return (
        <HistorialEntrenamientos 
          onNavigateToCalendar={(date, day) => {
            setViewDate(date);
            setSelectedDay(day);
            setActiveTab('calendario');
          }} 
        />
      );
      case 'calendario': return (
        <CalendarioEntrenamientos 
          viewDate={viewDate} 
          setViewDate={setViewDate} 
          selectedDay={selectedDay} 
          setSelectedDay={setSelectedDay} 
        />
      );
      case 'calculadora': return <CalculadoraCalorias user={user} />;
      case 'ajustes': return <AjustesUsuario user={user} />;
      default: return <InicioOverview user={user} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'white', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar Izquierda */}
      <aside style={{ width: '300px', borderRight: '1px solid var(--glass-border)', backgroundColor: 'rgba(25, 25, 28, 0.4)', display: 'flex', flexDirection: 'column', padding: '2rem 0' }}>
        <div style={{ padding: '0 2.5rem', marginBottom: '3rem' }}>
          <Link href="/" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'white', textDecoration: 'none', letterSpacing: '2px' }}>
            VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
          </Link>
        </div>
        <div style={{ padding: '0 2rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', borderColor: 'rgba(255, 42, 42, 0.2)' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 0 15px rgba(255,42,42,0.4)' }}>
              {userInitials}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{user.name}</div>
              <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem' }}>{user.level} • Plan {user.plan}</div>
              <form action={signOut}>
                <button type="submit" style={{ 
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', 
                  display: 'flex', alignItems: 'center', gap: '0.4rem', 
                  fontSize: '0.75rem', padding: '0', cursor: 'pointer', transition: 'color 0.2s' 
                }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                  <LogOut size={14} /> Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 1.5rem', gap: '0.5rem' }}>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Inicio" isActive={activeTab === 'inicio'} onClick={() => setActiveTab('inicio')} />
          <SidebarItem icon={<Dumbbell size={20} />} label="Crear Entrenamiento" isActive={activeTab === 'crear'} onClick={() => setActiveTab('crear')} />
          <SidebarItem icon={<History size={20} />} label="Entrenamientos Registrados" isActive={activeTab === 'historial'} onClick={() => setActiveTab('historial')} />
          <SidebarItem icon={<Calendar size={20} />} label="Calendario" isActive={activeTab === 'calendario'} onClick={() => setActiveTab('calendario')} />
          <SidebarItem icon={<Calculator size={20} />} label="Nutrición y Calorías" isActive={activeTab === 'calculadora'} onClick={() => setActiveTab('calculadora')} />
          <SidebarItem icon={<Settings size={20} />} label="Ajustes" isActive={activeTab === 'ajustes'} onClick={() => setActiveTab('ajustes')} />
        </nav>
      </aside>
      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto', backgroundColor: '#0a0a0c', backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255, 42, 42, 0.05) 0%, transparent 40%)' }}>
        {renderContent()}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: isActive ? 'rgba(255,42,42,0.1)' : 'transparent',
      color: isActive ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.2s ease', fontWeight: isActive ? 600 : 500, borderRight: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent'
    }}>
      <div style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}>{icon}</div>
      <span>{label}</span>
    </button>
  );
}

// -- Calendario Componente --
function CalendarioEntrenamientos({ viewDate, setViewDate, selectedDay, setSelectedDay }: { viewDate: Date, setViewDate: (d: Date) => void, selectedDay: number | null, setSelectedDay: (d: number | null) => void }) {
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const daysOfWeek = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  
  // Helpers para calcular el diseño dinámico del mes
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOffset = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajuste para que 0 sea Lunes y 6 el Domingo
  };

  const offset = getFirstDayOffset(viewYear, viewMonth);
  const totalDays = getDaysInMonth(viewYear, viewMonth);

  // Botones de control de mes
  const handlePrev = () => {
    if (viewYear <= 2026 && viewMonth <= 0) return; // Limite Jan 2026
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
    setSelectedDay(null);
  };

  const handleNext = () => {
    const now = new Date();
    const maxDate = new Date(now.getFullYear(), now.getMonth() + 3, 1);
    const nextView = new Date(viewYear, viewMonth + 1, 1);
    if (nextView > maxDate) return;
    setViewDate(nextView);
    setSelectedDay(null);
  };

  // Nombres de los meses formteados
  const monthNames = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

  const currentWorkoutKey = selectedDay ? `${viewYear}-${viewMonth}-${selectedDay}` : null;
  const currentWorkout = currentWorkoutKey ? MOCK_WORKOUTS[currentWorkoutKey] : null;

  const daysArray = [];
  for(let i = 0; i < offset; i++) daysArray.push(null);
  for(let d = 1; d <= totalDays; d++) daysArray.push(d);

  // Disable logs
  const isPrevDisabled = viewYear <= 2026 && viewMonth <= 0;
  const now = new Date();
  const maxDate = new Date(now.getFullYear(), now.getMonth() + 3, 1);
  const nextView = new Date(viewYear, viewMonth + 1, 1);
  const isNextDisabled = nextView > maxDate;

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Tu <span style={{ color: 'var(--accent-primary)' }}>Calendario</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>Programa o revisa tus entrenamientos completados con detalle visual de los grupos musculares trabajados.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={handlePrev} disabled={isPrevDisabled} style={{ background: 'rgba(25,25,28,0.8)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isPrevDisabled ? 'not-allowed' : 'pointer', color: 'white', opacity: isPrevDisabled ? 0.3 : 1 }}>
            <ChevronLeft size={20} />
          </button>
          
          <div style={{ fontSize: '1.2rem', fontFamily: 'Oswald', color: 'white', backgroundColor: 'rgba(25,25,28,0.8)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', minWidth: '200px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }}>
            {monthNames[viewMonth]} {viewYear}
          </div>

          <button onClick={handleNext} disabled={isNextDisabled} style={{ background: 'rgba(25,25,28,0.8)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isNextDisabled ? 'not-allowed' : 'pointer', color: 'white', opacity: isNextDisabled ? 0.3 : 1 }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Grid Calendario */}
        <div className="glass-card" style={{ flex: '1 1 500px', padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            {daysOfWeek.map(d => (
              <div key={d} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
            {daysArray.map((day, i) => {
               if(!day) return <div key={i} />;
               const workoutKey = `${viewYear}-${viewMonth}-${day}`;
               const hasWorkout = !!MOCK_WORKOUTS[workoutKey];
               const isSelected = selectedDay === day;

               return (
                 <button 
                   key={i} 
                   onClick={() => setSelectedDay(day)}
                   style={{
                     aspectRatio: '1', width: '100%', borderRadius: '12px', border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                     backgroundColor: isSelected ? 'rgba(255, 42, 42, 0.15)' : 'rgba(25, 25, 28, 0.6)',
                     color: isSelected ? 'white' : (hasWorkout ? 'white' : 'var(--text-muted)'), position: 'relative',
                     cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                     fontSize: '1.1rem', fontFamily: 'Oswald', transition: 'all 0.2s', boxShadow: isSelected ? '0 0 15px rgba(255,42,42,0.3)' : 'none'
                   }}
                 >
                   {day}
                   {hasWorkout && (
                     <div style={{ position: 'absolute', bottom: '8px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 5px var(--accent-primary)' }} />
                   )}
                 </button>
               )
            })}
          </div>
        </div>

        {/* Detalle Diario */}
        <div style={{ flex: '1 1 350px' }}>
          {currentWorkout ? (
            <div className="glass-card animate-fade-in-up" style={{ padding: '2.5rem', borderTop: '4px solid var(--accent-primary)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,42,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {currentWorkout.icon}
                   </div>
                   <div>
                     <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem', textTransform: 'capitalize' }}>Día {selectedDay} de {monthNames[viewMonth].toLowerCase()}</div>
                     <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{currentWorkout.title}</h2>
                   </div>
                 </div>
               </div>

               <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>"{currentWorkout.desc}"</p>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
                 <div style={{ backgroundColor: 'rgba(10,10,12,0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>DESGLOSE DE SERIES</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={16} /> {currentWorkout.duration}</div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {Object.keys(currentWorkout.sets).map((muscle) => (
                         <div key={muscle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                           <span style={{ fontWeight: 500 }}>{muscle}</span>
                           <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontFamily: 'Oswald', letterSpacing: '1px' }}>{currentWorkout.sets[muscle]} SERIES</span>
                         </div>
                      ))}
                    </div>
                 </div>
               </div>

               <button className="btn-outline" style={{ width: '100%', fontSize: '0.9rem', padding: '0.8rem' }}>Editar Rutina o Resultados</button>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.7 }}>
               <Calendar size={50} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
               <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Día de Descanso</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No registraste ni programaste entrenamientos para el día {selectedDay}. El descanso o la correcta planificación es vital.</p>
               <button className="btn-primary" style={{ marginTop: '1.5rem', fontSize: '0.9rem', padding: '0.6rem 1.2rem' }} onClick={() => {}}>Programar Entrenamiento</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CalculadoraCalorias({ user }: { user: any }) {
  // Use user data as initial values if available
  const [genero, setGenero] = useState('masculino');
  const [edad, setEdad] = useState(user.edad?.toString() || '');
  const [peso, setPeso] = useState(user.peso?.toString() || '');
  const [altura, setAltura] = useState(user.altura?.toString() || '');
  const [actividad, setActividad] = useState('1.2');
  const [objetivo, setObjetivo] = useState('ganar');
  const [resultados, setResultados] = useState<any>(null);

  const calcular = (e: React.FormEvent) => {
    e.preventDefault();
    if(!edad || !peso || !altura) return;
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

  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', fontFamily: 'inherit' };
  const labelStyle = { color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' };

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Calculadora <span style={{ color: 'var(--accent-primary)' }}>Nutricional</span></h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '800px' }}>Descubre cuántas calorías precisas necesitas consumir según la fórmula científica de Mifflin-St Jeor.</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
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
              <select value={objetivo} onChange={e => setObjetivo(e.target.value)} style={{ ...inputStyle, border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
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
                 <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #ff2a2a' }}>
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

function CrearEntrenamiento() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const muscleGroups = [
    { name: 'Pecho', desc: 'Press, Cruces', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200&auto=format&fit=crop', color: '#ff2a2a' },
    { name: 'Espalda', desc: 'Dominadas, Remos', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop', color: '#ff4d4d' },
    { name: 'Hombros', desc: 'Elevaciones, Press', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop', color: '#cc1a1a' },
    { name: 'Piernas', desc: 'Sentadillas, Prensa', image: 'https://images.unsplash.com/photo-1434596922112-19c563067271?q=80&w=200&auto=format&fit=crop', color: '#e62e2e' },
    { name: 'Brazos', desc: 'Bíceps, Tríceps', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=200&auto=format&fit=crop', color: '#ff6666' },
    { name: 'Core', desc: 'Abdominales, Lumbares', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200&auto=format&fit=crop', color: '#ff3333' }
  ];

  if (selectedMuscle) {
    return <DatabaseEjercicios muscle={selectedMuscle} onBack={() => setSelectedMuscle(null)} />;
  }

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Constructor <span style={{ color: 'var(--accent-primary)' }}>de Rutinas</span></h1><p style={{ color: 'var(--text-muted)' }}>Selecciona un grupo muscular principal para programar tu entrenamiento.</p></div>
        <button className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>Guardar Rutina</button>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontFamily: 'Oswald', marginBottom: '1.5rem' }}>Grupos Musculares Base</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {muscleGroups.map((mg, i) => (
          <div key={i} onClick={() => setSelectedMuscle(mg.name)} className="glass-card" style={{ padding: 0, cursor: 'pointer', transition: 'all 0.3s ease', overflow: 'hidden', position: 'relative', height: '200px' }} onMouseOver={(e) => { (e.currentTarget.lastChild as HTMLElement).style.opacity = '1'; (e.currentTarget.lastChild as HTMLElement).style.transform = 'translateY(0)'; }} onMouseOut={(e) => { (e.currentTarget.lastChild as HTMLElement).style.opacity = '0'; (e.currentTarget.lastChild as HTMLElement).style.transform = 'translateY(10px)'; }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(10,10,12,0.9), rgba(10,10,12,0.4))', zIndex: 1 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 10, padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}><h3 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', margin: 0 }}>{mg.name}</h3><div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: mg.color, boxShadow: `0 0 10px ${mg.color}` }} /></div><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{mg.desc}</p>
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 42, 42, 0.1)', border: '2px solid var(--accent-primary)', zIndex: 20, pointerEvents: 'none', opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ backgroundColor: 'var(--accent-primary)', padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 'bold' }}>Ver Ejercicios +</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Componentes de Apoyo para Inicio --

function EvolutionChart() {
  const data = [
    { label: 'S1', strength: 70, weight: 82 },
    { label: 'S2', strength: 78, weight: 81.2 },
    { label: 'S3', strength: 75, weight: 80.5 },
    { label: 'S4', strength: 88, weight: 79.8 },
    { label: 'Hoy', strength: 95, weight: 79.2 },
  ];

  const maxStrength = 100;
  const maxWeight = 90;
  const width = 400;
  const height = 200;
  const padding = 40;

  const getX = (i: number) => (i * (width - padding * 2)) / (data.length - 1) + padding;
  const getYStrength = (v: number) => height - padding - (v / maxStrength) * (height - padding * 2);
  const getYWeight = (v: number) => height - padding - (v / maxWeight) * (height - padding * 2);

  const strengthPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getYStrength(d.strength)}`).join(' ');
  const weightPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getYWeight(d.weight)}`).join(' ');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '220px' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(val => {
          const y = height - padding - (val / 100) * (height - padding * 2);
          return <line key={val} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />;
        })}
        
        {/* Labels X */}
        {data.map((d, i) => (
          <text key={i} x={getX(i)} y={height - 10} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle" fontFamily="Oswald">{d.label}</text>
        ))}

        {/* Strength Line */}
        <path d={strengthPath} fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(255,42,42,0.4))' }} />
        {data.map((d, i) => (
          <circle key={i} cx={getX(i)} cy={getYStrength(d.strength)} r="4" fill="var(--accent-primary)" />
        ))}

        {/* Weight Line */}
        <path d={weightPath} fill="none" stroke="#44ddee" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" opacity="0.6" />
        {data.map((d, i) => (
          <circle key={i} cx={getX(i)} cy={getYWeight(d.weight)} r="3" fill="#44ddee" opacity="0.8" />
        ))}
      </svg>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '10px', height: '2px', backgroundColor: 'var(--accent-primary)' }} /> FUERZA (1RM)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '10px', height: '2px', backgroundColor: '#44ddee', borderStyle: 'dashed', borderBottomWidth: '2px' }} /> PESO (KG)
        </div>
      </div>
    </div>
  );
}

function DailyProgressCard({ label, value, goal, unit, color }: { label: string, value: number, goal: number, unit: string, color: string }) {
  const percent = Math.min((value / goal) * 100, 100);
  return (
    <div style={{ marginBottom: '1.2rem' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
         <span style={{ fontWeight: 600, color: 'white' }}>{label}</span>
         <span style={{ color: 'var(--text-muted)' }}>{value}{unit} / <span style={{ color }}>{goal}{unit}</span></span>
       </div>
       <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
         <div style={{ width: `${percent}%`, height: '100%', background: color, transition: 'width 1s ease-out', boxShadow: `0 0 10px ${color}44` }} />
       </div>
    </div>
  );
}

function InicioOverview({ user }: { user: any }) {
  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Resumen <span style={{ color: 'var(--accent-primary)' }}>Semanal</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Bienvenido de vuelta. Aquí está el progreso de tus métricas clave y objetivos del día.</p>
      </div>

      {/* Tarjetas Principales */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: 1, minWidth: '200px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Ejercicios</span> <Flame size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Oswald' }}>142</div>
        </div>
        <div className="glass-card" style={{ flex: 1, minWidth: '200px', borderLeft: '4px solid #44ddee' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Volumen Semanal</span> <Dumbbell size={18} color="#44ddee" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Oswald' }}>12,450 <span style={{ fontSize: '1rem' }}>kg</span></div>
        </div>
        <div className="glass-card" style={{ flex: 1, minWidth: '200px', borderLeft: '4px solid #eedd44' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Sesiones</span> <Activity size={18} color="#eedd44" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Oswald' }}>12</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Gráfico de Evolución */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '1.2rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Evolución de Rendimiento</h3>
          <EvolutionChart />
        </div>

        {/* Columna Derecha: Metas y Próximo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Metas Diarias */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '1.2rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Metas Diarias</h3>
            <DailyProgressCard label="Proteínas" value={135} goal={165} unit="g" color="var(--accent-primary)" />
            <DailyProgressCard label="Hidratación" value={2.2} goal={3.5} unit="L" color="#44ddee" />
            <DailyProgressCard label="Calorías" value={2100} goal={2800} unit="kcal" color="#eedd44" />
          </div>

          {/* Próximo Entrenamiento */}
          <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(255,42,42,0.1) 0%, rgba(10,10,12,0.8) 100%)', border: '1px solid rgba(255,42,42,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Próxima Sesión</div>
              <Calendar size={18} color="rgba(255,255,255,0.4)" />
            </div>
            <h4 style={{ fontSize: '1.8rem', fontFamily: 'Oswald', margin: '0 0 0.5rem 0' }}>Pecho y Tríceps</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Mañana, 08:30 AM • 5 Ejercicios • Aprox. 55 min</p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Ver Detalles de la Rutina</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistorialEntrenamientos({ onNavigateToCalendar }: { onNavigateToCalendar: (date: Date, day: number) => void }) {
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  // Convert MOCK_WORKOUTS to list and sort by date desc
  const workouts = Object.values(MOCK_WORKOUTS).sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime());

  if (selectedWorkout) {
    return (
      <div className="animate-fade-in-up">
        {/* Header with back button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setSelectedWorkout(null)} className="btn-outline" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChevronLeft size={18} /> Volver al Listado
          </button>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald', margin: 0, textTransform: 'uppercase' }}>Detalle del <span style={{ color: 'var(--accent-primary)' }}>Entrenamiento</span></h1>
        </div>

        <div className="glass-card" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,42,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedWorkout.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'Oswald', margin: 0 }}>{selectedWorkout.title}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{selectedWorkout.date.toLocaleDateString()} • Duración: {selectedWorkout.duration}</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigateToCalendar(selectedWorkout.date, selectedWorkout.date.getDate())} 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'center' }}
            >
              <Calendar size={18} /> Ver en Calendario
            </button>
          </div>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', fontStyle: 'italic', maxWidth: '800px', lineHeight: 1.6 }}>"{selectedWorkout.desc}"</p>

          <h3 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', color: 'white', letterSpacing: '1px' }}>EJERCICIOS REALIZADOS</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {selectedWorkout.exercises.map((ex: any, idx: number) => (
              <div key={idx} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1.2rem', backgroundColor: 'rgba(20,20,22,0.6)', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '12px', backgroundColor: 'black', border: '1px solid var(--glass-border)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '1.2rem', fontWeight: 600 }}>{ex.name}</h4>
                  <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Dumbbell size={16} color="var(--accent-primary)" /> {ex.sets}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><History size={16} color="var(--accent-primary)" /> {ex.rest}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '4rem', padding: '2.5rem', background: 'linear-gradient(90deg, rgba(255,42,42,0.08) 0%, rgba(10,10,12,0.4) 100%)', borderRadius: '16px', border: '1px solid rgba(255,42,42,0.15)' }}>
             <h4 style={{ fontFamily: 'Oswald', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontSize: '1.2rem', letterSpacing: '1px' }}>RESUMEN DE CARGA POR GRUPO</h4>
             <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                {Object.keys(selectedWorkout.sets).map(muscle => (
                  <div key={muscle}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{muscle}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Oswald' }}>{selectedWorkout.sets[muscle]} <span style={{ fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: 500 }}>Series</span></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Entrenamientos <span style={{ color: 'var(--accent-primary)' }}>Registrados</span></h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Revisa tu historial completo y navega al calendario para ver los detalles temporales.</p>
      
      <div className="glass-card" style={{ padding: '0.5rem' }}>
         <ul style={{ listStyle: 'none', padding: 0 }}>
           {workouts.map((rt: any, i) => (
             <li key={i} style={{ padding: '2rem', borderBottom: i === workouts.length - 1 ? 'none' : '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                    {rt.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', fontFamily: 'Oswald' }}>{rt.title}</h3>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                      <span>{rt.date.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{rt.duration}</span>
                    </div>
                  </div>
               </div>
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <button 
                   onClick={() => onNavigateToCalendar(rt.date, rt.date.getDate())} 
                   className="btn-outline" 
                   style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}
                 >
                   <Calendar size={18} /> Ver Calendario
                 </button>
                 <button 
                   onClick={() => setSelectedWorkout(rt)} 
                   className="btn-primary" 
                   style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(255,42,42,0.2)' }}
                 >
                   Ver Detalle
                 </button>
               </div>
             </li>
           ))}
         </ul>
      </div>
    </div>
  );
}

function AjustesUsuario({ user }: { user: any }) {
  const [nombre, setNombre] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [unidades, setUnidades] = useState('kg');
  const [descanso, setDescanso] = useState('90');
  const [notificaciones, setNotificaciones] = useState(true);

  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', fontFamily: 'inherit' };
  const labelStyle = { color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' };

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
          Ajustes <span style={{ color: 'var(--accent-primary)' }}>de Perfil</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>Personaliza tu experiencia en VigorNova. Ajusta tus datos personales, preferencias de visualización y tu plan mensual.</p>
      </div>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        {/* Columna Izquierda: Formularios */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Tarjeta 1: Datos Personales */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Oswald', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>Información Básica</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Nombre en Plataforma</label>
                <input type="text" style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Correo Electrónico</label>
                <input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <button className="btn-primary">Guardar Cambios Personales</button>
          </div>

          {/* Tarjeta 2: Preferencias de Entrenamiento */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'Oswald', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>Preferencias de Entrenamiento</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Sistema de Medición Preferido</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setUnidades('kg')} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: unidades === 'kg' ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)', background: unidades === 'kg' ? 'rgba(255,42,42,0.1)' : 'transparent', color: 'white', cursor: 'pointer', transition: 'all 0.2s', fontWeight: unidades === 'kg' ? 600 : 400 }}>Kilogramos (kg)</button>
                  <button onClick={() => setUnidades('lbs')} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: unidades === 'lbs' ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)', background: unidades === 'lbs' ? 'rgba(255,42,42,0.1)' : 'transparent', color: 'white', cursor: 'pointer', transition: 'all 0.2s', fontWeight: unidades === 'lbs' ? 600 : 400 }}>Libras (lbs)</button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Temporizador de Descanso Automático</label>
                <select style={inputStyle} value={descanso} onChange={e => setDescanso(e.target.value)}>
                  <option value="60">60 segundos (Hipertrofia metabólica)</option>
                  <option value="90">90 segundos (Hipertrofia estándar)</option>
                  <option value="120">120 segundos (Fuerza moderada)</option>
                  <option value="180">180+ segundos (Fuerza pura)</option>
                  <option value="manual">Desactivar / Modo Manual</option>
                </select>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Al registrar una serie en plena rutina, un reloj bajará automáticamente para controlar la fatiga.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(25, 25, 28, 0.5)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>Alertas de Grupos Musculares</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Recibir notificaciones cuando pases &gt; 7 días sin entrenar un grupo principal.</div>
                </div>
                {/* Toggle Switch Simple */}
                <button onClick={() => setNotificaciones(!notificaciones)} style={{ width: '50px', height: '26px', borderRadius: '13px', border: 'none', background: notificaciones ? 'var(--accent-primary)' : '#444', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                   <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: notificaciones ? '27px' : '3px', transition: 'left 0.3s' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Plan y Facturación */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--accent-primary)', background: 'linear-gradient(135deg, rgba(255,42,42,0.05) 0%, rgba(10,10,12,0.8) 100%)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <h3 style={{ fontSize: '1.2rem', fontFamily: 'Oswald', margin: 0 }}>Plan Actual</h3>
               <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>ACTIVO</span>
             </div>
             <div style={{ fontSize: '2.5rem', fontFamily: 'Oswald', fontWeight: 700, marginBottom: '0.5rem' }}>PRO</div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>La élite de VigorNova. Tienes acceso a seguimiento de series musculares inteligente y rutinas infinitas.</p>
             
             <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-primary)" /> Siguiente ciclo: 15 Dic 2026</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--accent-primary)" /> Pagado con: **** 4242</li>
             </ul>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Mejorar a Anual (Oferta)</button>
               <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', borderColor: '#444', color: '#999' }}>Cancelar Suscripción</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// -- Anatomical View & Exercise Database --

function DatabaseEjercicios({ muscle, onBack }: { muscle: string, onBack: () => void }) {
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
        <button onClick={onBack} style={{ background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <ChevronLeft size={18} /> Volver a Grupos
        </button>
        <h1 style={{ fontSize: '2rem', fontFamily: 'Oswald', margin: 0, textTransform: 'uppercase' }}>Ejercicios de <span style={{ color: 'var(--accent-primary)' }}>{muscle}</span></h1>
      </div>

      <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Mapa Anatómico Realista 3D */}
        <div className="glass-card" style={{ flex: '0 0 380px', padding: '2rem', position: 'sticky', top: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>ANATOMÍA HUMANA</h3>
          
          <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', filter: 'drop-shadow(0 0 15px rgba(255,42,42,0.6))', alignContent: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Model 
                data={[{ name: 'Objective', muscles: isPecho ? ['chest'] : muscle === 'Espalda' ? ['upper-back','lower-back','trapezius'] : muscle === 'Hombros' ? ['front-deltoids'] : muscle === 'Piernas' ? ['quadriceps','calves'] : muscle === 'Brazos' ? ['biceps','forearm'] : muscle === 'Core' ? ['abs','obliques'] : [] }]} 
                style={{ width: '100%' }} 
                highlightedColors={['#ff2a2a']} 
                type="anterior" 
              />
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 600, letterSpacing: '2px' }}>FRONTAL</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Model 
                data={[{ name: 'Objective', muscles: isPecho ? ['chest'] : muscle === 'Espalda' ? ['upper-back','lower-back','trapezius'] : muscle === 'Hombros' ? ['back-deltoids'] : muscle === 'Piernas' ? ['hamstring','gluteal','calves'] : muscle === 'Brazos' ? ['triceps','forearm'] : [] }]} 
                style={{ width: '100%' }} 
                highlightedColors={['#ff2a2a']} 
                type="posterior" 
              />
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 600, letterSpacing: '2px' }}>POSTERIOR</div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontFamily: 'Oswald', fontWeight: 'bold' }}>{exercises.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ejercicios Encontrados</div>
          </div>
        </div>

        {/* Lista de Ejercicios */}
        <div style={{ flex: '1 1 500px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {exercises.map((ex, i) => (
            <div key={i} className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(20,20,22,0.8)' }}>
              <div style={{ height: '140px', background: 'black', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(10,10,12,0.8)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', border: '1px solid var(--glass-border)' }}>
                  {ex.type}
                </div>
              </div>
              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>{ex.name}</h4>
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
