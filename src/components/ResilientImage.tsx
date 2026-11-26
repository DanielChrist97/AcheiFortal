import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  title: string;
  className?: string;
}

export function ResilientImage({ src, alt, title, className = '' }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#ECE9E0] via-[#F4F2EC] to-[#E2E8E4] text-[#334155] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <MapPin className="w-6 h-6 text-[#0B8457] mb-2" aria-hidden="true" />
        <span className="text-sm font-medium text-[#0F1D2E] max-w-[22ch] line-clamp-2">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
