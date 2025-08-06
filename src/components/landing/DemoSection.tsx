import { Play, Smartphone, Monitor, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const DemoSection = () => {
  const features = [
    {
      icon: Monitor,
      title: "Dashboard Inteligente",
      description: "Acompanhe seu progresso com gráficos visuais e insígnias de conquistas"
    },
    {
      icon: Smartphone,
      title: "Chat com IA",
      description: "Tire dúvidas sobre treinos e alimentação com respostas personalizadas"
    },
    {
      icon: Users,
      title: "Personal Online",
      description: "Aulas ao vivo e acompanhamento profissional quando precisar"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted to-background">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Veja o <span className="bg-gradient-primary bg-clip-text text-transparent">Meu Ritmo</span> em ação
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma completa e intuitiva que transforma a maneira como você cuida da sua saúde
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Demo Image */}
          <div className="relative group">
            <div className="relative z-10">
              <img 
                src={dashboardPreview} 
                alt="Interface do aplicativo Meu Ritmo mostrando dashboard de progresso" 
                className="w-full h-auto rounded-2xl shadow-elegant group-hover:shadow-primary transition-all duration-500"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-20 h-20 rounded-full shadow-glow animate-pulse-glow"
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>

              {/* Feature Highlights */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-wellness">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-success">Online agora</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-primary">
                <div className="text-sm font-semibold text-primary">15 treinos completos</div>
                <div className="text-xs text-muted-foreground">Este mês</div>
              </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-secondary rounded-2xl blur-xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity"></div>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Tudo que você precisa em uma só tela
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Interface simples e poderosa que coloca você no controle da sua transformação
              </p>
            </div>

            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-card-foreground mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                <Play className="w-5 h-5 mr-2" />
                Ver demonstração completa
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Taxa de satisfação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">10k+</div>
              <div className="text-muted-foreground">Usuários ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">40+</div>
              <div className="text-muted-foreground">Exercícios únicos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">24/7</div>
              <div className="text-muted-foreground">Suporte disponível</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;