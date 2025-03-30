
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MatchCard from '@/components/MatchCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search, Trophy } from 'lucide-react';
import { allMatches } from '@/data/mockData';

const Matches = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const liveMatches = allMatches.filter(match => match.status === 'live');
  const upcomingMatches = allMatches.filter(match => match.status === 'upcoming');
  const finishedMatches = allMatches.filter(match => match.status === 'finished');
  
  // Filter matches based on search query
  const filterMatches = (matches) => {
    if (!searchQuery) return matches;
    
    const query = searchQuery.toLowerCase();
    return matches.filter(match => 
      match.homeTeam.name.toLowerCase().includes(query) || 
      match.awayTeam.name.toLowerCase().includes(query) ||
      match.competition.toLowerCase().includes(query)
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-7 w-7 text-primary" />
              Football Matches
            </h1>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search matches..."
                  className="w-full md:w-[300px] pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="all">All Matches</TabsTrigger>
              <TabsTrigger value="live" className="relative">
                Live
                {liveMatches.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="finished">Finished</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterMatches(allMatches).map(match => (
                  <MatchCard key={match.id} {...match} />
                ))}
                {filterMatches(allMatches).length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No matches found. Try a different search term.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="live">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterMatches(liveMatches).map(match => (
                  <MatchCard key={match.id} {...match} />
                ))}
                {filterMatches(liveMatches).length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No live matches at the moment.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterMatches(upcomingMatches).map(match => (
                  <MatchCard key={match.id} {...match} />
                ))}
                {filterMatches(upcomingMatches).length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No upcoming matches found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="finished">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterMatches(finishedMatches).map(match => (
                  <MatchCard key={match.id} {...match} />
                ))}
                {filterMatches(finishedMatches).length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No finished matches found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-team-primary text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Trophy className="h-6 w-6 text-accent" />
              <span className="font-bold text-xl">FanPlay</span>
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

export default Matches;
