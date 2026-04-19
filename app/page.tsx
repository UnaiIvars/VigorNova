import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'
import { Dumbbell, Users, Clock, ArrowRight, Activity, Flame, LayoutList, Target } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()

  return (
    <main>
      {/* Navbar Overlay */}
      <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'white', letterSpacing: '2px' }}>
            VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {session ? (
              <Link href="/dashboard" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>MI DASHBOARD</Link>
            ) : (
              <>
                <Link href="/login" className="btn-glass" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none' }}>INICIAR SESIÓN</Link>
                <Link href="/register" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none' }}>REGISTRARSE</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '6rem',
        paddingBottom: '4rem'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95))',
          backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255, 42, 42, 0.15) 0%, transparent 50%), linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95))',
          zIndex: -1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in-down">
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '3px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={20} /> TU PLATAFORMA FITNESS DE ÉLITE
            </span>
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              FORJA TU <br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--accent-primary)' }}>RUTINA</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '500px' }}>
              Crea, planifica y sigue rutinas personalizadas con nuestra tecnología. Accede a miles de ejercicios, optimiza tus tiempos y alcanza resultados reales avalados por datos.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>CREAR RUTINA GRATIS <ArrowRight size={20} /></Link>
            </div>
          </div>
          <div className="animate-fade-in-up delay-200" style={{ flex: '1 1 600px', position: 'relative', aspectRatio: '16/9', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(255,42,42,0.2)', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-dark)' }}>
            <div style={{ width: '200%', height: '200%', transform: 'scale(0.5)', transformOrigin: 'top left', pointerEvents: 'none' }}>
              <iframe src="/dashboard" title="Vista previa de la plataforma" style={{ width: '100%', height: '100%', border: 'none' }} tabIndex={-1} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features Banner */}
      <div style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(25, 25, 28, 0.5)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '3rem 0', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { metric: '1000+', label: 'EJERCICIOS ALMACENADOS' },
            { metric: '50+', label: 'GRUPOS MUSCULARES' },
            { metric: 'IA', label: 'RECOMENDACIONES' },
            { metric: '100%', label: 'PERSONALIZABLE' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <div style={{ fontSize: '3rem', fontFamily: 'Oswald', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{stat.metric}</div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '1px', fontSize: '0.9rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="section container" id="caracteristicas">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in-up">
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>LA EXCELENCIA ES <span style={{ color: 'var(--accent-primary)' }}>NUESTRO ESTÁNDAR</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Descubre el software definitivo para llevar el control absoluto de tu cuerpo y tus entrenamientos.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            {
              icon: <Dumbbell size={40} color="var(--accent-primary)" />,
              title: 'CREADOR DE RUTINAS',
              desc: 'Interfaz intuitiva que permite planificar entrenamientos. Añade series y selecciona ejercicios fácilmente.'
            },
            {
              icon: <Activity size={40} color="var(--accent-primary)" />,
              title: 'SEGUIMIENTO Y ESTADÍSTICAS',
              desc: 'Visualiza tu evolución física y rendimiento muscular a través de métricas y gráficos en tiempo real.'
            },
            {
              icon: <Clock size={40} color="var(--accent-primary)" />,
              title: 'GESTIÓN DE TIEMPOS',
              desc: 'El software te guía indicando cuándo debes descansar mediante cronómetros integrados para optimizar el esfuerzo.'
            },
            {
              icon: <Users size={40} color="var(--accent-primary)" />,
              title: 'RECOMENDACIONES INTELIGENTES',
              desc: 'Análisis de datos para proveer alertas automatizadas, mejorando tus rutinas basándose en ciencia deportiva.'
            }
          ].map((service, i) => (
            <div key={i} className="glass-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div style={{ marginBottom: '1.5rem', background: 'rgba(255, 42, 42, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{service.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Database & Profiles Section */}
      <section className="section" style={{ backgroundColor: 'rgba(25, 25, 28, 0.3)', borderTop: '1px solid var(--glass-border)' }} id="ejercicios">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                BASE DE DATOS <br /><span style={{ color: 'var(--accent-primary)' }}>FILTRADA A TU MEDIDA</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Encuentra el movimiento perfecto. Nuestra base de datos completa y categorizada te permite filtrar por grupo muscular, nivel de dificultad y tipo de entrenamiento.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: 0 }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><LayoutList color="var(--accent-primary)" /> Búsqueda por Grupo Muscular</li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Target color="var(--accent-primary)" /> Niveles: Principiante a Experto</li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><Activity color="var(--accent-primary)" /> Tipos: Fuerza, Hipertrofia, Cardio</li>
              </ul>
              <button className="btn-outline">EXPLORAR EJERCICIOS</button>
            </div>

            <div style={{ flex: '1 1 400px' }} id="perfiles">
              <div className="glass-card" style={{ padding: '3rem', border: '1px solid var(--accent-primary)' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>SISTEMA DE <br />PERFILES ÚNICOS</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Tu perfil de usuario es el centro de mando. Aquí almacenamos tus rutinas activas, registramos cada levantamiento, tus tiempos de entrenamiento y descansos de manera centralizada.
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>UN</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Usuario Nuevo</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nivel de Fuerza: Intermedio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section" style={{ backgroundColor: 'rgba(25, 25, 28, 0.4)' }} id="precios">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>SUSCRIPCIONES <span style={{ color: 'var(--accent-primary)' }}>VIGORNOVA</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Tu software de entrenamiento siempre disponible. Escala tus funciones cuando lo necesites.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {/* Plan Base */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Plan Free</h3>
              <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>$</span>
                <span style={{ fontSize: '4rem', fontFamily: 'Oswald', fontWeight: 700, lineHeight: 1 }}>0</span>
                <span style={{ alignSelf: 'flex-end', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>/mes</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', flex: 1 }}>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckIcon /> Creador básico de rutinas</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckIcon /> Base de datos: 100 ejercicios</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckIcon /> Temporizador de descansos</li>
              </ul>
              <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>CREAR CUENTA</button>
            </div>

            {/* Plan Premium */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', borderImage: 'linear-gradient(135deg, var(--accent-primary), transparent) 1', borderStyle: 'solid', borderWidth: '2px' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-primary)', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Recomendado</div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-primary)' }}>Plan Pro</h3>
              <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>$</span>
                <span style={{ fontSize: '4rem', fontFamily: 'Oswald', fontWeight: 700, lineHeight: 1 }}>9</span>
                <span style={{ alignSelf: 'flex-end', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>/mes</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', flex: 1 }}>
                <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-main)' }}><CheckIcon color="var(--accent-primary)" /> Todo lo incluido en Free</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckIcon /> Acceso total a 1000+ ejercicios</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckIcon /> Estadísticas avanzadas en gráficos</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckIcon /> Sugerencias mediante Inteligencia Artificial</li>
              </ul>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>HAZTE PRO AHORA</button>
            </div>
          </div>
        </div>
      </section>


      {/* Footer Avanzado SaaS */}
      <footer style={{ backgroundColor: '#050505', paddingTop: '5rem', paddingBottom: '2rem', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            
            {/* Columna 1: Marca y Redes */}
            <div style={{ flex: '2 1 300px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'white', letterSpacing: '2px', marginBottom: '1rem' }}>
                VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
              </div>
              <p style={{ lineHeight: 1.6, marginBottom: '2rem', maxWidth: '350px' }}>
                Plataforma web de última generación para planificar y optimizar tus rutinas de gimnasio al extremo. Basado en ciencia.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.3s' }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.3s' }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
              </div>
            </div>

            {/* Columna 2: Producto */}
            <div>
              <h4 style={{ color: 'white', fontFamily: 'Oswald', fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>LA PLATAFORMA</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li><Link href="#caracteristicas" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Características</Link></li>
                <li><Link href="#ejercicios" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Catálogo de Ejercicios</Link></li>
                <li><Link href="#precios" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Suscripción PRO</Link></li>
                <li><Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Calculadora Dietética</Link></li>
              </ul>
            </div>

            {/* Columna 3: Empresa */}
            <div>
              <h4 style={{ color: 'white', fontFamily: 'Oswald', fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>VIGORNOVA</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li><Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Sobre Nosotros</Link></li>
                <li><Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Blog de Fitness</Link></li>
                <li><Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Contacto y Soporte</Link></li>
                <li><Link href="#" style={{ color: 'var(--accent-primary)', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 600 }}>Programa de Afiliados</Link></li>
              </ul>
            </div>

            {/* Columna 4: Newsletter */}
            <div style={{ flex: '1 1 250px' }}>
              <h4 style={{ color: 'white', fontFamily: 'Oswald', fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>ÚNETE AL BOOTCAMP</h4>
              <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Suscríbete para recibir rutinas exclusivas y consejos de optimización fisiológica en tu correo.</p>
              <form style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="email" placeholder="Email" required style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} />
                <button type="button" className="btn-primary" style={{ padding: '0 1rem' }}>UNIRME</button>
              </form>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              © {new Date().getFullYear()} VigorNova App. Todos los derechos reservados.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Política de Privacidad</Link>
              <Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Términos de Servicio</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function CheckIcon({ color = "var(--text-muted)" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
