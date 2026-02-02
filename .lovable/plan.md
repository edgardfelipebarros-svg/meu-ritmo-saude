
# Plano de Implementacao Completa - Meu Ritmo

## Visao Geral

Este plano implementa todas as funcionalidades restantes do sistema, incluindo:
- Sistema de administrador (primeiro usuario = admin)
- Autenticacao completa com "Esqueci minha senha"
- Limpeza de usuarios existentes
- Todas as paginas e funcionalidades faltantes
- Integracao com Supabase

---

## Fase 1: Banco de Dados - Sistema de Roles e Admin

### 1.1 Criar tabela de user_roles (seguranca)
```sql
-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela user_roles (separada para seguranca)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Funcao segura para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Funcao para verificar se e o primeiro usuario
CREATE OR REPLACE FUNCTION public.is_first_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles)
$$;

-- Politicas RLS
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));
```

### 1.2 Atualizar funcao de novo usuario
```sql
-- Atualizar handle_new_user para criar role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  is_first boolean;
BEGIN
  -- Verificar se e o primeiro usuario
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles) INTO is_first;
  
  -- Criar perfil
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  
  -- Criar subscriber
  INSERT INTO public.subscribers (user_id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Criar role (primeiro usuario = admin)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_first THEN 'admin'::public.app_role ELSE 'user'::public.app_role END);
  
  RETURN NEW;
END;
$$;
```

### 1.3 Limpar usuarios existentes
```sql
-- Limpar todos os usuarios existentes
DELETE FROM auth.users;
```

---

## Fase 2: Pagina de Autenticacao Completa

### 2.1 Atualizar src/pages/Auth.tsx
- Adicionar aba "Esqueci minha senha"
- Modal para recuperacao de senha
- Formulario de reset de senha
- Validacoes melhoradas
- UI mais polida

Funcionalidades:
- Login com email/senha
- Cadastro com nome/email/senha
- Botao "Esqueci minha senha" que envia email
- Pagina /reset-password para definir nova senha
- Verificacao de email apos cadastro

---

## Fase 3: Sistema de Rotas com Protecao

### 3.1 Criar hook useAuth
Arquivo: `src/hooks/useAuth.tsx`
- Gerenciar estado de autenticacao
- Verificar role do usuario (admin/user)
- Funcoes de login/logout/signUp
- Carregar perfil automaticamente

### 3.2 Criar componente ProtectedRoute
Arquivo: `src/components/auth/ProtectedRoute.tsx`
- Verificar se usuario esta autenticado
- Redirecionar para /auth se nao estiver
- Suporte para rotas admin-only

### 3.3 Criar contexto AuthContext
Arquivo: `src/contexts/AuthContext.tsx`
- Prover estado global de autenticacao
- Disponibilizar user, profile, role
- Gerenciar sessao

---

## Fase 4: Dashboard Administrativo

### 4.1 Criar pagina AdminDashboard
Arquivo: `src/pages/admin/AdminDashboard.tsx`
- Estatisticas gerais (usuarios, assinantes, exercicios, receitas)
- Graficos de crescimento
- Ultimos usuarios cadastrados
- Ultimas atividades

### 4.2 Criar pagina de Gestao de Usuarios
Arquivo: `src/pages/admin/UserManagement.tsx`
- Lista de todos os usuarios
- Visualizar detalhes de cada usuario
- Editar informacoes
- Desativar/ativar usuarios
- Ver historico de atividades

### 4.3 Criar pagina de Gestao de Exercicios
Arquivo: `src/pages/admin/ExerciseManagement.tsx`
- CRUD completo de exercicios
- Upload de imagens
- Adicionar URL do YouTube
- Definir modulo e dificuldade

### 4.4 Criar pagina de Gestao de Receitas
Arquivo: `src/pages/admin/RecipeManagement.tsx`
- CRUD completo de receitas
- Gerenciar ingredientes
- Informacoes nutricionais
- Categorizar por objetivo

