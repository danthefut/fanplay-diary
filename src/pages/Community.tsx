
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, MessageSquare, Heart, Share2 } from 'lucide-react';
import { communityPosts, currentUser } from '@/data/mockData';

const Community = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              Community
            </h1>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search community posts..."
                  className="w-full md:w-[300px] pl-9"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="popular" className="mb-8">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                </TabsList>
                
                <TabsContent value="popular">
                  <div className="space-y-6">
                    {communityPosts.map(post => (
                      <Card key={post.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3 items-center">
                              <Avatar>
                                <AvatarImage src={post.userAvatar} alt={post.userName} />
                                <AvatarFallback>{post.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{post.userName}</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Follow</Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                          <p className="text-sm mb-4">{post.content}</p>
                          
                          {post.match && (
                            <Card className="border bg-muted/20 mb-4">
                              <CardContent className="p-3">
                                <div className="text-sm">
                                  <span className="font-medium">{post.match.homeTeam}</span>
                                  <span className="mx-2">vs</span>
                                  <span className="font-medium">{post.match.awayTeam}</span>
                                  <span className="text-muted-foreground ml-2">• {post.match.competition}</span>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                        <CardFooter>
                          <div className="flex gap-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <Heart className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="recent">
                  <div className="space-y-6">
                    {[...communityPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(post => (
                      <Card key={post.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3 items-center">
                              <Avatar>
                                <AvatarImage src={post.userAvatar} alt={post.userName} />
                                <AvatarFallback>{post.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{post.userName}</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Follow</Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                          <p className="text-sm mb-4">{post.content}</p>
                          
                          {post.match && (
                            <Card className="border bg-muted/20 mb-4">
                              <CardContent className="p-3">
                                <div className="text-sm">
                                  <span className="font-medium">{post.match.homeTeam}</span>
                                  <span className="mx-2">vs</span>
                                  <span className="font-medium">{post.match.awayTeam}</span>
                                  <span className="text-muted-foreground ml-2">• {post.match.competition}</span>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                        <CardFooter>
                          <div className="flex gap-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <Heart className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="following">
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">Follow other users to see their posts here.</p>
                    <Button>Discover Users</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="trending">
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No trending discussions at the moment. Check back later!</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input placeholder="Title" className="mb-4" />
                  <textarea 
                    className="w-full p-3 border rounded-md min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-input" 
                    placeholder="Share your thoughts with the community..."
                  ></textarea>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Post</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Communities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">PL</span>
                        </div>
                        <div>
                          <div className="font-medium">Premier League</div>
                          <div className="text-sm text-muted-foreground">24.5k members</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">CL</span>
                        </div>
                        <div>
                          <div className="font-medium">Champions League</div>
                          <div className="text-sm text-muted-foreground">32.1k members</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">WC</span>
                        </div>
                        <div>
                          <div className="font-medium">World Cup</div>
                          <div className="text-sm text-muted-foreground">45.8k members</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-team-primary text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Users className="h-6 w-6 text-accent" />
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

export default Community;
