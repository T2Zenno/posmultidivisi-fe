import React, { useEffect, useRef, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendDataPoint } from '@/types/dashboard';
import { rupiah } from '@/utils/dashboard';

Chart.register(...registerables);

interface TrendChartProps {
  data: TrendDataPoint[];
  periodLabel: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, periodLabel }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const createChart = useCallback(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'hsl(210, 100%, 44%, 0.3)');
    gradient.addColorStop(1, 'hsl(210, 100%, 44%, 0.05)');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label: 'Aktual (Rp)',
            data: data.map(d => d.value),
            borderColor: 'hsl(210, 100%, 44%)',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'hsl(210, 100%, 44%)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'hsl(210, 100%, 56%)',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'hsl(210, 100%, 44%)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Aktual: ${rupiah(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              color: 'hsl(215, 16%, 47%)',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: 'hsl(214, 32%, 91%, 0.5)'
            },
            border: {
              display: false
            },
            ticks: {
              color: 'hsl(215, 16%, 47%)',
              font: {
                size: 12
              },
              callback: function(value) {
                return rupiah(Number(value));
              }
            }
          }
        },
        elements: {
          line: {
            borderCapStyle: 'round',
            borderJoinStyle: 'round'
          }
        }
      }
    });
  }, [data]);

  const updateChart = useCallback(() => {
    if (!chartInstance.current) return;

    const chart = chartInstance.current;
    chart.data.labels = data.map(d => d.label);
    chart.data.datasets[0].data = data.map(d => d.value);
    chart.update('none'); // No animation to prevent flickering
  }, [data]);

  useEffect(() => {
    // Only create new chart if it doesn't exist
    if (!chartInstance.current) {
      chartInstance.current = createChart();
    } else {
      // Update existing chart data
      updateChart();
    }

    return () => {
      // Only destroy on unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [createChart, updateChart]);

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Trend Capaian</CardTitle>
        <span className="text-sm text-dashboard-muted">
          Periode: {periodLabel}
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="chart-container">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(TrendChart);