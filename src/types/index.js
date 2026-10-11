/**
 * @file types/index.js
 * @description JSDoc domain model definitions and runtime schema contracts for PULSE Financial Engine.
 * @author PULSE OS Architecture Group
 * @version 1.1.0
 */

/**
 * @typedef {'expense' | 'income' | 'commitment' | 'subscription'} TransactionType
 */

/**
 * @typedef {'food' | 'living' | 'commute' | 'bills' | 'utilities' | 'entertainment' | 'health' | 'education' | 'work' | 'shopping' | 'budget'} CategorySlug
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique transaction identifier
 * @property {number} day - Day of month (1-30)
 * @property {string} name - Merchant / Description
 * @property {number} amount - Rupee amount
 * @property {TransactionType} type - Transaction category type
 * @property {CategorySlug} category - Category slug
 * @property {string} [note] - Contextual notes
 */

/**
 * @typedef {Object} Commitment
 * @property {string} id - Unique identifier
 * @property {string} name - Obligation title (e.g. Rent, Wi-Fi)
 * @property {number} amount - Fixed liability amount in ₹
 * @property {number} dueDay - Day of month due (1-30)
 * @property {CategorySlug} category - Category classification
 * @property {boolean} paid - Settlement status
 * @property {string} icon - Visual emoji identifier
 */

/**
 * @typedef {Object} Subscription
 * @property {string} id - Identifier
 * @property {string} name - Service name (e.g. Spotify, Netflix)
 * @property {number} amount - Monthly recurring cost in ₹
 * @property {number} dueDay - Billing cycle day
 * @property {boolean} active - Active / paused toggle status
 * @property {string} icon - Emoji icon
 * @property {CategorySlug} category - Category slug
 */

/**
 * @typedef {Object} SavingsGoal
 * @property {string} id - Identifier
 * @property {string} name - Goal title (e.g. Coldplay Ticket, Emergency Shield)
 * @property {number} target - Target rupee milestone
 * @property {number} current - Currently locked funds in ₹
 * @property {number} deadlineDay - Target completion day (1-30)
 * @property {string} icon - Emoji icon
 * @property {string} color - Hex highlight color
 */

/**
 * @typedef {Object} SimulationScenario
 * @property {string} name - Test item description
 * @property {number} amount - Test purchase amount in ₹
 * @property {CategorySlug} category - Category slug
 * @property {string} icon - Emoji icon
 * @property {'one-off' | 'recurring-daily' | 'recurring-weekly'} frequency - Frequency
 * @property {boolean} active - Simulation active status
 */

/**
 * @typedef {Object} GamificationBadge
 * @property {string} id - Badge ID
 * @property {string} name - Badge name
 * @property {string} desc - How to unlock
 * @property {string} icon - Emoji symbol
 * @property {boolean} unlocked - Unlock status
 */

/**
 * @typedef {Object} GamificationState
 * @property {number} level - User level (1-5)
 * @property {string} title - Level title
 * @property {GamificationBadge[]} badges - Achievement badges
 * @property {number} unlockedCount - Total unlocked badges count
 */

/**
 * @typedef {Object} MonteCarloResult
 * @property {number} survivalRate - Probability of 30-day budget survival (0-100%)
 * @property {number} medianOutcome - Median Day 30 liquid balance in ₹
 * @property {number} worstCase - 10th percentile outcome in ₹
 * @property {number} bestCase - 90th percentile outcome in ₹
 */

/**
 * Validates whether an object adheres to the Transaction model.
 * 
 * @param {unknown} obj 
 * @returns {boolean}
 */
export function isValidTransaction(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const t = /** @type {Record<string, any>} */ (obj);
  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    typeof t.amount === 'number' &&
    !isNaN(t.amount) &&
    typeof t.type === 'string'
  );
}

/**
 * Validates whether an object adheres to the SavingsGoal model.
 * 
 * @param {unknown} obj 
 * @returns {boolean}
 */
export function isValidSavingsGoal(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const g = /** @type {Record<string, any>} */ (obj);
  return (
    typeof g.id === 'string' &&
    typeof g.name === 'string' &&
    typeof g.target === 'number' &&
    typeof g.current === 'number'
  );
}
