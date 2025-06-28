
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
import { cn } from '@/lib/utils';

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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.75 2.04-3.77 0-6.82-3.02-6.82-6.75s3.05-6.75 6.82-6.75c2.14 0 3.52.88 4.34 1.68l2.5-2.52C18.12 3 15.46 2.18 12.48 2.18c-5.45 0-9.84 4.38-9.84 9.82s4.39 9.82 9.84 9.82c5.28 0 9.4-3.55 9.4-9.56 0-.6-.07-1.2-.18-1.78Z" />
    </svg>
);


const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  remember: z.boolean().default(false),
});

const signUpSchema = z.object({
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background dark:bg-black p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/welcome" className="flex items-center gap-2 mb-4">
            <VIcon />
            <span className="text-2xl font-bold">CandleWeb</span>
          </Link>
          <h1 className="text-2xl font-bold">
            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {activeTab === 'login' ? 'Log in to continue your journey.' : 'Join us to create magical birthday wishes.'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/80 rounded-full mb-6 p-1 h-auto">
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
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleButton />

      </div>
    </div>
  );
}

function GoogleButton() {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({ title: 'Successfully signed in with Google!' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full h-11" onClick={handleGoogleSignIn} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon className="mr-2 h-4 w-4" />
      )}
      Google
    </Button>
  );
}


function AuthForm({ type }: { type: 'login' | 'signup' }) {
    const { signInWithEmail, signUpWithEmail } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(type === 'login' ? loginSchema : signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema | typeof signUpSchema>) => {
        setIsLoading(true);
        try {
            if (type === 'login') {
                await signInWithEmail(values.email, values.password);
                toast({ title: 'Login successful!' });
            } else {
                await signUpWithEmail(values.email, values.password);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="name@example.com" {...form.register('email')} required/>
                {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
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
                {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
            </div>
            {type === 'login' && (
                 <div className="flex items-center space-x-2">
                    <Checkbox id="remember" {...form.register('remember')} />
                    <Label htmlFor="remember" className="font-normal text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Remember me</Label>
                </div>
            )}
            <Button type="submit" className="w-full font-bold h-11" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {type === 'login' ? 'Login' : 'Create Account'}
            </Button>
        </form>
    );
}
