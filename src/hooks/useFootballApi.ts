
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  FootballApiResponse, 
  LeaguesApiResponse, 
  RoundsApiResponse 
} from '@/types/footballApi';
import { toast } from '@/hooks/use-toast';

export const useFootballApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async <T,>(endpoint: string, params: Record<string, string | number>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir os parâmetros da URL
      const searchParams = new URLSearchParams();
      searchParams.append('endpoint', endpoint);
      
      for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value.toString());
      }

      const { data, error } = await supabase.functions.invoke('football-api', {
        query: searchParams,
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsLoading(false);
      return data as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao chamar a API Football';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
      return null;
    }
  };

  const getMatches = (params: Record<string, string | number>) => {
    return callApi<FootballApiResponse>('fixtures', params);
  };

  const getLeagues = (params: Record<string, string | number> = {}) => {
    return callApi<LeaguesApiResponse>('leagues', params);
  };

  const getRounds = (leagueId: number, season: number) => {
    return callApi<RoundsApiResponse>('fixtures/rounds', {
      league: leagueId,
      season: season
    });
  };

  return {
    isLoading,
    error,
    getMatches,
    getLeagues,
    getRounds
  };
};
