import { Deal, Target, Period, KPIData, UnitPerformance, NotificationItem, TrendDataPoint } from '../types/dashboard';

export function rupiah(n: number): string {
  // Handle null, undefined, or invalid numbers
  if (n === null || n === undefined || isNaN(n)) {
    return 'Rp 0';
  }

  // For 0 values, show as Rp 0 (this is actually correct for currency)
  if (n === 0) {
    return 'Rp 0';
  }

  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

export function parseDate(s: string): Date {
  // Handle null, undefined, or empty strings
  if (!s || s.trim() === '') {
    return new Date(0); // Return epoch date for invalid input
  }

  // Handle both ISO format and readable format (dd/mm/yyyy)
  if (s.includes('T') || s.includes('Z')) {
    const date = new Date(s);
    return isNaN(date.getTime()) ? new Date(0) : date;
  } else if (s.includes('/')) {
    // Convert dd/mm/yyyy to Date object
    const parts = s.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const dayNum = parseInt(day);
      const monthNum = parseInt(month) - 1;
      const yearNum = parseInt(year);

      // Validate date components
      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 0 && monthNum <= 11 && yearNum >= 1900 && yearNum <= 2100) {
        const date = new Date(yearNum, monthNum, dayNum);
        return isNaN(date.getTime()) ? new Date(0) : date;
      }
    }
    return new Date(0);
  } else {
    const date = new Date(s + 'T00:00:00');
    return isNaN(date.getTime()) ? new Date(0) : date;
  }
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function sum(arr: number[], fn?: (item: number) => number): number {
  return arr.reduce((acc, x) => acc + (fn ? fn(x) : x), 0);
}

export function getPeriodRange(period: Period) {
  const today = new Date();
  const start = new Date(today);
  let label = '';
  const buckets: Array<{ label: string; start: Date; end: Date }> = [];

  if (period === 'day') {
    start.setDate(today.getDate() - 6);
    label = 'Harian';
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      buckets.push({
        label: d.toISOString().slice(0, 10),
        start: new Date(d),
        end: new Date(d)
      });
    }
  } else if (period === 'week') {
    start.setDate(today.getDate() - (7 * 8));
    label = 'Mingguan';
    for (let i = 8; i >= 1; i--) {
      const s = new Date(today);
      s.setDate(today.getDate() - (7 * i));
      const e = new Date(s);
      e.setDate(s.getDate() + 6);
      buckets.push({
        label: s.toISOString().slice(0, 10),
        start: new Date(s),
        end: new Date(e)
      });
    }
  } else if (period === 'month') {
    start.setMonth(today.getMonth() - 11);
    label = 'Bulanan';
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      buckets.push({
        label: d.toLocaleString('id-ID', { month: 'short', year: 'numeric' }),
        start: new Date(d),
        end: endOfMonth
      });
    }
  } else if (period === '3m') {
    start.setMonth(today.getMonth() - 2);
    label = '3 Bulan';
    for (let i = 2; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      buckets.push({
        label: d.toLocaleString('id-ID', { month: 'short', year: 'numeric' }),
        start: new Date(d),
        end: endOfMonth
      });
    }
  } else if (period === '6m') {
    start.setMonth(today.getMonth() - 5);
    label = '6 Bulan';
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      buckets.push({
        label: d.toLocaleString('id-ID', { month: 'short', year: 'numeric' }),
        start: new Date(d),
        end: endOfMonth
      });
    }
  } else {
    start.setFullYear(today.getFullYear() - 1);
    label = '1 Tahun';
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      buckets.push({
        label: d.toLocaleString('id-ID', { month: 'short', year: 'numeric' }),
        start: new Date(d),
        end: endOfMonth
      });
    }
  }

  return { start, end: new Date(), label, buckets };
}

export function filterDeals(
  deals: Deal[],
  period: Period,
  unit: string,
  search: string
): Deal[] {
  const range = getPeriodRange(period);
  const start = range.start;
  const end = range.end;

  return deals.filter(d => {
    const dd = parseDate(d.dateDeal);
    if (dd < start) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(d.product.toLowerCase().includes(s) ||
            (d.customer && d.customer.toLowerCase().includes(s)))) {
        return false;
      }
    }
    return true;
  });
}

