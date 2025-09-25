import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Period, DashboardState } from '@/types/dashboard';
import { SearchIcon, DownloadIcon, SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface DashboardFiltersProps {
  state: DashboardState;
  units: string[];
  unitsData?: { id: number; name: string; description?: string; is_active: boolean }[];
  onStateChange: (newState: Partial<DashboardState>) => void;
  onExportCSV: () => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  state,
  units,
  unitsData,
  onStateChange,
  onExportCSV
}) => {
  const { theme, setTheme } = useTheme();

  const periodOptions = [
    { value: 'day' as Period, label: 'Harian' },
    { value: 'week' as Period, label: 'Mingguan' },
    { value: 'month' as Period, label: 'Bulanan' },
    { value: '3m' as Period, label: '3 Bulan' },
    { value: '6m' as Period, label: '6 Bulan' },
    { value: '1y' as Period, label: '1 Tahun' }
  ];

  const handlePeriodChange = (value: Period) => {
    onStateChange({ period: value });
  };

  const handleUnitChange = (value: string) => {
    // If "all" is selected, set unit to "all"
    // Otherwise, keep the unit name as-is (don't convert to ID)
    if (value === 'all') {
      onStateChange({ unit: 'all' });
    } else {
      // Keep the unit name as selected
      onStateChange({ unit: value });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStateChange({ search: e.target.value });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6" style={{ pointerEvents: 'auto' }}>
      <div className="flex flex-wrap items-center gap-4" style={{ pointerEvents: 'auto' }}>
        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="period" className="text-sm font-medium text-dashboard-muted whitespace-nowrap">
            Periode
          </Label>
          <Select
            value={state.period}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-[140px] h-9" style={{ pointerEvents: 'auto' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ pointerEvents: 'auto', zIndex: 50 }}>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} style={{ pointerEvents: 'auto' }}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Unit Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="unit" className="text-sm font-medium text-dashboard-muted whitespace-nowrap">
            Unit
          </Label>
          <Select
            value={state.unit}
            onValueChange={handleUnitChange}
          >
            <SelectTrigger className="w-[140px] h-9" style={{ pointerEvents: 'auto' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ pointerEvents: 'auto', zIndex: 50 }}>
              <SelectItem value="all" style={{ pointerEvents: 'auto' }}>Semua Unit</SelectItem>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit} style={{ pointerEvents: 'auto' }}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-muted w-4 h-4 pointer-events-none" />
          <Input
            placeholder="Cari produk / customer..."
            value={state.search}
            onChange={handleSearchChange}
            className="pl-10 w-[200px] h-9"
            style={{ pointerEvents: 'auto' }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
        <Button
          onClick={onExportCSV}
          variant="outline"
          size="sm"
          className="h-9 gap-2"
          style={{ pointerEvents: 'auto' }}
        >
          <DownloadIcon className="w-4 h-4" />
          Export CSV
        </Button>

        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          style={{ pointerEvents: 'auto' }}
        >
          {theme === 'dark' ? (
            <SunIcon className="w-4 h-4" />
          ) : (
            <MoonIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(DashboardFilters);