
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="mr-2">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        <path fill="none" d="M1 1h22v22H1z"/>
    </svg>
);

const VIcon = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M6.7901 3.39001L12.0001 13L17.2101 3.39001H21.0001L12.0001 21L3.0001 3.39001H6.7901Z"
        fill="currentColor"
      />
    </svg>
  );

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  remember: z.boolean().default(false),
});

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative font-sans overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} data-ai-hint="twinkling stars"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/welcome" className="flex items-center gap-2 mb-4">
            <VIcon />
            <span className="text-2xl font-bold text-white">CandleWeb</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            {activeTab === 'login' ? 'Log in to continue your journey.' : 'Join us to create magical birthday wishes.'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-foreground/10 rounded-full mb-6 p-1 h-auto border border-white/10">
            <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AuthForm type="login" />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm type="signup" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AuthForm({ type }: { type: 'login' | 'signup' }) {
    const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(type === 'login' ? loginSchema : signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            remember: false,
        },
    });

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signInWithGoogle();
            toast({ title: 'Signed in with Google!' });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Google Sign-In Failed',
                description: 'Could not sign in with Google. Please try again.',
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof loginSchema | typeof signUpSchema>) => {
        setIsLoading(true);
        try {
            if (type === 'login') {
                const loginValues = loginSchema.parse(values);
                await signInWithEmail(loginValues.email, loginValues.password);
                toast({ title: 'Login successful!' });
            } else {
                const signupValues = signUpSchema.parse(values);
                await signUpWithEmail(signupValues.name, signupValues.email, signupValues.password);
                toast({ title: 'Sign up successful!' });
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Authentication Failed',
                description: error.message.includes('auth/invalid-credential') ? 'Invalid email or password.' : error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                    </span>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 {type === 'signup' && (
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="e.g. John Doe" {...form.register('name')} required />
                        {form.formState.errors.name && <p className="text-xs text-destructive">{String(form.formState.errors.name.message)}</p>}
                    </div>
                 )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="name@example.com" {...form.register('email')} required/>
                    {form.formState.errors.email && <p className="text-xs text-destructive">{String(form.formState.errors.email.message)}</p>}
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        {type === 'login' && <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>}
                    </div>
                    <div className="relative">
                        <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...form.register('password')} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {form.formState.errors.password && <p className="text-xs text-destructive">{String(form.formState.errors.password.message)}</p>}
                </div>
                {type === 'login' && (
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" {...form.register('remember')} />
                        <Label htmlFor="remember" className="font-normal text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Remember me</Label>
                    </div>
                )}
                <Button type="submit" className="w-full font-bold h-11" disabled={isLoading || isGoogleLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {type === 'login' ? 'Login' : 'Create Account'}
                </Button>
            </form>
        </div>
    );
}
