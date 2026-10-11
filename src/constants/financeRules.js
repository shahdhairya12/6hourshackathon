/**
 * PULSE OS - Core Financial Constants & Configuration
 * 
 * Formal definitions for the ₹10,000 / 30-Day Gen Z Financial Survival Engine.
 */

/** Initial total monthly budget allocated to the user */
export const INITIAL_MONTHLY_BUDGET = 10000;

/** Total duration of the simulation cycle in days */
export const TOTAL_SIMULATION_DAYS = 30;

/** Minimum financial health score floor */
export const MIN_HEALTH_SCORE = 10;

/** Maximum financial health score ceiling */
export const MAX_HEALTH_SCORE = 98;

/** Default emergency buffer target */
export const DEFAULT_EMERGENCY_BUFFER = 500;

/** Wishlist impulse delay duration in hours */
export const WISHLIST_COOLDOWN_HOURS = 48;

/** Risk classification thresholds */
export const RISK_THRESHOLDS = {
  LOW: 30,
  MODERATE: 65,
  HIGH: 85,
  CRITICAL: 100,
};

/** Health status classification tiers */
export const HEALTH_TIERS = {
  THRIVING: { min: 80, label: 'Thriving', color: '#10b981', emoji: '💎' },
  STABLE: { min: 60, label: 'Stable', color: '#06b6d4', emoji: '⚡' },
  VULNERABLE: { min: 40, label: 'Vulnerable', color: '#f59e0b', emoji: '⚠️' },
  CRITICAL: { min: 0, label: 'Critical Risk', color: '#f43f5e', emoji: '🚨' },
};

/** Storage keys for LocalStorage persistence */
export const STORAGE_KEYS = {
  PERSONA_ID: 'pulse_persona_id',
  CURRENT_DAY: 'pulse_current_day',
  SOUND_ENABLED: 'pulse_sound_enabled',
  SLANG_MODE: 'pulse_slang_mode',
  COMMITMENTS: 'pulse_commitments',
  SUBSCRIPTIONS: 'pulse_subscriptions',
  SAVINGS_GOALS: 'pulse_savings_goals',
  TRANSACTIONS: 'pulse_transactions',
  WISHLIST: 'pulse_wishlist',
  CURVEBALL_HISTORY: 'pulse_curveball_history',
};
