
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, StarHalf } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

export interface MatchCardProps {
  id: string;
  homeTeam: {
    name: string;
    logo?: string;
    score: number;
  };
  awayTeam: {
    name: string;
    logo?: string;
    score: number;
  };
  date: string;
  competition: string;
  status: 'upcoming' | 'live' | 'finished';
  averageRating?: number;
  isFeatured?: boolean;
}

const MatchCard = ({
  id,
  homeTeam,
  awayTeam,
  date,
  competition,
  status,
  averageRating,
  isFeatured = false
}: MatchCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-muted">Upcoming</Badge>;
      case 'live':
        return <Badge variant="destructive" className="animate-pulse-soft">LIVE</Badge>;
      case 'finished':
        return <Badge variant="secondary">Finished</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-accent" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-accent" />);
    }
    
    return stars;
  };

  return (
    <Link to={`/match/${id}`}>
      <div className={cn("match-card", isFeatured && "match-card-featured")}>
        {isFeatured && (
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-2 py-1">
            Featured
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {competition}
            </Badge>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col items-center">
              <div className="team-badge mb-2">
                {homeTeam.logo ? (
                  <img src={homeTeam.logo} alt={homeTeam.name} className="w-full h-full object-contain" />
                ) : (
                  homeTeam.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <span className="text-sm font-medium text-center">{homeTeam.name}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-2xl font-bold">{status !== 'upcoming' ? homeTeam.score : ''}</span>
              <span className="text-2xl font-bold px-2">{status !== 'upcoming' ? '-' : 'vs'}</span>
              <span className="text-2xl font-bold">{status !== 'upcoming' ? awayTeam.score : ''}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="team-badge mb-2">
                {awayTeam.logo ? (
                  <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-contain" />
                ) : (
                  awayTeam.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <span className="text-sm font-medium text-center">{awayTeam.name}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            {averageRating && (
              <div className="star-rating">
                {renderStars(averageRating)}
                <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
