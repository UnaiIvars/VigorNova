import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PoliticaCookies() {
  return (
    <main className="force-dark" style={{ minHeight: '100vh', padding: '4rem 2rem', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontFamily: 'Inter, sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem' }}>
          <ArrowLeft size={20} /> Volver al Inicio
        </Link>
        <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '3.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Política de <span style={{ color: 'var(--accent-primary)' }}>Cookies</span>
        </h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>Esta política de cookies explica qué son las cookies y cómo las usamos en VigorNova.</div>
          
          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>1. ¿Qué son las cookies?</h2>
            <div style={{ marginBottom: '1rem' }}>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador o dispositivo móvil) cuando visitas un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.</div>
          </section>
          
          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>2. ¿Cómo usamos las cookies?</h2>
            <div style={{ marginBottom: '1rem' }}>En VigorNova utilizamos cookies estrictamente necesarias para el funcionamiento de la plataforma:</div>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><strong>Cookies de Autenticación:</strong> Esenciales para mantener tu sesión segura a través de Supabase y asegurar que solo tú puedes acceder a tu panel de control de VigorNova.</li>
              <li><strong>Cookies de Preferencias:</strong> Nos ayudan a recordar tus configuraciones (como el idioma o el tema) para mejorar tu experiencia.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Oswald' }}>3. Gestionar cookies</h2>
            <div style={{ marginBottom: '1rem' }}>La mayoría de los navegadores te permiten rechazar la aceptación de cookies y eliminarlas. Los métodos para hacerlo varían de un navegador a otro, y de una versión a otra. Sin embargo, al bloquear todas las cookies de VigorNova, perderás el acceso a tu cuenta y no podrás guardar tus rutinas.</div>
          </section>
        </div>
      </div>
    </main>
  );
}
