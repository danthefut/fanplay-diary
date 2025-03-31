
  // Renderiza uma partida
  const renderMatch = (match: Match) => {
    const matchDate = new Date(match.fixture.date);
    const formattedDate = format(matchDate, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    
    return (
      <div 
        key={match.fixture.id} 
        className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleMatchClick(match)}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-muted-foreground">
              {formattedDate}
            </div>
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              match.fixture.status.short === 'NS' ? "bg-muted text-muted-foreground" :
              (match.fixture.status.short === '1H' || match.fixture.status.short === '2H' || match.fixture.status.short === 'HT' ||
               match.fixture.status.short === 'Q1' || match.fixture.status.short === 'Q2' || match.fixture.status.short === 'Q3' || match.fixture.status.short === 'Q4') ? 
              "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"
            )}>
              {getMatchStatus(match)}
              {match.fixture.status.elapsed && 
               (match.fixture.status.short === '1H' || match.fixture.status.short === '2H' ||
                match.fixture.status.short === 'Q1' || match.fixture.status.short === 'Q2' || 
                match.fixture.status.short === 'Q3' || match.fixture.status.short === 'Q4') && 
                `'${match.fixture.status.elapsed}`}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <img 
                src={match.league.logo} 
                alt={match.league.name} 
                className="w-6 h-6 object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <span className="text-sm font-medium">{match.league.name}</span>
            </div>
            <div className="text-xs">{match.league.round}</div>
          </div>
          
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col items-center text-center w-2/5">
              <img 
                src={match.teams.home.logo} 
                alt={match.teams.home.name} 
                className="w-12 h-12 object-contain mb-2" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <h3 className="text-sm font-semibold">{match.teams.home.name}</h3>
            </div>
            
            <div className="text-center">
              {match.fixture.status.short !== 'NS' ? (
                <div className="text-2xl font-bold">
                  {match.goals?.home ?? match.score?.halftime?.home ?? 0} - {match.goals?.away ?? match.score?.halftime?.away ?? 0}
                </div>
              ) : (
                <div className="text-xl font-medium">vs</div>
              )}
            </div>
            
            <div className="flex flex-col items-center text-center w-2/5">
              <img 
                src={match.teams.away.logo} 
                alt={match.teams.away.name} 
                className="w-12 h-12 object-contain mb-2" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <h3 className="text-sm font-semibold">{match.teams.away.name}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  };
