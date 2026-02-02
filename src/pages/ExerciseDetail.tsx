import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Play,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Dumbbell,
  Plus
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  benefits: string;
  contraindications: string;
  observations: string;
  module_type: string;
  difficulty_level: string;
  duration: number;
  youtube_url: string;
  image_urls: string[];
  muscle_groups: string[];
  equipment_needed: string[];
  calories_burned: number;
}

const ExerciseDetail = () => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchExercise();
    }
  }, [id]);

  const fetchExercise = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) setExercise(data);
    } catch (error) {
      console.error("Error fetching exercise:", error);
      toast.error("Exercício não encontrado");
      navigate("/exercises");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteExercise = async () => {
    if (!user || !exercise) return;

    try {
      const { error } = await supabase
        .from("user_exercises")
        .insert({
          user_id: user.id,
          exercise_id: exercise.id,
          duration: exercise.duration,
          calories_burned: exercise.calories_burned,
        });

      if (error) throw error;

      toast.success("Exercício concluído! 🎉 +" + exercise.calories_burned + " calorias queimadas");
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar exercício");
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg animate-pulse">Carregando exercício...</div>
        </div>
      </Layout>
    );
  }

  if (!exercise) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Exercício não encontrado</p>
        </div>
      </Layout>
    );
  }

  const embedUrl = getYoutubeEmbedUrl(exercise.youtube_url);

  return (
    <Layout>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/exercises")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{exercise.title}</h1>
          </div>
          <Button onClick={handleCompleteExercise}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como Concluído
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video */}
            {embedUrl && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl}
                      title={exercise.title}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Descrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{exercise.description}</p>
              </CardContent>
            </Card>

            {/* Instructions */}
            {exercise.instructions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Como Fazer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {exercise.instructions.split('\n').map((step, index) => (
                      <div key={index} className="flex gap-3 mb-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <p className="text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {exercise.benefits && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                    Benefícios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{exercise.benefits}</p>
                </CardContent>
              </Card>
            )}

            {/* Contraindications */}
            {exercise.contraindications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                    Contraindicações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{exercise.contraindications}</p>
                </CardContent>
              </Card>
            )}

            {/* Observations */}
            {exercise.observations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-500">
                    <Info className="h-5 w-5" />
                    Observações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{exercise.observations}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Módulo</span>
                  <Badge variant="outline">
                    {exercise.module_type === 'home' ? 'Casa' : 'Avançado'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dificuldade</span>
                  <Badge className={`${getDifficultyColor(exercise.difficulty_level)} text-white`}>
                    {getDifficultyLabel(exercise.difficulty_level)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duração</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{exercise.duration} min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Calorias</span>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{exercise.calories_burned} cal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Muscle Groups */}
            {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Grupos Musculares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscle_groups.map((group, index) => (
                      <Badge key={index} variant="secondary">{group}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Equipment */}
            <Card>
              <CardHeader>
                <CardTitle>Equipamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {exercise.equipment_needed && exercise.equipment_needed.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {exercise.equipment_needed.map((equip, index) => (
                      <Badge key={index} variant="outline">{equip}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum equipamento necessário ✓</p>
                )}
              </CardContent>
            </Card>

            {/* Add to Workout Button */}
            <Button className="w-full" size="lg" onClick={handleCompleteExercise}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar ao Treino
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExerciseDetail;
