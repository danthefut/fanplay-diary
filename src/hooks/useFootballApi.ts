
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FootballApiResponse } from '@/types/footballApi';

export const useFootballApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchFromFootballApi = async <T>(
    endpoint: string, 
    params?: Record<string, string | number>
  ): Promise<FootballApiResponse<T> | null> => {
    setIsLoading(true);
    
    try {
      const queryParams = params ? new URLSearchParams() : undefined;
      
      if (params && queryParams) {
        Object.entries(params).forEach(([key, value]) => {
          queryParams.append(key, value.toString());
        });
      }
      
      const queryString = queryParams ? `?${queryParams.toString()}` : '';
      
      const { data, error } = await supabase.functions.invoke('football-api', {
        body: {
          endpoint: `${endpoint}${queryString}`
        }
      });
      
      if (error) {
        console.error('Error calling Football API:', error);
        return null;
      }
      
      return data as FootballApiResponse<T>;
    } catch (error) {
      console.error('Error in fetchFromFootballApi:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getMatches = (params?: Record<string, string | number>) => 
    fetchFromFootballApi('fixtures', params);
  
  const getLeagues = (params?: Record<string, string | number>) => 
    fetchFromFootballApi('leagues', params);
  
  const getRounds = (leagueId: number, season: number) => 
    fetchFromFootballApi('fixtures/rounds', { league: leagueId, season });

  return {
    isLoading,
    getMatches,
    getLeagues,
    getRounds
  };
};
