import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface LoadingToastProps {
  open: boolean;
  title?: string;
  description?: string;
}

const LoadingToast: React.FC<LoadingToastProps> = ({
  open,
  title = "Memuat Data",
  description = "Mohon tunggu sebentar..."
}) => {
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      // Show loading toast
      const loadingToast = toast({
        title,
        description,
        duration: 1000000, // Very long duration since we control when to dismiss
        className: "fixed bottom-4 right-4 z-[100] w-auto max-w-sm shadow-lg border border-border/50 bg-background/95 backdrop-blur-sm",
      });

      // Return cleanup function to dismiss toast when component unmounts or open becomes false
      return () => {
        loadingToast.dismiss();
      };
    }
  }, [open, title, description, toast]);

  // This component doesn't render anything visible - it just manages the toast
  return null;
};

export default LoadingToast;
