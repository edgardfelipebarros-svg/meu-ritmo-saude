import { X, Check, Target, Zap, Users, TrendingUp } from "lucide-react";

const ProblemsSection = () => {
  const problems = [
    {
      icon: Target,
      title: "Falta de motivação para treinar sozinho",
      description: "Sem um plano claro e acompanhamento, é fácil desistir"
    },
    {
      icon: Zap,
      title: "Treinos e dietas sem estratégia",
      description: "Exercícios aleatórios e alimentação no 'achismo'"
    },
    {
      icon: Users,
      title: "Abandono por não ver resultados",
      description: "Sem acompanhamento profissional, a desmotivação é inevitável"
    },
    {
      icon: TrendingUp,
      title: "Não saber por onde começar",
      description: "Informações conflitantes e falta de orientação personalizada"
    }
  ];

  const comparison = [
    {
      category: "💪 Treinamento",
      withSystem: "Plano guiado com adaptação fácil",
      withoutSystem: "Treina sem rumo, repete sempre"
    },
    {
      category: "🥗 Alimentação", 
      withSystem: "Avaliação com IA e receitas práticas",
      withoutSystem: "Dieta no achismo, abandona rápido"
    },
    {
      category: "📊 Progresso",
      withSystem: "Vê evolução com gráficos e insígnias",
      withoutSystem: "Perde motivação, não percebe melhora"
    },
    {
      category: "🧠 Consistência",
      withSystem: "Missões semanais que engajam",
      withoutSystem: "Falta de rotina leva ao abandono"
    },
    {
      category: "🎯 Personalização",
      withSystem: "Sistema se ajusta à rotina do usuário",
      withoutSystem: "Planos genéricos e sem resultado"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted to-background">
      <div className="container mx-auto px-4">
        
        {/* Problems */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Por que as pessoas <span className="text-destructive">desistem</span> de cuidar da saúde?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Identificamos os principais obstáculos que impedem você de alcançar seus objetivos de saúde e bem-estar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {problems.map((problem, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 shadow-elegant hover:shadow-primary transition-all duration-300 group">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="text-center mb-12">
          <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            A diferença é <span className="text-primary">impressionante</span>
          </h3>
          <p className="text-lg text-muted-foreground">
            Veja como sua vida muda quando você tem o sistema certo
          </p>
        </div>

        <div className="bg-card rounded-2xl overflow-hidden shadow-elegant max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-primary text-white">
                  <th className="p-6 text-left font-semibold text-lg">Aspecto</th>
                  <th className="p-6 text-left font-semibold text-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Quem usa o Meu Ritmo
                    </div>
                  </th>
                  <th className="p-6 text-left font-semibold text-lg">
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5" />
                      Quem não usa
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-card"}>
                    <td className="p-6 font-medium text-card-foreground">{item.category}</td>
                    <td className="p-6">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                        <span className="text-card-foreground">{item.withSystem}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-start gap-2">
                        <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{item.withoutSystem}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;