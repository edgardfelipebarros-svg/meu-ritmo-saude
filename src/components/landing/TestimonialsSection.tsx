import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empresária, 34 anos",
      avatar: "MS",
      rating: 5,
      text: "Perdi 8kg em 3 meses seguindo o plano do Meu Ritmo. O chat com IA me ajudou muito quando tinha dúvidas sobre alimentação. Recomendo demais!",
      achievement: "8kg perdidos",
      color: "primary"
    },
    {
      name: "Carlos Oliveira", 
      role: "Engenheiro, 28 anos",
      avatar: "CO",
      rating: 5,
      text: "Como não tenho tempo para academia, os treinos em casa foram perfeitos. O personal online me motiva muito nas aulas ao vivo!",
      achievement: "15kg de massa magra",
      color: "secondary"
    },
    {
      name: "Ana Costa",
      role: "Professora, 41 anos", 
      avatar: "AC",
      rating: 5,
      text: "Depois dos 40 achei que seria impossível voltar ao peso ideal. O Meu Ritmo provou que eu estava errada! Sistema fantástico.",
      achievement: "12kg perdidos",
      color: "accent"
    },
    {
      name: "João Santos",
      role: "Estudante, 22 anos",
      avatar: "JS", 
      rating: 5,
      text: "As receitas são deliciosas e práticas. A lista de compras automática me economiza muito tempo. Vale cada centavo!",
      achievement: "Rotina saudável",
      color: "success"
    },
    {
      name: "Lucia Ferreira",
      role: "Médica, 45 anos",
      avatar: "LF",
      rating: 5,
      text: "Como profissional da saúde, aprovo totalmente a abordagem científica do app. Meus parâmetros de saúde melhoraram muito!",
      achievement: "Colesterol normalizado",
      color: "warning"
    },
    {
      name: "Pedro Almeida",
      role: "Empresário, 52 anos",
      avatar: "PA",
      rating: 5,
      text: "Estava sedentário há anos. O sistema me trouxe de volta à ativa de forma gradual e segura. Minha energia triplicou!",
      achievement: "Diabetes controlada",
      color: "primary"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Mais de <span className="bg-gradient-primary bg-clip-text text-transparent">10.000 vidas</span> transformadas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça algumas histórias reais de pessoas que mudaram suas vidas com o Meu Ritmo
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 shadow-elegant hover:shadow-primary transition-all duration-500 hover:-translate-y-2 group"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-8 h-8 text-primary/30" />
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-card-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>

              {/* Achievement Badge */}
              <div className={`inline-flex items-center gap-2 bg-${testimonial.color}/10 text-${testimonial.color} px-3 py-1 rounded-full text-sm font-semibold mb-4`}>
                <div className={`w-2 h-2 bg-${testimonial.color} rounded-full`}></div>
                {testimonial.achievement}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-${testimonial.color === 'warning' ? 'primary' : testimonial.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${testimonial.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Sua história de sucesso começa hoje
            </h3>
            <p className="text-muted-foreground mb-6">
              Junte-se a milhares de pessoas que já transformaram suas vidas
            </p>
            <button className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300">
              Quero minha transformação
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">4.9/5</div>
            <div className="text-sm text-muted-foreground">Avaliação média</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">10.000+</div>
            <div className="text-sm text-muted-foreground">Usuários satisfeitos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">95%</div>
            <div className="text-sm text-muted-foreground">Alcançam objetivos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">7 dias</div>
            <div className="text-sm text-muted-foreground">Garantia total</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;