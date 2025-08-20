import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface VariantImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface ImageModalProps {
  images: VariantImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, initialIndex, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
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

  if (!isOpen || sortedImages.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-black/95 border-0 sm:max-w-[95vw] sm:max-h-[95vh]">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Main image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
            <img
              src={sortedImages[currentIndex]?.imageUrl}
              alt="Product image"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation arrows - only show if more than one image */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Dot indicators - only show if more than one image */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
              {sortedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail strip for desktop - only show if more than one image */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-16 left-1/2 -translate-x-1/2 hidden md:flex gap-2 max-w-sm lg:max-w-md overflow-x-auto px-4">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 border-2 rounded overflow-hidden transition-colors ${
                    index === currentIndex
                      ? 'border-white'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;