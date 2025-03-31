
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FOOTBALL_API_KEY = Deno.env.get('FOOTBALL_API_KEY');
const API_URL = "https://v3.football.api-sports.io";
const BASKETBALL_API_URL = "https://v1.basketball.api-sports.io"; // Changed to v1 API

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Lidar com solicitações CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, params, sport = 'football' } = await req.json();
    
    if (!endpoint) {
      throw new Error('Endpoint não especificado');
    }
    
    // Validação de temporada para evitar erros no plano gratuito
    let validatedParams = { ...params };
    
    // Se estivermos usando o plano gratuito e a temporada for maior que 2023, ajuste para 2023
    if (params && params.season && Number(params.season) > 2023) {
      console.log(`Ajustando temporada de ${params.season} para 2023 (limite do plano gratuito)`);
      validatedParams.season = 2023;
    }
    
    console.log(`Buscando dados da API ${sport === 'football' ? 'Football' : 'Basketball'}: ${endpoint}`, validatedParams);

    // Determinar qual URL da API usar com base no esporte
    const baseUrl = sport === 'football' ? API_URL : BASKETBALL_API_URL;
    
    // Construir a URL da API com os parâmetros
    let apiUrl = `${baseUrl}/${endpoint}`;
    
    if (validatedParams && Object.keys(validatedParams).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(validatedParams)) {
        searchParams.append(key, String(value));
      }
      apiUrl += `?${searchParams.toString()}`;
    }
    
    console.log(`URL completa: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-apisports-key': FOOTBALL_API_KEY,
      },
    });

    const data = await response.json();
    
    // Adicionar informações para debug no lado do cliente
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.log('Erro na resposta da API:', data.errors);
    } else {
      console.log(`Resposta da API ${endpoint} bem-sucedida: ${data.results} resultados`);
    }
    
    // Se recebemos erro de limite de taxa, adicionar cabeçalho de retry-after
    let responseHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };
    if (data.errors && (data.errors.rateLimit || data.errors.requests)) {
      responseHeaders['Retry-After'] = '60'; // Sugerir retry após 60 segundos
      
      // Para problemas de limite de requisições, enviar resposta personalizada com mensagem clara
      if (data.errors.requests) {
        return new Response(JSON.stringify({
          error: true,
          message: "Limite de requisições diárias atingido. Por favor, tente novamente amanhã.",
          originalError: data.errors.requests
        }), {
          status: 429,
          headers: responseHeaders,
        });
      }
    }
    
    return new Response(JSON.stringify(data), {
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Erro na função ${req.url}: ${error.message}`);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
