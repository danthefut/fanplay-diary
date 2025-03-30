
export interface Team {
  id: number;
  name: string;
  logo: string;
  winner?: boolean;
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}

export interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
}

export interface Match {
  fixture: Fixture;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: Score;
}

export interface FootballApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: Match[];
}

export interface Season {
  year: number;
}

export interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: string;
}

export interface LeagueResponse {
  league: League;
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: Season[];
}

export interface LeaguesApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: LeagueResponse[];
}

export interface Round {
  round: string;
}

export interface RoundsApiResponse {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: Round[];
}
