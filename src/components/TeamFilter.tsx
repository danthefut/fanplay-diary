
import React from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { TeamInfo } from '@/types/footballApi';

interface TeamFilterProps {
  teams: TeamInfo[];
  selectedTeams: number[];
  onSelectTeam: (teamId: number) => void;
  onClearTeams: () => void;
}

const TeamFilter = ({ teams, selectedTeams, onSelectTeam, onClearTeams }: TeamFilterProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const selectedCount = selectedTeams.length;
  const hasSelectedTeams = selectedCount > 0;
  
  const filteredTeams = React.useMemo(() => {
    if (!searchQuery.trim()) return teams;
    
    const query = searchQuery.toLowerCase();
    return teams.filter(team => 
      team.name.toLowerCase().includes(query) || 
      team.country.toLowerCase().includes(query)
    );
  }, [teams, searchQuery]);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
        >
          <span className="truncate">
            {hasSelectedTeams 
              ? `${selectedCount} time${selectedCount > 1 ? 's' : ''} selecionado${selectedCount > 1 ? 's' : ''}` 
              : 'Selecionar times'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
        <DropdownMenuLabel>Times</DropdownMenuLabel>
        <div className="px-2 py-1.5">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar times..."
              className="pl-8 h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {hasSelectedTeams && (
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={onClearTeams}
          >
            Limpar seleção
          </DropdownMenuItem>
        )}
        
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <DropdownMenuCheckboxItem
              key={team.id}
              checked={selectedTeams.includes(team.id)}
              onSelect={(e) => e.preventDefault()}
              onClick={() => onSelectTeam(team.id)}
            >
              <div className="flex items-center gap-2 w-full">
                {team.logo && (
                  <img 
                    src={team.logo} 
                    alt={team.name} 
                    className="w-5 h-5 object-contain" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                )}
                <span className="truncate">{team.name}</span>
              </div>
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            {searchQuery ? 'Nenhum time encontrado' : 'Nenhum time disponível'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamFilter;
