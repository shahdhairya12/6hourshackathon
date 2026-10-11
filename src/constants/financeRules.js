/**
 * @file financeRules.js
 * @description Formal definitions, mathematical bounds, and operational thresholds
 * for the PULSE Gen Z Financial OS (₹10,000 / 30-Day Budget Engine).
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

/** Initial total monthly budget allocated to the user in INR */
export const INITIAL_MONTHLY_BUDGET = 10000;

/** Total duration of the simulation cycle in days */
export const TOTAL_SIMULATION_DAYS = 30;

/** Minimum financial health score floor */
export const MIN_HEALTH_SCORE = 10;

/** Maximum financial health score ceiling */
export const MAX_HEALTH_SCORE = 98;

/** Default emergency buffer target in INR */
export const DEFAULT_EMERGENCY_BUFFER = 500;

/** Minimum recommended emergency buffer target in INR */
export const RECOMMENDED_EMERGENCY_BUFFER = 1200;

/** Wishlist impulse delay duration in hours */
export const WISHLIST_COOLDOWN_HOURS = 48;

/**
 * Monte Carlo Stochastic Simulation Parameters
 * @readonly
 */
export const MONTE_CARLO_CONFIG = {
  DEFAULT_TRIALS: 350,
  DAILY_SPEND_VARIANCE_BASE: 0.8,
  DAILY_SPEND_VARIANCE_RANGE: 0.45,
  VOLATILITY_SIGMA: 0.22,
  DAILY_SHOCK_PROBABILITY: 0.08,
  DAILY_SHOCK_MIN: 150,
  DAILY_SHOCK_MAX_ADD: 450,
  MIN_DAILY_PACE_FLOOR: 80,
  P10_PERCENTILE: 0.10,
  P50_PERCENTILE: 0.50,
  P90_PERCENTILE: 0.90,
};

/**
 * Risk classification thresholds (Score between 5 and 99)
 * @readonly
 * @enum {number}
 */
export const RISK_THRESHOLDS = {
  LOW: 28,
  MODERATE: 52,
  ELEVATED: 75,
  CRITICAL: 100,
};

/**
 * Health status classification tiers with visual tokens and descriptions
 * @readonly
 */
export const HEALTH_TIERS = {
  THRIVING: {
    min: 82,
    label: 'Zen Master',
    desc: 'Flawless pacing & solid cushion',
    color: 'var(--status-emerald)',
    emoji: '🧘',
    badge: 'Zen Tier',
  },
  STABLE: {
    min: 68,
    label: 'Smart Hustler',
    desc: 'On track with conscious trade-offs',
    color: 'var(--aurora-cyan-deep)',
    emoji: '💼',
    badge: 'Hustler Tier',
  },
  VULNERABLE: {
    min: 50,
    label: 'Tightrope Walker',
    desc: 'Budget vulnerable to surprise shocks',
    color: 'var(--status-amber)',
    emoji: '🎪',
    badge: 'Caution Tier',
  },
  CRITICAL: {
    min: 0,
    label: 'Code Red Survivor',
    desc: 'Urgent expense freeze recommended',
    color: 'var(--status-rose)',
    emoji: '🚨',
    badge: 'Crisis Tier',
  },
};

/**
 * DEFCON Numerical Transition Thresholds
 * @readonly
 */
export const DEFCON_THRESHOLDS = {
  DEFCON_1_MAX_FREE_CASH: 0,
  DEFCON_2_MIN_LIABILITY_RATIO: 0.5,
  DEFCON_2_MIN_RISK: 75,
  DEFCON_3_MAX_DAILY_ALLOWANCE: 150,
  DEFCON_3_MIN_RISK: 52,
  DEFCON_4_MIN_LIABILITY_RATIO: 0.3,
  DEFCON_4_MIN_RISK: 28,
};