### 4.5 Criar Sidebar Admin
Arquivo: `src/components/layout/AdminSidebar.tsx`
- Menu especifico para administradores
- Links para todas as areas de gestao
- Indicador de admin

---

## Fase 5: Paginas Faltantes para Usuarios

### 5.1 Criar pagina Calendario
Arquivo: `src/pages/Calendar.tsx`
- Visualizacao semanal e mensal
- Agendamento de treinos
- Planejamento de refeicoes
- Lembretes configuráveis
- Marcar itens como concluidos

### 5.2 Criar pagina Progresso
Arquivo: `src/pages/Progress.tsx`
- Graficos de evolucao de peso
- Historico de IMC
- Calorias queimadas por periodo
- Frequencia de treinos
- Fotos de progresso (antes/depois)
- Medicoes corporais

### 5.3 Criar pagina Perfil
Arquivo: `src/pages/Profile.tsx`
- Questionario inicial de avaliacao
- Dados pessoais completos
- Metas personalizadas
- Avatar customizavel

### 5.4 Criar pagina Detalhes do Exercicio
Arquivo: `src/pages/ExerciseDetail.tsx`
- Titulo, descricao completa
- Para que serve
- Como fazer (instrucoes)
- Indicacoes e contraindicacoes
- Observacoes importantes
- Player de video YouTube
- Galeria de 5 imagens
- Botao para adicionar ao treino

### 5.5 Criar pagina Detalhes da Receita
Arquivo: `src/pages/RecipeDetail.tsx`
- Titulo, descricao
- Lista de ingredientes
- Modo de preparo passo a passo
- Informacoes nutricionais
- Tempo de preparo e porcoes
- Botao para lista de compras
- Adicionar aos favoritos

### 5.6 Criar pagina Reset Password
Arquivo: `src/pages/ResetPassword.tsx`
- Formulario para definir nova senha
- Validacao de token
- Confirmacao de senha

---

## Fase 6: Funcionalidades do Chat

### 6.1 Implementar upload de imagens no Chat
- Botao de anexar imagem funcional
- Upload para Supabase Storage
- Preview da imagem antes de enviar
- Integracao com IA para analise de fotos

### 6.2 Atualizar Edge Function chat-with-ai
- Usar modelo Gemini 2.5 Flash
- Suporte a imagens
- Historico de contexto
- Respostas mais naturais

---

## Fase 7: Sistema de Gamificacao

### 7.1 Criar componente de Missoes Semanais
Arquivo: `src/components/dashboard/WeeklyMissions.tsx`
- Lista de missoes ativas
- Progresso de cada missao
- Recompensas em pontos
- Marcar como concluida

### 7.2 Criar componente de Insignias
Arquivo: `src/components/dashboard/Badges.tsx`
- Exibicao de conquistas
- Insignias bloqueadas/desbloqueadas
- Animacao ao desbloquear
- Historico de conquistas

### 7.3 Implementar logica de pontuacao
- Pontos por treino concluido
- Pontos por dias seguidos
- Pontos por metas atingidas
- Sistema de niveis

---

## Fase 8: Lista de Compras

### 8.1 Criar pagina Lista de Compras
Arquivo: `src/pages/ShoppingList.tsx`
- Lista agregada de ingredientes
- Adicionar de receitas
- Marcar itens comprados
- Exportar/compartilhar lista

---

## Fase 9: Integracao do Layout

### 9.1 Atualizar todas as paginas com Layout
- Dashboard com Sidebar
- Exercises com Sidebar
- Recipes com Sidebar
- Chat com Sidebar
- Settings com Sidebar
- Calendar com Sidebar
- Progress com Sidebar
- Profile com Sidebar

### 9.2 Criar Layout Admin
Arquivo: `src/components/layout/AdminLayout.tsx`
- Layout especifico para area admin
- AdminSidebar integrado
- Header admin

---

## Fase 10: Rotas Finais

