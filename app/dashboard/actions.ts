"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getSupabase() {
  const cookieStore = await cookies();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const url = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    "placeholder-anon-key";

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Error handling for setting cookies in server actions
        }
      },
    },
  });
}

export async function getExercises() {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('ejercicios').select('*');

    if (error) {
      console.error("Error fetching exercises:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getExercises:", err);
    return [];
  }
}

export async function getUserFavorites(userId: string) {
  if (!userId) return [];
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('user_favorites')
      .select('exercise_id')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching user favorites:", error);
      return [];
    }
    return (data || []).map(row => row.exercise_id);
  } catch (err) {
    console.error("Error in getUserFavorites:", err);
    return [];
  }
}

export async function toggleFavorite(userId: string, exerciseId: number | string, isFavorite: boolean) {
  if (!userId || !exerciseId) return { success: false, error: "Missing userId or exerciseId" };
  try {
    const supabase = await getSupabase();

    // Verificar sesión en el servidor
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error in action:", authError);
      return { success: false, error: "No authenticated session found in server action" };
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({ user_id: userId, exercise_id: exerciseId });
      if (error) {
        console.error("Error removing favorite:", error);
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: userId, exercise_id: exerciseId });
      if (error) {
        console.error("Error adding favorite:", error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error in toggleFavorite:", err);
    return { success: false, error: err.message || "Error al actualizar favoritos" };
  }
}

export async function getUserWorkouts(userId: string) {
  if (!userId) return [];
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('entrenamientos')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching workouts:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getUserWorkouts:", err);
    return [];
  }
}

