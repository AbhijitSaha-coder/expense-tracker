export function downloadTransactionsCsv(transactions) {
  const headers = ['Date', 'Type', 'Description', 'Category', 'Amount'];
  const rows = transactions.map((tx) => [
    tx.date,
    tx.type,
    escapeCsvField(tx.description),
    tx.category,
    tx.amount,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `spendwise-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsvField(value) {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
