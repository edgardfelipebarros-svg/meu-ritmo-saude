import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft,
  User,
  Save,
  Target,
  Activity,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    weight: "",
    height: "",
    goal: "",
    fitness_level: "",
    diet_preference: "",
    health_conditions: "",
    activity_frequency: "",
  });
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        age: profile.age?.toString() || "",
        weight: profile.weight?.toString() || "",
        height: profile.height?.toString() || "",
        goal: profile.goal || "",
        fitness_level: profile.fitness_level || "",
        diet_preference: profile.diet_preference || "",
        health_conditions: "",
        activity_frequency: "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          age: formData.age ? parseInt(formData.age) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseInt(formData.height) : null,
          goal: formData.goal,
          fitness_level: formData.fitness_level,
          diet_preference: formData.diet_preference,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // If weight was updated, also log it in weight history
      if (formData.weight && parseFloat(formData.weight) !== profile?.weight) {
        await supabase
          .from("user_weight_history")
          .insert({
            user_id: user.id,
            weight: parseFloat(formData.weight),
          });
      }

      await refreshProfile();
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseInt(formData.height);
    if (weight && height) {
      return (weight / Math.pow(height / 100, 2)).toFixed(1);
    }
    return "--";
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (isNaN(bmi)) return { label: "Preencha peso e altura", color: "text-muted-foreground" };
    if (bmi < 18.5) return { label: "Abaixo do peso", color: "text-yellow-500" };
    if (bmi < 25) return { label: "Peso ideal", color: "text-green-500" };
    if (bmi < 30) return { label: "Sobrepeso", color: "text-orange-500" };
    return { label: "Obesidade", color: "text-red-500" };
  };

  return (
    <Layout>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {formData.full_name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{formData.full_name || "Usuário"}</h2>
                <p className="text-muted-foreground">{profile?.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>IMC: {calculateBMI()}</span>
                  </div>
                  <span className={getBMIStatus().color}>{getBMIStatus().label}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Idade</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Sua idade"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="Ex: 75.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Altura (cm)</Label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    placeholder="Ex: 175"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals and Preferences */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos e Preferências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Objetivo Principal</Label>
                  <Select 
                    value={formData.goal} 
                    onValueChange={(value) => setFormData({...formData, goal: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">Emagrecimento</SelectItem>
                      <SelectItem value="gain_muscle">Ganho de Massa Muscular</SelectItem>
                      <SelectItem value="maintain_health">Manutenção da Saúde</SelectItem>
                      <SelectItem value="improve_fitness">Melhorar Condicionamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nível de Condicionamento</Label>
                  <Select 
                    value={formData.fitness_level} 
                    onValueChange={(value) => setFormData({...formData, fitness_level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante (sedentário)</SelectItem>
                      <SelectItem value="intermediate">Intermediário (ativo às vezes)</SelectItem>
                      <SelectItem value="advanced">Avançado (treina regularmente)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Preferência Alimentar</Label>
                  <Select 
                    value={formData.diet_preference} 
                    onValueChange={(value) => setFormData({...formData, diet_preference: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">Onívora (come de tudo)</SelectItem>
                      <SelectItem value="vegetarian">Vegetariana</SelectItem>
                      <SelectItem value="vegan">Vegana</SelectItem>
                      <SelectItem value="keto">Cetogênica (Keto)</SelectItem>
                      <SelectItem value="low_carb">Low Carb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Informações de Saúde (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Condições de Saúde ou Restrições</Label>
                <Textarea
                  value={formData.health_conditions}
                  onChange={(e) => setFormData({...formData, health_conditions: e.target.value})}
                  placeholder="Ex: Diabetes, hipertensão, problemas articulares, alergias alimentares..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Essas informações ajudam a personalizar suas recomendações de exercícios e receitas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
