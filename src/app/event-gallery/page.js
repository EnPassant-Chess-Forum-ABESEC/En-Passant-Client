"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccordionGallery from "@/components/AccordionGallery";
import DepthCarousel from "@/components/DepthCarousel";
import Masonry from "@/components/Masonry";

const EVENTS = [
  {
    id: "event-1",
    label: "ACC",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    galleryImages: [
      { id: 1, img: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=600", height: 800 },
      { id: 2, img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=600", height: 600 },
      { id: 3, img: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=600", height: 900 },
      { id: 4, img: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=600", height: 500 },
      { id: 5, img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=600", height: 700 },
    ]
  },
  {
    id: "event-2",
    label: "Knightmares 1.0",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    galleryImages: [
      { id: 1, img: "https://images.unsplash.com/photo-1509423654408-2e06c57f2022?q=80&w=600", height: 700 },
      { id: 2, img: "https://images.unsplash.com/photo-1560170425-450f34b22c74?q=80&w=600", height: 800 },
      { id: 3, img: "https://images.unsplash.com/photo-1610626359546-24e5421d09e5?q=80&w=600", height: 500 },
      { id: 4, img: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=600", height: 900 },
    ]
  },
  {
    id: "event-3",
    label: "Knightmares 2.0",
    image: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2070&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    galleryImages: [
      { id: 1, img: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=600", height: 800 },
      { id: 2, img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=600", height: 600 },
      { id: 3, img: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=600", height: 700 },
      { id: 4, img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=600", height: 850 },
    ]
  },
  {
    id: "event-4",
    label: "HCC",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    galleryImages: [
      { id: 1, img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=600", height: 600 },
      { id: 2, img: "https://images.unsplash.com/photo-1509423654408-2e06c57f2022?q=80&w=600", height: 900 },
      { id: 3, img: "https://images.unsplash.com/photo-1560170425-450f34b22c74?q=80&w=600", height: 750 },
      { id: 4, img: "https://images.unsplash.com/photo-1610626359546-24e5421d09e5?q=80&w=600", height: 800 },
    ]
  },
  {
    id: "event-5",
    label: "Zonals 3",
    image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    galleryImages: [
      { id: 1, img: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=600", height: 800 },
      { id: 2, img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=600", height: 600 },
      { id: 3, img: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=600", height: 900 },
      { id: 4, img: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=600", height: 500 },
    ]
  },
  {
    id: "event-6",
    label: "Sheh Mat",
    image: "https://images.unsplash.com/photo-1509423654408-2e06c57f2022?q=80&w=2070&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    galleryImages: [
      { id: 1, img: "https://images.unsplash.com/photo-1509423654408-2e06c57f2022?q=80&w=600", height: 700 },
      { id: 2, img: "https://images.unsplash.com/photo-1560170425-450f34b22c74?q=80&w=600", height: 800 },
      { id: 3, img: "https://images.unsplash.com/photo-1610626359546-24e5421d09e5?q=80&w=600", height: 500 },
      { id: 4, img: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=600", height: 900 },
    ]
  },
  {
    id: "event-7",
    label: "Other Events",
    image: "https://images.unsplash.com/photo-1610626359546-24e5421d09e5?q=80&w=2070&auto=format&fit=crop",
    driveLink: "https://drive.google.com",
    galleryImages: [
      { id: 1, img: "https://images.unsplash.com/photo-1610626359546-24e5421d09e5?q=80&w=600", height: 700 },
      { id: 2, img: "https://images.unsplash.com/photo-1560170425-450f34b22c74?q=80&w=600", height: 800 },
      { id: 3, img: "https://images.unsplash.com/photo-1509423654408-2e06c57f2022?q=80&w=600", height: 500 },
      { id: 4, img: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=600", height: 900 },
    ]
  }
];

export default function EventGalleryPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const masonryRef = useRef(null);

  const handleItemClick = (item) => {
    if (selectedEvent?.id !== item.id) {
      setSelectedEvent(item);
    }
    
    setTimeout(() => {
      if (masonryRef.current) {
        masonryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleItemSelect = (item) => {
    if (selectedEvent?.id !== item.id) {
      setSelectedEvent(item);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 font-sans relative overflow-x-hidden">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#9b1a1a]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#c41e3a]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold tracking-widest uppercase mb-4 text-white drop-shadow-2xl">
            Events <span className="text-[#9b1a1a]">Gallery</span>
          </h1>
          <p className="text-white/60 font-inter max-w-2xl mx-auto tracking-wide text-sm md:text-base">
            Explore our past events, tournaments, and community gatherings. Click on an event to view its full gallery, or use the external link icon to access original drive files.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Desktop View */}
          <div className="hidden md:block">
            <AccordionGallery 
              items={EVENTS}
              onItemClick={handleItemClick}
              accentColor="#9b1a1a"
              height={500}
              defaultIndex={0}
            />
          </div>

          {/* Mobile View */}
          <div className="block md:hidden h-[450px]">
            <DepthCarousel 
              items={EVENTS}
              onChange={(index, item) => handleItemSelect(item)}
              onCardClick={(index, item) => handleItemClick(item)}
              cardWidth={260}
              cardHeight={340}
              autoplay={false}
              showControls={true}
              showIndicators={true}
              tiltDirection="left"
            />
          </div>
        </motion.div>

        <div ref={masonryRef} className="mt-24 min-h-[500px] pt-12 scroll-mt-24">
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
                  <h2 className="font-cinzel text-3xl font-bold tracking-wider uppercase text-white">
                    {selectedEvent.label} <span className="text-white/40 text-xl font-normal">Photos</span>
                  </h2>
                </div>
                
                <div className="relative w-full">
                  <Masonry 
                    items={selectedEvent.galleryImages}
                    animateFrom="bottom"
                    blurToFocus={true}
                    scaleOnHover={true}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
              >
                <p className="text-white/40 font-inter tracking-widest uppercase text-sm">
                  Click on an event above to view its gallery
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
