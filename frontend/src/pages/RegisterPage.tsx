import React from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Greening India
          </h1>
          <p className="text-muted-foreground mt-2">Become a partner in sustainability</p>
        </div>
        
        <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-card/95">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your dashboard account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="register" />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
