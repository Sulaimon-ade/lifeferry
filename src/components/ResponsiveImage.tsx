import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'auto' | 'video' | 'square' | 'portrait';
}

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'auto',
}: ResponsiveImageProps) {
  const [imageOrientation, setImageOrientation] = useState<'portrait' | 'landscape' | 'square'>('landscape');
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;

    if (ratio < 0.95) {
      setImageOrientation('portrait');
    } else if (ratio > 1.05) {
      setImageOrientation('landscape');
    } else {
      setImageOrientation('square');
    }
    setIsLoaded(true);
  };

  // Define container aspect ratios
  const getContainerClass = () => {
    if (aspectRatio === 'video') return 'aspect-video';
    if (aspectRatio === 'square') return 'aspect-square';
    if (aspectRatio === 'portrait') return 'aspect-[3/4]';
    return 'w-full h-full';
  };

  // Define image max-width based on orientation
  const getImageSizeClass = () => {
    if (imageOrientation === 'portrait') {
      // Portrait: smaller width on mobile, medium on desktop
      return 'max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] max-h-full';
    } else if (imageOrientation === 'landscape') {
      // Landscape: fill container width but constrain height
      return 'max-w-full max-h-full w-auto h-auto';
    } else {
      // Square: balanced sizing
      return 'max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px] max-h-full';
    }
  };

  return (
    <div className={`bg-gray-100 flex items-center justify-center overflow-hidden ${getContainerClass()} ${containerClassName}`}>
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className={`object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${getImageSizeClass()} ${className}`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
