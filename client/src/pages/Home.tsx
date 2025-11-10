import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Play, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: videos, isLoading } = trpc.videos.list.useQuery();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Auto-play and loop through videos
  useEffect(() => {
    if (videos && videos.length > 0 && videoRef.current) {
      const handleVideoEnd = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      };
      
      const video = videoRef.current;
      video.addEventListener('ended', handleVideoEnd);
      
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [videos]);

  // Update video source when index changes
  useEffect(() => {
    if (videoRef.current && videos && videos[currentVideoIndex]) {
      videoRef.current.src = videos[currentVideoIndex].videoUrl;
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  }, [currentVideoIndex, videos]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        {videos && videos.length > 0 && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 animate-fade-in">
            Jenia
          </h1>
          <p className="text-xl md:text-2xl text-center mb-12 max-w-3xl text-gray-200 animate-fade-in animation-delay-200">
            De l'idée à l'animation : workflows complets de conception vidéo par intelligence artificielle
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in animation-delay-400">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary shadow-[0_0_20px_rgba(34,197,94,0.5)]"
              onClick={() => scrollToSection('demos')}
            >
              <Play className="mr-2 h-5 w-5" />
              Voir les démos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border-2 border-secondary shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              onClick={() => scrollToSection('process')}
            >
              Notre processus
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-accent shadow-[0_0_20px_rgba(251,146,60,0.5)]"
              onClick={() => scrollToSection('services')}
            >
              Nos services
            </Button>
          </div>

          {isAuthenticated && user?.role === 'admin' && (
            <div className="mt-8">
              <Link href="/admin">
                <Button variant="ghost" className="text-white/70 hover:text-white">
                  Accéder à l'admin
                </Button>
              </Link>
            </div>
          )}
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white/70" />
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <section id="demos" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Nos Démos</h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            Découvrez nos créations vidéo générées par IA
          </p>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-gray-800 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div key={video.id} className="group relative overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition-transform duration-300">
                  <video
                    src={video.videoUrl}
                    className="w-full aspect-video object-cover"
                    controls
                    poster={video.thumbnailUrl || undefined}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-gray-400 text-sm">{video.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Aucune démo disponible pour le moment.</p>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Notre Processus</h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            De la conception à la réalisation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Storyboard Client",
                description: "Réception et analyse du storyboard fourni par le client pour comprendre la vision créative."
              },
              {
                step: "02",
                title: "Entraînement Lora",
                description: "Entraînement de modèles Lora personnalisés avec les données du client : styles désirés, saisons de séries précédentes, éléments visuels."
              },
              {
                step: "03",
                title: "Workflow de Restylisation",
                description: "Conception d'un workflow sur mesure pour styliser les images du storyboard selon les besoins du projet."
              },
              {
                step: "04",
                title: "Validation Client",
                description: "Présentation des résultats et ajustements selon les retours du client."
              },
              {
                step: "05",
                title: "Animation",
                description: "Animation des images stylisées pour créer des séquences vidéo fluides et cohérentes."
              },
              {
                step: "06",
                title: "Post-production",
                description: "Choix des voix, sound design, et finalisation de la vidéo complète."
              }
            ].map((item, index) => (
              <div key={index} className="relative p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Nos Services</h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            Des solutions adaptées à vos besoins
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Test de Plans",
                description: "Générez des plans de test avant tournage pour valider vos idées visuelles.",
                features: ["Génération rapide", "Itérations illimitées", "Validation visuelle"],
                color: "primary"
              },
              {
                title: "Workflow Complet",
                description: "Solution clé en main du storyboard à la vidéo finale.",
                features: ["Entraînement Lora", "Animation complète", "Post-production"],
                color: "secondary"
              },
              {
                title: "R&D Spécifique",
                description: "Développement de solutions personnalisées pour vos projets uniques.",
                features: ["Recherche sur mesure", "Développement custom", "Support dédié"],
                color: "accent"
              }
            ].map((service, index) => (
              <div key={index} className={`p-8 bg-gray-800 rounded-lg border-2 border-${service.color} hover:shadow-[0_0_30px_rgba(var(--${service.color}),0.3)] transition-all`}>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <span className={`mr-2 text-${service.color}`}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full bg-${service.color} hover:bg-${service.color}/90 text-${service.color}-foreground`}>
                  En savoir plus
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-500">
          <p>&copy; 2025 Jenia. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
