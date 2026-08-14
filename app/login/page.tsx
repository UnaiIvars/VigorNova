import Link from 'next/link'
import Image from 'next/image'
import { login, signInWithGoogle } from '../auth/actions'
import PasswordInput from './PasswordInput'
import { Mail } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; status?: string }>
}) {
  const { message } = await searchParams;

  return (
    <main className="force-dark" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Imagen de fondo y overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/dashboard-hero-v2.png"
          alt="VigorNova Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(10, 10, 12, 0.5), rgba(10, 10, 12, 0.85))',
        zIndex: 1
      }} />

      <div className="glass-card animate-fade-in-up" style={{
        width: '100%',
        maxWidth: '550px',
        padding: '3rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ fontSize: '3.2rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'white', letterSpacing: '2px', marginBottom: '2rem' }}>
          VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
        </div>

        <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', textAlign: 'center' }}>
          INICIAR SESIÓN
        </h1>

        <form action={signInWithGoogle} style={{ width: '100%', marginBottom: '1.5rem' }}>
          <button type="submit" className="btn-google">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
          <span style={{ padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>o</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
        </div>

        <form action={login} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {message && (
            <div className="animate-fade-in-up" style={{
              padding: '1.2rem', background: 'rgba(255, 77, 77, 0.05)',
              border: '1px solid rgba(255, 77, 77, 0.2)', color: '#ff4d4d',
              borderRadius: '15px', fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              marginBottom: '0.5rem', width: '100%'
            }}>
              <div style={{ background: '#ff4d4d', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.1rem', textTransform: 'uppercase' }}>Error de acceso</div>
                <div style={{ opacity: 0.9, fontSize: '0.85rem' }}>
                  {message.toLowerCase().includes('invalid login credentials') 
                    ? 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.' 
                    : message}
                </div>
              </div>
            </div>
          )}

          {/* Alerta de registro exitoso */}
          {(await searchParams).status === 'registered' && (
            <div className="animate-fade-in-up" style={{
              padding: '1.2rem', background: 'rgba(74, 222, 128, 0.05)',
              border: '1px solid rgba(74, 222, 128, 0.2)', color: '#4ade80',
              borderRadius: '15px', fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{ background: '#4ade80', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.1rem' }}>¡REGISTRO COMPLETADO!</div>
                <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>Ya puedes iniciar sesión en tu nueva cuenta.</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Mail size={18} /> Correo Electrónico
            </label>
            <input
              name="email"
              type="email"
              placeholder="Introduce tu correo"
              required
              className="auth-input"
              style={{
                width: '100%', padding: '1rem', borderRadius: '15px',
                color: 'white', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <PasswordInput />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
              <Link href="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-text-accent">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {/* Mas alertas movidas arriba */}

          <button type="submit" className="btn-primary auth-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1.2rem', borderRadius: '18px', fontSize: '1.1rem' }}>
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
