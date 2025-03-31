
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TeamInfo } from '@/types/footballApi';

export interface TeamFilterProps {
  teams: TeamInfo[];
  selectedTeams: number[];
  onSelectTeam: (teamId: number) => void;
  onClearTeams: () => void;
  isLoading?: boolean; // Added isLoading prop
  disabled?: boolean;
}

const TeamFilter = ({ 
  teams, 
  selectedTeams, 
  onSelectTeam, 
  onClearTeams,
  isLoading = false, // Default value
  disabled = false
}: TeamFilterProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTeams.length > 0 ? (
            <div className="flex items-center gap-1 truncate">
              <span>
                {teams.find(team => team.id === selectedTeams[0])?.name || 'Time selecionado'}
              </span>
              {selectedTeams.length > 1 && <span>+{selectedTeams.length - 1}</span>}
            </div>
          ) : (
            "Selecione os times"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar times..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Carregando times...</span>
                </div>
              ) : (
                "Nenhum time encontrado"
              )}
            </CommandEmpty>
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.name}
                  onSelect={() => {
                    onSelectTeam(team.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
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
                  <span>{team.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTeams.includes(team.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedTeams.length > 0 && (
            <div className="flex items-center justify-end p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault();
                  onClearTeams();
                }}
                className="h-8 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Limpar seleção
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TeamFilter;
