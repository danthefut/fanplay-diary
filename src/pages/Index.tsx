
import React from 'react';
import Navbar from '@/components/Navbar';
import FeaturedMatches from '@/components/FeaturedMatches';
import UpcomingMatches from '@/components/UpcomingMatches';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { featuredMatches, upcomingMatches, liveMatches } from '@/data/mockData';
import { Link } from 'react-router-dom';

const Index = () => {
  const allLiveAndFeatured = [...liveMatches, ...featuredMatches.slice(0, 3 - liveMatches.length)];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <section className="relative bg-field-gradient py-16 md:py-24">
        <div className="absolute inset-0 bg-stadium-pattern opacity-10"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Rate, Discuss, and Celebrate Football Matches</h1>
            <p className="text-white/90 text-lg mb-8">Join the community of passionate football fans. Share your thoughts on matches, follow your favorite teams, and discover the most exciting games.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Trophy className="mr-2 h-5 w-5" />
                  Join FanPlay
                </Button>
              </Link>
              <Link to="/matches">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Matches
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured matches section */}
      <FeaturedMatches matches={allLiveAndFeatured} />
      
      {/* Upcoming matches section */}
      <UpcomingMatches matches={upcomingMatches} />
      
      {/* App features */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">The Ultimate Platform for Football Fans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate Matches</h3>
              <p className="text-muted-foreground">Give ratings from 1-5 stars and share your thoughts on any football match worldwide.</p>
            </div>
            
            <div className="p-6 border rounded-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join the Community</h3>
              <p className="text-muted-foreground">Connect with fellow fans, share your opinions, and discover top-rated matches.</p>
            </div>
            
            <div className="p-6 border rounded-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your History</h3>
              <p className="text-muted-foreground">Build your profile, showcase your favorite team, and keep a record of matches you've rated.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-team-primary text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Trophy className="h-6 w-6 text-accent" />
              <span className="font-bold text-xl">FanPlay</span>
            </div>
            
            <div className="flex gap-8">
              <Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
              <Link to="/matches" className="text-white/70 hover:text-white transition-colors">Matches</Link>
              <Link to="/ratings" className="text-white/70 hover:text-white transition-colors">Ratings</Link>
              <Link to="/community" className="text-white/70 hover:text-white transition-colors">Community</Link>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-white/50">
              © 2024 FanPlay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
