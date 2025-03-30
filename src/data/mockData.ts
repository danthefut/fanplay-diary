
import { MatchCardProps } from '@/components/MatchCard';

// Mock data for featured matches
export const featuredMatches: MatchCardProps[] = [
  {
    id: '1',
    homeTeam: {
      name: 'Argentina',
      score: 3,
    },
    awayTeam: {
      name: 'France',
      score: 3,
    },
    date: '2022-12-18T15:00:00Z',
    competition: 'World Cup 2022 Final',
    status: 'finished',
    averageRating: 5,
    isFeatured: true,
  },
  {
    id: '2',
    homeTeam: {
      name: 'Real Madrid',
      score: 2,
    },
    awayTeam: {
      name: 'Bayern Munich',
      score: 1,
    },
    date: '2023-05-01T19:00:00Z',
    competition: 'Champions League Semi-final',
    status: 'finished',
    averageRating: 4.5,
  },
  {
    id: '3',
    homeTeam: {
      name: 'Liverpool',
      score: 3,
    },
    awayTeam: {
      name: 'Manchester City',
      score: 3,
    },
    date: '2023-04-10T15:00:00Z',
    competition: 'Premier League',
    status: 'finished',
    averageRating: 4.8,
  },
];

// Mock data for upcoming matches
export const upcomingMatches: MatchCardProps[] = [
  {
    id: '4',
    homeTeam: {
      name: 'Barcelona',
      score: 0,
    },
    awayTeam: {
      name: 'Atletico Madrid',
      score: 0,
    },
    date: '2024-04-21T19:00:00Z',
    competition: 'La Liga',
    status: 'upcoming',
  },
  {
    id: '5',
    homeTeam: {
      name: 'Arsenal',
      score: 0,
    },
    awayTeam: {
      name: 'Tottenham',
      score: 0,
    },
    date: '2024-04-28T15:00:00Z',
    competition: 'Premier League',
    status: 'upcoming',
  },
  {
    id: '6',
    homeTeam: {
      name: 'PSG',
      score: 0,
    },
    awayTeam: {
      name: 'Marseille',
      score: 0,
    },
    date: '2024-05-05T19:00:00Z',
    competition: 'Ligue 1',
    status: 'upcoming',
  },
];

// Mock data for live matches
export const liveMatches: MatchCardProps[] = [
  {
    id: '7',
    homeTeam: {
      name: 'Juventus',
      score: 2,
    },
    awayTeam: {
      name: 'AC Milan',
      score: 1,
    },
    date: new Date().toISOString(),
    competition: 'Serie A',
    status: 'live',
  },
];

// All matches combined
export const allMatches = [...liveMatches, ...featuredMatches, ...upcomingMatches];

// Mock user data
export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  favoriteTeam?: string;
  bio?: string;
  stats: {
    ratedMatches: number;
    reviewedMatches: number;
    favoriteLeague?: string;
  };
}

export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  username: 'football_fan',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  favoriteTeam: 'Liverpool',
  bio: 'Passionate football fan. I never miss a Liverpool match!',
  stats: {
    ratedMatches: 150,
    reviewedMatches: 75,
    favoriteLeague: 'Premier League',
  },
};

// Mock ratings data
export interface MatchRating {
  id: string;
  matchId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  tags: string[];
  highlights: {
    bestPlayer?: string;
    bestGoal?: string;
  };
  createdAt: string;
  likes: number;
}

export const matchRatings: MatchRating[] = [
  {
    id: '1',
    matchId: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    comment: 'Incredible! Mbappé hat-trick in the final, but Messi deserved the title ❤️',
    tags: ['WorldCup', 'Thrilling', 'DramaticPenalties'],
    highlights: {
      bestPlayer: 'Lionel Messi',
      bestGoal: 'Mbappé\'s volley equalizer',
    },
    createdAt: '2022-12-18T18:30:00Z',
    likes: 247,
  },
  {
    id: '2',
    matchId: '1',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    rating: 5,
    comment: 'Best World Cup final ever! What a rollercoaster of emotions!',
    tags: ['WorldCup', 'ClassicMatch', 'Historic'],
    highlights: {
      bestPlayer: 'Kylian Mbappé',
      bestGoal: 'Di María\'s team goal',
    },
    createdAt: '2022-12-18T19:15:00Z',
    likes: 189,
  },
];

// Community posts
export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  matchId?: string;
  match?: {
    homeTeam: string;
    awayTeam: string;
    competition: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
}

export const communityPosts: CommunityPost[] = [
  {
    id: '1',
    userId: '3',
    userName: 'Michael Brown',
    userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    title: 'Top 10 World Cup Finals of All Time',
    content: 'After yesterday\'s thrilling final, I\'ve updated my list of the greatest World Cup finals ever. Argentina vs France has to be #1!',
    createdAt: '2022-12-19T10:30:00Z',
    likes: 324,
    comments: 87,
  },
  {
    id: '2',
    userId: '4',
    userName: 'Sarah Johnson',
    userAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    title: 'Premier League Title Race Prediction',
    content: 'With Arsenal and Man City neck and neck, who do you think will win the Premier League this season?',
    createdAt: '2023-04-15T14:45:00Z',
    likes: 156,
    comments: 93,
  },
];
