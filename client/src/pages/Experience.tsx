import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, Video, Mic, ExternalLink } from "lucide-react";

export default function Experience() {
    // Mock data
    const posts = [
        {
            id: 1,
            title: "Pipeline Auto-prompt avec Claude 3.5",
            summary: "Comment j'ai automatisé la génération de prompts pour le projet Declics.",
            type: "notebook",
            tags: ["R&D", "LLM", "Automation"],
            date: "20 Nov 2024",
            mediaUrl: "https://notebooklm.google.com/..."
        },
        {
            id: 2,
            title: "Retour d'expérience: Vibe Coding",
            summary: "Podcast sur l'utilisation de l'IA pour coder sans être développeur.",
            type: "podcast",
            tags: ["Methodology", "AI"],
            date: "18 Nov 2024",
            mediaUrl: "#"
        },
        {
            id: 3,
            title: "Génération Vidéo Cohérente",
            summary: "Démonstration technique de consistance des personnages.",
            type: "video",
            tags: ["Video Gen", "Stable Diffusion"],
            date: "15 Nov 2024",
            mediaUrl: "#"
        }
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'notebook': return <BookOpen className="h-4 w-4" />;
            case 'video': return <Video className="h-4 w-4" />;
            case 'podcast': return <Mic className="h-4 w-4" />;
            default: return <BookOpen className="h-4 w-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Expérience & R&D</h1>
                    <p className="text-xl text-gray-400">
                        Veille technologique, tutoriels et retours d'expérience.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors p-6 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700 flex items-center gap-2">
                                        {getIcon(post.type)}
                                        <span className="capitalize">{post.type}</span>
                                    </Badge>
                                    <span className="text-xs text-zinc-500">{post.date}</span>
                                </div>

                                <h3 className="text-xl font-bold mb-2 text-white">{post.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 flex-grow">
                                    {post.summary}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href={post.mediaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-medium text-white hover:text-blue-400 transition-colors mt-auto"
                                >
                                    Voir le contenu <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
