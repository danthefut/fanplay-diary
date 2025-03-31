
import React, { useState, useEffect } from 'react';
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
import { CalendarIcon, Search, Trophy, CircleUser, FilterX } from 'lucide-react';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import LeagueFilter from '@/components/LeagueFilter';
import TeamFilter from '@/components/TeamFilter';
import MatchList from '@/components/MatchList';

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

  // Buscar ligas disponíveis
  useEffect(() => {
    const fetchLeagues = async () => {
      setIsLoadingLeagues(true);
      const currentYear = new Date().getFullYear();
      
      try {
        const leaguesResponse = await getLeagues({ current: 'true', season: currentYear }, sportType);
        
        if (leaguesResponse && leaguesResponse.response) {
          // Extrair as ligas das respostas da API
          const leaguesData = leaguesResponse.response.map(item => item.league);
          
          // Ordenar ligas por nome
          const sortedLeagues = leaguesData.sort((a, b) => a.name.localeCompare(b.name));
          
          setLeagues(sortedLeagues);
        }
      } catch (error) {
        console.error('Erro ao buscar ligas:', error);
        toast.error('Não foi possível carregar as ligas disponíveis');
      } finally {
        setIsLoadingLeagues(false);
      }
    };

    fetchLeagues();
  }, [sportType, getLeagues]);

  // Buscar times com base nas ligas selecionadas
  useEffect(() => {
    const fetchTeams = async () => {
      if (selectedLeagues.length === 0) {
        setTeams([]);
        return;
      }

      setIsLoadingTeams(true);
      const currentYear = new Date().getFullYear();
      const allTeams: TeamInfo[] = [];

      try {
        // Buscar times para cada liga selecionada
        for (const leagueId of selectedLeagues) {
          const teamsResponse = await getTeams({ league: leagueId, season: currentYear }, sportType);
          
          if (teamsResponse && teamsResponse.response) {
            const teamsData = teamsResponse.response.map(item => item.team);
            allTeams.push(...teamsData);
          }
        }

        // Remover times duplicados usando Set e Map
        const uniqueTeams = Array.from(
          new Map(allTeams.map(team => [team.id, team])).values()
        );

        // Ordenar times por nome
        const sortedTeams = uniqueTeams.sort((a, b) => a.name.localeCompare(b.name));
        
        setTeams(sortedTeams);
      } catch (error) {
        console.error('Erro ao buscar times:', error);
        toast.error('Não foi possível carregar os times disponíveis');
      } finally {
        setIsLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [selectedLeagues, sportType, getTeams]);

  // Buscar partidas com base nos filtros
  useEffect(() => {
    const fetchMatches = async () => {
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        // Construir objeto de parâmetros com todos os filtros aplicáveis
        const params: Record<string, string | number> = { date: formattedDate };
        
        // Adicionar filtros de liga se houver
        if (selectedLeagues.length === 1) {
          params.league = selectedLeagues[0];
        } else if (selectedLeagues.length > 1) {
          // A API de futebol suporta ligas como lista separada por hífens
          params.league = selectedLeagues.join('-');
        }
        
        // Adicionar filtros de time se houver
        if (selectedTeams.length === 1) {
          params.team = selectedTeams[0];
        } else if (selectedTeams.length > 1) {
          // A API suporta times como lista separada por hífens
          params.team = selectedTeams.join('-');
        }
        
        const response = await getMatches(params, sportType);
        
        if (response && response.response) {
          // Se temos uma resposta com erro de limite de taxa, mostrar uma notificação
          if (response.errors && response.errors.rateLimit) {
            toast.error("Limite de requisições excedido. Tente novamente mais tarde.");
            return;
          }
          
          let matchesData = response.response;

          // Ordenar partidas por horário
          matchesData = matchesData.sort((a, b) => {
            return new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime();
          });
          
          setMatches(matchesData);
          setFilteredMatches(matchesData);
        }
      }
    };

    fetchMatches();
  }, [date, sportType, selectedLeagues, selectedTeams, getMatches]);

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
    setSelectedLeagues(prev => 
      prev.includes(leagueId)
        ? prev.filter(id => id !== leagueId)
        : [...prev, leagueId]
    );
  };

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeams(prev => 
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
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

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Buscar Partidas</h1>
      
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
            />
          </div>
          
          <div className="w-full">
            <TeamFilter 
              teams={teams}
              selectedTeams={selectedTeams}
              onSelectTeam={handleSelectTeam}
              onClearTeams={handleClearTeams}
            />
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAllFilters}
              className="text-muted-foreground"
            >
              <FilterX size={16} className="mr-1" />
              Limpar filtros
            </Button>
          </div>
        )}
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
          <p className="text-muted-foreground">
            {hasActiveFilters ? 
              'Tente modificar os filtros aplicados.' : 
              'Tente selecionar outra data ou mudar os critérios de busca.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BuscarPartidas;
