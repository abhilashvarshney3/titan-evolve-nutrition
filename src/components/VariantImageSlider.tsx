import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageModal from './ImageModal';

interface VariantImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface VariantImageSliderProps {
  images: VariantImage[];
  className?: string;
}

const VariantImageSlider: React.FC<VariantImageSliderProps> = ({ 
  images, 
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  // Sort images by display order, with primary images first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        {/* Main Image */}
        <div 
          className="relative overflow-hidden rounded-lg bg-gray-900/80 aspect-square flex items-center justify-center p-4 cursor-pointer"
          onClick={openModal}
        >
          <img
            src={sortedImages[currentIndex]?.imageUrl}
            alt="Product variant"
            className="max-w-full max-h-full object-contain transition-all duration-300 hover:scale-105"
          />
          
          {/* Navigation Arrows - only show if more than 1 image */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails - only show if more than 1 image */}
        {sortedImages.length > 1 && (
          <div className="flex gap-2 mt-3 justify-center overflow-x-auto scrollbar-hide">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                  index === currentIndex
                    ? 'border-purple-500 shadow-md'
                    : 'border-gray-700 hover:border-purple-400'
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dots indicator for mobile */}
        {sortedImages.length > 1 && (
          <div className="flex justify-center gap-2 mt-2 md:hidden">
            {sortedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-purple-500'
                    : 'bg-gray-500 hover:bg-purple-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        images={sortedImages}
        initialIndex={currentIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default VariantImageSlider;