import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/components/ui/use-toast";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  fileKey: string;
  duration: number | null;
  displayOrder: number;
  isActive: boolean;
}

interface AddVideoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormData: VideoFormData = {
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
  fileKey: "",
  duration: null,
  displayOrder: 0,
  isActive: true,
};

export function AddVideoModal({ open, onClose, onSuccess }: AddVideoModalProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VideoFormData>(initialFormData);

  const createVideo = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Vidéo ajoutée",
      });
      setFormData({ ...initialFormData });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier vidéo",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Ask the backend for a signed Supabase upload URL (service role, no size limit)
      const urlResponse = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!urlResponse.ok) {
        const errorText = await urlResponse.text();
        throw new Error(errorText || "Impossible de préparer l'upload");
      }

      const { uploadUrl, key, publicUrl } = await urlResponse.json();

      // Ensure we always upload straight to Supabase (never through /api on Vercel)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      if (!supabaseUrl) {
        throw new Error("VITE_SUPABASE_URL manquant pour l'upload direct");
      }

      const supabaseBase = new URL(supabaseUrl);
      const resolvedUploadUrl = new URL(uploadUrl, supabaseBase);

      if (resolvedUploadUrl.hostname !== supabaseBase.hostname) {
        throw new Error("URL de téléchargement non Supabase");
      }

      // Upload directly to Supabase using the signed URL to bypass Vercel file size limits
      const uploadResponse = await fetch(resolvedUploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(
          errorText || "Upload Supabase échoué. Vérifiez la taille ou la connexion."
        );
      }

      setFormData((prev) => ({
        ...prev,
        videoUrl: publicUrl,
        fileKey: key,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));

      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = function () {
        setFormData((prev) => ({
          ...prev,
          duration: Math.round(video.duration),
        }));
        window.URL.revokeObjectURL(video.src);
      };
      video.onerror = function () {
        window.URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);

      toast({
        title: "Succès",
        description: "Vidéo uploadée vers Supabase",
      });
    } catch (error: any) {
      setUploadError(error?.message ?? "Échec de l'upload");
      toast({
        title: "Erreur",
        description: error?.message ?? "Échec de l'upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.videoUrl || !formData.fileKey) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord uploader une vidéo",
        variant: "destructive",
      });
      return;
    }

    createVideo.mutate({
      ...formData,
      description: formData.description || null,
      thumbnailUrl: formData.thumbnailUrl || null,
      duration: formData.duration ?? null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une vidéo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Fichier vidéo *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                disabled={uploading || createVideo.isPending}
                className="cursor-pointer"
              />
              {formData.videoUrl && !uploading && (
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Upload direct vers Supabase en cours...
              </div>
            )}
            {uploadError && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                {uploadError}
              </div>
            )}
            {formData.videoUrl && (
              <p className="text-xs text-green-500">
                ✓ Vidéo uploadée : {formData.fileKey}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={createVideo.isPending}
              placeholder="Titre de la vidéo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={createVideo.isPending}
              placeholder="Description (optionnelle)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">URL de la miniature</Label>
            <Input
              id="thumbnailUrl"
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://..."
              disabled={createVideo.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (secondes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: e.target.value ? Number(e.target.value) : null,
                  })
                }
                disabled={createVideo.isPending}
                placeholder="Auto-détecté"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Ordre d'affichage</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: Number(e.target.value),
                  })
                }
                disabled={createVideo.isPending}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              disabled={createVideo.isPending}
              className="h-4 w-4"
            />
            <Label htmlFor="isActive" className="!mt-0">
              Active
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createVideo.isPending || uploading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createVideo.isPending || uploading || !formData.videoUrl}
              className="bg-green-600 hover:bg-green-700"
            >
              {createVideo.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
