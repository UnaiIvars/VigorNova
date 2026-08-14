"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function upgradeToPro(userId: string) {
  if (!userId) return { success: false, error: "Usuario no encontrado" };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ es_pro: true })
      .eq('id', userId);

    if (error) {
      console.error("Error mejorando a pro:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("Error intentando mejorar a pro:", err);
    return { success: false, error: err.message || "Error interno del servidor" };
  }
}

export async function cancelProSubscription(userId: string) {
  if (!userId) return { success: false, error: "Missing userId" };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ es_pro: false })
      .eq('id', userId);

    if (error) {
      console.error("Error cancelando la suscripcion:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("Error cancelando la suscripcion:", err);
    return { success: false, error: err.message || "Error interno del servidor" };
  }
}
