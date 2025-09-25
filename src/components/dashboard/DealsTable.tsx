import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Deal } from '@/types/dashboard';
import { rupiah, formatDate } from '@/utils/dashboard';

interface DealsTableProps {
  deals: Deal[];
  onTogglePaid: (dealId: number) => void;
}

const DealsTable: React.FC<DealsTableProps> = ({ deals, onTogglePaid }) => {
  const getStatusBadge = (status: 'open' | 'partial' | 'paid') => {
    const statusConfig = {
      paid: { className: 'status-success', label: 'Lunas' },
      partial: { className: 'status-warning', label: 'DP' },
      open: { className: 'status-danger', label: 'Open' }
    };

    const config = statusConfig[status];
    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  };

  const calculateRemaining = (deal: Deal) => {
    const collected = deal.dp + (deal.status === 'paid' ? (deal.total - deal.dp) : 0);
    return Math.max(0, deal.total - collected);
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Daftar Produk / Project</CardTitle>
        <span className="text-sm text-dashboard-muted">
          Klik baris untuk menandai Lunas / Update
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="table-responsive">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold text-dashboard-muted">Produk / Project</TableHead>
                <TableHead className="font-semibold text-dashboard-muted">Unit</TableHead>
                <TableHead className="font-semibold text-dashboard-muted">Customer</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-right">Nilai Deal</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-right">DP</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-right">Sisa</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-center">Tanggal Deal</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-center">Due Date</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal, index) => {
                const remaining = calculateRemaining(deal);
                const isOverdue = new Date(deal.dueDate) < new Date() && remaining > 0;
                
                return (
                  <TableRow
                    key={deal.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer fade-in border-border/30"
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => onTogglePaid(deal.id)}
                  >
                    <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                      {deal.product}
                    </TableCell>
                    <TableCell className="text-dashboard-muted">
                      {deal.unit}
                    </TableCell>
                    <TableCell className="text-dashboard-muted max-w-[150px] truncate">
                      {deal.customer || '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {rupiah(deal.total)}
                    </TableCell>
                    <TableCell className="text-right text-dashboard-muted">
                      {rupiah(deal.dp)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${remaining > 0 ? 'text-dashboard-warning' : 'text-dashboard-success'}`}>
                      {rupiah(remaining)}
                    </TableCell>
                    <TableCell className="text-center text-dashboard-muted text-sm">
                      {deal.date_deal_formatted || formatDate(deal.dateDeal) || '-'}
                    </TableCell>
                    <TableCell className={`text-center text-sm ${isOverdue ? 'text-dashboard-danger font-medium' : 'text-dashboard-muted'}`}>
                      {deal.due_date_formatted || formatDate(deal.dueDate) || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(deal.status)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {deals.length === 0 && (
            <div className="text-center py-8 text-dashboard-muted">
              <p>Tidak ada data yang ditemukan</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(DealsTable);