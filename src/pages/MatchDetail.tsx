
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Star, Trophy, Flag, Youtube, Share2, Heart } from 'lucide-react';
import { matchRatings, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Match } from '@/types/footballApi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ratings = matchRatings.filter(r => r.matchId === id);
  
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [bestPlayer, setBestPlayer] = useState('');
  const [bestGoal, setBestGoal] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  useEffect(() => {
    // Tentar obter os dados da partida do localStorage
    const storedMatch = localStorage.getItem('selectedMatch');
    if (storedMatch) {
      try {
        const parsedMatch = JSON.parse(storedMatch) as Match;
        if (parsedMatch.fixture.id.toString() === id) {
          setMatch(parsedMatch);
        } else {
          toast.error('Partida não encontrada');
          navigate('/buscar-partidas');
        }
      } catch (e) {
        console.error('Erro ao parsear dados da partida:', e);
        toast.error('Erro ao carregar detalhes da partida');
      }
    } else {
      toast.error('Dados da partida não encontrados');
      navigate('/buscar-partidas');
    }
    setIsLoading(false);
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!match) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Partida não encontrada</p>
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
    toast.success(`Avaliação enviada: ${userRating} estrelas`);
  };
  
  const getMatchStatusClass = () => {
    switch (match.fixture.status.short) {
      case '1H':
      case '2H':
      case 'HT':
      case 'Q1':
      case 'Q2':
      case 'Q3':
      case 'Q4':
        return 'bg-destructive text-destructive-foreground';
      case 'FT':
      case 'AET':
      case 'PEN':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  const getMatchStatusText = () => {
    switch (match.fixture.status.short) {
      case '1H':
        return `${match.fixture.status.elapsed}' 1º Tempo`;
      case '2H':
        return `${match.fixture.status.elapsed}' 2º Tempo`;
      case 'HT':
        return 'Intervalo';
      case 'FT':
        return 'Finalizada';
      case 'AET':
        return 'Prorrogação';
      case 'PEN':
        return 'Pênaltis';
      case 'Q1':
        return '1º Quarto';
      case 'Q2':
        return '2º Quarto';
      case 'Q3':
        return '3º Quarto';
      case 'Q4':
        return '4º Quarto';
      case 'OT':
        return 'Tempo Extra';
      case 'NS':
        return 'Agendada';
      default:
        return match.fixture.status.long;
    }
  };
  
  const formatMatchDate = () => {
    const date = new Date(match.fixture.date);
    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };
  
  const renderRatingForm = () => {
    if (match.fixture.status.short === 'NS') {
      return (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">Esta partida ainda não começou. Volte mais tarde para avaliá-la!</p>
          <Button variant="outline">Adicionar à Lista de Observação</Button>
        </div>
      );
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliar esta Partida</CardTitle>
          <CardDescription>Compartilhe sua opinião sobre este jogo com a comunidade</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitRating}>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Sua Avaliação</h4>
                <StarRating 
                  initialRating={userRating} 
                  onChange={setUserRating} 
                  size="lg" 
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Seu Comentário</h4>
                <Textarea 
                  placeholder="O que você achou da partida?" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Melhor Jogador</h4>
                  <Input 
                    placeholder="Nome do jogador" 
                    value={bestPlayer}
                    onChange={(e) => setBestPlayer(e.target.value)}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Melhor Gol/Jogada</h4>
                  <Input 
                    placeholder="Descreva o gol/jogada" 
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
                    placeholder="Adicionar uma tag" 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>Adicionar</Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={userRating === 0}>
                Enviar Avaliação
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
                    <h1 className="text-2xl md:text-3xl font-bold">{match.league.name}</h1>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Youtube className="h-4 w-4 mr-2" />
                      Destaques
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="team-badge w-24 h-24 mb-4">
                      {match.teams.home.logo ? (
                        <img 
                          src={match.teams.home.logo} 
                          alt={match.teams.home.name} 
                          className="w-full h-full object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        match.teams.home.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <h2 className="text-xl font-bold">{match.teams.home.name}</h2>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold flex items-center gap-4">
                      <span>{match.fixture.status.short !== 'NS' ? match.goals?.home ?? 0 : ''}</span>
                      <span className="text-muted-foreground text-2xl">{match.fixture.status.short !== 'NS' ? '-' : 'vs'}</span>
                      <span>{match.fixture.status.short !== 'NS' ? match.goals?.away ?? 0 : ''}</span>
                    </div>
                    
                    {match.fixture.status.short === 'FT' && (
                      <div className="mt-4 star-rating">
                        <StarRating initialRating={4.5} readOnly size="sm" />
                        <span className="ml-2 text-sm font-medium">4.5/5</span>
                        <span className="ml-1 text-xs text-muted-foreground">({ratings.length} avaliações)</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="team-badge w-24 h-24 mb-4">
                      {match.teams.away.logo ? (
                        <img 
                          src={match.teams.away.logo} 
                          alt={match.teams.away.name} 
                          className="w-full h-full object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        match.teams.away.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <h2 className="text-xl font-bold">{match.teams.away.name}</h2>
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
                Avaliações da Comunidade
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
                              <CardDescription>{new Date(rating.createdAt).toLocaleDateString('pt-BR')}</CardDescription>
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
                                <span className="text-sm">Melhor jogador: <strong>{rating.highlights.bestPlayer}</strong></span>
                              </div>
                            )}
                            {rating.highlights.bestGoal && (
                              <div className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-accent" />
                                <span className="text-sm">Melhor gol: <strong>{rating.highlights.bestGoal}</strong></span>
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
                  <p className="text-muted-foreground">Nenhuma avaliação ainda. Seja o primeiro a avaliar esta partida!</p>
                </div>
              )}
            </div>
            
            <div>
              {renderRatingForm()}
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Informações da Partida</h3>
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Competição:</span>
                    <span className="font-medium">{match.league.name}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">{format(new Date(match.fixture.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{getMatchStatusText()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Estádio:</span>
                    <span className="font-medium">{match.fixture.venue?.name || "Não informado"}</span>
                  </div>
                  
                  {match.fixture.status.short === 'FT' && (
                    <>
                      <Separator />
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-muted-foreground">Avaliação Média:</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">4.5</span>
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
              © 2024 FanPlay. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MatchDetail;
