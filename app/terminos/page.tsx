import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TerminosServicio() {
  return (
    <main className="force-dark" style={{ minHeight: '100vh', padding: '4rem 2rem', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontFamily: 'Inter, sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem' }}>
          <ArrowLeft size={20} /> Volver al Inicio
        </Link>
        <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '3.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Términos de <span style={{ color: 'var(--accent-primary)' }}>Servicio</span>
        </h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>Bienvenido a VigorNova. Al utilizar nuestros servicios, aceptas estos términos. Por favor, léelos cuidadosamente.</div>
          
          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>1. Uso del Servicio</h2>
            <div style={{ marginBottom: '1rem' }}>Nuestra plataforma proporciona herramientas para el seguimiento y la planificación del entrenamiento físico. La información provista por la plataforma o el asistente IA es con fines orientativos y no sustituye el consejo de un profesional médico o entrenador certificado.</div>
          </section>
          
          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>2. Cuentas de Usuario</h2>
            <div style={{ marginBottom: '1rem' }}>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Nos reservamos el derecho de suspender o cancelar cuentas que violen nuestras políticas o presenten comportamiento abusivo.</div>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>3. Modificaciones al Servicio</h2>
            <div style={{ marginBottom: '1rem' }}>VigorNova se reserva el derecho de modificar o discontinuar temporal o permanentemente el servicio, con o sin previo aviso. Seguiremos trabajando continuamente para mejorar y añadir nuevas funcionalidades (como VigorNova PRO).</div>
          </section>
        </div>
      </div>
    </main>
  );
}
