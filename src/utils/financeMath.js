/**
 * @file financeMath.js
 * @description Pure, deterministic mathematical engine powering the PULSE Gen Z Financial OS.
 * Contains core calculations for liquid balance, safe daily allowance, financial risk index,
 * health score, runway projections, and trajectory points.
 */

/**
 * Calculates current liquid cash balance.
 * Liquid Balance = (All Incomes) - (All Spends) - (Funds Locked in Savings Vaults)
 * 
 * @param {Array<{amount: number, type: string}>} transactions 
 * @param {Array<{current: number}>} savingsGoals 
 * @returns {number}
 */
export function calculateLiquidBalance(transactions = [], savingsGoals = []) {
  let income = 0;
  let spent = 0;

  for (const t of transactions) {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      income += amt;
    } else {
      spent += amt;
    }
  }

  const lockedInSavings = savingsGoals.reduce((sum, g) => sum + (Number(g.current) || 0), 0);
  return income - spent - lockedInSavings;
}

/**
 * Calculates pending commitments due on or after the specified day.
 * 
 * @param {Array<{amount: number, dueDay: number, paid: boolean}>} commitments 
 * @param {number} currentDay 
 * @returns {number}
 */
export function calculatePendingCommitments(commitments = [], currentDay = 1) {
  return commitments
    .filter(c => !c.paid && c.dueDay >= currentDay)
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
}

/**
 * Calculates pending active subscriptions for remaining days in the month.
 * 
 * @param {Array<{amount: number, dueDay: number, active: boolean}>} subscriptions 
 * @param {number} currentDay 
 * @returns {number}
 */
export function calculatePendingSubscriptions(subscriptions = [], currentDay = 1) {
  return subscriptions
    .filter(s => s.active && s.dueDay >= currentDay)
    .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
}

/**
 * Calculates the True Free Cash Flow available for discretionary spending.
 * True Free Cash = Liquid Balance - Total Pending Liabilities
 * 
 * @param {number} liquidBalance 
 * @param {number} totalLiabilities 
 * @returns {number}
 */
export function calculateTrueFreeCash(liquidBalance, totalLiabilities) {
  return (Number(liquidBalance) || 0) - (Number(totalLiabilities) || 0);
}

/**
 * Calculates the Safe Daily Allowance ("Safe to Spend Today").
 * Safe Daily Allowance = max(0, floor(True Free Cash / Days Remaining))
 * 
 * @param {number} trueFreeCash 
 * @param {number} daysRemaining 
 * @returns {number}
 */
export function calculateSafeDailyAllowance(trueFreeCash, daysRemaining) {
  const safeDays = Math.max(1, Number(daysRemaining) || 1);
  const free = Number(trueFreeCash) || 0;
  if (free <= 0) return 0;
  return Math.floor(free / safeDays);
}

/**
 * Calculates average daily burn rate so far.
 * 
 * @param {Array<{amount: number, type: string, day: number, category: string}>} transactions 
 * @param {number} currentDay 
 * @returns {number}
 */
export function calculateAverageDailySpend(transactions = [], currentDay = 1) {
  const expenses = transactions
    .filter(t => t.type !== 'income' && t.category !== 'budget' && t.day <= currentDay)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  return currentDay > 1 ? Math.round(expenses / currentDay) : 300;
}

/**
 * Calculates runway in days based on liquid cash and average daily spend.
 * 
 * @param {number} liquidBalance 
 * @param {number} dailySpend 
 * @param {number} maxDays 
 * @returns {number}
 */
export function calculateRunwayDays(liquidBalance, dailySpend, maxDays = 30) {
  if (liquidBalance <= 0) return 0;
  const pace = Math.max(80, Number(dailySpend) || 200);
  return Math.min(maxDays, Math.floor(liquidBalance / pace));
}

/**
 * Calculates Financial Risk Score (0 - 100%).
 * Evaluates liability coverage, daily allowance stress, runway deficit, and emergency cushion.
 * 
 * @param {object} params
 * @param {number} params.liquidBalance
 * @param {number} params.totalLiabilities
 * @param {number} params.safeDailyAllowance
 * @param {number} params.runwayDays
 * @param {number} params.daysRemaining
 * @param {number} params.emergencySavings
 * @returns {number} Clamped between 5 and 99.
 */
export function calculateFinancialRisk({
  liquidBalance = 0,
  totalLiabilities = 0,
  safeDailyAllowance = 0,
  runwayDays = 0,
  daysRemaining = 1,
  emergencySavings = 0
}) {
  let risk = 15; // baseline

  // 1. Liability coverage pressure
  if (liquidBalance <= 0) {
    risk += 60;
  } else {
    const liabilityRatio = totalLiabilities / liquidBalance;
    if (liabilityRatio > 0.8) risk += 35;
    else if (liabilityRatio > 0.5) risk += 22;
    else if (liabilityRatio > 0.3) risk += 10;
  }

  // 2. Daily allowance pressure
  if (safeDailyAllowance < 100) risk += 30;
  else if (safeDailyAllowance < 180) risk += 18;
  else if (safeDailyAllowance >= 300) risk -= 10;

  // 3. Runway deficit
  if (runwayDays < daysRemaining) {
    risk += Math.min(25, (daysRemaining - runwayDays) * 3);
  } else {
    risk -= 8;
  }

  // 4. Emergency fund check
  if (emergencySavings < 500) {
    risk += 15;
  } else if (emergencySavings >= 1200) {
    risk -= 12;
  }

  return Math.max(5, Math.min(99, Math.round(risk)));
}

