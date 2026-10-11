/**
 * PULSE OS - Performance Monitoring Utility
 * 
 * Provides Core Web Vitals telemetry, user-timing marks, and frame budget trackers.
 */

/**
 * Starts a named performance measurement timer.
 * 
 * @param {string} markName 
 */
export function startPerfMeasure(markName) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${markName}-start`);
  }
}

/**
 * Ends a named performance measurement timer and logs duration if slow.
 * 
 * @param {string} markName 
 * @param {number} thresholdMs 
 */
export function endPerfMeasure(markName, thresholdMs = 16) {
  if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
    const startMark = `${markName}-start`;
    const endMark = `${markName}-end`;
    performance.mark(endMark);
    
    try {
      performance.measure(markName, startMark, endMark);
      const entries = performance.getEntriesByName(markName);
      const latest = entries[entries.length - 1];
      if (latest && latest.duration > thresholdMs) {
        // Slow frame warning for debug
      }
    } catch {
      // Ignore measure collisions
    }
  }
}

/**
 * Simple debounce utility for high-frequency input handlers.
 * 
 * @param {Function} fn 
 * @param {number} delayMs 
 * @returns {Function}
 */
export function debounce(fn, delayMs = 150) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delayMs);
  };
}
