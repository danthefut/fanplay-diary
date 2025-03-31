
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FeaturedMatches from '@/components/FeaturedMatches';
import UpcomingMatches from '@/components/UpcomingMatches';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFootballApi } from '@/hooks/useFootballApi';
import { Match } from '@/types/footballApi';
import { toast } from 'sonner';

const Index = () => {
  const { getMatches } = useFootballApi();
  const [featuredMatches, setFeaturedMatches] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Buscar partidas ao vivo da Premier League (ID 39) e temporada 2023
        const liveMatchesResult = await getMatches({ league: 39, season: 2023, live: 'all' });
        
        // Buscar próximas partidas da Premier League
        const upcomingMatchesResult = await getMatches({ league: 39, season: 2023, status: 'NS', next: 9 });
        
        const featuredData: any[] = [];
        const upcomingData: any[] = [];
        
        // Processar partidas ao vivo ou adicionar partidas destacadas se não houver ao vivo
        if (liveMatchesResult && liveMatchesResult.response) {
          const liveMatches = liveMatchesResult.response;
          
          liveMatches.slice(0, 3).forEach((match: Match) => {
            featuredData.push(convertMatchToCardProps(match, true));
          });
        }
        
        // Se não tivermos 3 partidas ao vivo, adicionar algumas próximas como destacadas
        if (featuredData.length < 3 && upcomingMatchesResult && upcomingMatchesResult.response) {
          const nextMatches = upcomingMatchesResult.response;
          
          nextMatches.slice(0, 3 - featuredData.length).forEach((match: Match) => {
            featuredData.push(convertMatchToCardProps(match, true));
          });
        }
        
        // Processar próximas partidas
        if (upcomingMatchesResult && upcomingMatchesResult.response) {
          const upcomingMatchesList = upcomingMatchesResult.response;
          
          upcomingMatchesList.forEach((match: Match) => {
            upcomingData.push(convertMatchToCardProps(match));
          });
        }
        
        setFeaturedMatches(featuredData);
        setUpcomingMatches(upcomingData);
      } catch (error) {
        console.error('Erro ao buscar partidas:', error);
        toast.error('Erro ao carregar partidas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);
  
  // Função para converter os dados da API para o formato esperado pelos componentes
  const convertMatchToCardProps = (match: Match, isFeatured = false) => {
    return {
      id: match.fixture.id.toString(),
      homeTeam: {
        name: match.teams.home.name,
        logo: match.teams.home.logo,
        score: match.goals?.home ?? 0
      },
      awayTeam: {
        name: match.teams.away.name,
        logo: match.teams.away.logo,
        score: match.goals?.away ?? 0
      },
      date: match.fixture.date,
      competition: match.league.name,
      status: match.fixture.status.short === 'NS' 
        ? 'upcoming' 
        : (match.fixture.status.short === '1H' || match.fixture.status.short === '2H' || match.fixture.status.short === 'HT' || 
           match.fixture.status.short === 'Q1' || match.fixture.status.short === 'Q2' || 
           match.fixture.status.short === 'Q3' || match.fixture.status.short === 'Q4')
          ? 'live'
          : 'finished',
      averageRating: Math.random() * 2 + 3, // Placeholder para avaliações (3-5 estrelas)
      isFeatured
    };
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <section className="relative bg-field-gradient py-16 md:py-24">
        <div className="absolute inset-0 bg-stadium-pattern opacity-10"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Avalie, Discuta e Celebre Partidas</h1>
            <p className="text-white/90 text-lg mb-8">Junte-se à comunidade de fãs apaixonados por esportes. Compartilhe suas opiniões sobre partidas, siga seus times favoritos e descubra os jogos mais emocionantes.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Trophy className="mr-2 h-5 w-5" />
                  Entrar para FanPlay
                </Button>
              </Link>
              <Link to="/buscar-partidas">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Buscar Partidas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured matches section */}
      <FeaturedMatches matches={featuredMatches} />
      
      {/* Upcoming matches section */}
      <UpcomingMatches matches={upcomingMatches} />
      
      {/* App features */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">A Plataforma Definitiva para Fãs de Esportes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Avalie Partidas</h3>
              <p className="text-muted-foreground">Dê notas de 1 a 5 estrelas e compartilhe suas impressões sobre qualquer partida de futebol ou basquete no mundo.</p>
            </div>
            
            <div className="p-6 border rounded-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entre na Comunidade</h3>
              <p className="text-muted-foreground">Conecte-se com outros fãs, compartilhe suas opiniões e descubra partidas bem avaliadas.</p>
            </div>
            
            <div className="p-6 border rounded-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Acompanhe seu Histórico</h3>
              <p className="text-muted-foreground">Construa seu perfil, mostre seu time favorito e mantenha um registro das partidas que você avaliou.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-team-primary text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Trophy className="h-6 w-6 text-accent" />
              <span className="font-bold text-xl">FanPlay</span>
            </div>
            
            <div className="flex gap-8">
              <Link to="/" className="text-white/70 hover:text-white transition-colors">Início</Link>
              <Link to="/buscar-partidas" className="text-white/70 hover:text-white transition-colors">Buscar Partidas</Link>
              <Link to="/ratings" className="text-white/70 hover:text-white transition-colors">Avaliações</Link>
              <Link to="/community" className="text-white/70 hover:text-white transition-colors">Comunidade</Link>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-white/50">
              © 2024 FanPlay. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
