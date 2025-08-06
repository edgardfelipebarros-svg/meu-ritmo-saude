import { Button } from "@/components/ui/button";
import { Play, Star, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-12 h-12 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-20 w-20 h-20 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Hero Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <Star className="w-5 h-5 text-warning fill-warning" />
              <span className="text-white/90 font-medium">Mais de 10.000 vidas transformadas</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Seu corpo.
              <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent"> Seu ritmo.</span>
              <br />Sua evolução.
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-lg mx-auto lg:mx-0">
              Transforme sua vida com treinos personalizados, nutrição inteligente e acompanhamento de IA. 
              Comece hoje mesmo sua jornada para uma vida mais saudável.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10k+</div>
                <div className="text-white/70 text-sm">Usuários ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-white/70 text-sm">Taxa de sucesso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">40+</div>
                <div className="text-white/70 text-sm">Exercícios</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                Experimente agora
                <Play className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
                Ver demonstração
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-8 text-white/70">
              <Award className="w-5 h-5" />
              <span className="text-sm">Certificado por nutricionistas</span>
              <Users className="w-5 h-5 ml-4" />
              <span className="text-sm">Personal trainers qualificados</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Pessoas praticando exercícios e vida saudável" 
                className="w-full h-auto rounded-2xl shadow-elegant transform hover:scale-105 transition-all duration-500"
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-wellness animate-pulse-glow">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="font-semibold text-success">Meta alcançada!</span>
                </div>
                <p className="text-sm text-muted-foreground">3kg perdidos este mês</p>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-primary animate-pulse-glow" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-semibold text-primary">Treino completo!</span>
                </div>
                <p className="text-sm text-muted-foreground">15 exercícios hoje</p>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-30 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;