export function calculateKPIs(
  deals: Deal[],
  targets: Target,
  period: Period,
  unit: string,
  search: string
): KPIData {
  const range = getPeriodRange(period);
  const filtered = filterDeals(deals, period, unit, search);

  // Calculate scaled target
  let totalTarget = 0;
  if (unit === 'all') {
    totalTarget = Object.values(targets).reduce((a, b) => a + b, 0);
  } else {
    totalTarget = targets[unit] || 0;
  }

  let scale = 1;
  if (period === 'day') scale = 1 / 30;
  else if (period === 'week') scale = 7 / 30;
  else if (period === 'month') scale = 1;
  else if (period === '3m') scale = 3;
  else if (period === '6m') scale = 6;
  else if (period === '1y') scale = 12;

  const scaledTarget = totalTarget * scale;

  // Calculate actual collected and outstanding
  let actualCollected = 0;
  let outstanding = 0;

  filtered.forEach(d => {
    // PERBAIKAN: Aktual calculation according to requirements
    // 1. Aktual = jumlah pembayaran yang sudah benar-benar masuk (DP + lunas), bukan total nilai deal
    // 2. Jika status = "Lunas", maka gunakan seluruh nilai deal
    // 3. Jika status = "DP" atau "Open", maka gunakan hanya nilai DP (bukan nilai deal penuh)
    // 4. Jangan pernah menghitung DP dua kali

    let collected = 0;
    if (d.status === 'paid') {
      // Status "Lunas" - gunakan seluruh nilai deal
      collected = d.total;
    } else if (d.status === 'partial') {
      // Status "DP" - gunakan hanya nilai DP
      collected = d.dp;
    } else {
      // Status "Open" atau lainnya - gunakan hanya nilai DP
      collected = d.dp;
    }

    actualCollected += collected;
    outstanding += Math.max(0, d.total - collected);
  });

  const progressPct = scaledTarget > 0 ? Math.round((actualCollected / scaledTarget) * 100) : 0;

  // Calculate aging buckets
  const today = new Date();
  const agingBuckets = [0, 0, 0];

  deals.forEach(d => {
    // PERBAIKAN: Use corrected aktual calculation for aging buckets
    let collected = 0;
    if (d.status === 'paid') {
      collected = d.total;
    } else if (d.status === 'partial') {
      collected = d.dp;
    } else {
      collected = d.dp;
    }

    const outstandingAmt = Math.max(0, d.total - collected);
    if (outstandingAmt > 0) {
      const due = parseDate(d.dueDate);
      const days = daysBetween(due, today);
      if (due >= today) {
        agingBuckets[0] += outstandingAmt;
      } else if (days <= 30) {
        agingBuckets[0] += outstandingAmt;
      } else if (days <= 60) {
        agingBuckets[1] += outstandingAmt;
      } else {
        agingBuckets[2] += outstandingAmt;
      }
    }
  });

  // Calculate collection rate
  const sumTotalsFiltered = filtered.reduce((a, b) => a + b.total, 0);
  const collectedFiltered = filtered.reduce((a, b) => {
    let collected = 0;
    if (b.status === 'paid') {
      collected = b.total;
    } else if (b.status === 'partial') {
      collected = b.dp;
    } else {
      collected = b.dp;
    }
    return a + collected;
  }, 0);
  const collectionRate = sumTotalsFiltered > 0 ? Math.round((collectedFiltered / sumTotalsFiltered) * 100) : 0;

  return {
    scaledTarget,
    actualCollected,
    progressPct,
    outstanding,
    agingBuckets,
    collectionRate
  };
}

export function calculateUnitPerformance(
  deals: Deal[],
  targets: Target,
  period: Period
): UnitPerformance[] {
  const units = [...new Set(deals.map(d => d.unit))];
  const range = getPeriodRange(period);

  return units.map(u => {
    const t = targets[u] || 0;
    let scale = 1;
    if (period === 'day') scale = 1 / 30;
    else if (period === 'week') scale = 7 / 30;
    else if (period === 'month') scale = 1;
    else if (period === '3m') scale = 3;
    else if (period === '6m') scale = 6;
    else if (period === '1y') scale = 12;

    const scaledTarget = t * scale;
    const filteredDeals = deals.filter(d => d.unit === u && parseDate(d.dateDeal) >= range.start);

    // PERBAIKAN: Use corrected aktual calculation
    const actual = filteredDeals.reduce((a, b) => {
      let collected = 0;
      if (b.status === 'paid') {
        collected = b.total;
      } else if (b.status === 'partial') {
        collected = b.dp;
      } else {
        collected = b.dp;
      }
      return a + collected;
    }, 0);

    // PERBAIKAN: Ensure percentage doesn't exceed 100% unless target is very small
    let percentage = scaledTarget > 0 ? Math.round((actual / scaledTarget) * 100) : 0;
    if (percentage > 100 && scaledTarget > 1000) { // Only allow >100% if target is very small
      percentage = 100;
    }

    const status = percentage >= 95 ? 'on' : (percentage >= 85 ? 'risk' : 'off');

    return {
      unit: u,
      target: scaledTarget,
      actual,
      percentage,
      status
    };
  });
}

