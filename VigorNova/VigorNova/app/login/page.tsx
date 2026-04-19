import Link from 'next/link'
import { login } from '../auth/actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Gradient */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95))',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 42, 42, 0.15) 0%, transparent 60%), linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95))',
        zIndex: -1
      }} />

      <div className="glass-card animate-fade-in-up" style={{ 
        width: '100%', 
        maxWidth: '450px',
        padding: '3rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'white', letterSpacing: '2px', marginBottom: '2rem' }}>
          VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
        </div>
        
        <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-main)', textAlign: 'center' }}>
          INICIAR SESIÓN
        </h1>

        <form action={login} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Correo Electrónico</label>
            <input 
              name="email"
              type="email" 
              placeholder="tu@email.com"
              required
              style={{
                width: '100%', padding: '1rem', borderRadius: '8px', 
                background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)',
                color: 'white', outline: 'none'
              }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Contraseña</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '1rem', borderRadius: '8px', 
                background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)',
                color: 'white', outline: 'none'
              }} 
            />
          </div>

          {searchParams?.message && (
            <div style={{ padding: '0.75rem', background: 'rgba(255, 42, 42, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
              {searchParams.message}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            ENTRAR
          </button>
        </form>

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ¿No tienes una cuenta? <Link href="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Regístrate aquí</Link>
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
