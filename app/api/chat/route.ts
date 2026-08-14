import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userContext } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const userName = userContext?.name || 'Atleta';

    if (!apiKey || apiKey.includes('AIzaSyCe0eteZFgeX7AWWJLaD14a6VUNi_9KGM4')) {
      return NextResponse.json({
        response: `¡Hola ${userName}! Soy NOVA, tu entrenador de IA. Actualmente para activar respuestas avanzadas en tiempo real necesitas configurar una clave válida de GEMINI_API_KEY en tu archivo .env.local. ¡Mientras tanto, puedes seguir utilizando todas tus rutinas, ejercicios y el calendario de VigorNova!`
      });
    }

    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content || '' }]
    }));

    const systemInstruction = {
      parts: [{
        text: `Eres NOVA, un entrenador personal avanzado con Inteligencia Artificial integrado en la aplicación VigorNova. 
        El usuario actual se llama ${userName}.
        Conoces todas las funcionalidades de VigorNova (rutinas, directorio de ejercicios, calculadora de calorías, calendario, historial).
        Tu tono debe ser motivador, profesional, amigable y directo.
        Da recomendaciones sobre fitness, nutrición y uso de la plataforma. Responde de manera concisa.`
      }]
    };

    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) {
      // Try gemini-2.0-flash as fallback
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });
    }

    const data = await response.json();

    if (!response.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.warn('Gemini API Warning:', data);
      return NextResponse.json({
        response: `¡Hola ${userName}! Tu mensaje ha sido recibido. Recuerda mantener la constancia en tus entrenamientos, registrar tus pesos en el historial y descansar adecuadamente para maximizar tus ganancias.`
      });
    }

    const aiMessage = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ response: aiMessage });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      response: '¡Hola! He experimentado una interrupción temporal de conexión con el motor de IA. Inténtalo de nuevo en unos momentos.'
    });
  }
}

