import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'
import { Dumbbell, Users, Clock, ArrowRight, Activity, Flame, LayoutList, Target, History, Calendar, Calculator, Zap, Search, User, Bot, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import NewsletterButton from './NewsletterButton'
import LegalLink from './LegalLink'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()

  return (
    <main className="force-dark" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: '1.5rem 0',
        background: 'linear-gradient(to bottom, rgba(10,10,12,0.8), transparent)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{
            textDecoration: 'none',
            fontSize: '3.2rem',
            fontWeight: 950,
            fontFamily: 'Oswald, sans-serif',
            color: 'white',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            textShadow: '0 0 15px rgba(var(--accent-primary-rgb),0.2), 0 0 30px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }} className="hover-scale">
            VIGOR<span style={{ color: 'var(--accent-primary)', textShadow: '0 0 20px rgba(var(--accent-primary-rgb),0.4)' }}>NOVA</span>
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {session ? (
              <Link href="/dashboard" className="btn-primary auth-btn" style={{ padding: '0.8rem 2.2rem', fontSize: '1.1rem', textDecoration: 'none', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>MI DASHBOARD <ArrowRight size={20} /></Link>
            ) : (
              <>
                <Link href="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem', transition: 'color 0.3s ease' }} className="hover-text-accent">INICIAR SESIÓN</Link>
                <Link href="/register" className="btn-primary auth-btn" style={{ padding: '0.8rem 2.2rem', fontSize: '1.1rem', textDecoration: 'none', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>ÚNETE / REGÍSTRATE</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section style={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>

        <style>{`
          @keyframes heroZoomIn {
            from { transform: scale(1.08); }
            to   { transform: scale(1); }
          }
          .hero-bg-img {
            animation: heroZoomIn 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
        `}</style>
        <div className="hero-bg-img" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          <Image
            src="/dashboard-hero-v2.png"
            alt="VigorNova Hero"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
        </div>

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.35) 40%, rgba(10,10,12,0.72) 80%, rgba(10,10,12,1) 100%)',
          zIndex: 1
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.8rem',
          padding: '0 2rem'
        }}>

          <div className="animate-fade-in-down" style={{
            letterSpacing: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            textTransform: 'uppercase',
            opacity: 0.9
          }}>
            TU MEJOR VERSIÓN
          </div>

          {/* Título Principal */}
          <div className="animate-fade-in-down">
            <h1 style={{
              fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
              fontWeight: 950,
              lineHeight: 0.9,
              fontFamily: 'Oswald, sans-serif',
              letterSpacing: '-2px',
              margin: 0,
              textShadow: '0 4px 30px rgba(0,0,0,0.6)'
            }}>
              <span style={{ color: 'white' }}>DOMINA TU</span><br />
              <span style={{ color: 'var(--accent-primary)' }}>POTENCIAL</span>
            </h1>
          </div>

          {/* Subtítulo */}
          <p className="animate-fade-in-up" style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.6,
            fontWeight: 300,
            letterSpacing: '0.3px',
            maxWidth: '620px',
            margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            La arquitectura digital definitiva para atletas de alto rendimiento.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <Link href={session ? "/dashboard" : "/register"} className="btn-primary auth-btn" style={{
              textDecoration: 'none',
              padding: '1.4rem 4rem',
              fontSize: '1.2rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem'
            }}>
              {session ? 'MI DASHBOARD' : 'EMPEZAR AHORA'} <ArrowRight size={22} />
            </Link>
          </div>
        </div>


      </section>

      <section style={{
        background: '#0a0a0c',
        padding: '6rem 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4rem'
        }}>
          <h2 className="animate-fade-in-up" style={{
            color: 'var(--accent-primary)',
            fontSize: '2.5rem',
            fontFamily: 'Oswald, sans-serif',
            fontWeight: 800,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '0'
          }}>
            Funcionalidades de la plataforma
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '3rem',
            width: '100%',
            maxWidth: '1000px'
          }}>
            {[
              { icon: <Activity size={24} />, label: 'PROGRESO' },
              { icon: <Dumbbell size={24} />, label: 'RUTINAS' },
              { icon: <Target size={24} />, label: 'EJERCICIOS' },
              { icon: <Users size={24} />, label: 'SOCIAL' },
              { icon: <User size={24} />, label: 'PERFIL' },
              { icon: <History size={24} />, label: 'HISTORIAL' },
              { icon: <Calendar size={24} />, label: 'CALENDARIO' },
              { icon: <Calculator size={24} />, label: 'CALCULADORA' },
              { icon: <Search size={24} />, label: 'EXPLORAR' },
              { icon: <Zap size={24} />, label: 'NOVA IA' }
            ].map((item, i) => (
              <div key={i} className="animate-fade-in-up hover-text-accent" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                opacity: 0.9,
                transition: 'all 0.3s ease',
                animationDelay: `${i * 60}ms`
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(5, 5, 5, 0.8)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 20
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '4rem 0', flexWrap: 'wrap', gap: '3rem' }}>
          {[
            { metric: '800+', label: 'Ejercicios' },
            { metric: 'NOVA IA', label: 'Asistente' },
            { metric: '24/7', label: 'Disponibilidad' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
              <div style={{
                fontSize: '4.5rem',
                fontFamily: 'Oswald',
                fontWeight: 900,
                color: 'white',
                marginBottom: '0.2rem',
                lineHeight: 1,
                letterSpacing: '-2px'
              }}>{stat.metric}</div>
              <div style={{
                color: 'var(--accent-primary)',
                fontWeight: 800,
                letterSpacing: '3px',
                fontSize: '0.9rem',
                textTransform: 'uppercase'
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="section container" id="caracteristicas" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }} className="animate-fade-in-up">
          <h2 style={{
            fontSize: 'clamp(3rem, 5vw, 5.5rem)',
            marginBottom: '1.5rem',
            lineHeight: 0.9,
            fontWeight: 900
          }}>
            INGENIERÍA APLICADA <br />
            <span style={{
              background: 'linear-gradient(to right, var(--accent-primary), #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>AL RENDIMIENTO</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', maxWidth: '700px', margin: '0 auto', fontWeight: 300, lineHeight: 1.6 }}>
            Hemos deconstruido el entrenamiento tradicional para reconstruirlo con tecnología de precisión. Control absoluto en cada repetición.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {[
            {
              icon: <Dumbbell size={35} color="var(--accent-primary)" />,
              title: 'Arquitectura de Rutinas',
              desc: 'Diseña y organiza tus sesiones con una interfaz fluida diseñada para la sobrecarga progresiva.'
            },
            {
              icon: <BarChart3 size={35} color="var(--accent-primary)" />,
              title: 'Métricas de Élite',
              desc: 'Visualiza tu evolución biométrica y marcas personales con gráficas dinámicas de alta resolución.'
            },
            {
              icon: <Calendar size={35} color="var(--accent-primary)" />,
              title: 'Mapa de Calor Térmico',
              desc: 'Calendario inteligente que visualiza la intensidad y frecuencia de tus entrenamientos de un vistazo.'
            },
            {
              icon: <Bot size={35} color="var(--accent-primary)" />,
              title: 'Nova AI Assistant',
              desc: 'Consultoría táctica 24/7 integrada con Gemini para optimizar tu programación y resolver dudas.'
            }
          ].map((service, i) => (
            <div key={i} className="glass-card animate-fade-in-up" style={{
              animationDelay: `${i * 100}ms`,
              borderRadius: '24px',
              padding: '3rem',
              border: '1px solid rgba(255,255,255,0.03)',
              background: 'rgba(255,255,255,0.02)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{
                marginBottom: '2rem',
                background: 'rgba(var(--accent-primary-rgb), 0.1)',
                width: '70px', height: '70px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(var(--accent-primary-rgb),0.1)'
              }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontFamily: 'Oswald', fontWeight: 700 }}>{service.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: '1.1rem' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
              </ul>
              <Link href="/register" className="btn-outline" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>CREAR CUENTA</Link>
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
              <Link href="/checkout" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>HAZTE PRO AHORA</Link>
            </div>
          </div>
        </div>
      </section>


      <footer style={{ backgroundColor: '#050505', paddingTop: '3rem', paddingBottom: '1.5rem', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
        <style>{`
          .footer-link {
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.25s ease;
          }
          .footer-link:hover {
            color: var(--accent-primary);
          }
        `}</style>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '2.5rem', textAlign: 'center' }}>

            {/* Columna 1: Marca y Redes */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Oswald, sans-serif', color: 'white', letterSpacing: '4px', marginBottom: '1rem' }}>
                VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
              </div>
              <p style={{ lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '400px', fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>
                La arquitectura digital definitiva para atletas de alto rendimiento. Fusionamos biomecánica avanzada con una interfaz de vanguardia para quienes no aceptan la mediocridad.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="https://www.instagram.com/vigornova/" target="_blank" rel="noopener noreferrer" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.3s' }}>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href="https://x.com/VigorNovaFit" target="_blank" rel="noopener noreferrer" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.3s' }}>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
              </div>
            </div>

            {/* Columna 2: Producto */}
            <div>
              <h4 style={{ color: 'white', fontFamily: 'Oswald', fontSize: '1.3rem', marginBottom: '1.2rem', letterSpacing: '2px' }}>LA PLATAFORMA</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '1rem' }}>
                <li><Link href="#caracteristicas" className="footer-link">Características</Link></li>
                <li><Link href="#ejercicios" className="footer-link">Catálogo de Ejercicios</Link></li>
                <li><Link href="/checkout" className="footer-link" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Suscripción PRO</Link></li>
              </ul>
            </div>

            {/* Columna 3: Empresa */}
            <div>
              <h4 style={{ color: 'white', fontFamily: 'Oswald', fontSize: '1.3rem', marginBottom: '1.2rem', letterSpacing: '2px' }}>VIGORNOVA</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '1rem' }}>
                <li><Link href="/sobre-nosotros" className="footer-link">Sobre Nosotros</Link></li>
                <li><a href="mailto:eldohu15@gmail.com" className="footer-link">Contacto y Soporte</a></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              © {new Date().getFullYear()} VigorNova App. Todos los derechos reservados.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <LegalLink href="/politica-privacidad">Política de Privacidad</LegalLink>
              <LegalLink href="/terminos">Términos de Servicio</LegalLink>
              <LegalLink href="/cookies">Política de Cookies</LegalLink>
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
