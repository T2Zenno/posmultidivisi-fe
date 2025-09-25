import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationItem } from '@/types/dashboard';
import { rupiah, formatDaysUntilDue, formatDaysUntilDueShort, getDaysUntilDueColor, getDaysUntilDueBgColor, formatDateForDisplay } from '@/utils/dashboard';
import { AlertTriangleIcon, CalendarIcon, ClockIcon } from 'lucide-react';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangleIcon className="w-5 h-5 text-dashboard-warning" />
          <CardTitle className="text-lg font-semibold">Notifikasi Tagihan</CardTitle>
        </div>
        <span className="text-sm text-dashboard-muted">
          Tagihan jatuh tempo dalam 7 hari
        </span>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-dashboard-muted">
            <div className="mx-auto w-12 h-12 bg-dashboard-success/10 rounded-full flex items-center justify-center mb-3">
              <ClockIcon className="w-6 h-6 text-dashboard-success" />
            </div>
            <p className="text-sm">Tidak ada tagihan jatuh tempo dalam 7 hari</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={notification.deal.id}
              className="notification-card fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground text-sm truncate">
                      {notification.deal.product}
                    </h4>
                    <span className="text-xs px-2 py-1 bg-dashboard-warning/10 text-dashboard-warning rounded-full flex-shrink-0">
                      {notification.deal.unit}
                    </span>
                  </div>

                  <p className="text-sm text-dashboard-muted mb-2 truncate">
                    {notification.deal.customer || 'Customer tidak tersedia'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-dashboard-muted">
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="font-medium text-dashboard-warning">
                        Sisa: {rupiah(notification.outstandingAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {notification.daysUntilDueFormatted || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-dashboard-danger">
                    {notification.deal.due_date_formatted || (notification.deal.dueDate ? formatDateForDisplay(notification.deal.dueDate) : 'Tanggal tidak tersedia') || '-'}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getDaysUntilDueBgColor(notification.daysUntilDue)} ${getDaysUntilDueColor(notification.daysUntilDue)}`}>
                    {notification.daysUntilDueFormatted ? notification.daysUntilDueFormatted : '-'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(NotificationsPanel);
