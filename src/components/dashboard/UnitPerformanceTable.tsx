import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UnitPerformance } from '@/types/dashboard';
import { rupiah } from '@/utils/dashboard';

interface UnitPerformanceTableProps {
  units: UnitPerformance[];
}

const UnitPerformanceTable: React.FC<UnitPerformanceTableProps> = ({ units }) => {
  const getStatusBadge = (status: 'on' | 'risk' | 'off') => {
    const statusConfig = {
      on: { className: 'status-success', label: 'On Track' },
      risk: { className: 'status-warning', label: 'At Risk' },
      off: { className: 'status-danger', label: 'Off Track' }
    };

    const config = statusConfig[status];
    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Unit Performance</CardTitle>
        <span className="text-sm text-dashboard-muted">
          Target vs Aktual (periode aktif)
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="table-responsive">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold text-dashboard-muted">Unit Usaha</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-right">Target</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-right">Aktual</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-center">% Capai</TableHead>
                <TableHead className="font-semibold text-dashboard-muted text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit, index) => (
                <TableRow 
                  key={unit.unit} 
                  className="hover:bg-muted/50 transition-colors fade-in border-border/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium text-foreground">
                    {unit.unit}
                  </TableCell>
                  <TableCell className="text-right text-dashboard-muted">
                    {rupiah(Math.round(unit.target))}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {unit.actual > 0 ? rupiah(Math.round(unit.actual)) : <span className="text-red-500">Rp 0 (No data)</span>}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-foreground">
                    {unit.percentage}%
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(unit.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(UnitPerformanceTable);