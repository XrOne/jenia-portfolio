import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Missions() {
    const { data: missions, isLoading } = trpc.missions.list.useQuery();

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Missions
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Projets clients et collaborations techniques.
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {missions?.map((mission, index) => (
                            <motion.div
                                key={mission.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/missions/${mission.id}`}>
                                    <Card className="group relative overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-300 cursor-pointer h-[400px]">
                                        {/* Background Image */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={mission.coverImageUrl || ""}
                                                alt={mission.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8">
                                            <div className="mb-2">
                                                <span className="text-xs font-medium tracking-wider uppercase text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                                    {mission.clientName}
                                                </span>
                                            </div>
                                            <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                                                {mission.title}
                                            </h3>
                                            <p className="text-gray-300 line-clamp-2 mb-6">
                                                {mission.description}
                                            </p>

                                            <div className="flex items-center text-sm font-medium text-white group-hover:translate-x-2 transition-transform">
                                                Voir les workflows <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
