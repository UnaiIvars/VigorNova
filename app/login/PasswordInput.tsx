'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

export default function PasswordInput() {
  const [show, setShow] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <label style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Lock size={18} /> Contraseña
      </label>
      <div style={{ position: 'relative' }}>
        <input
          name="password"
          type={show ? 'text' : 'password'}
          placeholder="Introduce tu contraseña"
          required
          className="auth-input"
          style={{
            width: '100%',
            padding: '1rem',
            paddingRight: '3rem',
            borderRadius: '15px',
            color: 'white',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          onClick={() => setShow(prev => !prev)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          style={{
            position: 'absolute',
            right: '0.9rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          {show ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}