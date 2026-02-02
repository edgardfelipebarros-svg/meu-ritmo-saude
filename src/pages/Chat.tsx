import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  id: string;
  message_type: 'user' | 'ai';
  content: string;
  image_urls?: string[];
  created_at: string;
  isStreaming?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-ai`;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset textarea height when message is sent
  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data as Message[]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Erro ao carregar mensagens");
    } finally {
      setInitialLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    const userMessageContent = newMessage;
    setNewMessage("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Usuário não autenticado");

      // Add user message optimistically with temp ID
      const tempUserMessage: Message = {
        id: `temp-user-${Date.now()}`,
        message_type: 'user',
        content: userMessageContent,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempUserMessage]);

      // Add placeholder for AI response
      const tempAiId = `temp-ai-${Date.now()}`;
      const tempAiMessage: Message = {
        id: tempAiId,
        message_type: 'ai',
        content: '',
        created_at: new Date().toISOString(),
        isStreaming: true,
      };
      setMessages(prev => [...prev, tempAiMessage]);

      // Call streaming endpoint
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          message: userMessageContent,
          stream: true 
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Muitas requisições. Aguarde um momento.");
        } else if (response.status === 402) {
          toast.error("Créditos insuficientes.");
        } else {
          toast.error("Erro ao enviar mensagem");
        }
        // Remove temp messages on error
        setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')));
        setLoading(false);
        return;
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              // Update the streaming message
              setMessages(prev => 
                prev.map(m => 
                  m.id === tempAiId 
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            // Incomplete JSON, put it back and wait for more
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
            }
          } catch { /* ignore */ }
        }
      }

      // Mark streaming as complete
      setMessages(prev => 
        prev.map(m => 
          m.id === tempAiId 
            ? { ...m, content: assistantContent, isStreaming: false }
            : m
        )
      );

      // Refresh messages from DB to get real IDs
      setTimeout(() => fetchMessages(), 500);

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
      // Remove temp messages on error
      setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    // Auto-resize: reset then expand
    const textarea = e.target;
    textarea.style.height = 'auto';
    // Calculate max height based on viewport (responsive)
    const maxHeight = Math.min(window.innerHeight * 0.2, 120); // 20% of viewport or 120px max
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
        <div className="text-lg">Carregando chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">Mari - IA Meu Ritmo</h1>
                <p className="text-sm text-muted-foreground">Sua Assistente de Saúde e Bem-estar</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl overflow-y-auto">
        <div className="space-y-4 mb-4">
          {messages.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Bem-vindo ao Chat IA!</h3>
                <p className="text-muted-foreground mb-4">
                  Sou sua assistente especializada em saúde, nutrição e exercícios. 
                  Posso ajudar você com:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    💪 Dúvidas sobre exercícios
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    🥗 Orientações nutricionais
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    📸 Análise de refeições (fotos)
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    📈 Acompanhamento de progresso
                  </div>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  Digite sua primeira pergunta abaixo para começar!
                </p>
              </CardContent>
            </Card>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.message_type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.message_type === 'ai' && (
                <Avatar className="flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${
                message.message_type === 'user' ? 'order-2' : ''
              }`}>
                <div className={`p-3 rounded-lg ${
                  message.message_type === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-card border'
                }`}>
                  <p className="whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                    )}
                  </p>
                  {message.image_urls && message.image_urls.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {message.image_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt="Anexo"
                          className="rounded border max-h-32 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {formatTime(message.created_at)}
                </p>
              </div>

              {message.message_type === 'user' && (
                <Avatar className="flex-shrink-0">
                  <AvatarFallback className="bg-secondary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {loading && messages[messages.length - 1]?.message_type !== 'ai' && (
            <div className="flex gap-3 justify-start">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[70%]">
                <div className="p-3 rounded-lg bg-card border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              placeholder="Digite sua pergunta sobre saúde, nutrição ou exercícios..."
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="flex-1 min-h-[44px] resize-none py-2.5 overflow-hidden"
              rows={1}
            />
            <Button 
              onClick={sendMessage} 
              disabled={loading || !newMessage.trim()}
              size="icon"
              className="flex-shrink-0 h-[44px] w-[44px]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            A IA pode cometer erros. Considere verificar informações importantes com profissionais de saúde.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
