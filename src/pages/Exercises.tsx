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
  Target, 
  Play, 
  Home, 
  Dumbbell,
  ArrowLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  benefits: string;
  contraindications: string;
  observations: string;
  module_type: 'home' | 'advanced';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  youtube_url: string;
  image_urls: string[];
  muscle_groups: string[];
  equipment_needed: string[];
  calories_burned: number;
}

const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<'all' | 'home' | 'advanced'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm, selectedModule, selectedDifficulty]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("title");

      if (error) throw error;

      if (data) {
        setExercises(data as Exercise[]);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscle_groups.some(group => 
          group.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by module
    if (selectedModule !== 'all') {
      filtered = filtered.filter(exercise => exercise.module_type === selectedModule);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exercise => exercise.difficulty_level === selectedDifficulty);
    }

    setFilteredExercises(filtered);
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

  const getModuleLabel = (module: string) => {
    switch (module) {
      case 'home': return 'Casa';
      case 'advanced': return 'Avançado';
      default: return module;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
        <div className="text-lg">Carregando exercícios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Biblioteca de Exercícios</h1>
          </div>
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
                    placeholder="Buscar exercícios ou grupos musculares..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todos os Módulos</option>
                  <option value="home">Casa</option>
                  <option value="advanced">Avançado</option>
                </select>
                
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todas as Dificuldades</option>
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Modules Tabs */}
        <Tabs value={selectedModule} onValueChange={(value) => setSelectedModule(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Módulo Casa
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Módulo Avançado
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Exercise Results */}
        <div className="mb-4 text-muted-foreground">
          {filteredExercises.length} exercício(s) encontrado(s)
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{exercise.title}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${getDifficultyColor(exercise.difficulty_level)} text-white ml-2`}
                  >
                    {getDifficultyLabel(exercise.difficulty_level)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    {getModuleLabel(exercise.module_type)}
                  </Badge>
                  {exercise.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {exercise.duration} min
                    </div>
                  )}
                  {exercise.calories_burned && (
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {exercise.calories_burned} cal
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {exercise.description}
                </p>
                
                {exercise.muscle_groups.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2">Grupos Musculares:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscle_groups.slice(0, 3).map((group, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {group}
                        </Badge>
                      ))}
                      {exercise.muscle_groups.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{exercise.muscle_groups.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {exercise.equipment_needed.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2">Equipamentos:</p>
                    <p className="text-xs text-muted-foreground">
                      {exercise.equipment_needed.length === 0 ? 
                        "Nenhum equipamento necessário" : 
                        exercise.equipment_needed.join(", ")
                      }
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => navigate(`/exercise/${exercise.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                  {exercise.youtube_url && (
                    <Button variant="outline" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum exercício encontrado com os filtros aplicados.</p>
                <p className="text-sm mt-2">Tente ajustar os filtros ou buscar por outros termos.</p>
              </div>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedModule('all');
                setSelectedDifficulty('all');
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

export default Exercises;