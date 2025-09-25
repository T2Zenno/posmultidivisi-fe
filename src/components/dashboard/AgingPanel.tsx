import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { rupiah } from '@/utils/dashboard';
import { ClockIcon, TrendingUpIcon } from 'lucide-react';

interface AgingPanelProps {
  agingBuckets: number[];
  collectionRate: number;
}

const AgingPanel: React.FC<AgingPanelProps> = ({ agingBuckets, collectionRate }) => {
  const agingData = [
    { bucket: '0 - 30 hari', amount: agingBuckets[0] },
    { bucket: '31 - 60 hari', amount: agingBuckets[1] },
    { bucket: '> 60 hari', amount: agingBuckets[2] }
  ];

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-dashboard-accent" />
          <CardTitle className="text-lg font-semibold">Aging & KPI Ringkas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {/* Aging Tagihan */}
        <div>
          <h4 className="text-sm font-medium text-dashboard-muted mb-3">
            Aging Tagihan
          </h4>
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold text-dashboard-muted">Bucket</TableHead>
                  <TableHead className="font-semibold text-dashboard-muted text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agingData.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className="hover:bg-muted/50 transition-colors fade-in border-border/30"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TableCell className="font-medium text-foreground">
                      {item.bucket}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      index === 2 && item.amount > 0 
                        ? 'text-dashboard-danger' 
                        : index === 1 && item.amount > 0
                        ? 'text-dashboard-warning'
                        : 'text-foreground'
                    }`}>
                      {rupiah(Math.round(item.amount))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Collection Rate */}
        <div>
          <h4 className="text-sm font-medium text-dashboard-muted mb-3">
            Collection Rate
          </h4>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${
              collectionRate >= 90 
                ? 'bg-dashboard-success/10' 
                : collectionRate >= 75 
                ? 'bg-dashboard-warning/10' 
                : 'bg-dashboard-danger/10'
            }`}>
              <TrendingUpIcon className={`w-6 h-6 ${
                collectionRate >= 90 
                  ? 'text-dashboard-success' 
                  : collectionRate >= 75 
                  ? 'text-dashboard-warning' 
                  : 'text-dashboard-danger'
              }`} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                collectionRate >= 90 
                  ? 'text-dashboard-success' 
                  : collectionRate >= 75 
                  ? 'text-dashboard-warning' 
                  : 'text-dashboard-danger'
              }`}>
                {collectionRate}%
              </div>
              <div className="text-sm text-dashboard-muted">
                Tingkat koleksi pembayaran
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(AgingPanel);