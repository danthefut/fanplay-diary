
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MatchCard from '@/components/MatchCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search, Trophy, Loader2 } from 'lucide-react';
import { useFootballApi } from '@/hooks/useFootballApi';
import { Match } from '@/types/footballApi';
import { toast } from 'sonner';

const Matches = () => {
  const { isLoading, getMatches } = useFootballApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Buscar partidas da API - usando a liga da Premier League (ID 39) e temporada 2023
        const result = await getMatches({ league: 39, season: 2023 });
        if (result && result.response) {
          setMatches(result.response);
        } else {
          toast.error('Não foi possível carregar as partidas');
        }
      } catch (error) {
        console.error('Erro ao buscar partidas:', error);
        toast.error('Erro ao buscar partidas');
      }
    };
    
    fetchMatches();
  }, []);
  
  // Filtrar partidas com base em status e busca
  const getLiveMatches = () => {
    return filterMatches(matches.filter(match => 
      match.fixture.status.short === '1H' || 
      match.fixture.status.short === '2H' || 
      match.fixture.status.short === 'HT' ||
      match.fixture.status.short === 'Q1' ||
      match.fixture.status.short === 'Q2' ||
      match.fixture.status.short === 'Q3' ||
      match.fixture.status.short === 'Q4'
    ));
  };
  
  const getUpcomingMatches = () => {
    return filterMatches(matches.filter(match => match.fixture.status.short === 'NS'));
  };
  
  const getFinishedMatches = () => {
    return filterMatches(matches.filter(match => 
      match.fixture.status.short === 'FT' || 
      match.fixture.status.short === 'AET' || 
      match.fixture.status.short === 'PEN'
    ));
  };
  
  // Filtrar partidas com base na busca
  const filterMatches = (matches: Match[]) => {
    if (!searchQuery) return matches;
    
    const query = searchQuery.toLowerCase();
    return matches.filter(match => 
      match.teams.home.name.toLowerCase().includes(query) || 
      match.teams.away.name.toLowerCase().includes(query) ||
      match.league.name.toLowerCase().includes(query)
    );
  };
  
  // Converter objetos Match para o formato MatchCard
  const convertMatchToCardProps = (match: Match) => {
    return {
      id: match.fixture.id.toString(),
      homeTeam: {
        name: match.teams.home.name,
        logo: match.teams.home.logo,
        score: match.goals?.home ?? 0
      },
      awayTeam: {
        name: match.teams.away.name,
        logo: match.teams.away.logo,
        score: match.goals?.away ?? 0
      },
      date: match.fixture.date,
      competition: match.league.name,
      status: match.fixture.status.short === 'NS' 
        ? 'upcoming' 
        : (match.fixture.status.short === '1H' || match.fixture.status.short === '2H' || match.fixture.status.short === 'HT' || 
           match.fixture.status.short === 'Q1' || match.fixture.status.short === 'Q2' || 
           match.fixture.status.short === 'Q3' || match.fixture.status.short === 'Q4')
          ? 'live'
          : 'finished',
      averageRating: Math.random() * 2 + 3 // Placeholder para avaliações (3-5 estrelas)
    };
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-7 w-7 text-primary" />
              Partidas de Futebol
            </h1>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Pesquisar partidas..."
                  className="w-full md:w-[300px] pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando partidas...</span>
            </div>
          ) : (
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="all">Todas Partidas</TabsTrigger>
                <TabsTrigger value="live" className="relative">
                  Ao Vivo
                  {getLiveMatches().length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                <TabsTrigger value="finished">Finalizadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterMatches(matches).map(match => (
                    <MatchCard key={match.fixture.id} {...convertMatchToCardProps(match)} />
                  ))}
                  {filterMatches(matches).length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-muted-foreground">Nenhuma partida encontrada. Tente um termo diferente.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="live">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getLiveMatches().map(match => (
                    <MatchCard key={match.fixture.id} {...convertMatchToCardProps(match)} />
                  ))}
                  {getLiveMatches().length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-muted-foreground">Nenhuma partida ao vivo no momento.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getUpcomingMatches().map(match => (
                    <MatchCard key={match.fixture.id} {...convertMatchToCardProps(match)} />
                  ))}
                  {getUpcomingMatches().length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-muted-foreground">Nenhuma partida próxima encontrada.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="finished">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFinishedMatches().map(match => (
                    <MatchCard key={match.fixture.id} {...convertMatchToCardProps(match)} />
                  ))}
                  {getFinishedMatches().length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-muted-foreground">Nenhuma partida finalizada encontrada.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
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

export default Matches;
