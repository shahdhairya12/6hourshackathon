import { useContext } from 'react';
import { FinanceContext } from '../context/financeContextInstance';

/**
 * Custom hook to consume the central FinanceContext state and dispatchers.
 * 
 * @returns {import('../../types').FinanceContextType}
 */
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
