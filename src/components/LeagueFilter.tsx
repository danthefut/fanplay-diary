
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem, 
  DropdownMenuCheckboxItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { League } from '@/types/footballApi';

interface LeagueFilterProps {
  leagues: League[];
  selectedLeagues: number[];
  onSelectLeague: (leagueId: number) => void;
  onClearLeagues: () => void;
}

const LeagueFilter = ({ leagues, selectedLeagues, onSelectLeague, onClearLeagues }: LeagueFilterProps) => {
  const selectedCount = selectedLeagues.length;
  const hasSelectedLeagues = selectedCount > 0;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
        >
          <span className="truncate">
            {hasSelectedLeagues 
              ? `${selectedCount} liga${selectedCount > 1 ? 's' : ''} selecionada${selectedCount > 1 ? 's' : ''}` 
              : 'Selecionar ligas'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
        <DropdownMenuLabel>Ligas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {hasSelectedLeagues && (
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={onClearLeagues}
          >
            Limpar seleção
          </DropdownMenuItem>
        )}
        
        {leagues.length > 0 ? (
          leagues.map((league) => (
            <DropdownMenuCheckboxItem
              key={league.id}
              checked={selectedLeagues.includes(league.id)}
              onSelect={(e) => e.preventDefault()}
              onClick={() => onSelectLeague(league.id)}
            >
              <div className="flex items-center gap-2 w-full">
                {league.logo && (
                  <img 
                    src={league.logo} 
                    alt={league.name} 
                    className="w-5 h-5 object-contain" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                )}
                <span className="truncate">{league.name}</span>
              </div>
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuItem disabled>Nenhuma liga disponível</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeagueFilter;
