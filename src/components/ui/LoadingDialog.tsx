import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LoadingDialogProps {
  open: boolean;
  title?: string;
  description?: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({
  open,
  title = "Memuat Data",
  description = "Mohon tunggu sebentar..."
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dashboard-accent mb-4"></div>
          <p className="text-dashboard-muted text-center">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
