
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FootballApiResponse, Match, LeagueResponse, Round } from '@/types/footballApi';

export const useFootballApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchFromSportsApi = async <T extends any>(
    endpoint: string, 
    params?: Record<string, string | number>,
    sport: 'football' | 'basketball' = 'football'
  ): Promise<FootballApiResponse<T> | null> => {
    setIsLoading(true);
    
    try {
      console.log(`Chamando API de ${sport === 'football' ? 'futebol' : 'basquete'}: ${endpoint}`, params);
      
      const { data, error } = await supabase.functions.invoke('football-api', {
        body: {
          endpoint,
          params,
          sport
        }
      });
      
      if (error) {
        console.error(`Erro ao chamar API de ${sport === 'football' ? 'futebol' : 'basquete'}:`, error);
        return null;
      }
      
      console.log(`Resposta da API de ${sport === 'football' ? 'futebol' : 'basquete'}:`, data);
      return data as FootballApiResponse<T>;
    } catch (error) {
      console.error(`Erro em fetchFromSportsApi (${sport}):`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getMatches = (params?: Record<string, string | number>, sport: 'football' | 'basketball' = 'football') => 
    fetchFromSportsApi<Match>('fixtures', params, sport);
  
  const getLeagues = (params?: Record<string, string | number>, sport: 'football' | 'basketball' = 'football') => 
    fetchFromSportsApi<LeagueResponse>('leagues', params, sport);
  
  const getRounds = (leagueId: number, season: number, sport: 'football' | 'basketball' = 'football') => 
    fetchFromSportsApi<Round>('fixtures/rounds', { league: leagueId, season }, sport);

  return {
    isLoading,
    getMatches,
    getLeagues,
    getRounds
  };
};
