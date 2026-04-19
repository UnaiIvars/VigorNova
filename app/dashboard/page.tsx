import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single()

  // If no profile exists (shouldn't happen with the trigger, but for safety)
  const userData = {
    name: profile?.nombre || user.email?.split('@')[0] || 'Usuario',
    level: profile?.nivel || 'Nivel 1',
    plan: 'Pro', // Mocking plan for now as it's not in the schema
    email: user.email,
    peso: profile?.peso,
    altura: profile?.altura,
    edad: profile?.edad,
  }

  return <DashboardClient user={userData} />
}
