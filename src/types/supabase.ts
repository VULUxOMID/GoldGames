export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  total_gold: number;
  games_played: number;
  win_rate: number;
  created_at: string;
  updated_at: string;
}

export interface GamingSession {
  id: string;
  user_id: string;
  game_type: string;
  start_time: string;
  end_time: string | null;
  score: number;
  created_at: string;
}

export interface GoldTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export type ProfileUpdateData = Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;

export type GamingSessionCreateData = Omit<GamingSession, 'id' | 'created_at'>;

export type GoldTransactionCreateData = Omit<GoldTransaction, 'id' | 'created_at'>;