### 10.1 Atualizar App.tsx
```typescript
// Rotas publicas
<Route path="/" element={<Index />} />
<Route path="/auth" element={<Auth />} />
<Route path="/reset-password" element={<ResetPassword />} />

// Rotas protegidas (usuarios)
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
<Route path="/exercise/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
<Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
<Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
<Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
<Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
<Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
<Route path="/shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />

// Rotas protegidas (admin only)
<Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
<Route path="/admin/users" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
<Route path="/admin/exercises" element={<ProtectedRoute adminOnly><ExerciseManagement /></ProtectedRoute>} />
<Route path="/admin/recipes" element={<ProtectedRoute adminOnly><RecipeManagement /></ProtectedRoute>} />
```

---

## Fase 11: Dados Iniciais

### 11.1 Popular tabela de exercicios
- 20 exercicios Modulo Casa (sem equipamento)
- 20 exercicios Modulo Avancado (com acompanhamento)
- Cada um com: titulo, descricao, instrucoes, beneficios, contraindicacoes, observacoes, URL YouTube, grupos musculares

### 11.2 Popular tabela de receitas
- Receitas para emagrecimento
- Receitas para ganho de massa
- Receitas vegetarianas/veganas
- Receitas low carb/keto

---

## Resumo de Arquivos a Criar/Modificar

### Novos Arquivos:
1. `src/contexts/AuthContext.tsx`
2. `src/hooks/useAuth.tsx`
3. `src/components/auth/ProtectedRoute.tsx`
4. `src/pages/ResetPassword.tsx`
5. `src/pages/Calendar.tsx`
6. `src/pages/Progress.tsx`
7. `src/pages/Profile.tsx`
8. `src/pages/ExerciseDetail.tsx`
9. `src/pages/RecipeDetail.tsx`
10. `src/pages/ShoppingList.tsx`
11. `src/pages/admin/AdminDashboard.tsx`
12. `src/pages/admin/UserManagement.tsx`
13. `src/pages/admin/ExerciseManagement.tsx`
14. `src/pages/admin/RecipeManagement.tsx`
15. `src/components/layout/AdminSidebar.tsx`
16. `src/components/layout/AdminLayout.tsx`
17. `src/components/dashboard/WeeklyMissions.tsx`
18. `src/components/dashboard/Badges.tsx`

### Arquivos a Modificar:
1. `src/pages/Auth.tsx` - Adicionar esqueci senha
2. `src/pages/Dashboard.tsx` - Integrar Layout, gamificacao
3. `src/pages/Chat.tsx` - Upload de imagens funcional
4. `src/pages/Exercises.tsx` - Integrar Layout
5. `src/pages/Recipes.tsx` - Integrar Layout, lista de compras
6. `src/pages/Settings.tsx` - Integrar Layout
7. `src/components/layout/Sidebar.tsx` - Adicionar indicador admin
8. `src/App.tsx` - Adicionar todas as rotas
9. `supabase/functions/chat-with-ai/index.ts` - Melhorar integracao

### Migracoes SQL:
1. Criar tabela user_roles com enum
2. Atualizar trigger handle_new_user
3. Limpar usuarios existentes
4. Adicionar politicas RLS para admin

---

## Ordem de Implementacao

1. **Migracao SQL** - user_roles, limpeza de usuarios
2. **AuthContext e hooks** - Base de autenticacao
3. **Auth.tsx atualizado** - Esqueci senha
4. **ResetPassword.tsx** - Pagina de reset
5. **ProtectedRoute** - Protecao de rotas
6. **Paginas admin** - Dashboard, gestao
7. **Paginas usuario** - Calendar, Progress, Profile
8. **Paginas detalhes** - ExerciseDetail, RecipeDetail
9. **Chat melhorado** - Upload de imagens
10. **Gamificacao** - Missoes, insignias
11. **Lista de compras** - ShoppingList
12. **Integracao Layout** - Todas as paginas
13. **Dados iniciais** - Exercicios e receitas
14. **App.tsx final** - Todas as rotas

---

## Preparacao para Stripe (Futuro)

A estrutura esta pronta para integracao Stripe:
- Tabela `subscribers` com campos para Stripe
- RLS configurado para edge functions
- Pagina de assinatura em Settings
- Estrutura para checkout e webhooks
