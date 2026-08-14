import Link from 'next/link';
import { ArrowLeft, Target, Users, Zap, Award, Code, Terminal } from 'lucide-react';

export default function SobreNosotros() {
  return (
    <main className="force-dark" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontFamily: 'Inter, sans-serif' }}>
      <section style={{ position: 'relative', padding: '8rem 2rem 4rem', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 0%, rgba(255, 42, 42, 0.15) 0%, transparent 70%)', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <ArrowLeft size={18} /> Volver al Inicio
          </Link>
          <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '1.5rem', textTransform: 'uppercase', lineHeight: 1 }}>
            Nuestra <span style={{ color: 'var(--accent-primary)' }}>Misión</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            VigorNova nació de la frustración con las aplicaciones de fitness genéricas. Nuestra obsesión es proporcionar las herramientas de élite que los atletas reales necesitan para optimizar cada segundo en el gimnasio.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255, 42, 42, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Target size={32} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Precisión</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>No creemos en el "creo que estoy mejorando". Creemos en los datos, en el volumen acumulado y en la progresión real cuantificable.</p>
          </div>

          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--accent-primary)' }}>
            <div style={{ background: 'rgba(255, 42, 42, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Zap size={32} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Rendimiento</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Nuestra plataforma está diseñada para ser rápida. Menos tiempo mirando el móvil, más tiempo levantando peso pesado.</p>
          </div>

          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255, 42, 42, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Users size={32} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Comunidad</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>VigorNova es para los que se toman esto en serio. Una comunidad de personas que buscan la excelencia física y mental.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 2rem', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontFamily: 'Oswald', fontSize: '3rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              Creado por <span style={{ color: 'var(--accent-primary)' }}>Programadores</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              Fundada en 2026, VigorNova es el resultado de la visión y dedicación de dos jóvenes programadores apasionados por la tecnología y el fitness de alto rendimiento.
              <br /><br />
              Entendemos que el fitness no es solo una afición, es un estilo de vida que requiere rigor y disciplina. Por eso, hemos volcado nuestra experiencia en desarrollo de software para crear una plataforma que actúe como tu mentor personal, optimizando cada entrenamiento para guiarte hacia tu máximo potencial.
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'Oswald', fontWeight: 700, color: 'white' }}>50K+</div>
                <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>USUARIOS ACTIVOS</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'Oswald', fontWeight: 700, color: 'white' }}>1M+</div>
                <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>SERIES REGISTRADAS</div>
              </div>
            </div>
          </div>
          <div style={{ flex: '1 1 400px', position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 42, 42, 0.2)', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
            <div style={{ position: 'relative', aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(255, 42, 42, 0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(255, 42, 42, 0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
              
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <Code size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                  <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    CREADO POR
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ fontFamily: 'Oswald', fontSize: '3.5rem', color: 'white', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '2px', marginBottom: '0.5rem' }}>
                      Unai <span style={{ color: 'var(--accent-primary)' }}>Ivars</span>
                    </div>
                    <div style={{ height: '2px', width: '60px', background: 'var(--accent-primary)', margin: '0 auto' }} />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <div style={{ fontFamily: 'Oswald', fontSize: '3.5rem', color: 'white', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '2px', marginBottom: '0.5rem' }}>
                      Aitor <span style={{ color: 'var(--accent-primary)' }}>Sanchez</span>
                    </div>
                    <div style={{ height: '2px', width: '60px', background: 'var(--accent-primary)', margin: '0 auto' }} />
                  </div>
                </div>

                <div style={{ marginTop: '3.5rem', opacity: 0.6 }}>
                  <Terminal size={24} color="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', marginBottom: '2rem', textTransform: 'uppercase' }}>¿Listo para unirte a la <span style={{ color: 'var(--accent-primary)' }}>Elite</span>?</h2>
          <Link href="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', textDecoration: 'none' }}>
            COMENZAR MI TRANSFORMACIÓN
          </Link>
        </div>
      </section>

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <div className="container">
          © {new Date().getFullYear()} VigorNova. Evolución Continua.
        </div>
      </footer>
    </main>
  );
}
