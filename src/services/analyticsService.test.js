import { describe, it, expect } from 'vitest';
import {
  determineDefconLevel,
  calculateResilienceIndex,
  trackFinancialEvent
} from './analyticsService';
import { DEFCON_LEVELS } from '../constants/financeRules';

describe('analyticsService', () => {
  describe('determineDefconLevel', () => {
    it('returns DEFCON 1 when liquid cash is 0 or negative', () => {
      const defcon = determineDefconLevel({
        liquidBalance: 0,
        totalLiabilities: 2000,
        trueFreeCash: -2000,
        safeDailyAllowance: 0,
        financialRisk: 85
      });
      expect(defcon.level).toBe(1);
      expect(defcon.name).toBe(DEFCON_LEVELS.DEFCON_1.name);
      expect(defcon.spendFreeze).toBe(true);
    });

    it('returns DEFCON 2 when liabilities exceed 50% of liquid balance', () => {
      const defcon = determineDefconLevel({
        liquidBalance: 4000,
        totalLiabilities: 2500, // 2500/4000 = 62.5% > 50%
        trueFreeCash: 1500,
        safeDailyAllowance: 100,
        financialRisk: 65
      });
      expect(defcon.level).toBe(2);
    });

    it('returns DEFCON 3 when allowance is squeezed below ₹150', () => {
      const defcon = determineDefconLevel({
        liquidBalance: 6000,
        totalLiabilities: 2000,
        trueFreeCash: 4000,
        safeDailyAllowance: 130, // < 150
        financialRisk: 45
      });
      expect(defcon.level).toBe(3);
    });

    it('returns DEFCON 5 when everything is thriving and healthy', () => {
      const defcon = determineDefconLevel({
        liquidBalance: 9000,
        totalLiabilities: 1000,
        trueFreeCash: 8000,
        safeDailyAllowance: 300,
        financialRisk: 15
      });
      expect(defcon.level).toBe(5);
      expect(defcon.spendFreeze).toBe(false);
    });

    it('pins exact DEFCON 1 boundary at trueFreeCash <= 0', () => {
      // At boundary <= 0
      const atBoundary = determineDefconLevel({
        liquidBalance: 5000,
        totalLiabilities: 5000,
        trueFreeCash: 0,
        safeDailyAllowance: 0,
        financialRisk: 20
      });
      expect(atBoundary.level).toBe(1);

      // Just above boundary > 0 (healthy metrics)
      const justAbove = determineDefconLevel({
        liquidBalance: 5000,
        totalLiabilities: 1000,
        trueFreeCash: 4000,
        safeDailyAllowance: 200,
        financialRisk: 20
      });
      expect(justAbove.level).not.toBe(1);
    });

    it('pins exact DEFCON 2 boundary at liability ratio > 0.50 and risk >= 75', () => {
      // Exactly 50% liability ratio with low risk: should NOT be DEFCON 2
      const atFiftyPercent = determineDefconLevel({
        liquidBalance: 4000,
        totalLiabilities: 2000, // exactly 0.5
        trueFreeCash: 2000,
        safeDailyAllowance: 200,
        financialRisk: 20
      });
      expect(atFiftyPercent.level).not.toBe(2);

      // Just above 50% liability ratio: should trigger DEFCON 2
      const aboveFiftyPercent = determineDefconLevel({
        liquidBalance: 4000,
        totalLiabilities: 2001, // 0.50025 > 0.5
        trueFreeCash: 1999,
        safeDailyAllowance: 200,
        financialRisk: 20
      });
      expect(aboveFiftyPercent.level).toBe(2);

      // Risk boundary at 75 vs 74
      const riskAt74 = determineDefconLevel({
        liquidBalance: 5000,
        totalLiabilities: 1000,
        trueFreeCash: 4000,
        safeDailyAllowance: 200,
        financialRisk: 74
      });
      expect(riskAt74.level).not.toBe(2);

      const riskAt75 = determineDefconLevel({
        liquidBalance: 5000,
        totalLiabilities: 1000,
        trueFreeCash: 4000,
        safeDailyAllowance: 200,
        financialRisk: 75
      });
      expect(riskAt75.level).toBe(2);
    });

    it('pins exact DEFCON 3 boundary at daily allowance < 150 and risk >= 52', () => {
      // Daily allowance exactly 150 with low risk: should NOT be DEFCON 3
      const allowanceAt150 = determineDefconLevel({
        liquidBalance: 5000,
        totalLiabilities: 1000,
        trueFreeCash: 4000,
        safeDailyAllowance: 150,
        financialRisk: 20
      });
      expect(allowanceAt150.level).not.toBe(3);

      // Daily allowance 149: triggers DEFCON 3
      const allowanceAt149 = determineDefconLevel({
        liquidBalance: 5000,
        totalLiabilities: 1000,
        trueFreeCash: 4000,
        safeDailyAllowance: 149,
        financialRisk: 20
      });
      expect(allowanceAt149.level).toBe(3);

      // Risk boundary at 52 vs 51
      const riskAt51 = determineDefconLevel({
        liquidBalance: 5000,
        totalLiabilities: 1000,
        trueFreeCash: 4000,
        safeDailyAllowance: 200,
        financialRisk: 51
      });
      expect(riskAt51.level).not.toBe(3);

      const riskAt52 = determineDefconLevel({
        liquidBalance: 5000,
        totalLiabilities: 1000,
        trueFreeCash: 4000,
        safeDailyAllowance: 200,
        financialRisk: 52
      });
      expect(riskAt52.level).toBe(3);
    });

    it('pins exact DEFCON 4 boundary at liability ratio > 0.30 and risk >= 28', () => {
      // Liability ratio exactly 30% with risk 20: should be DEFCON 5
      const ratioAt30 = determineDefconLevel({
        liquidBalance: 4000,
        totalLiabilities: 1200, // 0.30
        trueFreeCash: 2800,
        safeDailyAllowance: 200,
        financialRisk: 20
      });
      expect(ratioAt30.level).toBe(5);

      // Liability ratio 31%: triggers DEFCON 4
      const ratioAt31 = determineDefconLevel({
        liquidBalance: 4000,
        totalLiabilities: 1240, // 0.31 > 0.3
        trueFreeCash: 2760,
        safeDailyAllowance: 200,
        financialRisk: 20
      });
      expect(ratioAt31.level).toBe(4);

      // Risk boundary at 28 vs 27
      const riskAt27 = determineDefconLevel({
        liquidBalance: 4000,
        totalLiabilities: 800, // 0.20
        trueFreeCash: 3200,
        safeDailyAllowance: 200,
        financialRisk: 27
      });
      expect(riskAt27.level).toBe(5);

      const riskAt28 = determineDefconLevel({
        liquidBalance: 4000,
        totalLiabilities: 800,
        trueFreeCash: 3200,
        safeDailyAllowance: 200,
        financialRisk: 28
      });
      expect(riskAt28.level).toBe(4);
    });
  });

  describe('calculateResilienceIndex', () => {
    it('computes high resilience score when emergency buffer and runway are strong', () => {
      const score = calculateResilienceIndex({
        liquidBalance: 8000,
        totalLiabilities: 2000,
        emergencySavings: 1500,
        runwayDays: 28,
        daysRemaining: 25
      });
      expect(score).toBeGreaterThanOrEqual(75);
      expect(score).toBeLessThanOrEqual(99);
    });

    it('penalizes score when liabilities exceed cash and runway falls short', () => {
      const score = calculateResilienceIndex({
        liquidBalance: 1500,
        totalLiabilities: 3000,
        emergencySavings: 0,
        runwayDays: 5,
        daysRemaining: 20
      });
      expect(score).toBeLessThanOrEqual(35);
    });
  });

  describe('trackFinancialEvent', () => {
    it('records telemetry object safely without throwing errors', () => {
      const result = trackFinancialEvent('test_event', { amount: 500 });
      expect(result).toBeDefined();
      expect(result.event).toBe('test_event');
      expect(result.amount).toBe(500);
    });
  });
});
