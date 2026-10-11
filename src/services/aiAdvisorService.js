/**
 * @file aiAdvisorService.js
 * @description FinPulse Neural AI Copilot Engine.
 * Generates tailored financial critiques, compromise alternatives, and roasts
 * across 4 Gen Z advisor archetypes based on deterministic math signals.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

/**
 * Generates an AI advisor appraisal for a simulated purchase.
 * 
 * @param {object} params
 * @param {string} params.archetype - 'roast' | 'zen' | 'hustler' | 'quant'
 * @param {string} params.itemName - Description of item being tested
 * @param {number} params.amount - Item price in ₹
 * @param {number} params.liquidBalance - Current cash in hand
 * @param {number} params.safeDailyAllowance - Current safe spend rate
 * @param {number} params.simSafeDaily - Simulated safe daily spend rate
 * @param {number} params.daysRemaining - Days remaining in month
 * @param {number} params.totalPendingLiabilities - Unpaid commitments & active subs
 * @param {number} [params.splitCount=1] - Number of people splitting the expense
 * @returns {{
 *   headline: string,
 *   critique: string,
 *   compromise: string,
 *   badge: string,
 *   badgeColor: string,
 *   severity: 'chill' | 'warning' | 'danger'
 * }}
 */
export function generateAiAdvice({
  archetype = 'roast',
  itemName = 'This purchase',
  amount = 0,
  liquidBalance = 10000,
  safeDailyAllowance = 250,
  simSafeDaily = 200,
  daysRemaining = 27,
  totalPendingLiabilities = 3000,
  splitCount = 1
}) {
  const effectiveAmount = Math.round(amount / Math.max(1, splitCount));
  const dailyDrop = Math.max(0, safeDailyAllowance - simSafeDaily);
  const pctOfLiquid = Math.round((effectiveAmount / Math.max(1, liquidBalance)) * 100);
  const isSevereDeficit = (liquidBalance - effectiveAmount) < totalPendingLiabilities;

  // 1. ROAST MASTER ARCHETYPE 🔥
  if (archetype === 'roast') {
    if (isSevereDeficit) {
      return {
        headline: 'Bro is about to get evicted 💀',
        critique: `You have ₹${totalPendingLiabilities} in fixed bills waiting, and you wanna spend ₹${effectiveAmount} on "${itemName}"? Your landlord is gonna accept vibes as rent?`,
        compromise: `Skip it immediately or start learning how to cook instant Maggi with tap water.`,
        badge: 'Critical Roast 🔥',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        severity: 'danger'
      };
    }
    if (dailyDrop > 40 || simSafeDaily < 120) {
      return {
        headline: 'Financial self-sabotage speedrun 📉',
        critique: `Dropping your daily allowance by ₹${dailyDrop}/day for "${itemName}"? You’re gonna be eating Parle-G biscuits dipped in water by Day 24.`,
        compromise: `Park this in the 48-Hour Wishlist. If you still want it when your dopamine crashes, revisit it.`,
        badge: 'Harsh Warning ⚠️',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        severity: 'warning'
      };
    }
    return {
      headline: 'Surprisingly not terrible 👍',
      critique: `Takes ₹${dailyDrop}/day off your leeway, leaving ₹${simSafeDaily}/day. Not devastating, but don't get cocky.`,
      compromise: `If it sparks actual joy and not just 11 PM boredom, swipe UPI with caution.`,
      badge: 'Tolerated Spend ✨',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      severity: 'chill'
    };
  }

  // 2. ZEN MONK ARCHETYPE 🧘
  if (archetype === 'zen') {
    if (isSevereDeficit) {
      return {
        headline: 'Chaos looms on the horizon 🧘',
        critique: `Attachment to "${itemName}" will disturb your peace. Unpaid obligations of ₹${totalPendingLiabilities} will bring distress to your doorstep.`,
        compromise: `Breathe in discipline, exhale desire. Let this temptation pass like a drifting cloud into your 48-Hour Wishlist.`,
        badge: 'Mindful Boundary 🛡️',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        severity: 'danger'
      };
    }
    if (dailyDrop > 30) {
      return {
        headline: 'Temporary pleasure vs. Lasting equilibrium ⚖️',
        critique: `This ₹${effectiveAmount} commitment reduces your daily buffer by ₹${dailyDrop}/day across all ${daysRemaining} remaining sunrises.`,
        compromise: `Seek fulfillment in what you already possess. Try a ₹${Math.round(effectiveAmount * 0.25)} mindful alternative.`,
        badge: 'Moderation Call 🌿',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        severity: 'warning'
      };
    }
    return {
      headline: 'Harmony remains intact 🍃',
      critique: `Your safe allowance stays serene at ₹${simSafeDaily}/day. The river of your finances flows smoothly without drought.`,
      compromise: `Partake with gratitude. Ensure you also allocate a small tithe to your Emergency Buffer.`,
      badge: 'Balanced Choice 💎',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      severity: 'chill'
    };
  }

  // 3. HYPER HUSTLER ARCHETYPE 🚀
  if (archetype === 'hustler') {
    if (isSevereDeficit) {
      return {
        headline: 'Runway breach! Abort mission! 🚨',
        critique: `This ₹${effectiveAmount} spend completely wipes out your defensive moat. You'll default on your ₹${totalPendingLiabilities} obligations!`,
        compromise: `Lock this capital into the Emergency Shield instead. Winners don't burn their cash runway before payday.`,
        badge: 'Zero Defense 🛑',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        severity: 'danger'
      };
    }
    if (pctOfLiquid > 15) {
      return {
        headline: 'Capital drain alert: ${pctOfLiquid}% of liquid stack! ⚡',
        critique: `Dropping ₹${effectiveAmount} burns ${pctOfLiquid}% of your entire liquid reserves. That’s ${Math.round(effectiveAmount / 120)} days of runway erased!`,
        compromise: `Negotiate, split with ${splitCount > 1 ? splitCount : 'a flatmate'}, or find an internship gig to subsidize this first.`,
        badge: 'High Burn Rate 📊',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        severity: 'warning'
      };
    }
    return {
      headline: 'Capital deployment approved 🚀',
      critique: `Your runway stays protected with ₹${simSafeDaily}/day buffer. Pacing is solid.`,
      compromise: `Execute the transaction and refocus 100% of your energy on expanding your skills.`,
      badge: 'Runway Intact ⚡',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      severity: 'chill'
    };
  }

  // 4. QUANT ANALYST ARCHETYPE 📈
  return {
    headline: isSevereDeficit 
      ? 'Probability of Default: 94.2% [Critical]' 
      : `Drawdown Delta: -₹${dailyDrop}/day [σ = 0.24]`,
    critique: `Parametric evaluation: Capital deduction of ₹${effectiveAmount} (${pctOfLiquid}% of liquid pool) across T=${daysRemaining} days. Post-spend Free Cash = ₹${liquidBalance - effectiveAmount - totalPendingLiabilities}.`,
    compromise: isSevereDeficit
      ? `Mathematical veto: Liquidity coverage ratio (LCR) falls to ${(Math.max(0, liquidBalance - effectiveAmount) / Math.max(1, totalPendingLiabilities)).toFixed(2)}. Minimum requirement is 1.00.`
      : `Expected daily volatility: ₹${simSafeDaily}/day. Stochastic survival probability remains at ${Math.min(99, Math.max(10, Math.round(100 - (dailyDrop * 1.5))))}%.`,
    badge: isSevereDeficit ? 'Model Rejection 📉' : 'Model Verified 📐',
    badgeColor: isSevereDeficit 
      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
      : 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    severity: isSevereDeficit ? 'danger' : dailyDrop > 35 ? 'warning' : 'chill'
  };
}
