import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { SupabaseAuth } from "@/components/SupabaseAuth";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Video, Briefcase, FileText, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("videos");

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // Show setup instructions if not authenticated or not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-2xl px-6">
          <div className="text-center text-white mb-8">
            <h1 className="text-3xl font-bold mb-4">Configuration Admin Requise</h1>
            <p className="text-gray-400 mb-6">
              Pour accéder au dashboard admin, suivez ces étapes :
            </p>
          </div>

          <div className="space-y-6 text-white">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                Créer un Utilisateur dans Supabase
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-10">
                <li>Allez sur <a href="https://supabase.com/dashboard/project/dmqffcyiclqxqzfkdijy/auth/users" target="_blank" className="text-blue-400 hover:underline">Supabase Dashboard → Authentication → Users</a></li>
                <li>Cliquez "Add user" → "Create new user"</li>
                <li>Entrez votre email et mot de passe</li>
                <li>Cochez "Auto Confirm User"</li>
                <li>Cliquez "Create user"</li>
              </ol>
            </div>

            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                Attribuer le Rôle Admin
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-10">
                <li>Allez sur <a href="https://supabase.com/dashboard/project/dmqffcyiclqxqzfkdijy/sql/new" target="_blank" className="text-blue-400 hover:underline">Supabase Dashboard → SQL Editor</a></li>
                <li>Exécutez ce SQL :</li>
              </ol>
              <pre className="mt-3 bg-black p-4 rounded border border-zinc-700 text-sm overflow-x-auto">
                {`UPDATE users 
SET role = 'admin' 
WHERE email = 'votre-email@gmail.com';`}
              </pre>
            </div>

            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                Se Connecter
              </h2>
              <p className="text-gray-300 ml-10">
                Une fois configuré, rechargez cette page et vous aurez accès au dashboard.
              </p>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Guide complet : <code className="bg-zinc-800 px-2 py-1 rounded">GUIDE_ADMIN_SETUP.md</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Connecté en tant que {user?.email}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="videos" className="data-[state=active]:bg-zinc-800">
              <Video className="mr-2 h-4 w-4" /> Vidéos
            </TabsTrigger>
            <TabsTrigger value="missions" className="data-[state=active]:bg-zinc-800">
              <Briefcase className="mr-2 h-4 w-4" /> Missions
            </TabsTrigger>
            <TabsTrigger value="workflows" className="data-[state=active]:bg-zinc-800">
              <FileText className="mr-2 h-4 w-4" /> Workflows
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-zinc-800">
              <Lightbulb className="mr-2 h-4 w-4" /> Expérience (R&D)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Gestion des Vidéos</CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une vidéo
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Gérez ici les vidéos de fond et les clips du portfolio.
                </p>
                {/* Video List Component would go here */}
                <div className="mt-4 p-4 border border-dashed border-zinc-700 rounded-lg text-center text-zinc-500">
                  Composant de liste des vidéos existant à réintégrer
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missions" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Missions Clients</CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Nouvelle Mission
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Gérez les projets clients (Declics, L'Oréal, etc).
                </p>
                <div className="mt-4 p-4 border border-dashed border-zinc-700 rounded-lg text-center text-zinc-500">
                  Liste des missions (À implémenter)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Workflows & Démos</CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Nouveau Workflow
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Ajoutez des workflows techniques liés aux missions.
                </p>
                <div className="mt-4 p-4 border border-dashed border-zinc-700 rounded-lg text-center text-zinc-500">
                  Liste des workflows (À implémenter)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Expérience & R&D</CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Nouvel Article/Média
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Publiez des notebooks, podcasts ou vidéos de veille.
                </p>
                <div className="mt-4 p-4 border border-dashed border-zinc-700 rounded-lg text-center text-zinc-500">
                  Liste des contenus R&D (À implémenter)
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
