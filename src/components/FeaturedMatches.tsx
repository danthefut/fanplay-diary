
import React from 'react';
import MatchCard, { MatchCardProps } from './MatchCard';
import { Trophy } from 'lucide-react';

interface FeaturedMatchesProps {
  matches: MatchCardProps[];
}

const FeaturedMatches = ({ matches }: FeaturedMatchesProps) => {
  return (
    <section className="py-8">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold">Featured Matches</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} {...match} isFeatured={true} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMatches;
