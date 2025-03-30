
import React from 'react';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { currentUser, matchRatings, allMatches } from '@/data/mockData';
import { Trophy, Star, Calendar, Users, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '@/components/StarRating';

const Profile = () => {
  // Filter ratings for the current user
  const userRatings = matchRatings.filter(rating => rating.userId === currentUser.id);
  
  const getMatchForRating = (rating) => {
    return allMatches.find(m => m.id === rating.matchId);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* User header */}
          <div className="bg-field-gradient rounded-lg p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-stadium-pattern opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{currentUser.name}</h1>
                <div className="text-white/80 mb-3">@{currentUser.username}</div>
                
                {currentUser.favoriteTeam && (
                  <Badge className="bg-accent text-accent-foreground mb-4">
                    <Trophy className="h-3 w-3 mr-1" />
                    {currentUser.favoriteTeam} Fan
                  </Badge>
                )}
                
                <p className="text-white/90 max-w-2xl">{currentUser.bio}</p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <Button className="w-full">Edit Profile</Button>
                <div className="flex gap-2 text-white">
                  <div className="text-center">
                    <div className="text-lg font-bold">{userRatings.length}</div>
                    <div className="text-xs text-white/70">Ratings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">0</div>
                    <div className="text-xs text-white/70">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">0</div>
                    <div className="text-xs text-white/70">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="ratings">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="ratings">
                    <Star className="h-4 w-4 mr-2" />
                    Ratings
                  </TabsTrigger>
                  <TabsTrigger value="watchlist">
                    <Calendar className="h-4 w-4 mr-2" />
                    Watchlist
                  </TabsTrigger>
                  <TabsTrigger value="activity">
                    <Users className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="ratings">
                  {userRatings.length > 0 ? (
                    <div className="space-y-4">
                      {userRatings.map(rating => {
                        const match = getMatchForRating(rating);
                        if (!match) return null;
                        
                        return (
                          <Card key={rating.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <Link to={`/match/${match.id}`} className="hover:underline">
                                  <CardTitle className="text-lg">{match.homeTeam.name} vs {match.awayTeam.name}</CardTitle>
                                  <CardDescription>
                                    {match.competition} • {new Date(match.date).toLocaleDateString()}
                                  </CardDescription>
                                </Link>
                                <StarRating initialRating={rating.rating} readOnly size="sm" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm mb-4">{rating.comment}</p>
                              
                              {(rating.highlights.bestPlayer || rating.highlights.bestGoal) && (
                                <div className="space-y-2 mb-4">
                                  {rating.highlights.bestPlayer && (
                                    <div className="flex items-center gap-2">
                                      <Trophy className="h-4 w-4 text-accent" />
                                      <span className="text-sm">Best player: <strong>{rating.highlights.bestPlayer}</strong></span>
                                    </div>
                                  )}
                                  {rating.highlights.bestGoal && (
                                    <div className="flex items-center gap-2">
                                      <Flag className="h-4 w-4 text-accent" />
                                      <span className="text-sm">Best goal: <strong>{rating.highlights.bestGoal}</strong></span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {rating.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {rating.tags.map(tag => (
                                    <div key={tag} className="tag-pill">
                                      #{tag}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-lg p-6 text-center">
                      <p className="text-muted-foreground mb-4">You haven't rated any matches yet.</p>
                      <Link to="/matches">
                        <Button>Browse Matches</Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="watchlist">
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">You don't have any matches in your watchlist.</p>
                    <Link to="/matches">
                      <Button>Browse Upcoming Matches</Button>
                    </Link>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity">
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">Your activity feed is empty.</p>
                    <Link to="/community">
                      <Button>Explore Community</Button>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-accent" />
                        <span>Rated Matches</span>
                      </div>
                      <span className="font-bold">{currentUser.stats.ratedMatches}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-accent" />
                        <span>Reviewed Matches</span>
                      </div>
                      <span className="font-bold">{currentUser.stats.reviewedMatches}</span>
                    </div>
                    
                    {currentUser.stats.favoriteLeague && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-accent" />
                          <span>Favorite League</span>
                        </div>
                        <span className="font-bold">{currentUser.stats.favoriteLeague}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center bg-muted/30 rounded-lg p-4">
                      <Trophy className="h-10 w-10 text-accent mb-2" />
                      <div className="font-medium text-center">Premier League Fan</div>
                    </div>
                    
                    <div className="flex flex-col items-center bg-muted/30 rounded-lg p-4">
                      <Star className="h-10 w-10 text-accent mb-2" />
                      <div className="font-medium text-center">Top Reviewer</div>
                    </div>
                    
                    <div className="flex flex-col items-center bg-muted/30 rounded-lg p-4 opacity-40">
                      <Users className="h-10 w-10 text-muted-foreground mb-2" />
                      <div className="font-medium text-center">Community Leader</div>
                    </div>
                    
                    <div className="flex flex-col items-center bg-muted/30 rounded-lg p-4 opacity-40">
                      <Flag className="h-10 w-10 text-muted-foreground mb-2" />
                      <div className="font-medium text-center">World Cup Expert</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-team-primary text-white py-8 mt-8">
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

export default Profile;
