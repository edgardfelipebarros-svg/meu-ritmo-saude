import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  ChefHat, 
  Award,
  Target,
  Settings, 
  ArrowLeft,
  Menu,
  X,
  Shield
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard Admin", path: "/admin" },
    { icon: Users, label: "Usuários", path: "/admin/users" },
    { icon: Dumbbell, label: "Exercícios", path: "/admin/exercises" },
    { icon: ChefHat, label: "Receitas", path: "/admin/recipes" },
    { icon: Award, label: "Badges", path: "/admin/badges" },
    { icon: Target, label: "Missões", path: "/admin/missions" },
    { icon: Settings, label: "Configurações", path: "/admin/settings" },
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
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Admin</h2>
            </div>
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

      {/* Admin Badge */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <Badge variant="default" className="w-full justify-center bg-primary">
            Administrador
          </Badge>
        </div>
      )}

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

      {/* Divider */}
      <div className="mx-4 my-4 border-t" />

      {/* Back to User Dashboard */}
      <div className="px-2">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-3 h-11",
            isCollapsed && "justify-center px-2"
          )}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Voltar ao App</span>
          )}
        </Button>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Painel Administrativo
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