export async function saveWorkout(workoutId: string | null, userId: string, workoutData: any) {
  if (!userId) return { success: false, error: "Missing userId" };
  try {
    const supabase = await getSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (workoutId) {
      // Update existing
      const { error } = await supabase
        .from('entrenamientos')
        .update({
          nombre: workoutData.nombre,
          objetivo: workoutData.objetivo,
          nivel: workoutData.nivel,
          duracion: workoutData.duracion,
          color: workoutData.color,
          imagen_url: workoutData.imagen_url,
          dias: workoutData.dias || [],
          ejercicios: workoutData.ejercicios || [],
          musculos: workoutData.musculos || [],
          es_publico: workoutData.es_publico || false,
          descripcion: workoutData.descripcion || ''
        })
        .eq('id', workoutId)
        .eq('usuario_id', userId);

      if (error) return { success: false, error: error.message };
      return { success: true, isNew: false };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('entrenamientos')
        .insert({
          usuario_id: userId,
          nombre: workoutData.nombre,
          objetivo: workoutData.objetivo,
          nivel: workoutData.nivel,
          duracion: workoutData.duracion,
          color: workoutData.color,
          imagen_url: workoutData.imagen_url,
          dias: workoutData.dias || [],
          ejercicios: workoutData.ejercicios || [],
          musculos: workoutData.musculos || [],
          es_publico: workoutData.es_publico || false,
          descripcion: workoutData.descripcion || ''
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, isNew: true, data };
    }
  } catch (err: any) {
    console.error("Error in saveWorkout:", err);
    return { success: false, error: err.message || "Error al guardar la rutina" };
  }
}

export async function deleteWorkout(workoutId: string, userId: string) {
  if (!workoutId || !userId) return { success: false, error: "Missing parameters" };
  try {
    const supabase = await getSupabase();

    const { error } = await supabase
      .from('entrenamientos')
      .delete()
      .eq('id', workoutId)
      .eq('usuario_id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteWorkout:", err);
    return { success: false, error: err.message || "Error al eliminar la rutina" };
  }
}

export async function saveSession(userId: string, sessionData: any) {
  if (!userId) return { success: false, error: "Missing userId" };
  try {
    const supabase = await getSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from('historial_sesiones')
      .insert({
        usuario_id: userId,
        entrenamiento_id: sessionData.entrenamiento_id || null,
        nombre_entrenamiento: sessionData.nombre_entrenamiento,
        duracion: sessionData.duracion || 0,
        notas: sessionData.notas || '',
        datos_ejercicios: sessionData.datos_ejercicios || []
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving session:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error("Error in saveSession:", err);
    return { success: false, error: err.message || "Error al guardar la sesión" };
  }
}

export async function getUserHistory(userId: string) {
  if (!userId) return [];
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('historial_sesiones')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getUserHistory:", err);
    return [];
  }
}

export async function deleteHistoryEntry(id: string, userId: string) {
  if (!id || !userId) return { success: false, error: 'ID or UserID missing' };
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('historial_sesiones')
      .delete()
      .eq('id', id)
      .eq('usuario_id', userId);

    if (error) {
      console.error("Error deleting history entry:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteHistoryEntry:", err);
    return { success: false, error: err.message || "Error al eliminar historial" };
  }
}

export async function getPublicWorkouts() {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('entrenamientos')
      .select('*, resenas(rating)')
      .eq('es_publico', true);

    if (error) {
      console.error("DEBUG -> Error fetching public workouts:", error);
      return [];
    }

    const userIds = Array.from(new Set((data || []).map((w: any) => w.usuario_id))).filter(Boolean);
    let authors: any[] = [];
    if (userIds.length > 0) {
      const { data: authorsData } = await supabase
        .from('usuarios')
        .select('id, nombre, foto_perfil')
        .in('id', userIds);
      authors = authorsData || [];
    }

    const mapped = (data || []).map((w: any) => {
      const ratings = w.resenas || [];
      const avg = ratings.length > 0
        ? ratings.reduce((acc: number, r: any) => acc + r.rating, 0) / ratings.length
        : 0;

      return {
        ...w,
        rating_avg: avg,
        rating_count: ratings.length,
        usuarios: authors?.find((a: any) => a.id === w.usuario_id) || null
      };
    });

    return mapped;
  } catch (err) {
    console.error("Error in getPublicWorkouts:", err);
    return [];
  }
}

export async function getReviews(workoutId: string) {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('resenas').select('*').eq('workout_id', workoutId).order('created_at', { ascending: false });
    if (error) {
      console.error("DEBUG -> Error fetching reviews:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getReviews:", err);
    return [];
  }
}

export async function addReview(workoutId: string, rating: number, comment: string, userName: string, userAvatar: string) {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not logged in" };

    const { data: existing } = await supabase
      .from('resenas')
      .select('id')
      .eq('workout_id', workoutId)
      .eq('user_id', user.id)
      .limit(1);

    const existingReview = existing && existing.length > 0 ? existing[0] : null;

    if (existingReview) {
      const { error } = await supabase
        .from('resenas')
        .update({
          rating,
          comment,
          user_name: userName,
          user_avatar: userAvatar,
          created_at: new Date().toISOString()
        })
        .eq('id', existingReview.id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase.from('resenas').insert({
        workout_id: workoutId,
        user_id: user.id,
        user_name: userName,
        user_avatar: userAvatar,
        rating,
        comment
      });
      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error in addReview:", err);
    return { success: false, error: err.message || "Error al añadir la reseña" };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autenticado" };

    const { error, count } = await supabase
      .from('resenas')
      .delete({ count: 'exact' })
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (error) return { success: false, error: error.message };
    if (count === 0) return { success: false, error: "No se encontró la reseña o no tienes permiso para borrarla." };

    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteReview:", err);
    return { success: false, error: err.message || "Error al eliminar reseña" };
  }
}

export async function getUserReviews(userId: string) {
  try {
    const supabase = await getSupabase();
    const { data: workouts } = await supabase.from('entrenamientos').select('id, nombre').eq('usuario_id', userId);
    if (!workouts || workouts.length === 0) return [];

    const workoutIds = workouts.map((w: any) => w.id);
    const { data: reviews, error } = await supabase.from('resenas').select('*').in('workout_id', workoutIds).order('created_at', { ascending: false });

    if (error) return [];

    return (reviews || []).map(r => ({
      ...r,
      workout_name: workouts.find((w: any) => w.id === r.workout_id)?.nombre || 'Rutina'
    }));
  } catch (err) {
    console.error("Error in getUserReviews:", err);
    return [];
  }
}

export async function forkWorkout(workoutId: string, userId: string, selectedDays?: string[]) {
  if (!workoutId || !userId) return { success: false, error: "Missing parameters" };
  try {
    const supabase = await getSupabase();

    const { data: original, error: fetchError } = await supabase
      .from('entrenamientos')
      .select('*')
      .eq('id', workoutId)
      .single();

    if (fetchError || !original) return { success: false, error: "Workout not found" };

    const { error: insertError } = await supabase
      .from('entrenamientos')
      .insert({
        usuario_id: userId,
        nombre: original.nombre,
        objetivo: original.objetivo,
        nivel: original.nivel,
        duracion: original.duracion,
        color: original.color,
        imagen_url: original.imagen_url,
        dias: selectedDays || original.dias || [],
        ejercicios: original.ejercicios,
        es_publico: false
      });

    if (insertError) return { success: false, error: insertError.message };
    return { success: true };
  } catch (err: any) {
    console.error("Error in forkWorkout:", err);
    return { success: false, error: err.message || "Error al duplicar rutina" };
  }
}

export async function addExerciseToWorkout(workoutId: string, userId: string, exerciseName: string) {
  if (!workoutId || !userId || !exerciseName) return { success: false, error: "Missing parameters" };
  try {
    const supabase = await getSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) return { success: false, error: "Unauthorized" };

    const { data: workout, error: fetchError } = await supabase
      .from('entrenamientos')
      .select('ejercicios')
      .eq('id', workoutId)
      .eq('usuario_id', userId)
      .single();

    if (fetchError || !workout) return { success: false, error: "Rutina no encontrada" };

    const currentExercises: string[] = workout.ejercicios || [];

    if (currentExercises.includes(exerciseName)) {
      return { success: false, error: "Este ejercicio ya está en la rutina" };
    }

    const updatedExercises = [...currentExercises, exerciseName];

    const { error: updateError } = await supabase
      .from('entrenamientos')
      .update({ ejercicios: updatedExercises })
      .eq('id', workoutId)
      .eq('usuario_id', userId);

    if (updateError) return { success: false, error: updateError.message };
    return { success: true };
  } catch (err: any) {
    console.error("Error in addExerciseToWorkout:", err);
    return { success: false, error: err.message || "Error al añadir ejercicio" };
  }
}

export async function updateUserProfile(userId: string, profileData: any) {
  if (!userId) return { success: false, error: "Missing userId" };
  try {
    const supabase = await getSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) return { success: false, error: "Unauthorized" };

    if (profileData.nombre) {
      const { data: currentProfile } = await supabase
        .from('usuarios')
        .select('nombre, ultimo_cambio_nombre')
        .eq('id', userId)
        .single();

      if (currentProfile && currentProfile.nombre !== profileData.nombre) {
        if (currentProfile.ultimo_cambio_nombre) {
          const lastChange = new Date(currentProfile.ultimo_cambio_nombre);
          const now = new Date();
          const diffDays = Math.ceil((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays < 60) {
            return { success: false, error: `Solo puedes cambiar tu nombre cada 60 días. Faltan ${60 - diffDays} días.` };
          }
        }
        profileData.ultimo_cambio_nombre = new Date().toISOString();
      } else {
        delete profileData.nombre;
      }
    }

    const { error } = await supabase
      .from('usuarios')
      .update(profileData)
      .eq('id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error("Error in updateUserProfile:", err);
    return { success: false, error: err.message || "Error al actualizar perfil" };
  }
}

export async function getChatMessages(userId: string) {
  noStore();
  if (!userId) return [];
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getChatMessages:", err);
    return [];
  }
}

export async function saveChatMessage(userId: string, role: 'user' | 'ai', content: string, conversationId: string = 'default', isPinned: boolean = false) {
  if (!userId) return { success: false, error: "Missing userId" };
  try {
    const supabase = await getSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        role: role,
        content: content,
        conversation_id: conversationId,
        is_pinned: isPinned
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error("Error in saveChatMessage:", err);
    return { success: false, error: err.message || "Error al guardar mensaje" };
  }
}

export async function deleteConversation(userId: string, conversationId: string) {
  if (!userId || !conversationId) return { success: false, error: "Missing parameters" };
  try {
    const supabase = await getSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) return { success: false, error: "Unauthorized" };

    let totalDeleted = 0;
    if (conversationId === 'default') {
      const { error: err1, count: count1 } = await supabase.from('chat_messages').delete({ count: 'exact' }).eq('user_id', userId).eq('conversation_id', 'default');
      const { error: err2, count: count2 } = await supabase.from('chat_messages').delete({ count: 'exact' }).eq('user_id', userId).is('conversation_id', null);
      if (err1) throw err1;
      if (err2) throw err2;
      totalDeleted = (count1 || 0) + (count2 || 0);
    } else {
      const { error, count } = await supabase.from('chat_messages').delete({ count: 'exact' }).eq('user_id', userId).eq('conversation_id', conversationId);
      if (error) throw error;
      totalDeleted = count || 0;
    }

    if (totalDeleted === 0) {
      return { success: false, error: "Políticas RLS de Supabase: No tienes permiso para borrar (0 filas afectadas)." };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("deleteConversation error:", err);
    return { success: false, error: err.message || "Error deleting conversation" };
  }
}

export async function togglePinConversation(userId: string, conversationId: string, isPinned: boolean) {
  if (!userId || !conversationId) return { success: false, error: "Missing parameters" };
  try {
    const supabase = await getSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) return { success: false, error: "Unauthorized" };

    if (conversationId === 'default') {
      const { error: err1 } = await supabase.from('chat_messages').update({ is_pinned: isPinned }).eq('user_id', userId).eq('conversation_id', 'default');
      const { error: err2 } = await supabase.from('chat_messages').update({ is_pinned: isPinned }).eq('user_id', userId).is('conversation_id', null);
      if (err1) throw err1;
      if (err2) throw err2;
    } else {
      const { error } = await supabase.from('chat_messages').update({ is_pinned: isPinned }).eq('user_id', userId).eq('conversation_id', conversationId);
      if (error) throw error;
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("togglePinConversation error:", err);
    return { success: false, error: err.message || "Error pinning conversation" };
  }
}

export async function getWeightHistory(userId: string) {
  if (!userId) return [];
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('historial_peso')
      .select('*')
      .eq('usuario_id', userId)
      .order('fecha', { ascending: true });

    if (error) {
      console.error("Error fetching weight history:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getWeightHistory:", err);
    return [];
  }
}

export async function saveWeightEntry(userId: string, peso: number, fecha: string) {
  if (!userId || !peso) return { success: false, error: "Faltan datos" };
  try {
    const supabase = await getSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) return { success: false, error: "No autorizado" };

    const { error } = await supabase
      .from('historial_peso')
      .insert({
        usuario_id: userId,
        peso: peso,
        fecha: fecha
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error("Error in saveWeightEntry:", err);
    return { success: false, error: err.message || "Error al guardar peso" };
  }
}

export async function deleteWeightEntry(id: string, userId: string) {
  if (!id || !userId) return { success: false, error: "ID o Usuario faltante" };
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('historial_peso')
      .delete()
      .eq('id', id)
      .eq('usuario_id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteWeightEntry:", err);
    return { success: false, error: err.message || "Error al eliminar registro de peso" };
  }
}

export async function getPublicProfile(userId: string) {
  try {
    const supabase = await getSupabase();

    const { data: profile, error: pError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (pError || !profile) return null;

    const { data: workouts } = await supabase
      .from('entrenamientos')
      .select('*, resenas(rating)')
      .eq('usuario_id', userId)
      .eq('es_publico', true);

    const workoutIds = (workouts || []).map(w => w.id);
    let reviews: any[] = [];
    if (workoutIds.length > 0) {
      const { data: reviewsData } = await supabase
        .from('resenas')
        .select('*')
        .in('workout_id', workoutIds);
      reviews = reviewsData || [];
    }

    const workoutsWithStats = (workouts || []).map(w => {
      const r = reviews?.filter(rev => rev.workout_id === w.id) || [];
      const avg = r.length > 0 ? r.reduce((acc, curr) => acc + curr.rating, 0) / r.length : 0;
      return { ...w, rating_avg: avg, rating_count: r.length };
    });

    return {
      profile,
      workouts: workoutsWithStats,
      reviews: reviews || []
    };
  } catch (err) {
    console.error("Error in getPublicProfile:", err);
    return null;
  }
}

export async function unpublishWorkout(workoutId: string, userId: string) {
  try {
    const supabase = await getSupabase();

    const { data: workout, error: fError } = await supabase
      .from('entrenamientos')
      .select('usuario_id')
      .eq('id', workoutId)
      .single();

    if (fError || !workout || workout.usuario_id !== userId) {
      return { success: false, error: "No autorizado o rutina no encontrada" };
    }

    const { error: uError } = await supabase
      .from('entrenamientos')
      .update({ es_publico: false })
      .eq('id', workoutId);

    if (uError) return { success: false, error: "Error al actualizar estado: " + uError.message };

    const { error: dError } = await supabase
      .from('resenas')
      .delete()
      .eq('workout_id', workoutId);

    if (dError) {
      console.error("DEBUG -> Falló el borrado de reseñas:", dError);
      return {
        success: false,
        error: "La rutina se retiró, pero no se pudieron borrar las reseñas (posible falta de permisos). " + dError.message
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error in unpublishWorkout:", err);
    return { success: false, error: err.message || "Error al retirar rutina" };
  }
}
