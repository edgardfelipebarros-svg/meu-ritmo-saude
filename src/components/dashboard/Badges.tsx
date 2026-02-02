import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
}

interface UserBadge {
  id: string;
  badge_id: string;
  unlocked_at: string;
}

const Badges = () => {
  const [allBadges, setAllBadges] = useState<BadgeItem[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBadges();
    }
  }, [user]);

  const fetchBadges = async () => {
    if (!user) return;

    try {
      // Fetch all badges
      const { data: badges } = await supabase
        .from("badges")
        .select("*")
        .order("points", { ascending: true });

      if (badges) setAllBadges(badges);

      // Fetch user's unlocked badges
      const { data: unlocked } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", user.id);

      if (unlocked) setUserBadges(unlocked);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (badgeId: string) => {
    return userBadges.some(ub => ub.badge_id === badgeId);
  };

  const getBadgeEmoji = (iconName: string) => {
    const emojis: Record<string, string> = {
      'first_workout': '🏋️',
      'week_streak': '🔥',
      'month_streak': '⚡',
      'weight_goal': '🎯',
      'first_recipe': '👨‍🍳',
      'healthy_eater': '🥗',
      'early_bird': '🌅',
      'night_owl': '🦉',
      'social': '👥',
      'champion': '🏆',
    };
    return emojis[iconName] || '🏅';
  };

  const totalPoints = userBadges.reduce((sum, ub) => {
    const badge = allBadges.find(b => b.id === ub.badge_id);
    return sum + (badge?.points || 0);
  }, 0);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Carregando conquistas...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Conquistas
          </CardTitle>
          <Badge variant="secondary">
            {totalPoints} pontos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {allBadges.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {allBadges.map((badge) => {
              const unlocked = isUnlocked(badge.id);
              const userBadge = userBadges.find(ub => ub.badge_id === badge.id);

              return (
                <div
                  key={badge.id}
                  className={`relative p-4 rounded-lg border text-center transition-all ${
                    unlocked 
                      ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                      : 'bg-muted/30 opacity-60'
                  }`}
                >
                  <div className={`text-4xl mb-2 ${!unlocked && 'grayscale'}`}>
                    {getBadgeEmoji(badge.icon_name)}
                  </div>
                  <h4 className="font-medium text-sm">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.description}
                  </p>
                  <Badge 
                    variant={unlocked ? "default" : "secondary"} 
                    className="mt-2"
                  >
                    {badge.points} pts
                  </Badge>

                  {!unlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  {unlocked && userBadge && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Desbloqueado em {new Date(userBadge.unlocked_at).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma conquista disponível ainda.</p>
            <p className="text-sm mt-1">Continue treinando para desbloquear conquistas!</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{userBadges.length}</p>
            <p className="text-sm text-muted-foreground">Desbloqueadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{allBadges.length - userBadges.length}</p>
            <p className="text-sm text-muted-foreground">Restantes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Badges;
