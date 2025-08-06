import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Target, 
  Calendar, 
  Activity, 
  Apple, 
  MessageCircle,
  Settings,
  Dumbbell,
  ChefHat,
  TrendingUp,
  Award,
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Profile {
  full_name: string;
  weight: number;
  height: number;
  goal: string;
  fitness_level: string;
}

interface Achievement {
  title: string;
  description: string;
  icon_name: string;
  points: number;
}

interface WeeklyGoal {
  goal_type: string;
  target_value: number;
  current_value: number;
  completed: boolean;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchDashboardData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false })
        .limit(5);

      if (achievementsData) setAchievements(achievementsData);

      // Fetch weekly goals
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const { data: goalsData } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", user.id)
        .gte("week_start", startOfWeek.toISOString().split('T')[0]);

      if (goalsData) setWeeklyGoals(goalsData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const calculateBMI = () => {
    if (!profile?.weight || !profile?.height) return 0;
    return (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1);
  };

  const getGoalProgress = (goalType: string) => {
    const goal = weeklyGoals.find(g => g.goal_type === goalType);
    if (!goal) return 0;
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Meu Ritmo
            </h1>
            <span className="text-muted-foreground">
              Olá, {profile?.full_name || "Usuário"}!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">IMC</p>
                  <p className="text-2xl font-bold">{calculateBMI()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Peso Atual</p>
                  <p className="text-2xl font-bold">{profile?.weight || "--"} kg</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nível</p>
                  <p className="text-2xl font-bold capitalize">{profile?.fitness_level || "--"}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conquistas</p>
                  <p className="text-2xl font-bold">{achievements.length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="workouts">Treinos</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrição</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="chat">Chat IA</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Metas da Semana
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Treinos Completos</span>
                      <span>{weeklyGoals.find(g => g.goal_type === 'workouts')?.current_value || 0}/3</span>
                    </div>
                    <Progress value={getGoalProgress('workouts')} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Dias com Dieta</span>
                      <span>{weeklyGoals.find(g => g.goal_type === 'diet')?.current_value || 0}/7</span>
                    </div>
                    <Progress value={getGoalProgress('diet')} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hidratação (L)</span>
                      <span>{weeklyGoals.find(g => g.goal_type === 'water')?.current_value || 0}/14</span>
                    </div>
                    <Progress value={getGoalProgress('water')} />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Conquistas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {achievements.length > 0 ? (
                    <div className="space-y-3">
                      {achievements.slice(0, 3).map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl">🏆</div>
                          <div>
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <Badge variant="secondary" className="ml-auto">
                            {achievement.points} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Complete treinos e metas para desbloquear conquistas!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => navigate("/exercises")}
                  >
                    <Dumbbell className="h-6 w-6" />
                    Exercícios
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => navigate("/recipes")}
                  >
                    <ChefHat className="h-6 w-6" />
                    Receitas
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => navigate("/calendar")}
                  >
                    <Calendar className="h-6 w-6" />
                    Calendário
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => navigate("/chat")}
                  >
                    <MessageCircle className="h-6 w-6" />
                    Chat IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Meus Treinos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Acompanhe seus treinos e progressos diários.
                </p>
                <Button onClick={() => navigate("/exercises")}>
                  Ver Biblioteca de Exercícios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Plano Nutricional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Receitas e planos alimentares personalizados.
                </p>
                <Button onClick={() => navigate("/recipes")}>
                  Ver Receitas Saudáveis
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Acompanhamento de Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gráficos e métricas de evolução em breve...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat com IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Converse com nossa IA especializada em saúde e bem-estar.
                </p>
                <Button onClick={() => navigate("/chat")}>
                  Iniciar Conversa
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;