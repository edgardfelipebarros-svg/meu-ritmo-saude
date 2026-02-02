import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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
* Se ele enviar foto de prato descreva cada item que consegue visualizar, faça uma suposição em gramas do total do prato e total de calorias, diga ainda que essas informações podem não ser precisas`;

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

    // Get Lovable API Key
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare messages for Lovable AI Gateway
    const messages: { role: string; content: string | object[] }[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Build user message with optional image
    if (imageUrl) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      });
    } else {
      messages.push({ role: "user", content: message });
    }

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Muitas requisições. Aguarde um momento e tente novamente." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Créditos insuficientes. Entre em contato com o suporte." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 
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
