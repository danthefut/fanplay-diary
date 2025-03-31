
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FootballApiResponse, Match, LeagueResponse, Round, TeamResponse } from '@/types/footballApi';
import { toast } from "sonner";

// Cache simples para reduzir o número de requisições
const apiCache = new Map<string, {
  data: any,
  timestamp: number
}>();

// Tempo de cache em milissegundos (5 minutos)
const CACHE_TIME = 5 * 60 * 1000;

export const useFootballApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map());

  const getCacheKey = (endpoint: string, params?: Record<string, string | number>, sport: string = 'football') => {
    return `${sport}:${endpoint}:${JSON.stringify(params || {})}`;
  };

  const fetchFromSportsApi = async <T extends any>(
    endpoint: string, 
    params?: Record<string, string | number>,
    sport: 'football' | 'basketball' = 'football'
  ): Promise<FootballApiResponse<T> | null> => {
    const cacheKey = getCacheKey(endpoint, params, sport);
    
    // Verificar se já existe um request pendente para esta mesma chamada
    if (pendingRequests.current.has(cacheKey)) {
      console.log(`Aguardando request pendente para ${cacheKey}`);
      return pendingRequests.current.get(cacheKey);
    }
    
    // Verificar se temos dados em cache ainda válidos
    const cachedData = apiCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TIME) {
      console.log(`Usando dados em cache para ${cacheKey}`);
      return cachedData.data;
    }
    
    setIsLoading(true);
    
    // Ajustar temporada para 2023 se for maior (já que o plano gratuito só suporta até 2023)
    let validParams = { ...params };
    if (validParams && validParams.season && Number(validParams.season) > 2023) {
      console.log(`Ajustando temporada de ${validParams.season} para 2023 (limite do plano gratuito)`);
      validParams.season = 2023;
    }
    
    try {
      console.log(`Chamando API de ${sport === 'football' ? 'futebol' : 'basquete'}: ${endpoint}`, validParams);
      
      // Criar uma promise e armazená-la para evitar chamadas duplicadas
      const promise = (async () => {
        const { data, error } = await supabase.functions.invoke('football-api', {
          body: {
            endpoint,
            params: validParams,
            sport
          }
        });
        
        if (error) {
          console.error(`Erro ao chamar API de ${sport === 'football' ? 'futebol' : 'basquete'}:`, error);
          toast.error(`Erro ao buscar dados: ${error.message}`);
          return null;
        }
        
        // Se recebemos erro de limite de requisições diárias
        if (data && data.error && data.message) {
          console.error(`Erro na resposta da API:`, data.message);
          toast.error(data.message);
          return null;
        }
        
        // Verificar outros erros da API
        if (data && data.errors && Object.keys(data.errors).length > 0) {
          const errorMessage = data.errors.rateLimit || data.errors.requests || data.errors.plan || Object.values(data.errors)[0];
          console.error(`Erro na resposta da API:`, errorMessage);
          
          // Mensagens de erro mais específicas
          if (data.errors.requests) {
            toast.error(`Limite de requisições excedido. Tente novamente mais tarde.`);
          } else if (data.errors.plan) {
            toast.error(`Erro no plano: ${data.errors.plan}`);
          } else {
            toast.error(`Erro na API: ${errorMessage}`);
          }
          return null;
        }
        
        // Armazenar dados em cache
        apiCache.set(cacheKey, {
          data: data as FootballApiResponse<T>,
          timestamp: Date.now()
        });
        
        console.log(`Resposta da API de ${sport === 'football' ? 'futebol' : 'basquete'}:`, data);
        return data as FootballApiResponse<T>;
      })();
      
      pendingRequests.current.set(cacheKey, promise);
      
      const result = await promise;
      pendingRequests.current.delete(cacheKey);
      return result;
    } catch (error) {
      console.error(`Erro em fetchFromSportsApi (${sport}):`, error);
      toast.error(`Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}`);
      pendingRequests.current.delete(cacheKey);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Para basquete, usamos 'games' em vez de 'fixtures'
  const getMatches = (params?: Record<string, string | number>, sport: 'football' | 'basketball' = 'football') => 
    fetchFromSportsApi<Match>(sport === 'football' ? 'fixtures' : 'games', params, sport);
  
  const getLeagues = (params?: Record<string, string | number>, sport: 'football' | 'basketball' = 'football') => 
    fetchFromSportsApi<LeagueResponse>('leagues', params, sport);
  
  const getRounds = (leagueId: number, season: number, sport: 'football' | 'basketball' = 'football') => 
    fetchFromSportsApi<Round>('fixtures/rounds', { league: leagueId, season }, sport);

  const getTeams = (params?: Record<string, string | number>, sport: 'football' | 'basketball' = 'football') => 
    fetchFromSportsApi<TeamResponse>('teams', params, sport);
    
  // Função para limpar o cache
  const clearCache = (endpoint?: string, params?: Record<string, string | number>, sport?: 'football' | 'basketball') => {
    if (endpoint) {
      const cacheKey = getCacheKey(endpoint, params, sport);
      apiCache.delete(cacheKey);
    } else {
      apiCache.clear();
    }
  };

  return {
    isLoading,
    getMatches,
    getLeagues,
    getRounds,
    getTeams,
    clearCache
  };
};
