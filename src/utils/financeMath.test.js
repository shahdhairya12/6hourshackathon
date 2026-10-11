import { describe, it, expect } from 'vitest';
import {
  calculateLiquidBalance,
  calculatePendingCommitments,
  calculatePendingSubscriptions,
  calculateTrueFreeCash,
  calculateSafeDailyAllowance,
  calculateAverageDailySpend,
  calculateRunwayDays,
  calculateFinancialRisk,
  calculateFinancialHealth,
  calculateGamification,
  runMonteCarloStressTest
} from './financeMath';

describe('PULSE Finance Mathematical Engine', () => {
  
  describe('calculateLiquidBalance', () => {
    it('calculates initial ₹10,000 budget with no expenses or locked savings', () => {
      const transactions = [{ amount: 10000, type: 'income' }];
      const savings = [];
      expect(calculateLiquidBalance(transactions, savings)).toBe(10000);
    });

    it('correctly deducts expenses and locked savings from liquid cash', () => {
      const transactions = [
        { amount: 10000, type: 'income' },
        { amount: 450, type: 'expense' },
        { amount: 350, type: 'commitment' }
      ];
      const savings = [{ current: 1200 }, { current: 500 }];
      // 10000 - 450 - 350 - 1700 = 7500
      expect(calculateLiquidBalance(transactions, savings)).toBe(7500);
    });
  });

  describe('calculatePendingCommitments & Subscriptions', () => {
    it('only sums unpaid commitments due on or after today', () => {
      const commitments = [
        { name: 'Rent', amount: 3500, dueDay: 5, paid: false },
        { name: 'Bus Pass', amount: 450, dueDay: 2, paid: true },
        { name: 'Recharge', amount: 349, dueDay: 20, paid: false },
      ];
      // On Day 3: Rent (Day 5, unpaid) + Recharge (Day 20, unpaid) = 3849
      expect(calculatePendingCommitments(commitments, 3)).toBe(3849);
    });

    it('only sums active subscriptions due on or after today', () => {
      const subscriptions = [
        { name: 'Spotify', amount: 119, dueDay: 8, active: true },
        { name: 'Netflix', amount: 199, dueDay: 15, active: false }, // paused
        { name: 'Gym', amount: 499, dueDay: 1, active: true }, // past dueDay 1
      ];
      // On Day 4: Spotify only (Netflix inactive, Gym past day 1)
      expect(calculatePendingSubscriptions(subscriptions, 4)).toBe(119);
    });
  });

  describe('calculateTrueFreeCash', () => {
    it('returns liquid balance minus total liabilities', () => {
      expect(calculateTrueFreeCash(7000, 2500)).toBe(4500);
    });

    it('handles negative free cash when liabilities exceed liquid balance', () => {
      expect(calculateTrueFreeCash(2000, 4500)).toBe(-2500);
    });
  });

  describe('calculateAverageDailySpend', () => {
    it('computes average daily spend accurately up to current day', () => {
      const txs = [
        { amount: 10000, type: 'income', day: 1, category: 'income' },
        { amount: 600, type: 'expense', day: 2, category: 'food' },
        { amount: 400, type: 'expense', day: 4, category: 'transit' }
      ];
      // On day 5: (600 + 400) / 5 = 200/day
      expect(calculateAverageDailySpend(txs, 5)).toBe(200);
    });

    it('returns sensible fallback for day 1', () => {
      expect(calculateAverageDailySpend([], 1)).toBe(300);
    });
  });

  describe('calculateSafeDailyAllowance', () => {
    it('divides true free cash evenly over remaining days', () => {
      // ₹5,400 free cash over 27 remaining days = ₹200/day
      expect(calculateSafeDailyAllowance(5400, 27)).toBe(200);
    });

    it('returns 0 when free cash is 0 or negative', () => {
      expect(calculateSafeDailyAllowance(0, 15)).toBe(0);
      expect(calculateSafeDailyAllowance(-500, 10)).toBe(0);
    });

    it('protects against division by zero', () => {
      expect(calculateSafeDailyAllowance(1000, 0)).toBe(1000);
    });
  });

  describe('calculateRunwayDays', () => {
    it('calculates days till bankruptcy at current burn rate', () => {
      // ₹6,000 balance at ₹300/day = 20 days runway
      expect(calculateRunwayDays(6000, 300, 30)).toBe(20);
    });

    it('clamps to maxDays (30)', () => {
      expect(calculateRunwayDays(10000, 100, 30)).toBe(30);
    });

    it('returns 0 when balance is 0 or negative', () => {
      expect(calculateRunwayDays(0, 300)).toBe(0);
      expect(calculateRunwayDays(-500, 300)).toBe(0);
    });
  });

  describe('calculateFinancialRisk & Health Score', () => {
    it('calculates moderate risk for balanced budget', () => {
      const risk = calculateFinancialRisk({
        liquidBalance: 6000,
        totalLiabilities: 2000,
        safeDailyAllowance: 220,
        runwayDays: 25,
        daysRemaining: 25,
        emergencySavings: 1000
      });
      expect(risk).toBeGreaterThanOrEqual(10);
      expect(risk).toBeLessThanOrEqual(50);
    });

    it('spikes risk when liabilities exceed liquid balance', () => {
      const highRisk = calculateFinancialRisk({
        liquidBalance: 1500,
        totalLiabilities: 3500,
        safeDailyAllowance: 0,
        runwayDays: 5,
        daysRemaining: 20,
        emergencySavings: 0
      });
      expect(highRisk).toBeGreaterThanOrEqual(70);
    });

    it('computes health score within bounds [10, 98]', () => {
      const health = calculateFinancialHealth({
        financialRisk: 30,
        totalLockedSavings: 1500,
        totalSavingsTarget: 3000,
        trueFreeCash: 3000,
        safeDailyAllowance: 250
      });
      expect(health).toBeGreaterThanOrEqual(10);
      expect(health).toBeLessThanOrEqual(98);
    });
  });

  describe('calculateGamification', () => {
    it('unlocks badges and computes Gen Z level progression', () => {
      const result = calculateGamification({
        wishlistCount: 3,
        emergencySavings: 1000,
        pausedSubscriptionsCount: 1,
        healthScore: 85,
        currentDay: 26,
        liquidBalance: 4000
      });

      expect(result.level).toBe(5);
      expect(result.unlockedCount).toBe(5);
      expect(result.badges.every(b => b.unlocked)).toBe(true);
    });
  });

  describe('runMonteCarloStressTest', () => {
    it('calculates 100% survival rate when month has ended', () => {
      const result = runMonteCarloStressTest(5000, 0, 100, 0, 100);
      expect(result.survivalRate).toBe(100);
      expect(result.medianOutcome).toBe(5000);
    });

    it('returns bounded stochastic survival metrics under realistic conditions', () => {
      const result = runMonteCarloStressTest(6000, 2000, 120, 20, 200);
      expect(result.survivalRate).toBeGreaterThanOrEqual(0);
      expect(result.survivalRate).toBeLessThanOrEqual(100);
      expect(result.worstCase).toBeLessThanOrEqual(result.medianOutcome);
      expect(result.medianOutcome).toBeLessThanOrEqual(result.bestCase);
    });
  });

});

