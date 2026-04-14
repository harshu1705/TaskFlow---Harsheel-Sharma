import React from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Greening India
          </h1>
          <p className="text-muted-foreground mt-2">Empowering sustainable operations</p>
        </div>
        
        {/* USP 4: Demo Credentials Banner */}
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex flex-col items-center justify-center text-sm shadow-sm backdrop-blur-sm">
          <p className="font-semibold text-green-800 dark:text-green-300 mb-1">🚀 Quick Demo Access</p>
          <div className="flex flex-col items-center text-green-700 dark:text-green-400 font-mono text-xs mt-1">
            <span>Email: test@example.com</span>
            <span>Pass: password123</span>
          </div>
        </div>
        
        <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-card/95">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your email and password to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="login" />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
