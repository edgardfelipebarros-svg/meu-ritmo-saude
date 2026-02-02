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
  ChefHat
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

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  calories_per_serving: number;
  goal_category: string;
  diet_type: string;
  difficulty: string;
  image_url: string;
}

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    prep_time: 10,
    cook_time: 20,
    servings: 2,
    calories_per_serving: 200,
    goal_category: "maintain_health",
    diet_type: "omnivore",
    difficulty: "easy",
    image_url: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("title");

      if (error) throw error;
      if (data) setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients.split("\n").filter(Boolean),
        instructions: formData.instructions.split("\n").filter(Boolean),
      };

      if (editingRecipe) {
        const { error } = await supabase
          .from("recipes")
          .update(recipeData)
          .eq("id", editingRecipe.id);

        if (error) throw error;
        toast.success("Receita atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from("recipes")
          .insert(recipeData);

        if (error) throw error;
        toast.success("Receita criada com sucesso!");
      }

      setShowForm(false);
      setEditingRecipe(null);
      resetForm();
      fetchRecipes();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar receita");
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      description: recipe.description || "",
      ingredients: recipe.ingredients?.join("\n") || "",
      instructions: recipe.instructions?.join("\n") || "",
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      servings: recipe.servings,
      calories_per_serving: recipe.calories_per_serving,
      goal_category: recipe.goal_category,
      diet_type: recipe.diet_type,
      difficulty: recipe.difficulty,
      image_url: recipe.image_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Receita excluída com sucesso!");
      fetchRecipes();
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir receita");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      ingredients: "",
      instructions: "",
      prep_time: 10,
      cook_time: 20,
      servings: 2,
      calories_per_serving: 200,
      goal_category: "maintain_health",
      diet_type: "omnivore",
      difficulty: "easy",
      image_url: "",
    });
  };

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      lose_weight: "Emagrecimento",
      gain_muscle: "Ganho de Massa",
      maintain_health: "Manutenção",
      high_protein: "Alto Proteína",
      low_carb: "Low Carb",
    };
    return labels[goal] || goal;
  };

  const getDietLabel = (diet: string) => {
    const labels: Record<string, string> = {
      omnivore: "Onívora",
      vegetarian: "Vegetariana",
      vegan: "Vegana",
      keto: "Cetogênica",
      low_carb: "Low Carb",
    };
    return labels[diet] || diet;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg animate-pulse">Carregando receitas...</div>
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
            <h1 className="text-2xl font-bold">Gestão de Receitas</h1>
          </div>
          <Dialog open={showForm} onOpenChange={(open) => {
            setShowForm(open);
            if (!open) {
              setEditingRecipe(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecipe ? "Editar Receita" : "Nova Receita"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
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
                  <Label>Ingredientes (um por linha)</Label>
                  <Textarea
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    rows={4}
                    placeholder="200g de frango&#10;1 colher de azeite&#10;Sal a gosto"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Modo de Preparo (um passo por linha)</Label>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    rows={4}
                    placeholder="Tempere o frango&#10;Leve ao fogo médio&#10;Cozinhe por 20 minutos"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Preparo (min)</Label>
                    <Input
                      type="number"
                      value={formData.prep_time}
                      onChange={(e) => setFormData({...formData, prep_time: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cozimento (min)</Label>
                    <Input
                      type="number"
                      value={formData.cook_time}
                      onChange={(e) => setFormData({...formData, cook_time: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Porções</Label>
                    <Input
                      type="number"
                      value={formData.servings}
                      onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calorias/Porção</Label>
                    <Input
                      type="number"
                      value={formData.calories_per_serving}
                      onChange={(e) => setFormData({...formData, calories_per_serving: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select 
                      value={formData.goal_category} 
                      onValueChange={(value) => setFormData({...formData, goal_category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose_weight">Emagrecimento</SelectItem>
                        <SelectItem value="gain_muscle">Ganho de Massa</SelectItem>
                        <SelectItem value="maintain_health">Manutenção</SelectItem>
                        <SelectItem value="high_protein">Alto Proteína</SelectItem>
                        <SelectItem value="low_carb">Low Carb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Dieta</Label>
                    <Select 
                      value={formData.diet_type} 
                      onValueChange={(value) => setFormData({...formData, diet_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omnivore">Onívora</SelectItem>
                        <SelectItem value="vegetarian">Vegetariana</SelectItem>
                        <SelectItem value="vegan">Vegana</SelectItem>
                        <SelectItem value="keto">Cetogênica</SelectItem>
                        <SelectItem value="low_carb">Low Carb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Dificuldade</Label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(value) => setFormData({...formData, difficulty: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="hard">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL da Imagem</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingRecipe ? "Salvar Alterações" : "Criar Receita"}
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
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(recipe)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(recipe.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{getGoalLabel(recipe.goal_category)}</Badge>
                  <Badge variant="secondary">{getDietLabel(recipe.diet_type)}</Badge>
                  <Badge>{recipe.calories_per_serving} cal</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <ChefHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhuma receita encontrada. Clique em "Nova Receita" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default RecipeManagement;
