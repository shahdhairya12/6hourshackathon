/**
 * @file types/index.js
 * @description JSDoc domain model definitions for PULSE Financial Engine.
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique transaction identifier
 * @property {number} day - Day of month (1-30)
 * @property {string} name - Merchant / Description
 * @property {number} amount - Rupee amount
 * @property {'expense' | 'income' | 'commitment' | 'subscription'} type - Transaction category type
 * @property {string} category - Category slug (food, living, commute, etc.)
 * @property {string} [note] - Contextual notes
 */

/**
 * @typedef {Object} Commitment
 * @property {string} id - Unique identifier
 * @property {string} name - Obligation title (e.g. Rent, Wi-Fi)
 * @property {number} amount - Fixed liability amount in ₹
 * @property {number} dueDay - Day of month due (1-30)
 * @property {string} category - Category classification
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
 * @property {string} category - Category slug
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
 * @property {string} category - Category slug
 * @property {string} icon - Emoji icon
 * @property {'one-off' | 'recurring-daily' | 'recurring-weekly'} frequency - Frequency
 * @property {boolean} active - Simulation active status
 */

/**
 * @typedef {Object} GamificationState
 * @property {number} level - User level (1-5)
 * @property {string} title - Level title
 * @property {Array<{id: string, name: string, desc: string, icon: string, unlocked: boolean}>} badges - Achievement badges
 * @property {number} unlockedCount - Total unlocked badges count
 */
