import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'auto' | 'video' | 'square' | 'portrait';
  /**
   * cover (default): fill the container, cropping as needed — right for
   * photography. contain: letterbox inside the container — right for
   * posters, flyers, and documents where cropping loses information.
   */
  fit?: 'cover' | 'contain';
}

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'auto',
  fit = 'cover',
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const getContainerClass = () => {
    if (aspectRatio === 'video') return 'aspect-video';
    if (aspectRatio === 'square') return 'aspect-square';
    if (aspectRatio === 'portrait') return 'aspect-[3/4]';
    return 'w-full h-full';
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gray-100 ${getContainerClass()} ${containerClassName}`}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`h-full w-full transition-opacity duration-300 ${
          fit === 'contain' ? 'object-contain' : 'object-cover'
        } ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
