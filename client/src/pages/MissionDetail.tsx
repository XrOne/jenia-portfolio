import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Code, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

import { trpc } from "@/lib/trpc";

export default function MissionDetail() {
    const [, params] = useRoute("/missions/:id");
    const id = params?.id ? parseInt(params.id) : undefined;

    const { data: mission, isLoading } = trpc.missions.getById.useQuery(
        { id: id! },
        { enabled: !!id }
    );

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-white" /></div>;
    if (!mission) return <div className="text-white text-center py-20">Mission introuvable</div>;

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4">
            <div className="container mx-auto max-w-5xl">
                <Link href="/missions">
                    <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux missions
                    </Button>
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
                        <img
                            src={mission.coverImageUrl || ""}
                            alt={mission.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <span className="text-blue-400 font-medium mb-2 block">{mission.clientName}</span>
                            <h1 className="text-4xl md:text-5xl font-bold text-white">{mission.title}</h1>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-xl text-gray-300 leading-relaxed">
                            {mission.description}
                        </p>
                    </div>
                </motion.div>

                {/* Workflows Section */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold border-b border-zinc-800 pb-4">Workflows & Démos</h2>

                    <div className="grid gap-6">
                        {mission.workflows?.map((workflow, index) => (
                            <motion.div
                                key={workflow.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-zinc-900 border-zinc-800 p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-white">{workflow.title}</h3>
                                                <div className="flex gap-2">
                                                    {workflow.toolsUsed?.split(',').map(tool => (
                                                        <span key={tool} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                                                            {tool.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-400 mb-4">{workflow.description}</p>

                                            <div className="flex gap-3">
                                                {workflow.demoUrl && (
                                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                                                        <a href={workflow.demoUrl} target="_blank" rel="noopener noreferrer">
                                                            <Play className="mr-2 h-4 w-4" /> Voir la démo
                                                        </a>
                                                    </Button>
                                                )}
                                                {workflow.codeSnippet && (
                                                    <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300">
                                                        <Code className="mr-2 h-4 w-4" /> Voir le code
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
