import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Linkedin, Mail, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: videos } = trpc.videos.list.useQuery();
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload next video
  useEffect(() => {
    if (videos && videos.length > 1 && nextVideoRef.current) {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      nextVideoRef.current.src = videos[nextIndex].videoUrl;
      nextVideoRef.current.load();
    }
  }, [currentVideoIndex, videos]);

  // Auto-play and loop through videos
  useEffect(() => {
    if (videos && videos.length > 0 && videoRef.current) {
      const handleVideoEnd = () => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
          setIsTransitioning(false);
        }, 300);
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
      setIsVideoLoaded(false);
      const video = videoRef.current;
      video.src = videos[currentVideoIndex].videoUrl;
      video.load();
      
      // Wait for video to be ready before playing
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
        video.play().catch(console.error);
      };
      
      const handleLoadedData = () => {
        setIsVideoLoaded(true);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [currentVideoIndex, videos]);

  const handleVideoChange = (index: number) => {
    if (index !== currentVideoIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background - Fullscreen with optimization */}
      {videos && videos.length > 0 ? (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            style={{ 
              opacity: isVideoLoaded && !isTransitioning ? 1 : 0, 
              transition: 'opacity 0.5s ease-in-out' 
            }}
          />
          {/* Hidden video element for preloading next video */}
          <video
            ref={nextVideoRef}
            className="hidden"
            preload="auto"
            muted
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      )}
      
      {/* Loading indicator */}
      {!isVideoLoaded && videos && videos.length > 0 && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
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
              onClick={() => handleVideoChange(index)}
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
