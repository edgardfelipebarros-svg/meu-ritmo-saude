import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft,
  ShoppingCart,
  Plus,
  Trash2,
  Check,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ShoppingItem {
  id: string;
  ingredient: string;
  quantity?: string;
  is_checked: boolean;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("shopping_list")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data) setItems(data);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newItem.trim()) return;

    try {
      const { error } = await supabase
        .from("shopping_list")
        .insert({
          user_id: user.id,
          ingredient: newItem.trim(),
          quantity: newQuantity.trim() || null,
        });

      if (error) throw error;

      setNewItem("");
      setNewQuantity("");
      fetchItems();
      toast.success("Item adicionado!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar item");
    }
  };

  const toggleItem = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("shopping_list")
        .update({ is_checked: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchItems();
      toast.success("Item removido!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover item");
    }
  };

  const clearChecked = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .eq("user_id", user.id)
        .eq("is_checked", true);

      if (error) throw error;
      fetchItems();
      toast.success("Itens comprados removidos!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao limpar lista");
    }
  };

  const shareList = () => {
    const uncheckedItems = items.filter(item => !item.is_checked);
    const listText = uncheckedItems
      .map(item => `${item.quantity ? `${item.quantity} ` : ''}${item.ingredient}`)
      .join('\n');

    if (navigator.share) {
      navigator.share({
        title: 'Lista de Compras - Meu Ritmo',
        text: listText,
      });
    } else {
      navigator.clipboard.writeText(listText);
      toast.success("Lista copiada para a área de transferência!");
    }
  };

  const checkedCount = items.filter(item => item.is_checked).length;
  const uncheckedCount = items.filter(item => !item.is_checked).length;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg animate-pulse">Carregando lista...</div>
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
            <h1 className="text-2xl font-bold">Lista de Compras</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareList} disabled={uncheckedCount === 0}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            {checkedCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearChecked}>
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Comprados
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Add Item Form */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleAddItem} className="flex gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Adicionar item..."
                className="flex-1"
              />
              <Input
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="Qtd"
                className="w-24"
              />
              <Button type="submit">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>{uncheckedCount} item(s) para comprar</span>
          <span>{checkedCount} item(s) comprado(s)</span>
        </div>

        {/* Shopping List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Itens
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length > 0 ? (
              <div className="space-y-2">
                {/* Unchecked items first */}
                {items
                  .filter(item => !item.is_checked)
                  .map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={item.is_checked}
                          onCheckedChange={() => toggleItem(item.id, item.is_checked)}
                        />
                        <div>
                          <span className="font-medium">{item.ingredient}</span>
                          {item.quantity && (
                            <span className="text-sm text-muted-foreground ml-2">
                              ({item.quantity})
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}

                {/* Divider if there are checked items */}
                {checkedCount > 0 && uncheckedCount > 0 && (
                  <div className="border-t my-4" />
                )}

                {/* Checked items */}
                {items
                  .filter(item => item.is_checked)
                  .map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={item.is_checked}
                          onCheckedChange={() => toggleItem(item.id, item.is_checked)}
                        />
                        <div>
                          <span className="font-medium line-through">{item.ingredient}</span>
                          {item.quantity && (
                            <span className="text-sm text-muted-foreground ml-2 line-through">
                              ({item.quantity})
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sua lista de compras está vazia.</p>
                <p className="text-sm mt-2">
                  Adicione itens acima ou visite as receitas para adicionar ingredientes!
                </p>
                <Button className="mt-4" variant="outline" onClick={() => navigate("/recipes")}>
                  Ver Receitas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ShoppingList;
