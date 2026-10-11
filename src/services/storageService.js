/**
 * PULSE OS - Storage & Data Portability Service
 * 
 * Provides JSON backup/restore and CSV ledger export capabilities
 * for data sovereignty and offline-first persistence.
 */

/**
 * Exports current financial simulation state to a formatted JSON file.
 * 
 * @param {object} state - Financial state snapshot
 */
export function exportFinancialProfileJSON(state) {
  try {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'PULSE OS // Gen Z Financial Engine',
      data: state,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    if (typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pulse-financial-snapshot-day-${state.currentDay || 1}.json`;
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
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result);
        if (!parsed || !parsed.data) {
          throw new Error('Invalid Pulse backup file format');
        }
        resolve(parsed.data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Exports transaction history to CSV format for external analysis.
 * 
 * @param {Array<object>} transactions 
 */
export function exportTransactionsCSV(transactions = []) {
  try {
    const headers = ['ID', 'Day', 'Category', 'Description', 'Type', 'Amount (INR)'];
    const rows = transactions.map(t => [
      t.id,
      t.day || 1,
      t.category,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.type,
      t.amount
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
