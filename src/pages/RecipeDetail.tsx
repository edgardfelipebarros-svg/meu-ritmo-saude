import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Clock,
  Users,
  Flame,
  Heart,
  ShoppingCart,
  ChefHat,
  CheckCircle
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  nutritional_info: any;
}

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchRecipe();
      checkFavorite();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) setRecipe(data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("Receita não encontrada");
      navigate("/recipes");
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from("user_recipes")
        .select("is_favorite")
        .eq("user_id", user.id)
        .eq("recipe_id", id)
        .single();

      if (data) setIsFavorite(data.is_favorite);
    } catch (error) {
      // Not favorited yet
    }
  };

  const toggleFavorite = async () => {
    if (!user || !recipe) return;

    try {
      const { data: existing } = await supabase
        .from("user_recipes")
        .select("id, is_favorite")
        .eq("user_id", user.id)
        .eq("recipe_id", recipe.id)
        .single();

      if (existing) {
        await supabase
          .from("user_recipes")
          .update({ is_favorite: !existing.is_favorite })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("user_recipes")
          .insert({
            user_id: user.id,
            recipe_id: recipe.id,
            is_favorite: true,
          });
      }

      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos! ❤️");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar favoritos");
    }
  };

  const addToShoppingList = async () => {
    if (!user || !recipe) return;

    try {
      const items = recipe.ingredients.map(ingredient => ({
        user_id: user.id,
        ingredient,
      }));

      const { error } = await supabase
        .from("shopping_list")
        .insert(items);

      if (error) throw error;

      toast.success("Ingredientes adicionados à lista de compras! 🛒");
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar à lista");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
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
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg animate-pulse">Carregando receita...</div>
        </div>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Receita não encontrada</p>
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/recipes")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{recipe.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleFavorite}>
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorite ? 'Favorito' : 'Favoritar'}
            </Button>
            <Button onClick={addToShoppingList}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar à Lista
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {recipe.image_url && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Sobre a Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{recipe.description}</p>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Modo de Preparo</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-muted-foreground pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
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
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Preparo
                  </span>
                  <span>{recipe.prep_time} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Cozimento
                  </span>
                  <span>{recipe.cook_time} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Porções
                  </span>
                  <span>{recipe.servings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    Calorias/Porção
                  </span>
                  <span>{recipe.calories_per_serving} cal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dificuldade</span>
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} text-white`}>
                    {getDifficultyLabel(recipe.difficulty)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Objetivo</p>
                  <Badge variant="outline">{getGoalLabel(recipe.goal_category)}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tipo de Dieta</p>
                  <Badge variant="outline">{getDietLabel(recipe.diet_type)}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Nutritional Info */}
            {recipe.nutritional_info && Object.keys(recipe.nutritional_info).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Informação Nutricional</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(recipe.nutritional_info).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize text-muted-foreground">{key}</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full" size="lg" onClick={addToShoppingList}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar Ingredientes à Lista
              </Button>
              <Button className="w-full" variant="outline" size="lg" onClick={toggleFavorite}>
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetail;
