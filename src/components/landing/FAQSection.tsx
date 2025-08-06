import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Como funciona o período de teste de 7 dias?",
      answer: "Você tem 7 dias para testar todos os recursos do Meu Ritmo. Se não ficar satisfeito, devolvemos 100% do seu dinheiro, sem perguntas ou burocracias."
    },
    {
      question: "Preciso de equipamentos para os treinos?",
      answer: "Não! Nosso Módulo 1 foi desenvolvido especificamente para treinos em casa, sem necessidade de equipamentos. Você pode treinar usando apenas o peso do corpo e objetos que já tem em casa."
    },
    {
      question: "Como funciona o chat com IA?",
      answer: "Nosso chat usa inteligência artificial avançada para responder suas dúvidas sobre treinos, alimentação e progresso. É como ter um personal trainer e nutricionista disponível 24/7 no seu bolso."
    },
    {
      question: "Posso cancelar a assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento através do seu painel de usuário ou entrando em contato conosco. Não há multas ou taxas de cancelamento."
    },
    {
      question: "O que está incluído no acompanhamento nutricional?",
      answer: "Você recebe receitas personalizadas, lista de compras automática, avaliação nutricional por IA e acesso a um banco com centenas de receitas saudáveis organizadas por objetivo."
    },
    {
      question: "Como funcionam as aulas com personal trainer online?",
      answer: "No Módulo 2, você pode agendar sessões individuais ou participar de aulas ao vivo em grupo. Nossos personal trainers são certificados e experientes em treinos online."
    },
    {
      question: "O app funciona offline?",
      answer: "Sim! Você pode baixar treinos, receitas e acessar seu progresso mesmo sem internet. O chat com IA e aulas ao vivo precisam de conexão."
    },
    {
      question: "Existe suporte técnico disponível?",
      answer: "Temos uma equipe de suporte disponível via email, chat no app e WhatsApp (planos premium). Respondemos em até 2 horas durante dias úteis."
    },
    {
      question: "O sistema se adapta ao meu nível de condicionamento?",
      answer: "Sim! Através da avaliação inicial e feedback contínuo, o sistema ajusta automaticamente a intensidade dos treinos e recomendações nutricionais ao seu nível e progresso."
    },
    {
      question: "Posso mudar de plano depois?",
      answer: "Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A diferença de valor é calculada proporcionalmente."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-muted to-background">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Perguntas <span className="bg-gradient-primary bg-clip-text text-transparent">frequentes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tiramos as principais dúvidas para você começar sua transformação com segurança
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <div 
                className={`bg-card rounded-2xl border transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-primary shadow-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                >
                  <h3 className="font-semibold text-lg text-card-foreground pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-border pt-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ainda tem alguma dúvida?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para te ajudar com qualquer questão
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300">
                Falar com especialista
              </button>
              <button className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all duration-300">
                Ver mais dúvidas
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;