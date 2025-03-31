
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FOOTBALL_API_KEY = Deno.env.get('FOOTBALL_API_KEY');
const API_URL = "https://v3.football.api-sports.io";
const BASKETBALL_API_URL = "https://v3.basketball.api-sports.io";

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
    
    console.log(`Buscando dados da API ${sport === 'football' ? 'Football' : 'Basketball'}: ${endpoint}`, params);

    // Determinar qual URL da API usar com base no esporte
    const baseUrl = sport === 'football' ? API_URL : BASKETBALL_API_URL;
    
    // Construir a URL da API com os parâmetros
    let apiUrl = `${baseUrl}/${endpoint}`;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
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
    console.log('Resposta da API:', data);
    
    // Se recebemos erro de limite de taxa, adicionar cabeçalho de retry-after
    let responseHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };
    if (data.errors && data.errors.rateLimit) {
      responseHeaders['Retry-After'] = '60'; // Sugerir retry após 60 segundos
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
