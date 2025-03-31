
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFootballApi } from '@/hooks/useFootballApi';
import { Match } from '@/types/footballApi';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search, Football, BallBasketball } from 'lucide-react';

// Define o status da partida em português
const getMatchStatus = (match: Match) => {
  const statusMap: Record<string, string> = {
    'NS': 'Não iniciado',
    'TBD': 'A definir',
    '1H': '1º tempo',
    '2H': '2º tempo',
    'HT': 'Intervalo',
    'ET': 'Prorrogação',
    'BT': 'Intervalo (Prorr.)',
    'P': 'Pênaltis',
    'FT': 'Encerrado',
    'AET': 'Após Prorrogação',
    'PEN': 'Após Pênaltis',
    'SUSP': 'Suspenso',
    'INT': 'Interrompido',
    'PST': 'Adiado',
    'CANC': 'Cancelado',
    'ABD': 'Abandonado',
    'AWD': 'Decisão Técnica',
    'WO': 'W.O.',
    'LIVE': 'Ao vivo',
    'Q1': '1º quarto',
    'Q2': '2º quarto',
    'Q3': '3º quarto',
    'Q4': '4º quarto',
    'OT': 'Prorrogação',
  };

  return statusMap[match.fixture.status.short] || match.fixture.status.long;
};

const BuscarPartidas = () => {
  const navigate = useNavigate();
  const { isLoading, getMatches, getLeagues } = useFootballApi();
  const [sportType, setSportType] = useState<'football' | 'basketball'>('football');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

  // Busca partidas quando a página é carregada ou quando o tipo de esporte ou a data muda
  useEffect(() => {
    const fetchMatches = async () => {
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const params = { date: formattedDate };
        const response = await getMatches(params, sportType);
        
        if (response && response.response) {
          // Filtra as ligas de acordo com o esporte
          let filteredMatches: Match[] = [];
          
          if (sportType === 'football') {
            // Ligas principais de futebol (incluindo Brasileirão e Copa do Mundo)
            const majorLeagueIds = [1, 2, 3, 4, 5, 39, 71, 135, 140, 61, 78, 1];
            filteredMatches = response.response.filter(match => 
              majorLeagueIds.includes(match.league.id)
            );
          } else {
            // NBA e outras ligas de basquete
            filteredMatches = response.response;
          }
          
          setMatches(filteredMatches);
          setFilteredMatches(filteredMatches);
        }
      }
    };

    fetchMatches();
  }, [date, sportType, getMatches]);

  // Filtra partidas com base na pesquisa
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

  // Renderiza uma partida
  const renderMatch = (match: Match) => {
    const matchDate = new Date(match.fixture.date);
    const formattedDate = format(matchDate, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    
    return (
      <div 
        key={match.fixture.id} 
        className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleMatchClick(match)}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-muted-foreground">
              {formattedDate}
            </div>
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              match.fixture.status.short === 'NS' ? "bg-muted text-muted-foreground" :
              (match.fixture.status.short === '1H' || match.fixture.status.short === '2H' || match.fixture.status.short === 'HT' ||
               match.fixture.status.short === 'Q1' || match.fixture.status.short === 'Q2' || match.fixture.status.short === 'Q3' || match.fixture.status.short === 'Q4') ? 
              "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"
            )}>
              {getMatchStatus(match)}
              {match.fixture.status.elapsed && 
               (match.fixture.status.short === '1H' || match.fixture.status.short === '2H' ||
                match.fixture.status.short === 'Q1' || match.fixture.status.short === 'Q2' || 
                match.fixture.status.short === 'Q3' || match.fixture.status.short === 'Q4') && 
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
                  {match.goals?.home ?? 0} - {match.goals?.away ?? 0}
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
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Buscar Partidas</h1>
      
      <Tabs defaultValue="football" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="football" 
            onClick={() => setSportType('football')}
            className="flex items-center gap-2"
          >
            <Football size={18} />
            Futebol
          </TabsTrigger>
          <TabsTrigger 
            value="basketball" 
            onClick={() => setSportType('basketball')}
            className="flex items-center gap-2"
          >
            <BallBasketball size={18} />
            Basquete
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar por times ou ligas..."
              className="w-full px-10 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
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
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map(match => renderMatch(match))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            Nenhuma partida encontrada para esta data.
          </p>
          <p className="text-muted-foreground">
            Tente selecionar outra data ou mudar os critérios de busca.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuscarPartidas;
