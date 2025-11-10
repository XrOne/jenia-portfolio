import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, Upload, Loader2, Home, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

export default function Admin() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const { data: videos, isLoading, refetch } = trpc.videos.listAll.useQuery();
  const createVideo = trpc.videos.create.useMutation();
  const updateVideo = trpc.videos.update.useMutation();
  const deleteVideo = trpc.videos.delete.useMutation();

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleFileUpload = async (file: File, type: 'video' | 'thumbnail') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      return data;
    } catch (error) {
      toast.error('Erreur lors de l\'upload du fichier');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const videoFile = formData.get('videoFile') as File;
    const thumbnailFile = formData.get('thumbnailFile') as File;

    try {
      let videoUrl = editingVideo?.videoUrl;
      let thumbnailUrl = editingVideo?.thumbnailUrl;
      let fileKey = editingVideo?.fileKey;

      // Upload video if new file selected
      if (videoFile && videoFile.size > 0) {
        const videoData = await handleFileUpload(videoFile, 'video');
        videoUrl = videoData.url;
        fileKey = videoData.key;
      }

      // Upload thumbnail if new file selected
      if (thumbnailFile && thumbnailFile.size > 0) {
        const thumbnailData = await handleFileUpload(thumbnailFile, 'thumbnail');
        thumbnailUrl = thumbnailData.url;
      }

      const videoData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string || undefined,
        videoUrl: videoUrl!,
        thumbnailUrl: thumbnailUrl || undefined,
        fileKey: fileKey!,
        displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      };

      if (editingVideo) {
        await updateVideo.mutateAsync({
          id: editingVideo.id,
          ...videoData,
        });
        toast.success('Vidéo mise à jour avec succès');
      } else {
        await createVideo.mutateAsync(videoData);
        toast.success('Vidéo ajoutée avec succès');
      }

      setIsDialogOpen(false);
      setEditingVideo(null);
      refetch();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;

    try {
      await deleteVideo.mutateAsync({ id });
      toast.success('Vidéo supprimée avec succès');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingVideo(null);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Jenia - Administration</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Retour au site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Gestion des Vidéos</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingVideo(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une vidéo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingVideo ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingVideo?.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingVideo?.description}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoFile">
                      Fichier vidéo {!editingVideo && '*'}
                    </Label>
                    <Input
                      id="videoFile"
                      name="videoFile"
                      type="file"
                      accept="video/*"
                      required={!editingVideo}
                    />
                    {editingVideo?.videoUrl && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Vidéo actuelle : {editingVideo.videoUrl.split('/').pop()}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="thumbnailFile">Miniature</Label>
                    <Input
                      id="thumbnailFile"
                      name="thumbnailFile"
                      type="file"
                      accept="image/*"
                    />
                    {editingVideo?.thumbnailUrl && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Miniature actuelle : {editingVideo.thumbnailUrl.split('/').pop()}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="displayOrder">Ordre d'affichage</Label>
                    <Input
                      id="displayOrder"
                      name="displayOrder"
                      type="number"
                      defaultValue={editingVideo?.displayOrder || 0}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Upload en cours...
                        </>
                      ) : (
                        'Enregistrer'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="aspect-video bg-muted animate-pulse rounded mb-4" />
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <video
                    src={video.videoUrl}
                    className="w-full aspect-video object-cover"
                    controls
                    poster={video.thumbnailUrl || undefined}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(video)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucune vidéo</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter votre première vidéo
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une vidéo
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