export function getNotifications(deals: Deal[]): NotificationItem[] {
  const today = new Date();

  return deals
    .filter(d => {
      const due = parseDate(d.dueDate);

      // PERBAIKAN: Use corrected aktual calculation for outstanding
      let collected = 0;
      if (d.status === 'paid') {
        collected = d.total;
      } else if (d.status === 'partial') {
        collected = d.dp;
      } else {
        collected = d.dp;
      }

      const outstandingAmt = Math.max(0, d.total - collected);
      const days = daysBetween(today, due);
      return outstandingAmt > 0 && days <= 7 && days >= 0;
    })
    .map(d => {
      const due = parseDate(d.dueDate);
      const days = daysBetween(today, due);

      // PERBAIKAN: Use corrected aktual calculation for outstanding
      let collected = 0;
      if (d.status === 'paid') {
        collected = d.total;
      } else if (d.status === 'partial') {
        collected = d.dp;
      } else {
        collected = d.dp;
      }

      const outstandingAmt = Math.max(0, d.total - collected);
      return {
        deal: d,
        daysUntilDue: days,
        daysUntilDueFormatted: formatDaysUntilDueShort(days),
        outstandingAmount: outstandingAmt
      };
    });
}

export function buildTrendData(
  deals: Deal[],
  period: Period,
  unit: string
): TrendDataPoint[] {
  const range = getPeriodRange(period);
  const buckets = range.buckets;

  return buckets.map(b => {
    const amt = deals
      .filter(d => {
        const dd = parseDate(d.dateDeal);
        return dd >= b.start && dd <= b.end && (unit === 'all' || d.unit === unit);
      })
      .reduce((a, b) => {
        // PERBAIKAN: Use corrected aktual calculation for trend data
        let collected = 0;
        if (b.status === 'paid') {
          collected = b.total;
        } else if (b.status === 'partial') {
          collected = b.dp;
        } else {
          collected = b.dp;
        }
        return a + collected;
      }, 0);

    return {
      label: b.label,
      value: Math.round(amt)
    };
  });
}

export function exportToCSV(deals: Deal[]): void {
  const rows = [
    ['ID', 'Unit', 'Produk', 'Customer', 'Total', 'DP', 'Sisa', 'Tanggal Deal', 'Due Date', 'Status']
  ];

  deals.forEach(d => {
    // PERBAIKAN: Use corrected aktual calculation for export
    let collected = 0;
    if (d.status === 'paid') {
      collected = d.total;
    } else if (d.status === 'partial') {
      collected = d.dp;
    } else {
      collected = d.dp;
    }

    const sisa = Math.max(0, d.total - collected);
    rows.push([
      d.id.toString(),
      d.unit,
      d.product,
      d.customer || '',
      d.total.toString(),
      d.dp.toString(),
      sisa.toString(),
      d.dateDeal,
      d.dueDate,
      d.status
    ]);
  });

  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deals_export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// New date formatting functions
export function formatDate(dateString: string): string {
  try {
    // Handle null, undefined, or empty strings
    if (!dateString || dateString.trim() === '') {
      return 'Tanggal tidak tersedia';
    }

    // Handle special backend messages
    if (dateString === 'Tanggal tidak tersedia' || dateString === 'Format tanggal salah') {
      return dateString;
    }

    const date = parseDate(dateString);

    // Check if date is valid (not epoch date)
    if (date.getTime() === 0) {
      return 'Tanggal tidak tersedia';
    }

    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Tanggal tidak tersedia';
  }
}

export function formatDateForDisplay(dateString: string): string {
  try {
    // Handle null, undefined, or empty strings
    if (!dateString || dateString.trim() === '') {
      return 'Tanggal tidak tersedia';
    }

    // Handle special backend messages
    if (dateString === 'Tanggal tidak tersedia' || dateString === 'Format tanggal salah') {
      return dateString;
    }

    // Parse the ISO date string
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Tanggal tidak tersedia';
    }

    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'Tanggal tidak tersedia';
  }
}

export function formatDaysUntilDue(days: number): string {
  if (days === 0) {
    return 'Hari ini';
  } else if (days > 0) {
    return `${days} hari lagi`;
  } else {
    return `${Math.abs(days)} hari terlambat`;
  }
}

export function formatDaysUntilDueShort(days: number): string {
  if (days === 0) {
    return 'Hari ini';
  } else if (days > 0) {
    return `${days}h lagi`;
  } else {
    return `${Math.abs(days)}h terlambat`;
  }
}

export function getDaysUntilDueColor(days: number): string {
  if (days === 0) {
    return 'text-red-600'; // Today - most urgent
  } else if (days > 0 && days <= 3) {
    return 'text-orange-600'; // 1-3 days - high urgency
  } else if (days > 3 && days <= 7) {
    return 'text-yellow-600'; // 4-7 days - medium urgency
  } else if (days < 0) {
    return 'text-red-700'; // Overdue - danger
  } else {
    return 'text-green-600'; // More than 7 days - normal
  }
}

export function getDaysUntilDueBgColor(days: number): string {
  if (days === 0) {
    return 'bg-red-100'; // Today - most urgent
  } else if (days > 0 && days <= 3) {
    return 'bg-orange-100'; // 1-3 days - high urgency
  } else if (days > 3 && days <= 7) {
    return 'bg-yellow-100'; // 4-7 days - medium urgency
  } else if (days < 0) {
    return 'bg-red-200'; // Overdue - danger
  } else {
    return 'bg-green-100'; // More than 7 days - normal
  }
}