/**
 * Calculates Financial Health Score (0 - 100).
 * Combines risk inversion, savings ratio bonus, and cash buffer.
 * 
 * @param {object} params
 * @param {number} params.financialRisk
 * @param {number} params.totalLockedSavings
 * @param {number} params.totalSavingsTarget
 * @param {number} params.trueFreeCash
 * @param {number} params.safeDailyAllowance
 * @returns {number} Clamped between 10 and 98.
 */
export function calculateFinancialHealth({
  financialRisk = 30,
  totalLockedSavings = 0,
  totalSavingsTarget = 5000,
  trueFreeCash = 2000,
  safeDailyAllowance = 200
}) {
  const savingsRatio = totalSavingsTarget > 0 ? totalLockedSavings / totalSavingsTarget : 0.5;
  let health = 100 - (financialRisk * 0.65) + (savingsRatio * 20);

  if (trueFreeCash < 500) health -= 15;
  if (safeDailyAllowance < 150) health -= 10;

  return Math.max(10, Math.min(98, Math.round(health)));
}

/**
 * Calculates gamified Gen Z user level and unlocked achievement badges.
 * 
 * @param {object} state
 * @returns {{level: number, title: string, badges: Array<{id: string, name: string, icon: string, unlocked: boolean}>}}
 */
export function calculateGamification(state = {}) {
  const {
    wishlistCount = 0,
    emergencySavings = 0,
    pausedSubscriptionsCount = 0,
    healthScore = 70,
    currentDay = 1,
    liquidBalance = 5000
  } = state;

  const badges = [
    {
      id: 'b1',
      name: 'Monk of Restraint',
      desc: 'Delayed 2+ impulses to 48h Wishlist',
      icon: '🧘',
      unlocked: wishlistCount >= 2
    },
    {
      id: 'b2',
      name: 'Shield Bearer',
      desc: 'Accumulated ₹800+ in Emergency Buffer',
      icon: '🛡️',
      unlocked: emergencySavings >= 800
    },
    {
      id: 'b3',
      name: 'Subscription Slayer',
      desc: 'Paused an unused subscription to protect runway',
      icon: '⚡',
      unlocked: pausedSubscriptionsCount >= 1
    },
    {
      id: 'b4',
      name: 'Zen Disciplinarian',
      desc: 'Maintained Health Score above 80 pts',
      icon: '👑',
      unlocked: healthScore >= 80
    },
    {
      id: 'b5',
      name: 'Day 30 Survivor',
      desc: 'Reached Day 25+ with positive liquid cash',
      icon: '🏆',
      unlocked: currentDay >= 25 && liquidBalance > 0
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  let level = 1;
  let title = 'Broke Novice';

  if (unlockedCount >= 4) {
    level = 5;
    title = 'Financial Zen Master 👑';
  } else if (unlockedCount === 3) {
    level = 4;
    title = 'Compound Prodigy 💎';
  } else if (unlockedCount === 2) {
    level = 3;
    title = 'Runway Guardian 🛡️';
  } else if (unlockedCount === 1) {
    level = 2;
    title = 'Budget Aware ⚡';
  }

  return { level, title, badges, unlockedCount };
}

/**
 * Executes a stochastic Monte Carlo simulation across multiple random financial curveball outcomes.
 * Evaluates the probability of surviving the 30-day budget without entering a deficit.
 * 
 * @param {number} liquidBalance - Current cash in hand
 * @param {number} liabilities - Pending commitments and subscriptions
 * @param {number} dailyAllowance - Current safe spend rate
 * @param {number} daysRemaining - Remaining days in the month
 * @param {number} [trials=500] - Number of stochastic simulations
 * @returns {{ survivalRate: number, medianOutcome: number, worstCase: number, bestCase: number }}
 */
export function runMonteCarloStressTest(liquidBalance, liabilities, dailyAllowance, daysRemaining, trials = 500) {
  if (daysRemaining <= 0) {
    return { survivalRate: 100, medianOutcome: liquidBalance, worstCase: liquidBalance, bestCase: liquidBalance };
  }

  let survivedTrials = 0;
  const outcomes = [];

  for (let i = 0; i < trials; i++) {
    // Normal spending variance (80% to 120%)
    const varianceFactor = 0.8 + Math.random() * 0.4;
    const spendingOutcomes = dailyAllowance * daysRemaining * varianceFactor;

    // Stochastic curveball chance: 40% probability of 1 unexpected expense between ₹250 and ₹1,200
    let curveballCost = 0;
    if (Math.random() < 0.40) {
      curveballCost = 250 + Math.floor(Math.random() * 950);
    }
    // Rare secondary shock (10% chance)
    if (Math.random() < 0.10) {
      curveballCost += 500 + Math.floor(Math.random() * 500);
    }

    const endingBalance = Math.round(liquidBalance - liabilities - spendingOutcomes - curveballCost);
    outcomes.push(endingBalance);

    if (endingBalance >= 0) {
      survivedTrials++;
    }
  }

  outcomes.sort((a, b) => a - b);
  const worstCase = outcomes[0];
  const bestCase = outcomes[outcomes.length - 1];
  const medianOutcome = outcomes[Math.floor(outcomes.length / 2)];
  const survivalRate = Math.round((survivedTrials / trials) * 100);

  return {
    survivalRate,
    medianOutcome,
    worstCase,
    bestCase
  };
}
