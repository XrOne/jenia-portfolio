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
import { Loader2 } from "lucide-react";
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

export function AddVideoModal({ open, onClose, onSuccess }: AddVideoModalProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState<VideoFormData>({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        fileKey: "",
        duration: null,
        displayOrder: 0,
        isActive: true,
    });

    const createVideo = trpc.videos.create.useMutation({
        onSuccess: () => {
            toast({
                title: "Succès",
                description: "Vidéo ajoutée avec succès",
            });
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                title: "",
                description: "",
                videoUrl: "",
                thumbnailUrl: "",
                fileKey: "",
                duration: null,
                displayOrder: 0,
                isActive: true,
            });
        },
        onError: (error) => {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createVideo.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Ajouter une vidéo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            disabled={createVideo.isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={createVideo.isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="videoUrl">URL de la vidéo *</Label>
                        <Input
                            id="videoUrl"
                            type="url"
                            value={formData.videoUrl}
                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            placeholder="https://..."
                            required
                            disabled={createVideo.isPending}
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

                    <div className="space-y-2">
                        <Label htmlFor="fileKey">Clé du fichier *</Label>
                        <Input
                            id="fileKey"
                            value={formData.fileKey}
                            onChange={(e) => setFormData({ ...formData, fileKey: e.target.value })}
                            placeholder="video_123"
                            required
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
                                onChange={(e) => setFormData({
                                    ...formData,
                                    duration: e.target.value ? Number(e.target.value) : null
                                })}
                                disabled={createVideo.isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="displayOrder">Ordre d'affichage</Label>
                            <Input
                                id="displayOrder"
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    displayOrder: Number(e.target.value)
                                })}
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
                        <Label htmlFor="isActive" className="!mt-0">Active</Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={createVideo.isPending}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={createVideo.isPending}>
                            {createVideo.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ajouter
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
