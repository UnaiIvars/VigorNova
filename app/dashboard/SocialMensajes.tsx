'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, Users, MessageSquare, Check, X as XIcon, Send, Clock, Activity, Share2, ShieldBan, AlertTriangle, Plus, Smile, FileUp, Trash2, Download, Dumbbell, Eye, EyeOff, Settings, MoreVertical, Edit2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SocialMensajes({ user, workouts = [], onNavigateToProfile, onRoutineSaved, theme }: { user: any, workouts?: any[], onNavigateToProfile?: (id: string) => void, onRoutineSaved?: () => void, theme: 'light' | 'dark' }) {
  const [activeTab, setActiveTab] = useState<'chats' | 'amigos' | 'solicitudes'>('chats');
  const [amigos, setAmigos] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('caras');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null);
  const [showRoutineSelector, setShowRoutineSelector] = useState(false);
  const [selectedRoutineForSharing, setSelectedRoutineForSharing] = useState<any | null>(null);
  const [routineToSave, setRoutineToSave] = useState<any | null>(null);
  const [selectedDaysForSave, setSelectedDaysForSave] = useState<string[]>([]);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const [showZoomedPhoto, setShowZoomedPhoto] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<any | null>(null);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const EMOJI_CATEGORIES = {
    caras: { icon: '😀', label: 'Emoticonos', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭', '🤫', '🫠', '🤥', '😶', '🫥', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '😵‍💫', '🫨', '🤐', '🥴', '🤢', '🤮', '🤧', '🫠', '🫥', '🫡', '🫣', '🫤', '🫨'] },
    gestos: { icon: '👋', label: 'Gestos', emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾', '✍️', '💅', '🤳', '🦵', '🦿', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'] },
    deporte: { icon: '⚽', label: 'Deporte y Salud', emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🎿', '⛷️', '🏂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🔥', '⚡', '✨'] },
    comida: { icon: '🍎', label: 'Comida y Bebida', emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🌮', '🌯', '🥗', '🥘', '🍲', '🥣', '🍿', '🍣', '🍱', '🍦', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃'] },
    objetos: { icon: '💡', label: 'Objetos', emojis: ['⌚', '📱', '💻', '📷', '📹', '📺', '📻', '🎙️', '⏱️', '⏰', '⌛', '🔋', '🔌', '💡', '🔦', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '🏺', '🔮', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛀', '🧼', '🪥', '🪒', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🧸', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🪄', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '🪧', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📄', '📑', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'] }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getInitials = (nombre: string) => nombre?.substring(0, 2).toUpperCase() || '??';

  useEffect(() => {
    loadSocialData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeChat) loadMensajes(activeChat.id);
      loadSolicitudes();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    if (activeChat) {
      loadMensajes(activeChat.id);
      marcarComoLeido(activeChat.id);
    }
  }, [activeChat]);

  useEffect(() => {
    if (chatContainerRef.current && autoScrollEnabled) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [mensajes, autoScrollEnabled]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setAutoScrollEnabled(isAtBottom);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showPlusMenu || showEmojiPicker) {
        const target = e.target as HTMLElement;
        if (!target.closest('.plus-menu-container') && !target.closest('.emoji-picker-container') && !target.closest('.btn-plus')) {
          setShowPlusMenu(false);
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlusMenu, showEmojiPicker]);

  const marcarComoLeido = async (amigoId: string) => {
    await supabase.from('mensajes')
      .update({ leido: true })
      .eq('remitente_id', amigoId)
      .eq('receptor_id', user.id)
      .eq('leido', false);
    setAmigos(prev => prev.map(a => a.id === amigoId ? { ...a, unread_count: 0 } : a));
  };

  const loadSocialData = async () => {
    setLoading(true);
    await Promise.all([loadAmigos(), loadSolicitudes()]);
    setLoading(false);
  };

  const loadAmigos = async () => {
    if (!user?.id) return;

    const { data: d1 } = await supabase
      .from('amigos')
      .select('amigo_id, nombre, usuarios!amigos_amigo_id_fkey(*)')
      .eq('usuario_id', user.id);

    const { data: d2 } = await supabase
      .from('amigos')
      .select('usuario_id, usuarios!amigos_usuario_id_fkey(*)')
      .eq('amigo_id', user.id);

    let amigosList = [
      ...(d1?.map((d: any) => ({
        ...d.usuarios,
        nombre: d.nombre || d.usuarios?.nombre || 'Usuario'
      })) || []),
      ...(d2?.map((d: any) => ({
        ...d.usuarios,
        nombre: d.usuarios?.nombre || 'Usuario'
      })) || [])
    ];

    const amigosConUnread = await Promise.all(amigosList.map(async (amigo) => {
      const { count } = await supabase.from('mensajes').select('*', { count: 'exact', head: true }).eq('remitente_id', amigo.id).eq('receptor_id', user.id).eq('leido', false);
      return { ...amigo, unread_count: count || 0 };
    }));

    setAmigos(amigosConUnread);
  };

  const loadSolicitudes = async () => {
    if (!user?.id) return;
    const { data } = await supabase.from('solicitudes_amistad').select('id, remitente_id, estado, created_at, usuarios!solicitudes_amistad_remitente_id_fkey(*)').eq('receptor_id', user.id).eq('estado', 'pendiente');
    setSolicitudes(data || []);
  };

  const loadMensajes = async (amigoId: string) => {
    const { data } = await supabase.from('mensajes').select('*').or(`and(remitente_id.eq.${user.id},receptor_id.eq.${amigoId}),and(remitente_id.eq.${amigoId},receptor_id.eq.${user.id})`).order('created_at', { ascending: true });
    setMensajes(data || []);
  };

  const renameFriend = async () => {
    if (!activeChat || !newName.trim()) return;
    try {
      const { error } = await supabase
        .from('amigos')
        .update({ nombre: newName.trim() })
        .eq('usuario_id', user.id)
        .eq('amigo_id', activeChat.id);

      if (error) throw error;

      showToast('Nombre actualizado correctamente');
      setShowFriendProfile(false);
      loadSocialData();
      setActiveChat(prev => prev ? { ...prev, nombre: newName.trim() } : null);
    } catch (error) {
      console.error(error);
      showToast('Error al actualizar el nombre', 'error');
    }
  };

  const deleteFriend = async () => {
    if (!friendToDelete) return;
    try {

      await supabase.from('amigos').delete()
        .or(`and(usuario_id.eq.${user.id},amigo_id.eq.${friendToDelete.id}),and(usuario_id.eq.${friendToDelete.id},amigo_id.eq.${user.id})`);

      await supabase.from('mensajes').delete()
        .or(`and(remitente_id.eq.${user.id},receptor_id.eq.${friendToDelete.id}),and(remitente_id.eq.${friendToDelete.id},receptor_id.eq.${user.id})`);

      await supabase.from('solicitudes_amistad').delete()
        .or(`and(remitente_id.eq.${user.id},receptor_id.eq.${friendToDelete.id}),and(remitente_id.eq.${friendToDelete.id},receptor_id.eq.${user.id})`);

      setAmigos(prev => prev.filter(a => a.id !== friendToDelete.id));
      if (activeChat?.id === friendToDelete.id) {
        setActiveChat(null);
        setMensajes([]);
      }
      showToast(`${friendToDelete.nombre} eliminado de tus amigos`, 'success');
    } catch (error) {
      console.error(error);
      showToast('Error al eliminar amigo', 'error');
    } finally {
      setFriendToDelete(null);
    }
  };

  const clearChat = async () => {
    if (!activeChat) return;
    try {
      const { error } = await supabase
        .from('mensajes')
        .delete()
        .or(`and(remitente_id.eq.${user.id},receptor_id.eq.${activeChat.id}),and(remitente_id.eq.${activeChat.id},receptor_id.eq.${user.id})`);

      if (error) throw error;

      showToast('Chat vaciado');
      loadMensajes(activeChat.id);
      setShowClearConfirm(false);
      setShowHeaderMenu(false);
    } catch (error) {
      console.error(error);
      showToast('Error al vaciar el chat', 'error');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachedFile) || !activeChat) return;
    const msg = newMessage;
    const file = attachedFile;
    setNewMessage('');
    setAttachedFile(null);
    let msgContent = msg;
    let msgType = 'texto';
    if (file) {
      msgType = 'archivo';
      showToast('Subiendo archivo...', 'info');
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('chat-files').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('chat-files').getPublicUrl(fileName);
        msgContent = `${publicUrl}|${file.name}`;
      } catch (err: any) {
        console.error('Upload error:', err);
        showToast('Error al subir archivo', 'error');
        msgContent = `ERROR_UPLOAD:${file.name}`;
      }
    }
    await supabase.from('mensajes').insert({ remitente_id: user.id, receptor_id: activeChat.id, contenido: msgContent, tipo: msgType });
    setAutoScrollEnabled(true);
    loadMensajes(activeChat.id);
  };

  const deleteMessage = async (msgId: string) => {
    if (!msgId) return;
    setMensajes(prev => prev.filter(m => m.id !== msgId));
    const { error } = await supabase.from('mensajes').delete().eq('id', msgId);
    if (error) {
      showToast('Error al eliminar mensaje', 'error');
      if (activeChat) loadMensajes(activeChat.id);
    }
  };

  const handleDownloadFile = async (url: string, filename: string) => {
    try {
      showToast('Descargando archivo...', 'info');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al descargar');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'archivo_descargado';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading:', error);
      showToast('Error al descargar el archivo', 'error');
    }
  };

  const handleSendRoutineFromSelector = async (routine: any) => {
    if (!activeChat) return;
    const routineSnapshot = {
      name: routine.name || routine.nombre,
      goal: routine.goal || routine.objetivo,
      days: routine.days || routine.dias || [],
      exercises: routine.exercises || routine.ejercicios || [],
      level: routine.level || 'Intermedio',
      duration: routine.duration || '45 min',
      image: routine.image || routine.imagen_url,
      color: routine.color,
      descripcion: routine.descripcion || ''
    };
    const { error } = await supabase.from('mensajes').insert({
      remitente_id: user.id,
      receptor_id: activeChat.id,
      contenido: `RUTINA_DATA|${JSON.stringify(routineSnapshot)}`,
      tipo: 'rutina'
    });
    if (error) {
      showToast('Error al compartir rutina', 'error');
    } else {
      setShowRoutineSelector(false);
      showToast('¡Rutina compartida!', 'success');
      loadMensajes(activeChat.id);
    }
  };

  const guardarRutinaCompartida = async (routineData: any) => {
    try {
      const { error: insertError } = await supabase.from('entrenamientos').insert({
        usuario_id: user.id,
        nombre: routineData.name || routineData.nombre,
        objetivo: routineData.goal || routineData.objetivo,
        dias: selectedDaysForSave.length > 0 ? selectedDaysForSave : (routineData.days || routineData.dias || []),
        ejercicios: routineData.exercises || routineData.ejercicios || [],
        musculos: routineData.muscles || routineData.musculos || [],
        nivel: routineData.level || 'Intermedio',
        duracion: routineData.duration || '45 min',
        imagen_url: routineData.image || routineData.imagen_url,
        color: routineData.color,
        descripcion: routineData.descripcion || '',
        es_publico: false
      });
      if (insertError) throw insertError;
      if (onRoutineSaved) onRoutineSaved();
      setRoutineToSave(null);
      showToast('¡Rutina guardada en tu biblioteca!', 'success');
    } catch (error) {
      console.error('Error saving routine:', error);
      showToast('Error al guardar la rutina', 'error');
    }
  };

  const buscarUsuario = async () => {
    if (!searchCode.trim() || searchCode === user.codigo_unico) return;
    const { data } = await supabase.from('usuarios').select('*').eq('codigo_unico', searchCode.toUpperCase()).single();
    setSearchResult(data || null);
    if (!data) showToast('Usuario no encontrado.', 'error');
  };

  const enviarSolicitud = async (receptorId: string) => {

    await supabase.from('solicitudes_amistad').delete()
      .or(`and(remitente_id.eq.${user.id},receptor_id.eq.${receptorId}),and(remitente_id.eq.${receptorId},receptor_id.eq.${user.id})`);

    const { error } = await supabase.from('solicitudes_amistad').insert({ remitente_id: user.id, receptor_id: receptorId });
    if (error) {
      console.error('Error al enviar solicitud:', error);
      showToast('Error al enviar solicitud.', 'error');
    } else {
      showToast('Solicitud enviada.', 'success');
    }
    setSearchResult(null);
    setSearchCode('');
  };

  const responderSolicitud = async (solicitudId: string, remitenteId: string, accion: 'aceptada' | 'rechazada') => {
    await supabase.from('solicitudes_amistad').update({ estado: accion }).eq('id', solicitudId);
    if (accion === 'aceptada') {
      await supabase.from('amigos').insert({ usuario_id: user.id, amigo_id: remitenteId });
      loadAmigos();
    }
    loadSolicitudes();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><div className="animate-pulse" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div className={`animate-fade-in-up social-container ${activeChat ? 'viewing-chat' : ''}`} style={{ height: 'calc(100vh - 8rem)', display: 'flex', gap: '2rem', position: 'relative' }}>

      {toast && (
        <div style={{ position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#22c55e', color: 'var(--text-main)', padding: '0.8rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', animation: 'fade-in-up 0.3s ease-out' }}>
          {toast.type === 'success' ? <Check size={18} /> : toast.type === 'info' ? <Activity size={18} /> : <AlertTriangle size={18} />}
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{toast.message}</span>
        </div>
      )}

      {showRoutineSelector && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => { setShowRoutineSelector(false); setSelectedRoutineForSharing(null); }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'visible', padding: '2.5rem', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {selectedRoutineForSharing && (
                  <button type="button" onClick={() => setSelectedRoutineForSharing(null)} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '10px', width: '35px', height: '35px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <XIcon size={18} style={{ transform: 'rotate(90deg)' }} />
                  </button>
                )}
                <h2 style={{ fontFamily: 'Oswald', fontSize: '2.2rem', color: 'var(--text-main)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {selectedRoutineForSharing ? 'REVISAR' : 'COMPARTIR'} <span style={{ color: 'var(--accent-primary)' }}>RUTINA</span>
                </h2>
              </div>
              <button type="button" onClick={() => { setShowRoutineSelector(false); setSelectedRoutineForSharing(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}><XIcon size={28} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }} className="custom-scrollbar">
              {!selectedRoutineForSharing ? (

                workouts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Dumbbell size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                    <p style={{ fontSize: '1.1rem' }}>No tienes rutinas creadas para compartir.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', paddingBottom: '1rem' }}>
                    {workouts.map((w: any) => (
                      <div
                        key={w.id}
                        onClick={() => setSelectedRoutineForSharing(w)}
                        style={{ padding: '1.5rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(255,42,42,0.15)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '1.2rem' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: w.color || 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                            <Dumbbell size={26} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Oswald', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{w.name || w.nombre}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{w.goal || w.objetivo}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)' }}><Activity size={14} /> {(w.exercises || w.ejercicios || []).length} ejercicios</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> {w.goal || w.objetivo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (

                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ background: 'var(--bg-subtle)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Resumen de Rutina</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
                      {(selectedRoutineForSharing.exercises || selectedRoutineForSharing.ejercicios || []).map((ex: string, idx: number) => (
                        <div key={idx} style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(var(--accent-primary-rgb), 0.1)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedRoutineForSharing(null)}
                      style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', fontWeight: 700, fontFamily: 'Oswald', letterSpacing: '1px', cursor: 'pointer', transition: '0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      VOLVER AL LISTADO
                    </button>
                    <button
                      type="button"
                      onClick={() => { handleSendRoutineFromSelector(selectedRoutineForSharing); setSelectedRoutineForSharing(null); }}
                      style={{ flex: 2, padding: '1.2rem', borderRadius: '16px', border: 'none', background: 'var(--accent-primary)', color: 'var(--text-on-accent)', fontWeight: 800, fontFamily: 'Oswald', letterSpacing: '2px', cursor: 'pointer', transition: '0.3s', boxShadow: `0 10px 30px rgba(var(--accent-primary-rgb), ${theme === 'dark' ? 0.3 : 0.15})`, display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 15px 40px rgba(var(--accent-primary-rgb), ${theme === 'dark' ? 0.4 : 0.2})`; }}
                      onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 10px 30px rgba(var(--accent-primary-rgb), ${theme === 'dark' ? 0.3 : 0.15})`; }}
                    >
                      <Send size={20} /> ENVIAR RUTINA A {activeChat?.nombre.toUpperCase()}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="glass-card social-sidebar hide-mobile-when-chat" style={{ width: '380px', display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-subtle)' }}>
          <h2 style={{ fontFamily: 'Oswald', fontSize: '1.8rem', color: 'var(--text-main)', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Comunidad</h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-subtle)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Tu Código:</span>
            <span style={{ fontFamily: 'Oswald', color: 'var(--accent-primary)', fontSize: '1.1rem', letterSpacing: '2px', cursor: 'pointer' }} onClick={() => { navigator.clipboard.writeText(user.codigo_unico || ''); showToast('Código copiado', 'success'); }}>
              {user.codigo_unico || 'GENERANDO...'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
          {['chats', 'amigos', 'solicitudes'].map((tab: any) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '1rem 0.2rem', background: activeTab === tab ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent', color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
              onMouseOver={e => { if (activeTab !== tab) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseOut={e => { if (activeTab !== tab) e.currentTarget.style.background = 'transparent'; }}
            >
              {tab === 'chats' && <MessageSquare size={16} />}
              {tab === 'amigos' && <Users size={16} />}
              {tab === 'solicitudes' && <UserPlus size={16} />}
              {tab}
              {tab === 'solicitudes' && solicitudes.length > 0 && <span style={{ background: 'var(--accent-primary)', color: 'var(--text-on-accent)', width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{solicitudes.length}</span>}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem' }} className="custom-scrollbar">
          {activeTab === 'chats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {amigos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <MessageSquare size={32} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                  <p style={{ fontSize: '0.85rem' }}>Añade amigos para chatear.</p>
                </div>
              ) : (
                amigos.map(amigo => (
                  <button
                    key={amigo.id}
                    type="button"
                    onClick={() => setActiveChat(amigo)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem', borderRadius: '18px', background: activeChat?.id === amigo.id ? 'rgba(var(--accent-primary-rgb), 0.08)' : 'transparent', border: '1px solid', borderColor: activeChat?.id === amigo.id ? 'rgba(var(--accent-primary-rgb), 0.3)' : 'transparent', cursor: 'pointer', transition: 'all 0.25s', textAlign: 'left' }}
                    onMouseOver={e => { if (activeChat?.id !== amigo.id) e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                    onMouseOut={e => { if (activeChat?.id !== amigo.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--glass-border)', flexShrink: 0 }}>
                      {amigo.foto_perfil ? <img src={amigo.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontWeight: 800, fontFamily: 'Oswald', color: 'var(--text-main)', fontSize: '1.1rem' }}>{getInitials(amigo.nombre)}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{amigo.nombre}</span>
                        {amigo.unread_count > 0 && <span style={{ background: 'var(--accent-primary)', color: 'var(--text-on-accent)', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{amigo.unread_count}</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Oswald', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{amigo.nivel}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {activeTab === 'amigos' && (
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input type="text" placeholder="Código de amigo..." value={searchCode} onChange={e => setSearchCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && buscarUsuario()} style={{ flex: 1, padding: '0.8rem 1rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }} />
                <button type="button" onClick={buscarUsuario} style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: '12px', padding: '0 1rem', color: 'var(--text-main)', cursor: 'pointer' }}><Search size={18}/></button>
              </div>

              {searchResult && (
                <div style={{ padding: '1rem', background: 'rgba(var(--accent-primary-rgb), 0.05)', borderRadius: '16px', border: '1px solid rgba(var(--accent-primary-rgb), 0.2)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {searchResult.foto_perfil ? <img src={searchResult.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontWeight: 800, fontFamily: 'Oswald', color: 'var(--text-main)' }}>{getInitials(searchResult.nombre)}</span>}
                    </div>
                    <div><div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem' }}>{searchResult.nombre}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{searchResult.nivel}</div></div>
                  </div>
                  <button type="button" onClick={() => enviarSolicitud(searchResult.id)} style={{ background: 'var(--accent-primary)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: 'var(--text-on-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserPlus size={16}/></button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {amigos.map(amigo => (
                  <div key={amigo.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '16px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {amigo.foto_perfil ? <img src={amigo.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontWeight: 800, fontFamily: 'Oswald', color: 'var(--text-main)' }}>{getInitials(amigo.nombre)}</span>}
                    </div>
                    <div style={{ flex: 1 }}><div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem' }}>{amigo.nombre}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{amigo.codigo_unico}</div></div>
                    <button 
                      type="button" 
                      onClick={() => { setActiveTab('chats'); setActiveChat(amigo); }} 
                      style={{ 
                        background: 'transparent', border: '1px solid var(--glass-border)', 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        color: 'var(--text-main)', cursor: 'pointer', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' 
                      }} 
                      onMouseOver={e => {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        e.currentTarget.style.transform = 'scale(1.15)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Abrir chat"
                    >
                      <MessageSquare size={14}/>
                    </button>
                    <button type="button" onClick={() => setFriendToDelete(amigo)} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', width: '32px', height: '32px', borderRadius: '50%', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; e.currentTarget.style.transform = 'scale(1)'; }} title="Eliminar amigo"><XIcon size={14}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'solicitudes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {solicitudes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}><ShieldBan size={32} style={{ opacity: 0.2, margin: '0 auto 1rem' }} /><p>Sin solicitudes pendientes.</p></div>
              ) : (
                solicitudes.map(sol => (
                  <div key={sol.id} style={{ padding: '1.2rem', background: 'var(--bg-subtle)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>{sol.usuarios.nombre} quiere ser tu amigo</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" onClick={() => responderSolicitud(sol.id, sol.remitente_id, 'aceptada')} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: 'var(--accent-primary)', border: 'none', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>ACEPTAR</button>
                      <button type="button" onClick={() => responderSolicitud(sol.id, sol.remitente_id, 'rechazada')} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>RECHAZAR</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card social-chat show-mobile-when-chat" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', position: 'relative' }}>
        {activeChat ? (
          <>

            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <button 
                  onClick={() => setActiveChat(null)}
                  className="show-mobile"
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.4rem', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  <ArrowLeft size={18} />
                </button>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--accent-primary)', overflow: 'hidden', padding: '2px', flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeChat.foto_perfil ? <img src={activeChat.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Oswald', color: 'var(--text-main)' }}>{getInitials(activeChat.nombre)}</span>}
                  </div>
                </div>
                <div
                  onClick={() => { setShowFriendProfile(true); setNewName(activeChat.nombre); }}
                  style={{ cursor: 'pointer' }}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  <h3 style={{ margin: 0, fontFamily: 'Oswald', fontSize: '1.4rem', textTransform: 'uppercase', color: 'var(--text-main)', letterSpacing: '1px' }}>{activeChat.nombre}</h3>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '12px', width: '45px', height: '45px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <MoreVertical size={20} />
                </button>

                {showHeaderMenu && (
                  <div className="glass-card" style={{ position: 'absolute', top: '120%', right: 0, width: '200px', zIndex: 100, overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
                    <button type="button" onClick={() => { setShowFriendProfile(true); setNewName(activeChat.nombre); setShowHeaderMenu(false); }} style={{ width: '100%', padding: '1rem', background: 'none', border: 'none', color: 'var(--text-main)', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
                      <Settings size={16} /> Ver Detalles
                    </button>
                    <div style={{ height: '1px', background: 'var(--glass-border)' }} />
                    <button type="button" onClick={() => { setShowClearConfirm(true); setShowHeaderMenu(false); }} style={{ width: '100%', padding: '1rem', background: 'none', border: 'none', color: '#ef4444', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
                      <Trash2 size={16} /> Vaciar Chat
                    </button>
                    <button type="button" onClick={() => { setFriendToDelete(activeChat); setShowHeaderMenu(false); }} style={{ width: '100%', padding: '1rem', background: 'none', border: 'none', color: '#ef4444', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
                      <XIcon size={16} /> Eliminar Amigo
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
              className="custom-scrollbar"
            >
              {mensajes.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', opacity: 0.3 }}><MessageSquare size={64} style={{ margin: '0 auto 1rem' }} /><h3 style={{ fontFamily: 'Oswald' }}>INICIA LA CONVERSACIÓN</h3></div>
              ) : (
                mensajes.map((msg, i) => {
                  const isMe = msg.remitente_id === user.id;
                  const date = new Date(msg.created_at);
                  return (
                    <div key={msg.id || i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div
                        className="msg-bubble"
                        style={{
                          maxWidth: '70%',
                          position: 'relative',
                          padding: msg.tipo === 'rutina' ? '0' : '1rem 1.4rem',
                          borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                          background: isMe ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                          color: isMe ? 'white' : 'var(--text-main)',
                          border: isMe ? 'none' : '1px solid var(--glass-border)',
                          boxShadow: isMe ? '0 10px 25px rgba(255,42,42,0.2)' : 'none',
                          minWidth: '100px'
                        }}
                        onMouseEnter={e => { const b = e.currentTarget.querySelector('.msg-actions') as HTMLElement; if(b) b.style.opacity = '1'; }}
                        onMouseLeave={e => { const b = e.currentTarget.querySelector('.msg-actions') as HTMLElement; if(b) b.style.opacity = '0'; }}
                      >
                        {(isMe || msg.tipo === 'archivo') && (
                          <div className="msg-actions" style={{ position: 'absolute', ...(isMe ? { right: 'calc(100% + 10px)' } : { left: 'calc(100% + 10px)' }), top: '50%', transform: 'translateY(-50%)', opacity: 0, transition: '0.2s', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                            {msg.tipo === 'archivo' && !msg.contenido.startsWith('ERROR') && (
                              <button type="button" onClick={(e) => { e.stopPropagation(); handleDownloadFile(msg.contenido.split('|')[0], msg.contenido.split('|')[1] || 'archivo'); }} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-subtle)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Descargar archivo"><Download size={14}/></button>
                            )}
                            {isMe && (
                              <button type="button" onClick={() => deleteMessage(msg.id)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Eliminar mensaje"><Trash2 size={12}/></button>
                            )}
                          </div>
                        )}

                        {msg.tipo === 'texto' && <div style={{ fontSize: '1rem', lineHeight: 1.5 }}>{msg.contenido}</div>}

                        {msg.tipo === 'archivo' && (
                          <div onClick={() => !msg.contenido.startsWith('ERROR') && window.open(msg.contenido.split('|')[0], '_blank')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '16px' }}>
                             <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileUp size={20}/></div>
                             <div style={{ overflow: 'hidden' }}><div style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.contenido.split('|')[1] || 'Archivo'}</div><div style={{ fontSize: '0.65rem', opacity: 0.6 }}>Haz clic para ver</div></div>
                          </div>
                        )}

                        {msg.tipo === 'rutina' && (() => {
                          let rData = null;
                          try { rData = JSON.parse(msg.contenido.split('RUTINA_DATA|')[1]); } catch(e) {}
                          if (!rData) return <div style={{ padding: '1rem' }}>Rutina antigua</div>;
                          const isExp = expandedRoutine === msg.id;
                          const routineName = rData.name || rData.nombre || 'Rutina Especial';

                          return (
                            <div style={{ padding: '0.5rem', width: '100%', minWidth: '300px' }}>
                                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '1.2rem', padding: '0.8rem 0.8rem 0 0.8rem' }}>
                                  <div style={{ width: '55px', height: '55px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #ca2626 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 15px rgba(255,42,42,0.3)', flexShrink: 0 }}>
                                    <Dumbbell size={28} color="white" />
                                  </div>
                                  <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.2rem' }}>Rutina Compartida</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Oswald', textTransform: 'uppercase', color: 'var(--text-main)', letterSpacing: '1px' }}>{routineName}</div>
                                  </div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '16px', padding: '1rem', border: '1px solid var(--glass-border)', marginBottom: '1.2rem' }}>
                                  {isExp ? (
                                    <div style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
                                      <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '1px' }}>Lista de Ejercicios:</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        {(rData.exercises || rData.ejercicios || []).map((ex: string, idx: number) => (
                                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem', background: 'var(--bg-subtle)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{ex}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Músculos</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>{rData.goal || rData.objetivo}</div>
                                      </div>
                                      <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Ejercicios</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>{(rData.exercises?.length || rData.ejercicios?.length || 0)}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.8rem', padding: '0 0.8rem 0.8rem 0.8rem' }}>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setExpandedRoutine(isExp ? null : msg.id); }}
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: isExp ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)', color: isExp ? 'white' : 'var(--text-main)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                                  >
                                    {isExp ? 'Ocultar' : 'Ver Ejercicios'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRoutineToSave(rData);
                                      setSelectedDaysForSave(rData.days || rData.dias || []);
                                    }}
                                    style={{ flex: 1.2, padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'white', color: 'black', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                  >
                                    <Plus size={14} /> Guardar
                                  </button>
                                </div>
                            </div>
                          );
                        })()}

                        <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '0.5rem', textAlign: 'right', fontWeight: 700 }}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-subtle)', position: 'relative' }}>

              {showEmojiPicker && (
                <div className="glass-card emoji-picker-container" style={{ position: 'absolute', bottom: '100%', left: '2.5rem', marginBottom: '1rem', width: '350px', height: '420px', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>EMOTICONOS</span>
                    <button type="button" onClick={() => setShowEmojiPicker(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><XIcon size={16}/></button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.8rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-subtle)' }}>
                    {Object.entries(EMOJI_CATEGORIES).map(([id, cat]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveEmojiCategory(id)}
                        style={{ padding: '0.5rem', borderRadius: '10px', background: activeEmojiCategory === id ? 'rgba(255,42,42,0.1)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.4rem', transition: '0.2s', filter: activeEmojiCategory === id ? 'none' : 'grayscale(1)' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {cat.icon}
                      </button>
                    ))}
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }} className="custom-scrollbar">
                    {EMOJI_CATEGORIES[activeEmojiCategory as keyof typeof EMOJI_CATEGORIES].emojis.map((emoji, i) => (
                      <button key={i} type="button" onClick={() => setNewMessage(p => p + emoji)} style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'none'}>{emoji}</button>
                    ))}
                  </div>
                </div>
              )}

              {showPlusMenu && (
                <div className="glass-card plus-menu-container" style={{ position: 'absolute', bottom: '100%', left: '2.5rem', marginBottom: '1rem', width: '220px', padding: '0.6rem', zIndex: 100 }}>
                  <button type="button" onClick={() => { setShowEmojiPicker(true); setShowPlusMenu(false); }} style={{ width: '100%', padding: '1rem', borderRadius: '12px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'none'}><Smile size={20} color="#fbbf24"/> Emojis</button>
                  <button type="button" onClick={() => { fileInputRef.current?.click(); setShowPlusMenu(false); }} style={{ width: '100%', padding: '1rem', borderRadius: '12px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'none'}><FileUp size={20} color="#3b82f6"/> Enviar Archivo</button>
                  <button type="button" onClick={() => { setShowRoutineSelector(true); setShowPlusMenu(false); }} style={{ width: '100%', padding: '1rem', borderRadius: '12px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'none'}><Share2 size={20} color="var(--accent-primary)"/> Compartir Rutina</button>
                </div>
              )}

              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={() => setShowPlusMenu(!showPlusMenu)} 
                  className="btn-plus" 
                  style={{ 
                    width: '50px', height: '50px', borderRadius: '50%', 
                    background: showPlusMenu ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--glass-border)', color: 'var(--text-main)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.3s' 
                  }}
                  onMouseOver={e => {
                    if (!showPlusMenu) {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    }
                  }}
                  onMouseOut={e => {
                    if (!showPlusMenu) {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }
                  }}
                >
                  <Plus size={24} style={{ transform: showPlusMenu ? 'rotate(45deg)' : 'none', transition: '0.3s' }}/>
                </button>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input type="text" placeholder="Escribe un mensaje..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onFocus={() => activeChat && marcarComoLeido(activeChat.id)} style={{ width: '100%', padding: '1.2rem 1.8rem', borderRadius: '25px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', fontSize: '1.05rem', outline: 'none' }} />
                  {attachedFile && <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📎 {attachedFile.name.substring(0, 10)}... <XIcon size={12} style={{ cursor: 'pointer' }} onClick={() => setAttachedFile(null)} /></div>}
                </div>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => e.target.files?.[0] && setAttachedFile(e.target.files[0])} />
                <button type="submit" disabled={!newMessage.trim() && !attachedFile} style={{ width: '60px', height: '60px', borderRadius: '50%', background: (newMessage.trim() || attachedFile) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: '0.3s', boxShadow: (newMessage.trim() || attachedFile) ? '0 10px 20px rgba(255,42,42,0.3)' : 'none' }}><Send size={24} style={{ transform: 'translateX(-2px)' }}/></button>
              </form>
            </div>

            {showFriendProfile && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setShowFriendProfile(false)}>
                <div className="glass-card" style={{ width: '100%', maxWidth: '550px', padding: '3.5rem', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'visible' }} onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => setShowFriendProfile(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><XIcon size={24}/></button>

                  <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontFamily: 'Oswald', fontSize: '2.4rem', color: 'var(--text-main)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      OPERACIÓN: <span style={{ color: 'var(--accent-primary)' }}>CONTACTO</span>
                    </h2>
                  </div>

                  <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div
                      onClick={() => setShowZoomedPhoto(true)}
                      style={{ width: '110px', height: '110px', borderRadius: '50%', border: '4px solid var(--accent-primary)', overflow: 'hidden', padding: '4px', flexShrink: 0, cursor: 'pointer', transition: '0.3s', boxShadow: '0 0 30px rgba(255,42,42,0.2)' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {activeChat.foto_perfil ? <img src={activeChat.foto_perfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Oswald', color: 'var(--text-main)' }}>{getInitials(activeChat.nombre)}</span>}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem', letterSpacing: '1.5px' }}>Nombre en Clave (Apodo)</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        style={{ width: '100%', padding: '1rem 1.2rem', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, outline: 'none', transition: '0.2s' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                        onKeyDown={e => e.key === 'Enter' && renameFriend()}
                      />
                      <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <ShieldBan size={12} /> Cambia cómo ves a este contacto
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {routineToSave && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} onClick={() => setRoutineToSave(null)}>
                <div
                  className="glass-card"
                  style={{
                    width: '100%', maxWidth: '650px', maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    padding: '2.5rem', position: 'relative'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button onClick={() => setRoutineToSave(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', width: '36px', height: '36px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XIcon size={18} /></button>

                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>GUARDAR RUTINA COMPARTIDA</div>
                    <h2 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', lineHeight: 1.1 }}>{routineToSave.name || routineToSave.nombre}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>{routineToSave.goal || routineToSave.objetivo} · {routineToSave.level || 'Intermedio'}</p>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem' }} className="custom-scrollbar">

                    <div style={{ background: 'var(--bg-subtle)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Resumen de la Rutina</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {(routineToSave.exercises || routineToSave.ejercicios || []).map((ex: string, idx: number) => (
                          <div key={idx} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,42,42,0.1)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: '1.3' }}>{ex}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Selecciona tus días de entrenamiento:</div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => {
                          const sel = selectedDaysForSave.includes(d);
                          return (
                            <button
                              key={d}
                              onClick={() => setSelectedDaysForSave(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                              style={{
                                width: '50px', height: '50px', borderRadius: '12px',
                                border: `1px solid ${sel ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                                background: sel ? 'rgba(var(--accent-primary-rgb), 0.15)' : 'rgba(255,255,255,0.02)',
                                color: sel ? 'var(--accent-primary)' : 'var(--text-muted)',
                                cursor: 'pointer', fontWeight: 800, transition: 'all 0.2s',
                                fontFamily: 'Oswald', fontSize: '0.9rem'
                              }}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => setRoutineToSave(null)}
                      style={{ 
                        flex: 1, padding: '1.2rem', borderRadius: '16px', 
                        border: '1px solid var(--glass-border)', background: 'transparent', 
                        color: 'var(--text-main)', fontWeight: 800, fontFamily: 'Oswald', 
                        cursor: 'pointer', transition: 'all 0.3s', textTransform: 'uppercase' 
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = 'var(--text-main)';
                        e.currentTarget.style.color = 'var(--bg-dark)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-main)';
                      }}
                    >CANCELAR</button>
                    <button
                      onClick={() => guardarRutinaCompartida(routineToSave)}
                      disabled={selectedDaysForSave.length === 0}
                      style={{
                        flex: 2, padding: '1.2rem', borderRadius: '16px', 
                        border: `2px solid ${selectedDaysForSave.length === 0 ? 'var(--glass-border)' : 'var(--accent-primary)'}`,
                        background: 'transparent',
                        color: selectedDaysForSave.length === 0 ? 'var(--text-muted)' : 'var(--accent-primary)',
                        fontWeight: 900, fontFamily: 'Oswald', letterSpacing: '1px', cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={e => {
                        if (selectedDaysForSave.length > 0) {
                          e.currentTarget.style.background = 'var(--accent-primary)';
                          e.currentTarget.style.color = 'black';
                          e.currentTarget.style.boxShadow = '0 10px 25px rgba(var(--accent-primary-rgb), 0.3)';
                        }
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = selectedDaysForSave.length === 0 ? 'var(--text-muted)' : 'var(--accent-primary)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >CONFIRMAR Y GUARDAR</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', opacity: 0.5 }}>
            <MessageSquare size={100} style={{ marginBottom: '2rem' }} />
            <h2 style={{ fontFamily: 'Oswald', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Selecciona un contacto para iniciar</h2>
            <p style={{ fontSize: '1.1rem' }}>Tu red de entrenamiento te espera.</p>
          </div>
        )}
      </div>

      {friendToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setFriendToDelete(null)}>
          <div 
            className="glass-card" 
            style={{ 
              width: '100%', maxWidth: '460px', padding: '3.5rem', textAlign: 'center', 
              border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '85px', height: '85px', borderRadius: '50%', 
                background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: '#ff4444' 
              }}>
                <Trash2 size={42} />
              </div>

              <h2 style={{ fontFamily: 'Oswald', fontSize: '2.4rem', color: 'var(--text-main)', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>¿ELIMINAR AMIGO?</h2>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                ¿Seguro que quieres eliminar a <strong style={{ color: 'var(--text-main)' }}>{friendToDelete.nombre}</strong> de tu red?
              </p>
              
              <p style={{ color: 'rgba(255, 68, 68, 0.7)', fontSize: '0.85rem', marginBottom: '3rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                SE BORRARÁ TODO EL HISTORIAL DE MENSAJES.
              </p>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setFriendToDelete(null)} 
                  style={{ 
                    flex: 1, padding: '1.2rem', borderRadius: '18px', 
                    border: '1px solid var(--glass-border)', background: 'transparent', 
                    color: 'var(--text-main)', fontWeight: 800, fontFamily: 'Oswald', 
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' 
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'var(--text-main)';
                    e.currentTarget.style.color = 'var(--bg-dark)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  CANCELAR
                </button>
                <button 
                  type="button" 
                  onClick={deleteFriend} 
                  style={{ 
                    flex: 1.2, padding: '1.2rem', borderRadius: '18px', 
                    border: '2px solid #ff4444', background: 'transparent', color: '#ff4444', 
                    fontWeight: 900, fontFamily: 'Oswald', textTransform: 'uppercase', 
                    letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#ff4444';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 68, 68, 0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ff4444';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
