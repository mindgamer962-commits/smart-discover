import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  cta?: string;
}

interface BannerSliderProps {
  banners: Banner[];
  autoPlayInterval?: number;
}

export function BannerSlider({ banners, autoPlayInterval = 4000 }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [banners.length, autoPlayInterval]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div className="relative aspect-[2/1] md:aspect-[3/1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={banners[currentIndex].image}
              alt={banners[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent flex items-center">
              <div className="px-6 md:px-12 text-card max-w-md">
                <h2 className="text-xl md:text-3xl font-bold mb-2">
                  {banners[currentIndex].title}
                </h2>
                {banners[currentIndex].subtitle && (
                  <p className="text-sm md:text-base opacity-90 mb-4">
                    {banners[currentIndex].subtitle}
                  </p>
                )}
                {banners[currentIndex].cta && (
                  <button className="px-4 py-2 bg-card text-foreground font-medium rounded-lg hover:bg-card/90 transition-colors">
                    {banners[currentIndex].cta}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-card w-6"
                  : "bg-card/50 hover:bg-card/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
