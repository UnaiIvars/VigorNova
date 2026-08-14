import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let user: any = null;
  let profile: any = null;

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return redirect('/login')
    }
    user = authData.user;

    const { data: dbProfile } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = dbProfile;

    // Auto-creación de perfil si no existe
    if (!profile) {
      const meta = user.user_metadata;
      const newCode = 'FIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: newProfile, error: createError } = await supabase
        .from('usuarios')
        .insert({
          id: user.id,
          email: user.email,
          nombre: meta?.full_name || user.email?.split('@')[0] || 'Usuario',
          nivel: meta?.nivel || 'Nivel 1',
          edad: meta?.edad || null,
          peso: meta?.peso || null,
          altura: meta?.altura || null,
          fecha_registro: new Date().toISOString().split('T')[0],
          codigo_unico: newCode,
          estado: 'online'
        })
        .select()
        .single();
      
      if (!createError && newProfile) {
        profile = newProfile;
      }
    } else if (!profile.edad || !profile.peso || !profile.altura || !profile.codigo_unico) {
      // Sincronizar datos si existen en metadata pero no en la tabla usuarios o generar código único
      const meta = user.user_metadata;
      const missingCode = !profile.codigo_unico ? ('FIT-' + Math.random().toString(36).substring(2, 8).toUpperCase()) : profile.codigo_unico;
      
      if (meta?.edad || meta?.peso || meta?.altura || !profile.codigo_unico) {
        const { data: updatedProfile } = await supabase
          .from('usuarios')
          .update({
            nombre: profile.nombre === (profile.email?.split('@')[0] || 'Usuario') ? (meta?.full_name || profile.nombre) : profile.nombre,
            edad: profile.edad || meta?.edad,
            peso: profile.peso || meta?.peso,
            altura: profile.altura || meta?.altura,
            nivel: profile.nivel === 'Nivel 1' ? (meta?.nivel || profile.nivel) : profile.nivel,
            codigo_unico: missingCode,
            estado: 'online'
          })
          .eq('id', user.id)
          .select()
          .single();
        
        if (updatedProfile) {
          profile = updatedProfile;
        }
      }
    } else {
      // Update state to online
      if (profile.estado !== 'online') {
        const { data: updatedProfile } = await supabase
          .from('usuarios')
          .update({ estado: 'online' })
          .eq('id', user.id)
          .select()
          .single();
        if (updatedProfile) profile = updatedProfile;
      }
    }
  } catch (err: any) {
    if (
      err?.message === 'NEXT_REDIRECT' ||
      err?.digest?.includes('NEXT_REDIRECT') ||
      err?.digest === 'DYNAMIC_SERVER_USAGE' ||
      err?.message?.includes('Dynamic server usage')
    ) {
      throw err;
    }
    console.error("Dashboard Supabase error:", err);
    return redirect('/login?message=' + encodeURIComponent('Error al conectar con la base de datos'));
  }

  if (!user) {
    return redirect('/login');
  }

  const userData = {
    id: user.id,
    name: profile?.nombre || user.email?.split('@')[0] || 'Usuario',
    level: profile?.nivel || 'Nivel 1',
    plan: profile?.es_pro ? 'Pro' : 'Básico',
    es_pro: profile?.es_pro || false,
    email: user.email,
    peso: profile?.peso,
    altura: profile?.altura,
    edad: profile?.edad,
    descripcion: profile?.descripcion || '',
    foto_perfil: profile?.foto_perfil || '',
    ultimo_cambio_nombre: profile?.ultimo_cambio_nombre || null,
    ubicacion: profile?.ubicacion || '',
    instagram: profile?.instagram || '',
    twitter: profile?.twitter || '',
    codigo_unico: profile?.codigo_unico || '',
    estado: profile?.estado || 'offline'
  }

  return <DashboardClient user={userData} />
}

