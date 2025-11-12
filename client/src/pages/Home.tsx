import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Linkedin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: videos } = trpc.videos.list.useQuery();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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

  // Update video source when index changes with preload
  useEffect(() => {
    if (videoRef.current && videos && videos[currentVideoIndex]) {
      setIsVideoLoaded(false);
      const video = videoRef.current;
      video.src = videos[currentVideoIndex].videoUrl;
      video.load();
      
      // Wait for video to be ready before playing
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
        video.play().catch(console.error);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [currentVideoIndex, videos]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background - Fullscreen with optimization */}
      {videos && videos.length > 0 ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          style={{ opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      )}
      
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content - Centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <h1 className="text-7xl md:text-9xl font-bold text-white mb-8 tracking-tight">
          Jenia
        </h1>
      </div>

      {/* Social Links - Bottom Left */}
      <div className="absolute bottom-8 left-8 flex gap-4 z-20">
        <a
          href="https://www.linkedin.com/in/charleshenrimarrauddesgrottes/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-6 h-6 text-white" />
        </a>
        <a
          href="mailto:studio.jenia@gmail.com"
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
          aria-label="Contact Email"
        >
          <Mail className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Admin link - Top Right */}
      {isAuthenticated && user?.role === 'admin' && (
        <Link href="/admin">
          <button className="absolute top-8 right-8 text-white/50 hover:text-white text-sm transition-colors z-20">
            Admin
          </button>
        </Link>
      )}

      {/* Video navigation dots - Bottom Center */}
      {videos && videos.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentVideoIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Vidéo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
