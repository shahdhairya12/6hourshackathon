import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  exportFinancialProfileJSON, 
  exportTransactionsCSV,
  getStorageHealth,
  importFinancialProfileJSON
} from './storageService';

describe('Storage & Data Portability Service', () => {
  beforeEach(() => {
    // Mock URL and document DOM APIs
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    global.document = {
      createElement: vi.fn(() => ({
        href: '',
        download: '',
        click: vi.fn(),
      })),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates valid JSON export blob and triggers download', () => {
    const dummyState = {
      currentDay: 15,
      liquidBalance: 6500,
      safeDailyAllowance: 216
    };

    const success = exportFinancialProfileJSON(dummyState);
    expect(success).toBe(true);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.document.createElement).toHaveBeenCalledWith('a');
  });

  it('formats transactions into CSV and handles special characters in description', () => {
    const transactions = [
      { id: 'tx-1', day: 2, category: 'food', description: 'Chai, "Samosa" & Snacks', type: 'expense', amount: 150 },
      { id: 'tx-2', day: 4, category: 'income', description: 'Pocket Money Allowance', type: 'income', amount: 10000 }
    ];

    const success = exportTransactionsCSV(transactions);
    expect(success).toBe(true);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.document.createElement).toHaveBeenCalledWith('a');
  });

  it('handles empty transactions gracefully during CSV export', () => {
    const success = exportTransactionsCSV([]);
    expect(success).toBe(true);
  });

  it('evaluates storage health metrics safely', () => {
    const health = getStorageHealth();
    expect(typeof health.available).toBe('boolean');
    expect(typeof health.estimatedBytesUsed).toBe('number');
  });

  it('rejects importFinancialProfileJSON when null file is passed', async () => {
    await expect(importFinancialProfileJSON(null)).rejects.toThrow('No file provided');
  });
});
