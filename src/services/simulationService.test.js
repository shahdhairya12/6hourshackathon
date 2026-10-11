import { describe, it, expect } from 'vitest';
import {
  calculateConsequenceMatrix,
  runMonteCarloFanSimulation
} from './simulationService';

describe('simulationService', () => {
  describe('calculateConsequenceMatrix', () => {
    it('calculates safe purchase impact with small spend', () => {
      const result = calculateConsequenceMatrix({
        amount: 200,
        liquidBalance: 8000,
        trueFreeCash: 5000,
        daysRemaining: 25,
        safeDailyAllowance: 200,
        financialRisk: 20,
        financialHealth: 85,
        averageDailySpend: 150,
        runwayDays: 28,
        totalPendingLiabilities: 3000,
        splitCount: 1
      });

      expect(result.simLiquid).toBe(7800);
      expect(result.simFreeCash).toBe(4800);
      expect(result.simSafeDaily).toBe(192);
      expect(result.dailyDrop).toBe(8);
      expect(result.verdict.status).toBe('safe');
      expect(result.verdict.headline).toContain('Resilient');
    });

    it('triggers insolvency danger verdict when spend exceeds free cash', () => {
      const result = calculateConsequenceMatrix({
        amount: 3500,
        liquidBalance: 4000,
        trueFreeCash: 1000, // spending 3500 leaves free cash -2500
        daysRemaining: 20,
        safeDailyAllowance: 50,
        financialRisk: 40,
        financialHealth: 60,
        averageDailySpend: 200,
        runwayDays: 20,
        totalPendingLiabilities: 3000,
        splitCount: 1
      });

      expect(result.simFreeCash).toBe(-2500);
      expect(result.verdict.status).toBe('danger');
      expect(result.verdict.headline).toContain('Insolvency Warning');
    });

    it('correctly calculates roommate bill splitting', () => {
      // Total amount ₹900 split 3 ways = ₹300 per person
      const solo = calculateConsequenceMatrix({
        amount: 900,
        liquidBalance: 6000,
        trueFreeCash: 4000,
        daysRemaining: 20,
        safeDailyAllowance: 200,
        splitCount: 1
      });

      const split3 = calculateConsequenceMatrix({
        amount: 900,
        liquidBalance: 6000,
        trueFreeCash: 4000,
        daysRemaining: 20,
        safeDailyAllowance: 200,
        splitCount: 3
      });

      expect(solo.simLiquid).toBe(5100);
      expect(split3.simLiquid).toBe(5700); // 6000 - 300
      expect(split3.dailyDrop).toBeLessThan(solo.dailyDrop);
    });

    it('detects severe leeway compression when allowance drops below ₹120', () => {
      const result = calculateConsequenceMatrix({
        amount: 1200,
        liquidBalance: 5000,
        trueFreeCash: 2500,
        daysRemaining: 25,
        safeDailyAllowance: 100,
        splitCount: 1
      });

      expect(result.verdict.status).toBe('warning');
      expect(result.verdict.headline).toContain('Severe Leeway Compression');
    });
  });

  describe('runMonteCarloFanSimulation', () => {
    it('produces 30-day projection fan points with P10, P50, and P90 bounds', () => {
      const result = runMonteCarloFanSimulation(7000, 2000, 150, 5, 100);

      expect(result.survivalRate).toBeGreaterThanOrEqual(0);
      expect(result.survivalRate).toBeLessThanOrEqual(100);
      expect(result.worstCase).toBeLessThanOrEqual(result.medianOutcome);
      expect(result.medianOutcome).toBeLessThanOrEqual(result.bestCase);
      expect(result.fanPoints).toHaveLength(30);

      // Verify structure of fan points
      const day15 = result.fanPoints[14];
      expect(day15.day).toBe(15);
      expect(typeof day15.p10).toBe('number');
      expect(typeof day15.p50).toBe('number');
      expect(typeof day15.p90).toBe('number');
    });
  });
});
