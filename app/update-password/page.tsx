import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login?message=Sesión expirada. Por favor, solicita un nuevo enlace.')
  }

  async function updatePassword(formData: FormData) {
    'use server'
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const password = formData.get('password') as string

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      return redirect(`/update-password?message=${encodeURIComponent(error.message)}`)
    }

    return redirect('/dashboard')
  }

  return (
    <main className="force-dark" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95))',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 42, 42, 0.15) 0%, transparent 60%), linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95))',
        zIndex: -1
      }} />

      <div className="glass-card animate-fade-in-up" style={{
        width: '100%',
        maxWidth: '550px',
        padding: '3rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '3.2rem', fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'white', letterSpacing: '2px', marginBottom: '2rem' }}>
          VIGOR<span style={{ color: 'var(--accent-primary)' }}>NOVA</span>
        </div>

        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)', textAlign: 'center' }}>
          NUEVA CONTRASEÑA
        </h1>

        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Por favor, introduce tu nueva contraseña a continuación.
        </p>

        <form action={updatePassword} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Nueva Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%', padding: '1rem', borderRadius: '8px',
                background: 'rgba(25, 25, 28, 0.8)', border: '1px solid var(--glass-border)',
                color: 'white', outline: 'none'
              }}
            />
          </div>

          {message && (
            <div className="animate-fade-in-up" style={{
              padding: '1.2rem', background: 'rgba(255, 77, 77, 0.05)',
              border: '1px solid rgba(255, 77, 77, 0.2)', color: '#ff4d4d',
              borderRadius: '15px', fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              marginBottom: '1rem', width: '100%'
            }}>
              <div style={{ background: '#ff4d4d', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.1rem', textTransform: 'uppercase' }}>Error de actualización</div>
                <div style={{ opacity: 0.9, fontSize: '0.85rem' }}>
                  {message.toLowerCase().includes('password should be') 
                    ? 'La contraseña debe tener al menos 6 caracteres.' 
                    : message}
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            ACTUALIZAR Y ENTRAR
          </button>
        </form>
      </div>
    </main>
  )
}
