import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Dumbbell, 
  ChefHat, 
  MessageCircle, 
  Settings, 
  Calendar,
  TrendingUp,
  User,
  Menu,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Dumbbell, label: "Exercícios", path: "/exercises" },
    { icon: ChefHat, label: "Receitas", path: "/recipes" },
    { icon: MessageCircle, label: "Chat IA", path: "/chat" },
    { icon: Calendar, label: "Calendário", path: "/calendar" },
    { icon: TrendingUp, label: "Progresso", path: "/progress" },
    { icon: User, label: "Perfil", path: "/profile" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full bg-card/95 backdrop-blur-sm border-l transition-all duration-300 z-50",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                isCollapsed && "justify-center px-2",
                isActive(item.path) && "bg-primary text-primary-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Meu Ritmo v1.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;