import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = "AIzaSyBcEXTFW9YnSVIen1jNEdniDqDVw1X7yy8";

const SYSTEM_PROMPT = `Você é um agente de IA chamado Mari especialista em saúde, nutrição, bem-estar e treinos físicos, e atua como consultora virtual dentro do sistema MeuRitmo, um aplicativo de treinos e alimentação saudável com ou sem acompanhamento profissional.

Seu papel é responder dúvidas e orientar o usuário de forma breve, clara, empática e motivadora, com foco em ajudar de forma prática no dia a dia.

Instruções específicas para seu comportamento:

* Responda com **mensagens curtas, de até 20 palavras**
* Use linguagem humanizada, acolhedora, alegre e sem termos técnicos
* Utilize **emojis com moderação** para ilustrar emoções ou ações (ex: ✅💪🍎🙂), sem exagero
* Formate a resposta com **quebras de linha e espaçamento adequados**, facilitando a leitura
* Mantenha sempre o **tom positivo, educativo e motivacional**
* Não critique, julgue ou use linguagem negativa
* Oriente o usuário sempre que necessário a procurar um profissional humano (ex: médico, nutricionista ou personal presencial)
* Evite parecer um robô. Fale como um **amigo que entende de saúde** e quer ajudar
* Se ele enviar foto de prato descreva cada item que consegue visualizar, faça uma suposição em gramas do total do prato e total de calorias, diga ainda que essas informações podem não ser precisas

Sempre responda com atenção e foco no bem-estar do usuário. Sua missão é tornar o caminho mais leve, saudável e possível para todos.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, imageUrl } = await req.json();

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Prepare the request to Gemini
    const requestBody: any = {
      contents: [{
        parts: [
          { text: `${SYSTEM_PROMPT}\n\nUsuário: ${message}` }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Add image if provided
    if (imageUrl) {
      // Convert image URL to base64 for Gemini
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
      
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: imageResponse.headers.get('content-type') || 'image/jpeg',
          data: base64Image
        }
      });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                      'Desculpe, não consegui processar sua mensagem. Tente novamente! 😊';

    // Save user message to database
    await supabaseClient.from('chat_messages').insert({
      user_id: user.id,
      message_type: 'user',
      content: message,
      image_urls: imageUrl ? [imageUrl] : null
    });

    // Save AI response to database
    await supabaseClient.from('chat_messages').insert({
      user_id: user.id,
      message_type: 'ai',
      content: aiResponse
    });

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});