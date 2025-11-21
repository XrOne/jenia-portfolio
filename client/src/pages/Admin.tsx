import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { LoginForm } from "@/components/LoginForm";
import { AddVideoModal } from "@/components/AddVideoModal";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Video, Briefcase, FileText, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("videos");
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  // Queries
  const { data: videos, refetch: refetchVideos } = trpc.videos.listAll.useQuery();

  // Mutations
  const deleteVideo = trpc.videos.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Vidéo supprimée",
      });
      refetchVideos();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // Show login form if not authenticated or not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-md px-6">
          <div className="text-center text-white mb-8">
            <h1 className="text-3xl font-bold mb-4">Connexion Admin</h1>
            <p className="text-gray-400 mb-6">
              Connectez-vous avec vos identifiants Supabase
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            <p className="text-sm text-gray-400 mb-2">
              <strong className="text-white">Première fois ?</strong>
            </p>
            <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
              <li>Créez un utilisateur dans <a href="https://supabase.com/dashboard/project/dmqffcyiclqxqzfkdijy/auth/users" target="_blank" className="text-blue-400 hover:underline">Supabase Auth</a></li>
              <li>Exécutez: <code className="bg-zinc-800 px-1 rounded text-xs">UPDATE users SET role = 'admin' WHERE email = 'votre-email'</code></li>
              <li>Connectez-vous ici avec vos identifiants</li>
            </ol>
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
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowAddVideoModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une vidéo
                </Button>
              </CardHeader>
              <CardContent>
                {videos && videos.length > 0 ? (
                  <div className="space-y-2">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{video.title}</h3>
                          {video.description && (
                            <p className="text-gray-400 text-sm">{video.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Ordre: {video.displayOrder}</span>
                            {video.duration && <span>Durée: {video.duration}s</span>}
                            <span className={video.isActive ? "text-green-500" : "text-red-500"}>
                              {video.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Supprimer cette vidéo ?")) {
                              deleteVideo.mutate({ id: video.id });
                            }
                          }}
                          disabled={deleteVideo.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Aucune vidéo. Cliquez sur "Ajouter une vidéo" pour commencer.
                  </p>
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
    </div >
  );
}
