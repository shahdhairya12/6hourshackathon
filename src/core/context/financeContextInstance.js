import { createContext } from 'react';

/**
 * React Context instance for PULSE OS financial state and actions.
 * Separated into an isolated file to satisfy React Fast Refresh and Clean Architecture boundaries.
 */
export const FinanceContext = createContext(null);
