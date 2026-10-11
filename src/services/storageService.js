/**
 * @file storageService.js
 * @description Local-First Data Portability, Storage Quota Monitoring,
 * and JSON/CSV Ledger Export & Import Services.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

/**
 * Checks LocalStorage availability and quota headroom.
 * 
 * @returns {{ available: boolean, estimatedBytesUsed: number }}
 */
export function getStorageHealth() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { available: false, estimatedBytesUsed: 0 };
  }

  try {
    let bytes = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        bytes += (localStorage[key].length + key.length) * 2;
      }
    }
    return { available: true, estimatedBytesUsed: bytes };
  } catch {
    return { available: false, estimatedBytesUsed: 0 };
  }
}

/**
 * Exports current financial simulation state to a formatted JSON file.
 * 
 * @param {object} state - Financial state snapshot
 * @returns {boolean} Success status
 */
export function exportFinancialProfileJSON(state) {
  try {
    const exportData = {
      version: '1.1.0',
      exportedAt: new Date().toISOString(),
      appName: 'PULSE OS // Gen Z Financial Engine',
      data: state,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    if (typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pulse-financial-snapshot-day-${state?.currentDay || 1}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    return true;
  } catch (error) {
    console.error('Failed to export financial state:', error);
    return false;
  }
}

/**
 * Validates and imports a JSON financial backup file.
 * 
 * @param {File} file 
 * @returns {Promise<object>} Parsed data
 */
export function importFinancialProfileJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided for import'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Could not read file content');
        }
        const parsed = JSON.parse(text);
        if (!parsed || !parsed.data) {
          throw new Error('Invalid Pulse backup file format: missing data payload');
        }
        resolve(parsed.data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk'));
    reader.readAsText(file);
  });
}

/**
 * Exports transaction history to standard CSV format.
 * 
 * @param {Array<object>} transactions 
 * @returns {boolean} Success status
 */
export function exportTransactionsCSV(transactions = []) {
  try {
    const headers = ['ID', 'Day', 'Category', 'Description', 'Type', 'Amount (INR)'];
    const rows = transactions.map(t => [
      t.id,
      t.day || 1,
      t.category || 'general',
      `"${(t.name || t.description || '').replace(/"/g, '""')}"`,
      t.type || 'expense',
      t.amount || 0
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pulse-transactions-ledger.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    return true;
  } catch (error) {
    console.error('Failed to export CSV ledger:', error);
    return false;
  }
}
