'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

function isRedirectError(err: any): boolean {
  return (
    err?.message === 'NEXT_REDIRECT' ||
    err?.digest?.startsWith?.('NEXT_REDIRECT') ||
    typeof err?.digest === 'string' && err.digest.includes('NEXT_REDIRECT')
  );
}

function parseAuthError(err: any): string {
  const msg = err?.message || String(err || '');
  const lower = msg.toLowerCase();

  if (lower.includes('invalid api key') || lower.includes('api key not found') || lower.includes('apikey')) {
    return 'Clave API de Supabase no configurada o no válida. Asegúrate de haber añadido las variables de entorno en Vercel (Project Settings -> Environment Variables).';
  }
  if (lower.includes('fetch failed') || lower.includes('enotfound') || lower.includes('failed to fetch')) {
    return 'No se puede conectar con el servidor de base de datos (Supabase). Por favor, comprueba que tu proyecto de Supabase esté activo y las credenciales en .env.local sean válidas.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.';
  }
  if (lower.includes('user already registered') || lower.includes('already registered')) {
    return 'Este correo electrónico ya está registrado. Por favor, inicia sesión.';
  }
  if (lower.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Por favor, confirma tu correo electrónico antes de acceder.';
  }
  return msg || 'Error en la operación de autenticación.';
}

export async function login(formData: FormData) {
  let redirectTarget: string | null = null;

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string

    if (!email || !password) {
      redirectTarget = `/login?message=${encodeURIComponent('Por favor, rellena todos los campos.')}`;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        redirectTarget = `/login?message=${encodeURIComponent(parseAuthError(error))}`;
      } else {
        revalidatePath('/', 'layout')
        redirectTarget = '/dashboard';
      }
    }
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    redirectTarget = `/login?message=${encodeURIComponent(parseAuthError(err))}`;
  }

  if (redirectTarget) {
    return redirect(redirectTarget);
  }
}

export async function signup(formData: FormData) {
  let redirectTarget: string | null = null;

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    const fullName = (formData.get('fullName') as string)?.trim()
    const edad = formData.get('edad') as string
    const peso = formData.get('peso') as string
    const altura = formData.get('altura') as string
    const nivel = formData.get('nivel') as string

    if (!email || !password) {
      redirectTarget = `/register?message=${encodeURIComponent('Por favor, rellena todos los campos requeridos.')}`;
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            edad: edad ? parseInt(edad) : null,
            peso: peso ? parseFloat(peso) : null,
            altura: altura ? parseInt(altura) : null,
            nivel: nivel || 'Principiante',
          },
        },
      })

      if (error) {
        redirectTarget = `/register?message=${encodeURIComponent(parseAuthError(error))}`;
      } else {
        revalidatePath('/', 'layout')
        redirectTarget = '/login?status=registered';
      }
    }
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    redirectTarget = `/register?message=${encodeURIComponent(parseAuthError(err))}`;
  }

  if (redirectTarget) {
    return redirect(redirectTarget);
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    }
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    console.error('SignOut error:', err);
  }

  revalidatePath('/', 'layout')
  return redirect('/')
}

export async function signInWithGoogle() {
  let oauthUrl: string | null = null;
  let errorMessage: string | null = null;

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { headers } = await import('next/headers')
    const origin = (await headers()).get('origin') || 'http://localhost:3000'

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      errorMessage = 'No se ha configurado la URL de Supabase en .env.local.';
    } else {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })

      if (error) {
        errorMessage = parseAuthError(error);
      } else if (data?.url) {
        oauthUrl = data.url;
      } else {
        errorMessage = 'No se pudo generar el enlace de inicio de sesión con Google.';
      }
    }
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    errorMessage = parseAuthError(err);
  }

  if (errorMessage) {
    return redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
  }

  if (oauthUrl) {
    return redirect(oauthUrl);
  }
}

export async function resetPassword(formData: FormData) {
  let redirectTarget: string | null = null;

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const email = (formData.get('email') as string)?.trim()
    const { headers } = await import('next/headers')
    const origin = (await headers()).get('origin') || 'http://localhost:3000'

    if (!email) {
      redirectTarget = `/forgot-password?message=${encodeURIComponent('Por favor ingresa tu correo electrónico.')}`;
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/update-password`,
      })

      if (error) {
        redirectTarget = `/forgot-password?message=${encodeURIComponent(parseAuthError(error))}`;
      } else {
        redirectTarget = '/forgot-password?message=Revisa tu correo para recuperar tu contraseña.';
      }
    }
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    redirectTarget = `/forgot-password?message=${encodeURIComponent(parseAuthError(err))}`;
  }

  if (redirectTarget) {
    return redirect(redirectTarget);
  }
}

