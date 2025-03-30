
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FOOTBALL_API_KEY = Deno.env.get('FOOTBALL_API_KEY');
const API_URL = "https://v3.football.api-sports.io";

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
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    const params = {};
    
    // Extrair todos os parâmetros da solicitação
    for (const [key, value] of url.searchParams.entries()) {
      if (key !== 'endpoint') {
        params[key] = value;
      }
    }

    console.log(`Buscando dados da API Football: ${endpoint}`, params);

    // Construir a URL da API com os parâmetros
    let apiUrl = `${API_URL}/${endpoint}?`;
    for (const [key, value] of Object.entries(params)) {
      apiUrl += `${key}=${value}&`;
    }
    
    // Remover o último '&'
    apiUrl = apiUrl.slice(0, -1);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-apisports-key': FOOTBALL_API_KEY,
      },
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função football-api:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
