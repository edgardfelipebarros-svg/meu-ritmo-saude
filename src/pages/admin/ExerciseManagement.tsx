import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Dumbbell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  muscle_groups: string[];
  equipment_needed: string[];
  calories_burned: number;
}

const ExerciseManagement = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    benefits: "",
    contraindications: "",
    observations: "",
    module_type: "home",
    difficulty_level: "beginner",
    duration: 10,
    youtube_url: "",
    muscle_groups: "",
    equipment_needed: "",
    calories_burned: 50,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("title");

      if (error) throw error;
      if (data) setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const exerciseData = {
        ...formData,
        muscle_groups: formData.muscle_groups.split(",").map(s => s.trim()).filter(Boolean),
        equipment_needed: formData.equipment_needed.split(",").map(s => s.trim()).filter(Boolean),
      };

      if (editingExercise) {
        const { error } = await supabase
          .from("exercises")
          .update(exerciseData)
          .eq("id", editingExercise.id);

        if (error) throw error;
        toast.success("Exercício atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("exercises")
          .insert(exerciseData);

        if (error) throw error;
        toast.success("Exercício criado com sucesso!");
      }

      setShowForm(false);
      setEditingExercise(null);
      resetForm();
      fetchExercises();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar exercício");
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      title: exercise.title,
      description: exercise.description || "",
      instructions: exercise.instructions || "",
      benefits: exercise.benefits || "",
      contraindications: exercise.contraindications || "",
      observations: exercise.observations || "",
      module_type: exercise.module_type,
      difficulty_level: exercise.difficulty_level,
      duration: exercise.duration,
      youtube_url: exercise.youtube_url || "",
      muscle_groups: exercise.muscle_groups?.join(", ") || "",
      equipment_needed: exercise.equipment_needed?.join(", ") || "",
      calories_burned: exercise.calories_burned,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este exercício?")) return;

    try {
      const { error } = await supabase
        .from("exercises")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Exercício excluído com sucesso!");
      fetchExercises();
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir exercício");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructions: "",
      benefits: "",
      contraindications: "",
      observations: "",
      module_type: "home",
      difficulty_level: "beginner",
      duration: 10,
      youtube_url: "",
      muscle_groups: "",
      equipment_needed: "",
      calories_burned: 50,
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg animate-pulse">Carregando exercícios...</div>
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Gestão de Exercícios</h1>
          </div>
          <Dialog open={showForm} onOpenChange={(open) => {
            setShowForm(open);
            if (!open) {
              setEditingExercise(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Exercício
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingExercise ? "Editar Exercício" : "Novo Exercício"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Módulo</Label>
                    <Select 
                      value={formData.module_type} 
                      onValueChange={(value) => setFormData({...formData, module_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Casa</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Instruções</Label>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Benefícios</Label>
                    <Textarea
                      value={formData.benefits}
                      onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraindicações</Label>
                    <Textarea
                      value={formData.contraindications}
                      onChange={(e) => setFormData({...formData, contraindications: e.target.value})}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Dificuldade</Label>
                    <Select 
                      value={formData.difficulty_level} 
                      onValueChange={(value) => setFormData({...formData, difficulty_level: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Iniciante</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duração (min)</Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calorias</Label>
                    <Input
                      type="number"
                      value={formData.calories_burned}
                      onChange={(e) => setFormData({...formData, calories_burned: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grupos Musculares (separar por vírgula)</Label>
                    <Input
                      value={formData.muscle_groups}
                      onChange={(e) => setFormData({...formData, muscle_groups: e.target.value})}
                      placeholder="Peitoral, Tríceps, Ombros"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Equipamentos (separar por vírgula)</Label>
                    <Input
                      value={formData.equipment_needed}
                      onChange={(e) => setFormData({...formData, equipment_needed: e.target.value})}
                      placeholder="Halteres, Barra"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingExercise ? "Salvar Alterações" : "Criar Exercício"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar exercícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(exercise)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(exercise.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {exercise.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {exercise.module_type === 'home' ? 'Casa' : 'Avançado'}
                  </Badge>
                  <Badge variant="secondary">
                    {exercise.difficulty_level === 'beginner' ? 'Iniciante' : 
                     exercise.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                  </Badge>
                  <Badge>{exercise.duration} min</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum exercício encontrado. Clique em "Novo Exercício" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ExerciseManagement;
