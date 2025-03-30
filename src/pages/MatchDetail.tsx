
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Star, Trophy, Flag, YouTube, Share2, Heart } from 'lucide-react';
import { allMatches, matchRatings, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

const MatchDetail = () => {
  const { id } = useParams();
  const match = allMatches.find(m => m.id === id);
  const ratings = matchRatings.filter(r => r.matchId === id);
  
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [bestPlayer, setBestPlayer] = useState('');
  const [bestGoal, setBestGoal] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  if (!match) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Match not found</p>
        </div>
      </div>
    );
  }
  
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send this data to an API
    alert(`Rating submitted: ${userRating} stars`);
  };
  
  const getMatchStatusClass = () => {
    switch (match.status) {
      case 'live':
        return 'bg-destructive text-destructive-foreground';
      case 'finished':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  const getMatchStatusText = () => {
    switch (match.status) {
      case 'live':
        return 'LIVE';
      case 'finished':
        return 'Finished';
      default:
        return 'Upcoming';
    }
  };
  
  const formatMatchDate = () => {
    const date = new Date(match.date);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const renderRatingForm = () => {
    if (match.status === 'upcoming') {
      return (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">This match hasn't started yet. Come back later to rate it!</p>
          <Button variant="outline">Add to Watchlist</Button>
        </div>
      );
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate this Match</CardTitle>
          <CardDescription>Share your thoughts about this game with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitRating}>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Your Rating</h4>
                <StarRating 
                  initialRating={userRating} 
                  onChange={setUserRating} 
                  size="lg" 
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Your Review</h4>
                <Textarea 
                  placeholder="What did you think of the match?" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Best Player</h4>
                  <Input 
                    placeholder="Player name" 
                    value={bestPlayer}
                    onChange={(e) => setBestPlayer(e.target.value)}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Best Goal</h4>
                  <Input 
                    placeholder="Describe the goal" 
                    value={bestGoal}
                    onChange={(e) => setBestGoal(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <div key={tag} className="tag-pill">
                      #{tag}
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a tag" 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>Add</Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={userRating === 0}>
                Submit Rating
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Match header */}
        <div className="bg-field-gradient py-12">
          <div className="container">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getMatchStatusClass())}>
                        {getMatchStatusText()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatMatchDate()}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">{match.competition}</h1>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <YouTube className="h-4 w-4 mr-2" />
                      Highlights
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="team-badge w-24 h-24 mb-4">
                      {match.homeTeam.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold">{match.homeTeam.name}</h2>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold flex items-center gap-4">
                      <span>{match.status !== 'upcoming' ? match.homeTeam.score : ''}</span>
                      <span className="text-muted-foreground text-2xl">{match.status !== 'upcoming' ? '-' : 'vs'}</span>
                      <span>{match.status !== 'upcoming' ? match.awayTeam.score : ''}</span>
                    </div>
                    
                    {match.status === 'finished' && match.averageRating && (
                      <div className="mt-4 star-rating">
                        <StarRating initialRating={match.averageRating} readOnly size="sm" />
                        <span className="ml-2 text-sm font-medium">{match.averageRating.toFixed(1)}/5</span>
                        <span className="ml-1 text-xs text-muted-foreground">({ratings.length} ratings)</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="team-badge w-24 h-24 mb-4">
                      {match.awayTeam.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold">{match.awayTeam.name}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Match content */}
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-accent" />
                Community Ratings
              </h2>
              
              {ratings.length > 0 ? (
                <div className="space-y-6">
                  {ratings.map(rating => (
                    <Card key={rating.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3 items-center">
                            <Avatar>
                              <AvatarImage src={rating.userAvatar} alt={rating.userName} />
                              <AvatarFallback>{rating.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{rating.userName}</CardTitle>
                              <CardDescription>{new Date(rating.createdAt).toLocaleDateString()}</CardDescription>
                            </div>
                          </div>
                          <StarRating initialRating={rating.rating} readOnly size="sm" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{rating.comment}</p>
                        
                        {(rating.highlights.bestPlayer || rating.highlights.bestGoal) && (
                          <div className="mt-4 space-y-2">
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
                          <div className="mt-4 flex flex-wrap gap-2">
                            {rating.tags.map(tag => (
                              <div key={tag} className="tag-pill">
                                #{tag}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Heart className="h-4 w-4 mr-2" />
                          {rating.likes}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">No ratings yet. Be the first to rate this match!</p>
                </div>
              )}
            </div>
            
            <div>
              {renderRatingForm()}
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Match Info</h3>
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Competition:</span>
                    <span className="font-medium">{match.competition}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{new Date(match.date).toDateString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{match.status}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Venue:</span>
                    <span className="font-medium">Stadium Name</span>
                  </div>
                  
                  {match.status === 'finished' && (
                    <>
                      <Separator />
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-muted-foreground">Average Rating:</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{match.averageRating?.toFixed(1) || 'N/A'}</span>
                          <Star className="h-4 w-4 text-accent fill-accent" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
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

export default MatchDetail;
