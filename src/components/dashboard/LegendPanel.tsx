import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

const LegendPanel: React.FC = () => {
  const legendItems = [
    { label: 'On Track', description: 'capaian ≥ 95% target', color: 'text-dashboard-success' },
    { label: 'At Risk', description: 'capaian 85% - 95%', color: 'text-dashboard-warning' },
    { label: 'Off Track', description: 'capaian < 85%', color: 'text-dashboard-danger' },
    { label: 'Tips', description: 'Gunakan filter periode & unit untuk melihat detail', color: 'text-dashboard-muted' }
  ];

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <InfoIcon className="w-5 h-5 text-dashboard-accent" />
          <CardTitle className="text-lg font-semibold">Legend & Tips</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3">
          {legendItems.map((item, index) => (
            <li 
              key={index} 
              className="flex items-start gap-3 fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                item.color === 'text-dashboard-success' ? 'bg-dashboard-success' :
                item.color === 'text-dashboard-warning' ? 'bg-dashboard-warning' :
                item.color === 'text-dashboard-danger' ? 'bg-dashboard-danger' :
                'bg-dashboard-muted'
              }`} />
              <div>
                <span className={`font-medium ${item.color}`}>
                  {item.label}:
                </span>
                <span className="text-sm text-dashboard-muted ml-2">
                  {item.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default React.memo(LegendPanel);