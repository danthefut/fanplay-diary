
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Star, Trophy, Users } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
            <Trophy className="h-6 w-6" />
            <span>FanPlay</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/matches" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Matches</span>
          </Link>
          <Link to="/ratings" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>Ratings</span>
          </Link>
          <Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Community</span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
