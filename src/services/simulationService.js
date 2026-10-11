/**
 * @file simulationService.js
 * @description Decision Simulator calculations, roommate bill-splitting,
 * and Monte Carlo stochastic stress-testing engine with confidence fan projections.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

import { calculateSafeDailyAllowance, calculateRunwayDays, runMonteCarloSimulation } from '../utils/financeMath';
import { MONTE_CARLO_CONFIG } from '../constants/financeRules';

/**
 * Computes the interconnected consequences of a simulated purchase.
 * 
 * @param {object} params
 * @param {number} params.amount - Proposed expenditure in ₹
 * @param {number} params.liquidBalance - Current cash in hand
 * @param {number} params.trueFreeCash - Free cash after liabilities
 * @param {number} params.daysRemaining - Days left in month
 * @param {number} params.safeDailyAllowance - Current safe spend
 * @param {number} params.financialRisk - Current risk score
 * @param {number} params.financialHealth - Current health score
 * @param {number} params.averageDailySpend - Historical daily spend pace
 * @param {number} params.runwayDays - Current runway in days
 * @param {number} params.totalPendingLiabilities - Total upcoming bills
 * @param {number} [params.splitCount=1] - Split with N roommates/friends
 * @returns {import('../types/finance').ConsequenceMatrix}
 */
export function calculateConsequenceMatrix({
  amount = 0,
  liquidBalance = 10000,
  trueFreeCash = 5000,
  daysRemaining = 27,
  safeDailyAllowance = 250,
  financialRisk = 25,
  financialHealth = 80,
  averageDailySpend = 200,
  runwayDays = 25,
  totalPendingLiabilities = 3500,
  splitCount = 1
}) {
  const effectiveAmount = Math.max(0, Math.round(Number(amount) / Math.max(1, splitCount)) || 0);
  const simLiquid = liquidBalance - effectiveAmount;
  const simFreeCash = trueFreeCash - effectiveAmount;
  const simSafeDaily = calculateSafeDailyAllowance(simFreeCash, daysRemaining);
  const dailyDrop = Math.max(0, safeDailyAllowance - simSafeDaily);

  // Simulated Risk
  let simRisk = financialRisk;
  if (effectiveAmount > 0) {
    const dropRatio = effectiveAmount / Math.max(1, liquidBalance);
    simRisk += Math.round(dropRatio * 40);
    if (simSafeDaily < 120) simRisk += 15;
  }
  simRisk = Math.max(5, Math.min(99, simRisk));

  // Simulated Health
  let simHealth = financialHealth;
  if (effectiveAmount > 0) {
    const penalty = Math.round((effectiveAmount / 250) + (dailyDrop / 15));
    simHealth = Math.max(10, Math.min(98, simHealth - penalty));
  }

  const simRunway = averageDailySpend > 0 
    ? calculateRunwayDays(simLiquid, averageDailySpend, 30) 
    : runwayDays;

  // Formulate deterministic verdict
  let verdict = {
    status: 'safe',
    headline: 'Budget Looks Resilient 🚀',
    analysis: `This ₹${effectiveAmount} share (${splitCount > 1 ? `split among ${splitCount}` : 'solo'}) takes ₹${dailyDrop}/day off your daily allowance, leaving you with ₹${simSafeDaily}/day.`,
    action: 'You can absorb this without jeopardizing bills or savings goals.'
  };

  if (simFreeCash < 0) {
    verdict = {
      status: 'danger',
      headline: '🚨 Financial Redline: Insolvency Warning!',
      analysis: `Spending ₹${effectiveAmount} will leave you short by ₹${Math.abs(simFreeCash)} for fixed commitments (Pending Bills: ₹${totalPendingLiabilities})!`,
      action: 'Veto this spend or unlock funds from an emergency vault before Day 30.'
    };
  } else if (dailyDrop > 50 || simSafeDaily < 120) {
    verdict = {
      status: 'warning',
      headline: '⚠️ Severe Leeway Compression!',
      analysis: `Your daily discretionary spend falls from ₹${safeDailyAllowance}/day to ₹${simSafeDaily}/day (-₹${dailyDrop}/day penalty). One unplanned expense will breach your budget.`,
      action: 'Suggestion: Add to 48-Hour Wishlist or look for a ₹' + Math.round(effectiveAmount * 0.35) + ' alternative.'
    };
  } else if (effectiveAmount > 1500) {
    verdict = {
      status: 'caution',
      headline: '⚡ Major Outflow Alert',
      analysis: `This represents ${Math.round((effectiveAmount / 10000) * 100)}% of your entire monthly ₹10,000 allowance in a single transaction.`,
      action: 'Determine whether this expense yields 30-day value or momentary gratification.'
    };
  }

  return {
    simLiquid,
    simFreeCash,
    simSafeDaily,
    dailyDrop,
    simRisk,
    simHealth,
    simRunway,
    verdict
  };
}

/**
 * Executes a Monte Carlo multi-path stochastic simulation and generates
 * 30-day confidence fan projection curves (P10, P50, P90).
 * Delegates to the unified runMonteCarloSimulation engine.
 * 
 * @param {number} liquidBalance 
 * @param {number} liabilities 
 * @param {number} dailyAllowance 
 * @param {number} currentDay 
 * @param {number} [trials=350] 
 * @param {() => number} [prng=Math.random]
 * @returns {import('../types/finance').MonteCarloResult}
 */
export function runMonteCarloFanSimulation(
  liquidBalance,
  liabilities,
  dailyAllowance,
  currentDay,
  trials = MONTE_CARLO_CONFIG.DEFAULT_TRIALS,
  prng = Math.random
) {
  return runMonteCarloSimulation(
    liquidBalance,
    liabilities,
    dailyAllowance,
    currentDay,
    trials,
    prng
  );
}

