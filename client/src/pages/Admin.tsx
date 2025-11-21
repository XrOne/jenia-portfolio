import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Video, Briefcase, FileText, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("videos");

  // Redirect if not admin
  if (!isAuthLoading && (!user || user.role !== "admin")) {
    setLocation("/");
    return null;
  }

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
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
