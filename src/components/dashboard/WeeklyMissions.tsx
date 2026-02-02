import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  CheckCircle,
  Clock,
  Gift
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  mission_type: string;
  target_value: number;
  points_reward: number;
}

interface UserMission {
  id: string;
  mission_id: string;
  current_value: number;
  is_completed: boolean;
  mission: Mission;
}

const WeeklyMissions = () => {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  const fetchMissions = async () => {
    if (!user) return;

    try {
      // Get current week start
      const now = new Date();
      const dayOfWeek = now.getDay();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      const weekStartStr = weekStart.toISOString().split('T')[0];

      // Fetch active missions
      const { data: activeMissions } = await supabase
        .from("weekly_missions")
        .select("*")
        .eq("is_active", true);

      if (!activeMissions || activeMissions.length === 0) {
        setMissions([]);
        setLoading(false);
        return;
      }

      // Fetch user's progress on these missions
      const { data: userMissions } = await supabase
        .from("user_missions")
        .select("*, mission:weekly_missions(*)")
        .eq("user_id", user.id)
        .eq("week_start", weekStartStr);

      if (userMissions && userMissions.length > 0) {
        setMissions(userMissions);
      } else {
        // Create user missions for this week
        const newMissions = activeMissions.map(mission => ({
          user_id: user.id,
          mission_id: mission.id,
          current_value: 0,
          is_completed: false,
          week_start: weekStartStr,
        }));

        await supabase
          .from("user_missions")
          .insert(newMissions);

        // Fetch again
        const { data: createdMissions } = await supabase
          .from("user_missions")
          .select("*, mission:weekly_missions(*)")
          .eq("user_id", user.id)
          .eq("week_start", weekStartStr);

        if (createdMissions) {
          setMissions(createdMissions);
        }
      }
    } catch (error) {
      console.error("Error fetching missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (missionId: string, points: number) => {
    if (!user) return;

    try {
      // Update user points
      const { data: currentPoints } = await supabase
        .from("user_points")
        .select("total_points")
        .eq("user_id", user.id)
        .single();

      const newTotal = (currentPoints?.total_points || 0) + points;

      await supabase
        .from("user_points")
        .upsert({
          user_id: user.id,
          total_points: newTotal,
        });

      toast.success(`🎉 +${points} pontos conquistados!`);
      fetchMissions();
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'workouts': return '💪';
      case 'water': return '💧';
      case 'meals': return '🥗';
      case 'streak': return '🔥';
      default: return '🎯';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Carregando missões...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Missões da Semana
        </CardTitle>
      </CardHeader>
      <CardContent>
        {missions.length > 0 ? (
          <div className="space-y-4">
            {missions.map((userMission) => {
              const mission = userMission.mission;
              if (!mission) return null;

              const progress = (userMission.current_value / mission.target_value) * 100;
              const isComplete = userMission.is_completed || progress >= 100;

              return (
                <div
                  key={userMission.id}
                  className={`p-4 rounded-lg border ${isComplete ? 'bg-green-500/10 border-green-500/20' : 'bg-muted/50'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMissionIcon(mission.mission_type)}</span>
                      <div>
                        <h4 className="font-medium">{mission.title}</h4>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                      </div>
                    </div>
                    <Badge variant={isComplete ? "default" : "secondary"}>
                      <Gift className="h-3 w-3 mr-1" />
                      {mission.points_reward} pts
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span>
                        {userMission.current_value}/{mission.target_value}
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} />
                  </div>

                  {isComplete && !userMission.is_completed && (
                    <Button
                      className="w-full mt-3"
                      size="sm"
                      onClick={() => claimReward(userMission.id, mission.points_reward)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resgatar Recompensa
                    </Button>
                  )}

                  {userMission.is_completed && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Concluída!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma missão ativa no momento.</p>
            <p className="text-sm mt-1">Novas missões serão adicionadas em breve!</p>
          </div>
        )}

        {/* Week Reset Timer */}
        <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>As missões são renovadas toda segunda-feira</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyMissions;