/**
 * DEFCON Financial Emergency Severity Levels
 * Inspired by tactical military readiness, mapping financial stress to austerity protocols.
 * @readonly
 */
export const DEFCON_LEVELS = {
  DEFCON_5: {
    level: 5,
    name: 'Normal Operations',
    tagline: 'Budget Healthy & Flowing',
    color: 'var(--status-emerald)',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    action: 'Discretionary spending permitted within safe daily allowance.',
    spendFreeze: false,
  },
  DEFCON_4: {
    level: 4,
    name: 'Guarded Readiness',
    tagline: 'Moderate Liability Pressure',
    color: 'var(--aurora-cyan-deep)',
    bgColor: 'rgba(20, 184, 166, 0.12)',
    borderColor: 'rgba(20, 184, 166, 0.35)',
    action: 'Review non-essential subscriptions and protect emergency buffer.',
    spendFreeze: false,
  },
  DEFCON_3: {
    level: 3,
    name: 'Elevated Caution',
    tagline: 'Daily Allowance Squeezed (< ₹150)',
    color: 'var(--status-amber)',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    action: 'Park all non-critical impulse desires in the 48-Hour Wishlist.',
    spendFreeze: false,
  },
  DEFCON_2: {
    level: 2,
    name: 'Severe Stress',
    tagline: 'Liabilities Exceed 50% of Liquid Cash',
    color: 'var(--status-orange)',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    action: 'Pause active subscriptions immediately and avoid all dining out.',
    spendFreeze: false,
  },
  DEFCON_1: {
    level: 1,
    name: 'Code Red Lockdown',
    tagline: 'Insolvency Deficit Imminent (< ₹0 Free Cash)',
    color: 'var(--status-rose)',
    bgColor: 'rgba(244, 63, 94, 0.18)',
    borderColor: 'rgba(244, 63, 94, 0.5)',
    action: 'Austerity Mode: Absolute spend freeze. Release emergency vault reserves.',
    spendFreeze: true,
  },
};

/**
 * FinPulse AI Advisor Archetypes for contextual financial coaching
 * @readonly
 */
export const AI_ADVISOR_ARCHETYPES = {
  ROAST_MASTER: {
    id: 'roast',
    name: 'Roast Master 🔥',
    role: 'Sarcastic Realist',
    tagline: 'Unfiltered Gen Z financial truths',
    avatar: '🔥',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
  ZEN_MONK: {
    id: 'zen',
    name: 'Zen Monk 🧘',
    role: 'Mindful Stoic',
    tagline: 'Peace over temporary dopamine',
    avatar: '🧘',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  HYPER_HUSTLER: {
    id: 'hustler',
    name: 'Hyper Hustler 🚀',
    role: 'Runway Optimizer',
    tagline: 'Every rupee compound-stacks',
    avatar: '🚀',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  QUANT_ANALYST: {
    id: 'quant',
    name: 'Quant Analyst 📈',
    role: 'Stochastic Modeler',
    tagline: 'Deterministic mathematical rigor',
    avatar: '📈',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  },
};

/**
 * Storage keys for LocalStorage persistence with namespacing
 * @readonly
 */
export const STORAGE_KEYS = {
  PERSONA_ID: 'pulse_persona_id',
  CURRENT_DAY: 'pulse_current_day',
  SOUND_ENABLED: 'pulse_sound_enabled',
  UPI_SOUNDBOX_ENABLED: 'pulse_upi_soundbox_enabled',
  AI_ARCHETYPE: 'pulse_ai_archetype',
  AUSTERITY_MODE: 'pulse_austerity_mode',
  COMMITMENTS: 'pulse_commitments',
  SUBSCRIPTIONS: 'pulse_subscriptions',
  SAVINGS_GOALS: 'pulse_savings_goals',
  TRANSACTIONS: 'pulse_transactions',
  WISHLIST: 'pulse_wishlist',
  CURVEBALL_HISTORY: 'pulse_curveball_history',
};
