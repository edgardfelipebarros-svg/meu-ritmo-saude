import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Clock, 
  Users, 
  Flame, 
  ChefHat,
  ArrowLeft,
  Heart,
  ShoppingCart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedGoal, selectedDiet]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("title");

      if (error) throw error;

      if (data) {
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by goal
    if (selectedGoal !== 'all') {
      filtered = filtered.filter(recipe => recipe.goal_category === selectedGoal);
    }

    // Filter by diet type
    if (selectedDiet !== 'all') {
      filtered = filtered.filter(recipe => recipe.diet_type === selectedDiet);
    }

    setFilteredRecipes(filtered);
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
    switch (goal) {
      case 'lose_weight': return 'Emagrecimento';
      case 'gain_muscle': return 'Ganho de Massa';
      case 'maintain_health': return 'Manutenção';
      case 'high_protein': return 'Alto Proteína';
      case 'low_carb': return 'Low Carb';
      default: return goal;
    }
  };

  const getDietLabel = (diet: string) => {
    switch (diet) {
      case 'omnivore': return 'Onívora';
      case 'vegetarian': return 'Vegetariana';
      case 'vegan': return 'Vegana';
      case 'keto': return 'Cetogênica';
      case 'low_carb': return 'Low Carb';
      default: return diet;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
        <div className="text-lg">Carregando receitas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Receitas Saudáveis</h1>
          </div>
          <Button variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Lista de Compras
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar receitas ou ingredientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todos os Objetivos</option>
                  <option value="lose_weight">Emagrecimento</option>
                  <option value="gain_muscle">Ganho de Massa</option>
                  <option value="maintain_health">Manutenção</option>
                  <option value="high_protein">Alto Proteína</option>
                  <option value="low_carb">Low Carb</option>
                </select>
                
                <select
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="omnivore">Onívora</option>
                  <option value="vegetarian">Vegetariana</option>
                  <option value="vegan">Vegana</option>
                  <option value="keto">Cetogênica</option>
                  <option value="low_carb">Low Carb</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Categories Tabs */}
        <Tabs value={selectedGoal} onValueChange={(value) => setSelectedGoal(value)} className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="lose_weight">Emagrecimento</TabsTrigger>
            <TabsTrigger value="gain_muscle">Massa</TabsTrigger>
            <TabsTrigger value="maintain_health">Manutenção</TabsTrigger>
            <TabsTrigger value="high_protein">Proteína</TabsTrigger>
            <TabsTrigger value="low_carb">Low Carb</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Recipe Results */}
        <div className="mb-4 text-muted-foreground">
          {filteredRecipes.length} receita(s) encontrada(s)
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="group hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                {recipe.image_url ? (
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{recipe.title}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${getDifficultyColor(recipe.difficulty)} text-white ml-2`}
                  >
                    {getDifficultyLabel(recipe.difficulty)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {recipe.servings} porções
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {recipe.calories_per_serving} cal
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">
                    {getGoalLabel(recipe.goal_category)}
                  </Badge>
                  <Badge variant="outline">
                    {getDietLabel(recipe.diet_type)}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs font-medium mb-2">Principais Ingredientes:</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {recipe.ingredients.slice(0, 3).join(", ")}
                    {recipe.ingredients.length > 3 && "..."}
                  </p>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  Ver Receita Completa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma receita encontrada com os filtros aplicados.</p>
                <p className="text-sm mt-2">Tente ajustar os filtros ou buscar por outros termos.</p>
              </div>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedGoal('all');
                setSelectedDiet('all');
              }}>
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recipes;