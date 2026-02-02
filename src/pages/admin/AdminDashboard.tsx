import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Dumbbell, 
  ChefHat, 
  MessageCircle,
  TrendingUp,
  Award,
  Target,
  Activity,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";

interface Stats {
  totalUsers: number;
  totalExercises: number;
  totalRecipes: number;
  totalMessages: number;
  activeSubscribers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalExercises: 0,
    totalRecipes: 0,
    totalMessages: 0,
    activeSubscribers: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  useEffect(() => {
    fetchStats();
    fetchRecentUsers();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch counts
      const [usersResult, exercisesResult, recipesResult, messagesResult, subscribersResult] = await Promise.all([
        supabase.from("profiles").select("*", { count: 'exact', head: true }),
        supabase.from("exercises").select("*", { count: 'exact', head: true }),
        supabase.from("recipes").select("*", { count: 'exact', head: true }),
        supabase.from("chat_messages").select("*", { count: 'exact', head: true }),
        supabase.from("subscribers").select("*", { count: 'exact', head: true }).neq("subscription_status", "free"),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalExercises: exercisesResult.count || 0,
        totalRecipes: recipesResult.count || 0,
        totalMessages: messagesResult.count || 0,
        activeSubscribers: subscribersResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) setRecentUsers(data);
    } catch (error) {
      console.error("Error fetching recent users:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
    toast.success("Logout realizado com sucesso!");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg animate-pulse">Carregando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <span className="text-muted-foreground">
              Olá, {profile?.full_name || "Admin"}!
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/users")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuários</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/exercises")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exercícios</p>
                  <p className="text-3xl font-bold">{stats.totalExercises}</p>
                </div>
                <Dumbbell className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/recipes")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receitas</p>
                  <p className="text-3xl font-bold">{stats.totalRecipes}</p>
                </div>
                <ChefHat className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mensagens Chat</p>
                  <p className="text-3xl font-bold">{stats.totalMessages}</p>
                </div>
                <MessageCircle className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assinantes</p>
                  <p className="text-3xl font-bold">{stats.activeSubscribers}</p>
                </div>
                <Award className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/admin/exercises")}
                >
                  <Dumbbell className="h-6 w-6" />
                  Adicionar Exercício
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/admin/recipes")}
                >
                  <ChefHat className="h-6 w-6" />
                  Adicionar Receita
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/admin/users")}
                >
                  <Users className="h-6 w-6" />
                  Gerenciar Usuários
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/admin/missions")}
                >
                  <Target className="h-6 w-6" />
                  Gerenciar Missões
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.full_name || "Sem nome"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum usuário cadastrado ainda.
                </p>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate("/admin/users")}
              >
                Ver Todos os Usuários
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Versão</p>
                <p className="font-semibold">1.0.0</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Status</p>
                <p className="font-semibold text-green-500">Online</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Último Backup</p>
                <p className="font-semibold">Automático</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Stripe</p>
                <p className="font-semibold text-yellow-500">Pendente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
