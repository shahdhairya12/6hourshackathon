import { describe, it, expect } from 'vitest';
import {
  INITIAL_MONTHLY_BUDGET,
  TOTAL_SIMULATION_DAYS,
  MIN_HEALTH_SCORE,
  MAX_HEALTH_SCORE,
  RISK_THRESHOLDS,
  HEALTH_TIERS,
  DEFCON_LEVELS,
  AI_ADVISOR_ARCHETYPES,
  STORAGE_KEYS,
  MONTE_CARLO_CONFIG
} from './financeRules';

describe('financeRules configuration constants', () => {
  it('defines core ₹10,000 and 30-day bounds accurately', () => {
    expect(INITIAL_MONTHLY_BUDGET).toBe(10000);
    expect(TOTAL_SIMULATION_DAYS).toBe(30);
    expect(MIN_HEALTH_SCORE).toBe(10);
    expect(MAX_HEALTH_SCORE).toBe(98);
  });

  it('defines valid non-overlapping risk thresholds', () => {
    expect(RISK_THRESHOLDS.LOW).toBeLessThan(RISK_THRESHOLDS.MODERATE);
    expect(RISK_THRESHOLDS.MODERATE).toBeLessThan(RISK_THRESHOLDS.ELEVATED);
    expect(RISK_THRESHOLDS.ELEVATED).toBeLessThanOrEqual(RISK_THRESHOLDS.CRITICAL);
  });

  it('contains all 4 health tiers with required properties', () => {
    const tiers = Object.values(HEALTH_TIERS);
    expect(tiers).toHaveLength(4);
    tiers.forEach(tier => {
      expect(tier.label).toBeDefined();
      expect(tier.color).toMatch(/^(#[0-9a-fA-F]{6}|var\(--[a-z0-9-]+\))$/);
      expect(typeof tier.min).toBe('number');
    });
  });

  it('defines 5 hierarchical DEFCON levels', () => {
    expect(Object.keys(DEFCON_LEVELS)).toHaveLength(5);
    expect(DEFCON_LEVELS.DEFCON_1.level).toBe(1);
    expect(DEFCON_LEVELS.DEFCON_1.spendFreeze).toBe(true);
    expect(DEFCON_LEVELS.DEFCON_5.level).toBe(5);
    expect(DEFCON_LEVELS.DEFCON_5.spendFreeze).toBe(false);
  });

  it('contains all 4 AI advisor archetypes', () => {
    expect(Object.keys(AI_ADVISOR_ARCHETYPES)).toHaveLength(4);
    expect(AI_ADVISOR_ARCHETYPES.ROAST_MASTER.id).toBe('roast');
    expect(AI_ADVISOR_ARCHETYPES.ZEN_MONK.id).toBe('zen');
    expect(AI_ADVISOR_ARCHETYPES.HYPER_HUSTLER.id).toBe('hustler');
    expect(AI_ADVISOR_ARCHETYPES.QUANT_ANALYST.id).toBe('quant');
  });

  it('has consistent unique namespaced storage keys', () => {
    const keys = Object.values(STORAGE_KEYS);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
    keys.forEach(k => expect(k).toMatch(/^pulse_/));
  });

  it('defines valid Monte Carlo configuration parameters', () => {
    expect(MONTE_CARLO_CONFIG.DEFAULT_TRIALS).toBe(350);
    expect(MONTE_CARLO_CONFIG.DAILY_SPEND_VARIANCE_BASE).toBe(0.8);
    expect(MONTE_CARLO_CONFIG.VOLATILITY_SIGMA).toBe(0.22);
    expect(MONTE_CARLO_CONFIG.DAILY_SHOCK_PROBABILITY).toBe(0.08);
    expect(MONTE_CARLO_CONFIG.MIN_DAILY_PACE_FLOOR).toBe(80);
    expect(MONTE_CARLO_CONFIG.P10_PERCENTILE).toBe(0.10);
    expect(MONTE_CARLO_CONFIG.P50_PERCENTILE).toBe(0.50);
    expect(MONTE_CARLO_CONFIG.P90_PERCENTILE).toBe(0.90);
  });
});
