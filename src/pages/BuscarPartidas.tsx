
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFootballApi } from '@/hooks/useFootballApi';
import { Match, League, TeamInfo } from '@/types/footballApi';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search, Trophy, CircleUser, FilterX, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LeagueFilter from '@/components/LeagueFilter';
import TeamFilter from '@/components/TeamFilter';
import MatchList from '@/components/MatchList';

const CURRENT_YEAR = 2023; // Forçar 2023 como ano atual para API gratuita

const BuscarPartidas = () => {
  const navigate = useNavigate();
  const { isLoading, getMatches, getLeagues, getTeams } = useFootballApi();
  const [sportType, setSportType] = useState<'football' | 'basketball'>('football');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  
  // Novos estados para filtros
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<number[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Função para mostrar uma mensagem de aviso sobre limitações da API
  useEffect(() => {
    if (isFirstLoad) {
      toast.info(
        "API gratuita: limitada a temporada 2023 e número de requisições diárias", 
        { duration: 5000 }
      );
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  // Buscar ligas disponíveis com limitação
  const fetchLeagues = useCallback(async () => {
    if (isLoadingLeagues) return;
    
    setIsLoadingLeagues(true);
    setError(null);
    
    try {
      const leaguesResponse = await getLeagues({ current: 'true', season: CURRENT_YEAR }, sportType);
      
      if (leaguesResponse && leaguesResponse.response) {
        // Extrair as ligas das respostas da API
        const leaguesData = leaguesResponse.response.map(item => item.league);
        
        // Ordenar ligas por nome
        const sortedLeagues = leaguesData.sort((a, b) => a.name.localeCompare(b.name));
        
        setLeagues(sortedLeagues);
      } else {
        // Se não temos resposta, mas não temos erro explícito
        if (!leaguesResponse) {
          setError('Não foi possível carregar as ligas. Verifique sua conexão.');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar ligas:', error);
      setError('Erro ao carregar ligas: ' + (error instanceof Error ? error.message : 'Desconhecido'));
    } finally {
      setIsLoadingLeagues(false);
    }
  }, [sportType, getLeagues, isLoadingLeagues]);

  // Buscar times com base nas ligas selecionadas (com limitação)
  const fetchTeams = useCallback(async () => {
    if (selectedLeagues.length === 0) {
      setTeams([]);
      return;
    }

    if (isLoadingTeams) return;
    
    setIsLoadingTeams(true);
    setError(null);
    
    const allTeams: TeamInfo[] = [];

    try {
      // Limitar buscas para apenas a primeira liga selecionada para economizar requisições
      const leagueToFetch = selectedLeagues[0];
      
      const teamsResponse = await getTeams({ league: leagueToFetch, season: CURRENT_YEAR }, sportType);
      
      if (teamsResponse && teamsResponse.response) {
        const teamsData = teamsResponse.response.map(item => item.team);
        allTeams.push(...teamsData);
        
        // Ordenar times por nome
        const sortedTeams = allTeams.sort((a, b) => a.name.localeCompare(b.name));
        setTeams(sortedTeams);
      }
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      setError('Erro ao carregar times: ' + (error instanceof Error ? error.message : 'Desconhecido'));
    } finally {
      setIsLoadingTeams(false);
    }
  }, [selectedLeagues, sportType, getTeams, isLoadingTeams]);

  // Carregar ligas ao mudar o tipo de esporte
  useEffect(() => {
    fetchLeagues();
  }, [sportType, fetchLeagues]);

  // Buscar times ao selecionar ligas
  useEffect(() => {
    fetchTeams();
  }, [selectedLeagues, fetchTeams]);

  // Buscar partidas com base nos filtros (com limitações)
  const fetchMatches = useCallback(async () => {
    if (!date) return;
    
    setError(null);
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Construir objeto de parâmetros com todos os filtros aplicáveis
    const params: Record<string, string | number> = { date: formattedDate };
    
    // Adicionar filtros de liga se houver (limitando a 1 liga para economizar requisições)
    if (selectedLeagues.length > 0) {
      params.league = selectedLeagues[0];
    }
    
    // Adicionar filtros de time se houver (limitando a 1 time para economizar requisições)
    if (selectedTeams.length > 0) {
      params.team = selectedTeams[0];
    }
    
    const response = await getMatches(params, sportType);
    
    if (response && response.response) {
      let matchesData = response.response;

      // Ordenar partidas por horário
      matchesData = matchesData.sort((a, b) => {
        return new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime();
      });
      
      setMatches(matchesData);
      setFilteredMatches(matchesData);
    } else {
      // Se a resposta falhou mas não foi por erro de limite (que já mostra toast)
      if (!response) {
        setMatches([]);
        setFilteredMatches([]);
      }
    }
  }, [date, sportType, selectedLeagues, selectedTeams, getMatches]);

  // Buscar partidas quando os filtros mudam
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Filtrar partidas por pesquisa de texto
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMatches(matches);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = matches.filter(match => 
      match.teams.home.name.toLowerCase().includes(lowercaseQuery) || 
      match.teams.away.name.toLowerCase().includes(lowercaseQuery) ||
      match.league.name.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredMatches(filtered);
  }, [searchQuery, matches]);

  const handleMatchClick = (match: Match) => {
    navigate(`/match/${match.fixture.id}`, { 
      state: { 
        match,
        sportType 
      } 
    });
  };

  const handleSelectLeague = (leagueId: number) => {
    // Permitir apenas uma liga selecionada para economizar requisições
    setSelectedLeagues([leagueId]);
  };

  const handleSelectTeam = (teamId: number) => {
    // Permitir apenas um time selecionado para economizar requisições
    setSelectedTeams([teamId]);
  };

  const handleClearLeagues = () => {
    setSelectedLeagues([]);
  };

  const handleClearTeams = () => {
    setSelectedTeams([]);
  };

  const handleClearAllFilters = () => {
    setSelectedLeagues([]);
    setSelectedTeams([]);
    setSearchQuery('');
  };

  // Determinar se há algum filtro ativo
  const hasActiveFilters = selectedLeagues.length > 0 || selectedTeams.length > 0 || searchQuery.trim() !== '';

  // Função para forçar nova busca
  const handleRefresh = () => {
    setError(null);
    fetchMatches();
  };

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Buscar Partidas</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Limitações da API Gratuita</AlertTitle>
        <AlertDescription>
          Esta demonstração usa a versão gratuita da API-Sports que tem acesso apenas a dados 
          de 2023 e um número limitado de requisições diárias.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="football" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="football" 
            onClick={() => {
              setSportType('football');
              handleClearAllFilters();
            }}
            className="flex items-center gap-2"
          >
            <Trophy size={18} />
            Futebol
          </TabsTrigger>
          <TabsTrigger 
            value="basketball" 
            onClick={() => {
              setSportType('basketball');
              handleClearAllFilters();
            }}
            className="flex items-center gap-2"
          >
            <CircleUser size={18} />
            Basquete
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Buscar por times ou ligas..."
                className="w-full px-10 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <LeagueFilter 
              leagues={leagues}
              selectedLeagues={selectedLeagues}
              onSelectLeague={handleSelectLeague}
              onClearLeagues={handleClearLeagues}
              isLoading={isLoadingLeagues}
            />
          </div>
          
          <div className="w-full">
            <TeamFilter 
              teams={teams}
              selectedTeams={selectedTeams}
              onSelectTeam={handleSelectTeam}
              onClearTeams={handleClearTeams}
              isLoading={isLoadingTeams}
              disabled={selectedLeagues.length === 0}
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAllFilters}
              className="text-muted-foreground"
            >
              <FilterX size={16} className="mr-1" />
              Limpar filtros
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="ml-auto"
          >
            Atualizar
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredMatches.length > 0 ? (
        <MatchList 
          matches={filteredMatches} 
          onMatchClick={handleMatchClick} 
          sportType={sportType} 
        />
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            Nenhuma partida encontrada.
          </p>
          <p className="text-muted-foreground mb-4">
            {hasActiveFilters ? 
              'Tente modificar os filtros aplicados.' : 
              'Tente selecionar outra data ou mudar os critérios de busca.'}
          </p>
          <p className="text-sm text-muted-foreground">
            Nota: A API gratuita tem limite diário de requisições e acesso apenas à temporada 2023.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuscarPartidas;
