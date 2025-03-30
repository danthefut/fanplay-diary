
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/StarRating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Star, Calendar, Heart, MessageSquare } from 'lucide-react';
import { matchRatings, allMatches } from '@/data/mockData';

const Ratings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter ratings based on search query
  const filterRatings = (ratings) => {
    if (!searchQuery) return ratings;
    
    const query = searchQuery.toLowerCase();
    return ratings.filter(rating => {
      const match = allMatches.find(m => m.id === rating.matchId);
      if (!match) return false;
      
      return rating.comment.toLowerCase().includes(query) || 
             match.homeTeam.name.toLowerCase().includes(query) || 
             match.awayTeam.name.toLowerCase().includes(query) ||
             match.competition.toLowerCase().includes(query);
    });
  };
  
  const getMatchForRating = (rating) => {
    return allMatches.find(m => m.id === rating.matchId);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Star className="h-7 w-7 text-primary" />
              Match Ratings
            </h1>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search ratings..."
                  className="w-full md:w-[300px] pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="recent" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="friends">From Friends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterRatings([...matchRatings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())).map(rating => {
                  const match = getMatchForRating(rating);
                  if (!match) return null;
                  
                  return (
                    <Card key={rating.id} className="overflow-hidden">
                      <div className="bg-muted/30 p-3">
                        <Link to={`/match/${match.id}`} className="hover:underline">
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</div>
                            <div className="text-sm text-muted-foreground">{match.homeTeam.score} - {match.awayTeam.score}</div>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {match.competition} • {new Date(match.date).toLocaleDateString()}
                          </div>
                        </Link>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={rating.userAvatar} alt={rating.userName} />
                              <AvatarFallback>{rating.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium">{rating.userName}</div>
                          </div>
                          <StarRating initialRating={rating.rating} readOnly size="sm" />
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        <p className="text-sm line-clamp-3">{rating.comment}</p>
                        
                        {rating.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {rating.tags.slice(0, 3).map(tag => (
                              <div key={tag} className="tag-pill">
                                #{tag}
                              </div>
                            ))}
                            {rating.tags.length > 3 && (
                              <div className="tag-pill">
                                +{rating.tags.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Heart className="h-4 w-4 mr-2" />
                            {rating.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
                
                {filterRatings(matchRatings).length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No ratings found. Try a different search term.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="popular">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterRatings([...matchRatings].sort((a, b) => b.likes - a.likes)).map(rating => {
                  const match = getMatchForRating(rating);
                  if (!match) return null;
                  
                  return (
                    <Card key={rating.id} className="overflow-hidden">
                      <div className="bg-muted/30 p-3">
                        <Link to={`/match/${match.id}`} className="hover:underline">
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</div>
                            <div className="text-sm text-muted-foreground">{match.homeTeam.score} - {match.awayTeam.score}</div>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {match.competition} • {new Date(match.date).toLocaleDateString()}
                          </div>
                        </Link>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={rating.userAvatar} alt={rating.userName} />
                              <AvatarFallback>{rating.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium">{rating.userName}</div>
                          </div>
                          <StarRating initialRating={rating.rating} readOnly size="sm" />
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        <p className="text-sm line-clamp-3">{rating.comment}</p>
                        
                        {rating.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {rating.tags.slice(0, 3).map(tag => (
                              <div key={tag} className="tag-pill">
                                #{tag}
                              </div>
                            ))}
                            {rating.tags.length > 3 && (
                              <div className="tag-pill">
                                +{rating.tags.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Heart className="h-4 w-4 mr-2" />
                            {rating.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
                
                {filterRatings(matchRatings).length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No ratings found. Try a different search term.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="friends">
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Follow other users to see their ratings here.</p>
                <Button>Discover Users</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-team-primary text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Star className="h-6 w-6 text-accent" />
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

export default Ratings;
