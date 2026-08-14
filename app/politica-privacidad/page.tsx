import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PoliticaPrivacidad() {
  return (
    <main className="force-dark" style={{ minHeight: '100vh', padding: '4rem 2rem', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontFamily: 'Inter, sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem' }}>
          <ArrowLeft size={20} /> Volver al Inicio
        </Link>
        <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '3.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Política de <span style={{ color: 'var(--accent-primary)' }}>Privacidad</span>
        </h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>En VigorNova nos tomamos tu privacidad tan en serio como tus entrenamientos. Esta política describe cómo recopilamos, usamos y protegemos tus datos personales.</div>
          
          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>1. Información que recopilamos</h2>
            <div style={{ marginBottom: '1rem' }}>Recopilamos información cuando te registras en nuestra plataforma, incluyendo tu nombre, correo electrónico y datos biométricos básicos (peso, altura, nivel de entrenamiento) necesarios para personalizar tu experiencia.</div>
          </section>
          
          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>2. Uso de la información</h2>
            <div style={{ marginBottom: '1rem' }}>Tus datos se utilizan exclusivamente para:</div>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Proporcionar y mantener el servicio de VigorNova.</li>
              <li>Personalizar tus rutinas de entrenamiento mediante nuestros algoritmos.</li>
              <li>Sincronizar tu progreso con nuestro asistente IA "NOVA".</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>3. Protección de datos</h2>
            <div style={{ marginBottom: '1rem' }}>Implementamos medidas de seguridad de nivel empresarial proporcionadas por Supabase para mantener la seguridad de tu información personal. No vendemos ni compartimos tus datos de entrenamiento con terceros bajo ningún concepto.</div>
          </section>
        </div>
      </div>
    </main>
  );
}
