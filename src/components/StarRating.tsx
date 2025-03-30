
import React, { useState } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

const StarRating = ({
  initialRating = 0,
  onChange,
  size = 'md',
  readOnly = false,
  className
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const iconSize = sizes[size];
  
  const handleClick = (index: number, half: boolean) => {
    if (readOnly) return;
    
    const newRating = half ? index + 0.5 : index + 1;
    setRating(newRating);
    onChange?.(newRating);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readOnly) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const half = x < rect.width / 2;
    
    setHoverRating(half ? index + 0.5 : index + 1);
  };
  
  const handleMouseLeave = () => {
    if (readOnly) return;
    
    setHoverRating(0);
  };
  
  const renderStar = (index: number) => {
    const currentRating = hoverRating || rating;
    const filled = currentRating >= index + 1;
    const halfFilled = currentRating === index + 0.5;
    
    if (filled) {
      return <Star key={index} className={cn(iconSize, "fill-accent")} />;
    } else if (halfFilled) {
      return <StarHalf key={index} className={cn(iconSize, "fill-accent")} />;
    } else {
      return <StarOff key={index} className={cn(iconSize, "text-muted")} />;
    }
  };
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={cn("cursor-pointer", readOnly && "cursor-default")}
          onClick={() => handleClick(index, false)}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={handleMouseLeave}
        >
          {renderStar(index)}
        </div>
      ))}
      {!readOnly && (
        <span className="ml-2 text-sm font-medium">
          {hoverRating || rating || '0'}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
