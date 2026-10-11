/**
 * @file finance.d.ts
 * @description Comprehensive TypeScript type definitions for the PULSE Gen Z Financial OS.
 * Provides compile-time contracts, domain models, and strict interface validation.
 * @author PULSE OS Architecture Group
 */

export type TransactionType = 'expense' | 'income' | 'commitment' | 'subscription';

export type CategorySlug = 
  | 'food' 
  | 'living' 
  | 'commute' 
  | 'bills' 
  | 'utilities' 
  | 'entertainment' 
  | 'health' 
  | 'education' 
  | 'work' 
  | 'shopping' 
  | 'budget';

export interface Transaction {
  id: string;
  day: number;
  name: string;
  amount: number;
  type: TransactionType;
  category: CategorySlug;
  note?: string;
}

export interface Commitment {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: CategorySlug;
  paid: boolean;
  icon: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  active: boolean;
  icon: string;
  category: CategorySlug;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadlineDay: number;
  icon: string;
  color: string;
}

export interface SimulationScenario {
  name: string;
  amount: number;
  category: CategorySlug;
  icon: string;
  frequency: 'one-off' | 'recurring-daily' | 'recurring-weekly';
  active: boolean;
}

export interface ConsequenceMatrix {
  simLiquid: number;
  simFreeCash: number;
  simSafeDaily: number;
  dailyDrop: number;
  simRisk: number;
  simHealth: number;
  simRunway: number;
  verdict: {
    status: 'safe' | 'warning' | 'danger' | 'caution';
    headline: string;
    analysis: string;
    action: string;
  };
}

export interface GamificationBadge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export interface GamificationState {
  level: number;
  title: string;
  badges: GamificationBadge[];
  unlockedCount: number;
}

export interface MonteCarloResult {
  survivalRate: number;
  medianOutcome: number;
  worstCase: number;
  bestCase: number;
  fanPoints?: Array<{
    day: number;
    p10: number;
    p50: number;
    p90: number;
  }>;
}

export interface DefconState {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  action: string;
  spendFreeze: boolean;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tagline: string;
  startingBudget: number;
  commitments: Commitment[];
  subscriptions: Subscription[];
  savingsGoals: SavingsGoal[];
  initialTransactions: Transaction[];
}
