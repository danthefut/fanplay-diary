
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Search, FilterX, Loader2 } from 'lucide-react';
import { useFootballApi } from '@/hooks/useFootballApi';
import { Match, LeagueResponse } from '@/types/footballApi';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BuscarPartidas = () => {
  const { isLoading, getMatches, getLeagues, getRounds } = useFootballApi();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<LeagueResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedLeagueId, setSelectedLeagueId] = useState('71'); // Default: Brasil Série A
  const [selectedRound, setSelectedRound] = useState<string>('');
  const [rounds, setRounds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('todas');
  const [loadingLeagues, setLoadingLeagues] = useState(false);

  // Anos disponíveis para seleção
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  
  // Buscar ligas disponíveis
  useEffect(() => {
    const fetchLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const data = await getLeagues({ season: selectedYear });
        if (data && data.response) {
          setLeagues(data.response);
        } else {
          toast.error('Não foi possível carregar as ligas');
        }
      } catch (error) {
        console.error('Erro ao buscar ligas:', error);
        toast.error('Erro ao buscar ligas');
      } finally {
        setLoadingLeagues(false);
      }
    };
    
    fetchLeagues();
  }, [selectedYear]);
  
  // Buscar rodadas disponíveis quando o ano ou liga muda
  useEffect(() => {
    const fetchRounds = async () => {
      if (!selectedLeagueId) return;
      
      try {
        const data = await getRounds(parseInt(selectedLeagueId), parseInt(selectedYear));
        if (data && data.response) {
          const roundsList = data.response.map(r => r.round);
          setRounds(roundsList);
        } else {
          setRounds([]);
          console.log('Nenhuma rodada disponível');
        }
      } catch (error) {
        console.error('Erro ao buscar rodadas:', error);
        setRounds([]);
      }
    };
    
    fetchRounds();
  }, [selectedYear, selectedLeagueId]);
  
  // Filtrar partidas com base em critérios
  const filterMatches = (matches: Match[]) => {
    if (!matches) return [];
    
    return matches.filter(match => {
      const homeTeamName = match.teams.home.name.toLowerCase();
      const awayTeamName = match.teams.away.name.toLowerCase();
      const leagueName = match.league.name.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      // Filtro de texto
      const matchesSearch = !searchQuery || 
        homeTeamName.includes(query) || 
        awayTeamName.includes(query) || 
        leagueName.includes(query);
      
      // Filtro de status
      let matchesStatus = true;
      if (activeTab === 'ao-vivo') {
        matchesStatus = match.fixture.status.short === 'NS' || 
                       match.fixture.status.short === '1H' || 
                       match.fixture.status.short === '2H' || 
                       match.fixture.status.short === 'HT';
      } else if (activeTab === 'proximas') {
        matchesStatus = match.fixture.status.short === 'NS';
      } else if (activeTab === 'finalizadas') {
        matchesStatus = match.fixture.status.short === 'FT' || 
                       match.fixture.status.short === 'AET' || 
                       match.fixture.status.short === 'PEN';
      }
      
      return matchesSearch && matchesStatus;
    });
  };
  
  // Buscar partidas com base nos filtros selecionados
  const handleSearch = async () => {
    if (!selectedLeagueId) {
      toast.error('Selecione uma liga');
      return;
    }
    
    const params: Record<string, string | number> = {
      league: parseInt(selectedLeagueId),
      season: parseInt(selectedYear)
    };
    
    if (selectedRound && selectedRound !== 'all') {
      params.round = selectedRound;
    }
    
    if (selectedDate) {
      params.date = format(selectedDate, 'yyyy-MM-dd');
    }
    
    try {
      const data = await getMatches(params);
      if (data && data.response) {
        setMatches(data.response);
        console.log('Partidas carregadas:', data.response);
        
        if (data.response.length === 0) {
          toast.info('Nenhuma partida encontrada com os filtros selecionados');
        }
      } else {
        setMatches([]);
        toast.error('Erro ao buscar partidas');
      }
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
      toast.error('Erro ao buscar partidas');
    }
  };
  
  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedRound('');
    setSearchQuery('');
  };
  
  // Calcular status da partida em português
  const getMatchStatus = (match: Match) => {
    const { status } = match.fixture;
    
    switch(status.short) {
      case 'NS':
        return 'Agendada';
      case '1H':
        return `${status.elapsed}' 1º Tempo`;
      case '2H':
        return `${status.elapsed}' 2º Tempo`;
      case 'HT':
        return 'Intervalo';
      case 'FT':
        return 'Finalizada';
      case 'AET':
        return 'Prorrogação';
      case 'PEN':
        return 'Pênaltis';
      default:
        return status.long;
    }
  };
  
  // Renderiza uma partida
  const renderMatch = (match: Match) => {
    const matchDate = new Date(match.fixture.date);
    const formattedDate = format(matchDate, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    
    return (
      <div key={match.fixture.id} className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-muted-foreground">
              {formattedDate}
            </div>
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              match.fixture.status.short === 'NS' ? "bg-muted text-muted-foreground" :
              (match.fixture.status.short === '1H' || match.fixture.status.short === '2H' || match.fixture.status.short === 'HT') ? 
              "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"
            )}>
              {getMatchStatus(match)}
              {match.fixture.status.elapsed && (match.fixture.status.short === '1H' || match.fixture.status.short === '2H') && 
                `'${match.fixture.status.elapsed}`}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <img 
                src={match.league.logo} 
                alt={match.league.name} 
                className="w-6 h-6 object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <span className="text-sm font-medium">{match.league.name}</span>
            </div>
            <div className="text-xs">{match.league.round}</div>
          </div>
          
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col items-center text-center w-2/5">
              <img 
                src={match.teams.home.logo} 
                alt={match.teams.home.name} 
                className="w-12 h-12 object-contain mb-2" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <h3 className="text-sm font-semibold">{match.teams.home.name}</h3>
            </div>
            
            <div className="text-center">
              {match.fixture.status.short !== 'NS' ? (
                <div className="text-2xl font-bold">
                  {match.goals.home} - {match.goals.away}
                </div>
              ) : (
                <div className="text-xl font-medium">vs</div>
              )}
            </div>
            
            <div className="flex flex-col items-center text-center w-2/5">
              <img 
                src={match.teams.away.logo} 
                alt={match.teams.away.name} 
                className="w-12 h-12 object-contain mb-2" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <h3 className="text-sm font-semibold">{match.teams.away.name}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Buscar Partidas</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Temporada</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Liga</label>
              <Select value={selectedLeagueId} onValueChange={setSelectedLeagueId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a liga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="71">Campeonato Brasileiro - Série A</SelectItem>
                  <SelectItem value="72">Campeonato Brasileiro - Série B</SelectItem>
                  <SelectItem value="73">Copa do Brasil</SelectItem>
                  <SelectItem value="39">Premier League</SelectItem>
                  <SelectItem value="140">La Liga</SelectItem>
                  <SelectItem value="135">Serie A</SelectItem>
                  <SelectItem value="78">Bundesliga</SelectItem>
                  {leagues.map(league => (
                    <SelectItem key={league.league.id} value={league.league.id.toString()}>
                      {league.league.name} - {league.country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rodada</label>
              <Select value={selectedRound} onValueChange={setSelectedRound}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a rodada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as rodadas</SelectItem>
                  {rounds.map(round => (
                    <SelectItem key={round} value={round}>
                      {round}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar times, ligas..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleClearFilters} variant="outline" className="gap-2">
                <FilterX className="h-4 w-4" />
                Limpar Filtros
              </Button>
              
              <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Buscar
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="todas" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="ao-vivo">Ao Vivo</TabsTrigger>
              <TabsTrigger value="proximas">Próximas</TabsTrigger>
              <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="todas">
              {renderMatchesContent(filterMatches(matches))}
            </TabsContent>
            
            <TabsContent value="ao-vivo">
              {renderMatchesContent(filterMatches(matches))}
            </TabsContent>
            
            <TabsContent value="proximas">
              {renderMatchesContent(filterMatches(matches))}
            </TabsContent>
            
            <TabsContent value="finalizadas">
              {renderMatchesContent(filterMatches(matches))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-team-primary text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
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
  
  function renderMatchesContent(filteredMatches: Match[]) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando partidas...</span>
        </div>
      );
    }
    
    if (filteredMatches.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Nenhuma partida encontrada. Tente diferentes critérios de busca.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map(match => renderMatch(match))}
      </div>
    );
  }
};

export default BuscarPartidas;
