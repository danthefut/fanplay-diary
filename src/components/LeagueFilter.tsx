
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
import { League } from '@/types/footballApi';

export interface LeagueFilterProps {
  leagues: League[];
  selectedLeagues: number[];
  onSelectLeague: (leagueId: number) => void;
  onClearLeagues: () => void;
  isLoading?: boolean; // Added isLoading prop
}

const LeagueFilter = ({ 
  leagues, 
  selectedLeagues, 
  onSelectLeague, 
  onClearLeagues,
  isLoading = false // Default value
}: LeagueFilterProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLeagues.length > 0 ? (
            <div className="flex items-center gap-1 truncate">
              <span>
                {leagues.find(league => league.id === selectedLeagues[0])?.name || 'Liga selecionada'}
              </span>
              {selectedLeagues.length > 1 && <span>+{selectedLeagues.length - 1}</span>}
            </div>
          ) : (
            "Selecione as ligas"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar ligas..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Carregando ligas...</span>
                </div>
              ) : (
                "Nenhuma liga encontrada"
              )}
            </CommandEmpty>
            <CommandGroup>
              {leagues.map((league) => (
                <CommandItem
                  key={league.id}
                  value={league.name}
                  onSelect={() => {
                    onSelectLeague(league.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
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
                  <span>{league.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedLeagues.includes(league.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedLeagues.length > 0 && (
            <div className="flex items-center justify-end p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault();
                  onClearLeagues();
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

export default LeagueFilter;
