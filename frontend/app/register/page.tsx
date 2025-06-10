'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FadeInUp } from '@/components/ui/motion';
import { Bot, Mail, Loader2, Shield, Zap, UserPlus, Lock } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !openaiApiKey) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!openaiApiKey.startsWith('sk-')) {
      setError('Please enter a valid OpenAI API key (starts with sk-)');
      return;
    }

    try {
      await register(email, password, openaiApiKey);
      toast.success('Account created successfully! Welcome to Botly.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FadeInUp>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Join Botly</h1>
            <p className="text-slate-600 mt-2">Create your account and start building AI chatbots</p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Account
              </CardTitle>
              <CardDescription>
                Enter your details to get started with Botly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Password</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apikey" className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>OpenAI API Key</span>
                  </Label>
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="sk-..."
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Get your API key from{' '}
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      OpenAI Platform
                    </a>
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-start space-x-3 text-sm text-slate-600">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Your data is secure</p>
                    <p className="text-xs leading-relaxed">
                      We use industry-standard encryption to protect your information. Your API key is stored securely and never shared.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <p>Create Account</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <p>Build Chatbots</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <p>Deploy & Scale</p>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
} 