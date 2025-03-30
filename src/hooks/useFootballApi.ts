
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FootballApiResponse, Match, LeagueResponse, Round } from '@/types/footballApi';

export const useFootballApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchFromFootballApi = async <T extends any>(
    endpoint: string, 
    params?: Record<string, string | number>
  ): Promise<FootballApiResponse<T> | null> => {
    setIsLoading(true);
    
    try {
      console.log(`Calling Football API: ${endpoint}`, params);
      
      const { data, error } = await supabase.functions.invoke('football-api', {
        body: {
          endpoint,
          params
        }
      });
      
      if (error) {
        console.error('Error calling Football API:', error);
        return null;
      }
      
      console.log('Football API response:', data);
      return data as FootballApiResponse<T>;
    } catch (error) {
      console.error('Error in fetchFromFootballApi:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getMatches = (params?: Record<string, string | number>) => 
    fetchFromFootballApi<Match>('fixtures', params);
  
  const getLeagues = (params?: Record<string, string | number>) => 
    fetchFromFootballApi<LeagueResponse>('leagues', params);
  
  const getRounds = (leagueId: number, season: number) => 
    fetchFromFootballApi<Round>('fixtures/rounds', { league: leagueId, season });

  return {
    isLoading,
    getMatches,
    getLeagues,
    getRounds
  };
};
