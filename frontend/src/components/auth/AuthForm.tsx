import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    if (type === 'register' && !name.trim()) return 'Name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return 'A valid email is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);

    const validationError = validate();
    if (validationError) {
      setErrorBanner(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
      const payload = type === 'login' ? { email, password } : { name, email, password };
      
      const { data } = await api.post(endpoint, payload);
      
      setAuth(data.data.user, data.data.token);
      
      toast({
        title: type === 'login' ? 'Welcome Back!' : 'Account Created!',
        description: type === 'login' ? 'You have successfully logged in.' : 'Your account was created successfully.',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Authentication failed. Please try again.';
      setErrorBanner(msg);
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {errorBanner && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
          {errorBanner}
        </div>
      )}
      
      {type === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="you@example.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {type === 'login' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          type === 'login' ? 'Sign In' : 'Create Account'
        )}
      </Button>
    </form>
  );
}
