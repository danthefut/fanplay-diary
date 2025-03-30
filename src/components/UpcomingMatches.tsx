
import React from 'react';
import MatchCard, { MatchCardProps } from './MatchCard';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UpcomingMatchesProps {
  matches: MatchCardProps[];
}

const UpcomingMatches = ({ matches }: UpcomingMatchesProps) => {
  return (
    <section className="py-8 bg-muted/50">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Upcoming Matches</h2>
          </div>
          <Link to="/matches">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} {...match} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingMatches;
