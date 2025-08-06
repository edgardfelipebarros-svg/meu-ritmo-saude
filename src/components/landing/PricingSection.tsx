import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  const plans = [
    {
      name: "Mensal",
      price: "R$ 29,90",
      period: "/mês",
      description: "Ideal para testar o sistema",
      features: [
        "Acesso completo ao app",
        "40 exercícios disponíveis",
        "Chat com IA ilimitado",
        "Receitas e lista de compras",
        "Dashboard de progresso",
        "Suporte por email"
      ],
      popular: false,
      color: "secondary",
      buttonVariant: "secondary" as const
    },
    {
      name: "Trimestral",
      price: "R$ 69,90",
      period: "/3 meses",
      originalPrice: "R$ 89,70",
      discount: "22% OFF",
      description: "Mais popular entre iniciantes",
      features: [
        "Tudo do plano mensal",
        "Personal trainer online (2x/mês)",
        "Plano alimentar personalizado",
        "Acompanhamento nutricional",
        "Relatórios detalhados",
        "Suporte prioritário",
        "Desconto em consultorias"
      ],
      popular: true,
      color: "primary",
      buttonVariant: "hero" as const
    },
    {
      name: "Semestral",
      price: "R$ 119,90",
      period: "/6 meses",
      originalPrice: "R$ 179,40",
      discount: "33% OFF",
      description: "Melhor custo-benefício",
      features: [
        "Tudo do plano trimestral",
        "Personal trainer online (4x/mês)",
        "Aulas ao vivo semanais",
        "Consultoria nutricional inclusa",
        "Acesso a desafios especiais",
        "Material exclusivo (PDFs)",
        "Suporte WhatsApp direto"
      ],
      popular: false,
      color: "accent",
      buttonVariant: "wellness" as const
    },
    {
      name: "Anual",
      price: "R$ 199,90",
      period: "/ano",
      originalPrice: "R$ 358,80",
      discount: "44% OFF",
      description: "Máximo desconto para transformação completa",
      features: [
        "Tudo do plano semestral",
        "Personal trainer online ilimitado",
        "Aulas ao vivo diárias",
        "3 consultorias presenciais/ano",
        "Kit fitness em casa",
        "Acesso vitalício a receitas",
        "Mentoria em grupo mensal",
        "Garantia de resultados"
      ],
      popular: false,
      color: "success",
      buttonVariant: "success" as const
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Escolha o plano ideal para sua <span className="bg-gradient-primary bg-clip-text text-transparent">transformação</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Investimento que transforma sua vida. Todos os planos incluem garantia de satisfação de 7 dias.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Cancelamento a qualquer momento</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Garantia de 7 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Acesso imediato</span>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-card rounded-2xl p-6 shadow-elegant hover:shadow-primary transition-all duration-500 hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Discount Badge */}
              {plan.discount && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-xs font-bold transform rotate-12">
                    {plan.discount}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{plan.name}</h3>
                <div className="mb-2">
                  {plan.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">{plan.originalPrice}</div>
                  )}
                  <div className="flex items-baseline justify-center">
                    <span className={`text-3xl font-bold text-${plan.color}`}>{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 text-${plan.color} mt-0.5 shrink-0`} />
                    <span className="text-sm text-card-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                variant={plan.buttonVariant}
                className="w-full"
                size="lg"
              >
                {plan.popular ? (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Assinar agora
                  </>
                ) : (
                  'Escolher plano'
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ainda tem dúvidas sobre qual plano escolher?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe de especialistas está pronta para te ajudar a escolher o plano ideal para seus objetivos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Falar com especialista
              </Button>
              <Button variant="ghost" size="lg">
                Ver comparação detalhada
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;