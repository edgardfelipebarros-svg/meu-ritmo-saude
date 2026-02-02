import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Scale,
  Ruler,
  Activity,
  Target,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeightEntry {
  id: string;
  weight: number;
  recorded_at: string;
}

interface ExerciseLog {
  id: string;
  completed_at: string;
  calories_burned: number;
}

const Progress = () => {
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentWeight: 0,
    startWeight: 0,
    goalWeight: 0,
    bmi: 0,
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    currentStreak: 0,
  });
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch weight history
      const { data: weightData } = await supabase
        .from("user_weight_history")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: true });

      if (weightData) {
        setWeightHistory(weightData);
      }

      // Fetch exercise logs
      const { data: exerciseData } = await supabase
        .from("user_exercises")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (exerciseData) {
        setExerciseLogs(exerciseData);
      }

      // Fetch user points for streak
      const { data: pointsData } = await supabase
        .from("user_points")
        .select("streak_days")
        .eq("user_id", user.id)
        .single();

      // Calculate stats
      const currentWeight = weightData && weightData.length > 0 
        ? weightData[weightData.length - 1].weight 
        : profile?.weight || 0;
      
      const startWeight = weightData && weightData.length > 0 
        ? weightData[0].weight 
        : profile?.weight || 0;

      const totalCalories = exerciseData?.reduce((sum, log) => sum + (log.calories_burned || 0), 0) || 0;

      const height = profile?.height || 170;
      const bmi = currentWeight && height ? (currentWeight / Math.pow(height / 100, 2)) : 0;

      setStats({
        currentWeight,
        startWeight,
        goalWeight: 70, // Default goal
        bmi,
        totalWorkouts: exerciseData?.length || 0,
        totalCaloriesBurned: totalCalories,
        currentStreak: pointsData?.streak_days || 0,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newWeight) return;

    try {
      const weight = parseFloat(newWeight);
      if (isNaN(weight) || weight <= 0) {
        toast.error("Digite um peso válido");
        return;
      }

      const { error } = await supabase
        .from("user_weight_history")
        .insert({
          user_id: user.id,
          weight,
        });

      if (error) throw error;

      // Update profile weight
      await supabase
        .from("profiles")
        .update({ weight })
        .eq("user_id", user.id);

      toast.success("Peso registrado!");
      setShowAddWeight(false);
      setNewWeight("");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar peso");
    }
  };

  const weightChartData = weightHistory.map(entry => ({
    date: new Date(entry.recorded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    peso: entry.weight,
  }));

  const weightChange = stats.currentWeight - stats.startWeight;
  const weightChangePercent = stats.startWeight > 0 
    ? ((weightChange / stats.startWeight) * 100).toFixed(1) 
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg animate-pulse">Carregando progresso...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Meu Progresso</h1>
          </div>
          <Dialog open={showAddWeight} onOpenChange={setShowAddWeight}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Peso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Novo Peso</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddWeight} className="space-y-4">
                <div className="space-y-2">
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Ex: 75.5"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddWeight(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Peso Atual</p>
                  <p className="text-3xl font-bold">{stats.currentWeight.toFixed(1)} kg</p>
                  <p className={`text-sm flex items-center gap-1 ${weightChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {weightChange < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {Math.abs(weightChange).toFixed(1)} kg ({weightChangePercent}%)
                  </p>
                </div>
                <Scale className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">IMC</p>
                  <p className="text-3xl font-bold">{stats.bmi.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.bmi < 18.5 ? 'Abaixo do peso' :
                     stats.bmi < 25 ? 'Peso normal' :
                     stats.bmi < 30 ? 'Sobrepeso' : 'Obesidade'}
                  </p>
                </div>
                <Ruler className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Treinos Realizados</p>
                  <p className="text-3xl font-bold">{stats.totalWorkouts}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.totalCaloriesBurned.toLocaleString()} cal queimadas
                  </p>
                </div>
                <Activity className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sequência Atual</p>
                  <p className="text-3xl font-bold">{stats.currentStreak} dias</p>
                  <p className="text-sm text-muted-foreground">
                    Continue assim! 🔥
                  </p>
                </div>
                <Target className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weight Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução do Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weightChartData.length > 1 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="peso" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Registre pelo menos 2 pesagens para ver o gráfico de evolução.</p>
                <Button className="mt-4" onClick={() => setShowAddWeight(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primeiro Peso
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Últimos Treinos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exerciseLogs.length > 0 ? (
              <div className="space-y-3">
                {exerciseLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Treino Realizado</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.completed_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-green-500">
                      {log.calories_burned || 0} cal
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum treino registrado ainda.</p>
                <Button className="mt-4" variant="outline" onClick={() => navigate("/exercises")}>
                  Ver Exercícios
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Progress;
