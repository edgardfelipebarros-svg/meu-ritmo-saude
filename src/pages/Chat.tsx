import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Image as ImageIcon, 
  ArrowLeft, 
  Bot, 
  User,
  Paperclip 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  id: string;
  message_type: 'user' | 'ai';
  content: string;
  image_urls?: string[];
  created_at: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Save user message
      const { data: userMessage, error: userError } = await supabase
        .from("chat_messages")
        .insert({
          user_id: user.id,
          message_type: 'user',
          content: userMessageContent
        })
        .select()
        .single();

      if (userError) throw userError;

      setMessages(prev => [...prev, userMessage as Message]);

      // Simulate AI response (replace with actual AI integration)
      const aiResponse = await generateAIResponse(userMessageContent);
      
      const { data: aiMessage, error: aiError } = await supabase
        .from("chat_messages")
        .insert({
          user_id: user.id,
          message_type: 'ai',
          content: aiResponse
        })
        .select()
        .single();

      if (aiError) throw aiError;

      setMessages(prev => [...prev, aiMessage as Message]);

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { message: userMessage }
      });

      if (error) {
        console.error('Error calling AI function:', error);
        return 'Desculpe, estou com dificuldades técnicas. Tente novamente em alguns instantes! 😊';
      }

      return data.response || 'Não consegui processar sua mensagem. Tente reformular sua pergunta! 💪';
    } catch (error) {
      console.error('Error calling AI:', error);
      return 'Ops! Algo deu errado. Tente novamente! 🙂';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
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
                  <p className="whitespace-pre-wrap">{message.content}</p>
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
          
          {loading && (
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
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Digite sua pergunta sobre saúde, nutrição ou exercícios..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="pr-12"
              />
            </div>
            <Button 
              onClick={sendMessage} 
              disabled={loading || !newMessage.trim()}
              size="icon"
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