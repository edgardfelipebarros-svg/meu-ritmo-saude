import { Dumbbell, Brain, MessageSquare, Trophy, BarChart3, Heart } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Dumbbell,
      title: "Treinos Guiados",
      description: "40 exercícios personalizados, em casa ou com personal online. Sua evolução no seu ritmo.",
      color: "primary",
      gradient: "gradient-primary"
    },
    {
      icon: Heart,
      title: "Nutrição Inteligente", 
      description: "Receitas saudáveis, lista de compras automática e acompanhamento nutricional personalizado.",
      color: "accent",
      gradient: "gradient-wellness"
    },
    {
      icon: MessageSquare,
      title: "IA que Responde Dúvidas",
      description: "Chat estilo WhatsApp com respostas humanizadas sobre treinos, alimentação e resultados.",
      color: "secondary",
      gradient: "gradient-secondary"
    },
    {
      icon: Trophy,
      title: "Gamificação",
      description: "Missões semanais, insígnias de conquistas e sistema de pontos que mantém você motivado.",
      color: "warning",
      gradient: "gradient-primary"
    },
    {
      icon: BarChart3,
      title: "Resultados Reais",
      description: "Gráficos de progresso, acompanhamento de peso, IMC e frequência de treinos em tempo real.",
      color: "success",
      gradient: "gradient-secondary"
    },
    {
      icon: Brain,
      title: "Totalmente Personalizado",
      description: "Sistema que se adapta aos seus horários, preferências e evolução única.",
      color: "primary",
      gradient: "gradient-wellness"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Transforme sua vida com o <span className="bg-gradient-primary bg-clip-text text-transparent">Meu Ritmo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa para alcançar seus objetivos de saúde, bem-estar e qualidade de vida em uma única plataforma
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group relative bg-card rounded-2xl p-8 shadow-elegant hover:shadow-primary transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-${benefit.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-${benefit.color}/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-8 h-8 text-${benefit.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Pronto para começar sua transformação?
            </h3>
            <p className="text-muted-foreground mb-6">
              Junte-se a milhares de pessoas que já mudaram suas vidas com o Meu Ritmo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300">
                Começar agora - Grátis
              </button>
              <button className="px-8 py-4 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all duration-300">
                Ver mais benefícios
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;