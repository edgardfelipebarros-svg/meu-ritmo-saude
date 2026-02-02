import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Dumbbell,
  ChefHat,
  Bell,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  event_date: string;
  event_time?: string;
  is_completed: boolean;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "workout",
    event_time: "",
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, currentDate]);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .gte("event_date", startOfMonth.toISOString().split('T')[0])
        .lte("event_date", endOfMonth.toISOString().split('T')[0])
        .order("event_date");

      if (error) throw error;
      if (data) setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDate) return;

    try {
      const { error } = await supabase
        .from("calendar_events")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          event_type: formData.event_type,
          event_date: selectedDate.toISOString().split('T')[0],
          event_time: formData.event_time || null,
        });

      if (error) throw error;

      toast.success("Evento adicionado!");
      setShowAddEvent(false);
      setFormData({ title: "", description: "", event_type: "workout", event_time: "" });
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar evento");
    }
  };

  const toggleComplete = async (eventId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("calendar_events")
        .update({ is_completed: !currentStatus })
        .eq("id", eventId);

      if (error) throw error;
      fetchEvents();
      toast.success(currentStatus ? "Evento desmarcado" : "Evento concluído! 🎉");
    } catch (error) {
      console.error("Error toggling event:", error);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.event_date === date.toISOString().split('T')[0]
    );
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return <Dumbbell className="h-3 w-3" />;
      case 'meal': return <ChefHat className="h-3 w-3" />;
      case 'reminder': return <Bell className="h-3 w-3" />;
      default: return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workout': return 'bg-green-500';
      case 'meal': return 'bg-orange-500';
      case 'reminder': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg animate-pulse">Carregando calendário...</div>
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Calendário</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Calendar Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="ghost"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card className="mb-6">
          <CardContent className="p-4">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="p-2 h-24" />;
                }

                const dayEvents = getEventsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate?.toDateString() === date.toDateString();

                return (
                  <div
                    key={date.toISOString()}
                    className={`p-2 h-24 border rounded-lg cursor-pointer transition-colors ${
                      isToday ? 'border-primary bg-primary/5' : 'border-border'
                    } ${isSelected ? 'ring-2 ring-primary' : ''} hover:bg-muted/50`}
                    onClick={() => {
                      setSelectedDate(date);
                      setShowAddEvent(true);
                    }}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded flex items-center gap-1 ${
                            event.is_completed ? 'opacity-50 line-through' : ''
                          } ${getEventTypeColor(event.event_type)} text-white`}
                        >
                          {getEventTypeIcon(event.event_type)}
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Eventos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.filter(e => e.event_date === new Date().toISOString().split('T')[0]).length > 0 ? (
              <div className="space-y-3">
                {events
                  .filter(e => e.event_date === new Date().toISOString().split('T')[0])
                  .map(event => (
                    <div
                      key={event.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        event.is_completed ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${getEventTypeColor(event.event_type)} text-white`}>
                          {getEventTypeIcon(event.event_type)}
                        </div>
                        <div>
                          <p className={`font-medium ${event.is_completed ? 'line-through' : ''}`}>
                            {event.title}
                          </p>
                          {event.event_time && (
                            <p className="text-sm text-muted-foreground">{event.event_time}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={event.is_completed ? "secondary" : "default"}
                        size="sm"
                        onClick={() => toggleComplete(event.id, event.is_completed)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum evento para hoje. Clique em um dia para adicionar!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Add Event Dialog */}
        <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Adicionar Evento - {selectedDate?.toLocaleDateString('pt-BR')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Treino de pernas"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={formData.event_type} 
                  onValueChange={(value) => setFormData({...formData, event_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workout">Treino</SelectItem>
                    <SelectItem value="meal">Refeição</SelectItem>
                    <SelectItem value="reminder">Lembrete</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Horário (opcional)</Label>
                <Input
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detalhes adicionais"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddEvent(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Calendar;
