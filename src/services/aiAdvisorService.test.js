import { describe, it, expect } from 'vitest';
import { generateAiAdvice } from './aiAdvisorService';

describe('aiAdvisorService', () => {
  it('generates Roast Master critique for severe deficit', () => {
    const advice = generateAiAdvice({
      archetype: 'roast',
      itemName: 'Sneakers',
      amount: 2500,
      liquidBalance: 3000,
      totalPendingLiabilities: 2000, // 3000 - 2500 = 500 < 2000
      safeDailyAllowance: 100,
      simSafeDaily: 20,
      daysRemaining: 25
    });

    expect(advice.severity).toBe('danger');
    expect(advice.headline).toContain('evicted');
    expect(advice.critique).toContain('fixed bills');
    expect(advice.badge).toContain('Roast');
  });

  it('generates Zen Monk mindfulness commentary', () => {
    const advice = generateAiAdvice({
      archetype: 'zen',
      itemName: 'Artisanal Coffee',
      amount: 380,
      liquidBalance: 8000,
      totalPendingLiabilities: 2000,
      safeDailyAllowance: 220,
      simSafeDaily: 205,
      daysRemaining: 25
    });

    expect(advice.severity).toBe('chill');
    expect(advice.headline).toContain('Harmony');
    expect(advice.critique).toContain('river');
  });

  it('generates Hyper Hustler runway defense commentary', () => {
    const advice = generateAiAdvice({
      archetype: 'hustler',
      itemName: 'Gaming Rig Upgrade',
      amount: 4000,
      liquidBalance: 6000,
      totalPendingLiabilities: 3000,
      safeDailyAllowance: 120,
      simSafeDaily: 40,
      daysRemaining: 25
    });

    expect(advice.severity).toBe('danger');
    expect(advice.headline).toContain('Runway');
    expect(advice.badge).toContain('Zero Defense');
  });

  it('generates Quant Analyst stochastic and parametric evaluation', () => {
    const advice = generateAiAdvice({
      archetype: 'quant',
      itemName: 'Swiggy Dinner',
      amount: 450,
      liquidBalance: 7000,
      totalPendingLiabilities: 2000,
      safeDailyAllowance: 200,
      simSafeDaily: 180,
      daysRemaining: 22
    });

    expect(advice.headline).toContain('Drawdown Delta');
    expect(advice.critique).toContain('Parametric evaluation');
    expect(advice.badge).toContain('Model');
  });
});
