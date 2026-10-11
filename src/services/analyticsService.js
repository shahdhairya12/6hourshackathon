/**
 * @file analyticsService.js
 * @description Local-First Financial Telemetry, DEFCON Severity Auditor,
 * and Deterministic Financial Resilience Indexer.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import { DEFCON_LEVELS, DEFCON_THRESHOLDS } from '../constants/financeRules';

/**
 * Determines the current DEFCON level based on cash, liabilities, and daily spend.
 * 
 * @param {object} params
 * @param {number} params.liquidBalance
 * @param {number} params.totalLiabilities
 * @param {number} params.trueFreeCash
 * @param {number} params.safeDailyAllowance
 * @param {number} params.financialRisk
 * @returns {import('../types/finance').DefconState}
 */
export function determineDefconLevel({
  liquidBalance = 10000,
  totalLiabilities = 0,
  trueFreeCash = 5000,
  safeDailyAllowance = 250,
  financialRisk = 20
}) {
  // DEFCON 1: Immediate Insolvency Redline
  if (trueFreeCash <= DEFCON_THRESHOLDS.DEFCON_1_MAX_FREE_CASH || liquidBalance <= 0) {
    return DEFCON_LEVELS.DEFCON_1;
  }

  // DEFCON 2: Liabilities exceed 50% of liquid or risk >= 75
  const liabilityRatio = liquidBalance > 0 ? totalLiabilities / liquidBalance : 1;
  if (liabilityRatio > DEFCON_THRESHOLDS.DEFCON_2_MIN_LIABILITY_RATIO || financialRisk >= DEFCON_THRESHOLDS.DEFCON_2_MIN_RISK) {
    return DEFCON_LEVELS.DEFCON_2;
  }

  // DEFCON 3: Allowance squeezed (< ₹150) or risk >= 52
  if (safeDailyAllowance < DEFCON_THRESHOLDS.DEFCON_3_MAX_DAILY_ALLOWANCE || financialRisk >= DEFCON_THRESHOLDS.DEFCON_3_MIN_RISK) {
    return DEFCON_LEVELS.DEFCON_3;
  }

  // DEFCON 4: Guarded readiness (liabilityRatio > 0.3 or risk >= 28)
  if (liabilityRatio > DEFCON_THRESHOLDS.DEFCON_4_MIN_LIABILITY_RATIO || financialRisk >= DEFCON_THRESHOLDS.DEFCON_4_MIN_RISK) {
    return DEFCON_LEVELS.DEFCON_4;
  }

  // DEFCON 5: All green peacetime
  return DEFCON_LEVELS.DEFCON_5;
}

/**
 * Calculates a comprehensive Financial Resilience Index (0 - 100)
 * weighting liquidity, liability buffer, goal savings ratio, and runway.
 * 
 * @param {object} params
 * @param {number} params.liquidBalance
 * @param {number} params.totalLiabilities
 * @param {number} params.emergencySavings
 * @param {number} params.runwayDays
 * @param {number} params.daysRemaining
 * @returns {number}
 */
export function calculateResilienceIndex({
  liquidBalance = 10000,
  totalLiabilities = 3000,
  emergencySavings = 500,
  runwayDays = 25,
  daysRemaining = 27
}) {
  let score = 50;

  // Liquidity coverage
  const coverageRatio = totalLiabilities > 0 ? liquidBalance / totalLiabilities : 2;
  if (coverageRatio >= 2.0) score += 20;
  else if (coverageRatio >= 1.2) score += 10;
  else if (coverageRatio < 0.9) score -= 25;

  // Emergency buffer (target ₹1,200)
  if (emergencySavings >= 1200) score += 15;
  else if (emergencySavings >= 600) score += 8;
  else if (emergencySavings < 300) score -= 12;

  // Runway vs days remaining
  if (runwayDays >= daysRemaining) score += 15;
  else score -= Math.min(25, (daysRemaining - runwayDays) * 2);

  return Math.max(5, Math.min(99, Math.round(score)));
}

/**
 * Telemetry audit log entry recorder (client-side only, non-tracking)
 * 
 * @param {string} eventName 
 * @param {object} [metadata={}] 
 */
export function trackFinancialEvent(eventName, metadata = {}) {
  // Local telemetry buffer for runtime audit
  const logEntry = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...metadata
  };
  return logEntry;
}
