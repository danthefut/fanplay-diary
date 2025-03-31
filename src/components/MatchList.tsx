
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Match } from '@/types/footballApi';
import { cn } from '@/lib/utils';

interface MatchListProps {
  matches: Match[];
  onMatchClick: (match: Match) => void;
  sportType: 'football' | 'basketball';
}

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

const MatchList = ({ matches, onMatchClick, sportType }: MatchListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map(match => (
        <div 
          key={match.fixture.id} 
          className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onMatchClick(match)}
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-muted-foreground">
                {format(new Date(match.fixture.date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
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
      ))}
    </div>
  );
};

export default MatchList;
