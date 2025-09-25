import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const { state, login, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username || !password) {
      return;
    }

    try {
      await login({ username, password });
      onLogin();
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dashboard-bg p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-dashboard-accent/5 via-transparent to-dashboard-success/5 pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 rounded-lg backdrop-blur-sm pointer-events-none" />
        
        <CardHeader className="relative z-10 text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-dashboard-accent to-dashboard-success rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <LockIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-dashboard-accent to-dashboard-success bg-clip-text text-transparent">
            Dashboard Admin
          </CardTitle>
          <CardDescription className="text-dashboard-muted">
            Masuk untuk mengakses Dashboard POS Multidivisi
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {state.error && (
            <Alert variant="destructive" className="fade-in">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-muted w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 bg-white/70 dark:bg-gray-800/70 border-dashboard-accent/20 focus:border-dashboard-accent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-muted w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-white/70 dark:bg-gray-800/70 border-dashboard-accent/20 focus:border-dashboard-accent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dashboard-muted hover:text-dashboard-accent transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full h-11 font-medium transition-all duration-200",
                "bg-gradient-to-r from-dashboard-accent to-dashboard-success",
                "hover:from-dashboard-accent/90 hover:to-dashboard-success/90",
                "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              )}
              disabled={state.isLoading || !username || !password}
            >
              {state.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </div>
              ) : (
                'Masuk Dashboard'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="relative z-10 flex flex-col space-y-3">
          <button
            onClick={toggleTheme}
            className="text-sm text-dashboard-muted hover:text-dashboard-accent transition-colors flex items-center gap-2 mx-auto"
          >
            {theme === 'dark' ? '☀️ Mode Siang' : '🌙 Mode Malam'}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;