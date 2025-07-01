
'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRequireAuth, useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChevronRight, Edit2, KeyRound, Loader2, LogOut, Mail, Palette, Share2, Shield, User as UserIcon, FileText, Upload, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

export const dynamic = 'force-dynamic';

const nameSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name is too long." }),
});

const passwordSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function AccountPage() {
    const auth = useRequireAuth();
    const { user, signOut, updateUserName, updateUserPassword } = useAuth();
    const { toast } = useToast();

    const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const nameForm = useForm<z.infer<typeof nameSchema>>({
        resolver: zodResolver(nameSchema),
        defaultValues: { name: user?.displayName || "" }
    });
    
    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "" }
    });

    const handleShare = async () => {
        const shareUrl = 'https://candleweb.netlify.app/';
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'CandleWeb',
                    text: 'Create beautiful, personalized AI-powered birthday websites with CandleWeb!',
                    url: shareUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
                toast({ variant: 'destructive', title: 'Could not share', description: 'There was an error trying to share the app.' });
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            toast({ title: 'Link Copied!', description: 'App link copied to clipboard.' });
        }
    };
    
    const onNameChange = async (values: z.infer<typeof nameSchema>) => {
        setIsSubmitting(true);
        try {
            await updateUserName(values.name);
            toast({ title: "Success", description: "Your name has been updated." });
            setIsNameDialogOpen(false);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPasswordChange = async (values: z.infer<typeof passwordSchema>) => {
        setIsSubmitting(true);
        try {
            await updateUserPassword(values.password);
            toast({ title: "Success", description: "Your password has been updated. You may be required to log in again." });
            setIsPasswordDialogOpen(false);
            passwordForm.reset();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Update Failed', description: "This is a sensitive operation. Please log out and log in again before changing your password." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (auth.loading || !user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');

    return (
        <div className="bg-background text-foreground min-h-screen font-sans relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} data-ai-hint="twinkling stars"></div>
            <div className="relative z-10 p-4 md:p-6 max-w-2xl mx-auto pb-24">
                <h1 className="text-3xl font-bold mb-6 text-white">My Account</h1>

                <div className="flex flex-col items-center text-center mb-8">
                    <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-lg">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold mt-4 text-white">{user.displayName || 'CandleWeb User'}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                
                <Card className="mb-4 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground shadow-xl shadow-primary/20">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Invite Friends</h3>
                            <p className="text-sm opacity-90 max-w-xs">Share the joy of creating personalized wishes.</p>
                        </div>
                        <Button onClick={handleShare} variant="secondary" size="icon" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground h-12 w-12 rounded-full">
                            <Share2 />
                        </Button>
                    </CardContent>
                </Card>

                <Link href="/upgrade" className="block mb-8 group">
                    <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-xl group-hover:shadow-pink-500/20 transition-all duration-300">
                        <div className="bg-[#191428] rounded-[14px] p-6 flex items-center justify-between">
                             <div>
                                <h3 className="text-lg font-semibold text-white">Upgrade to Pro</h3>
                                <p className="text-sm text-white/70 max-w-xs">Unlock premium templates & features.</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg h-12 w-12 flex items-center justify-center">
                                <Sparkles className="text-white h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="space-y-2">
                    <h3 className="px-4 text-sm font-medium text-primary">Account Settings</h3>
                    <div className="bg-foreground/5 rounded-lg border border-white/10">
                        <SettingsItem icon={UserIcon} text="Change Name" onClick={() => setIsNameDialogOpen(true)} />
                        <SettingsItem icon={KeyRound} text="Change Password" onClick={() => setIsPasswordDialogOpen(true)} />
                    </div>

                    <h3 className="px-4 pt-4 text-sm font-medium text-primary">Preferences</h3>
                     <div className="bg-foreground/5 rounded-lg border border-white/10">
                       <div className="flex items-center p-4">
                            <div className="flex items-center gap-4">
                                <Palette className="h-5 w-5 text-muted-foreground" />
                                <span className="flex-1 text-white">Theme</span>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                    
                    <h3 className="px-4 pt-4 text-sm font-medium text-primary">Support & Legal</h3>
                    <div className="bg-foreground/5 rounded-lg border border-white/10">
                        <SettingsItem icon={FileText} text="Terms of Use" href="/terms-of-use" />
                        <SettingsItem icon={Shield} text="Privacy Policy" href="/privacy-policy" />
                        <SettingsItem icon={Mail} text="Contact" href="mailto:mdkasifuddin123@gmail.com" />
                    </div>

                    <div className="pt-6">
                        <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-500/10 border-red-500/20" onClick={signOut}>
                            <LogOut className="mr-2 h-5 w-5" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
            <BottomNavBar />

            {/* Change Name Dialog */}
            <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Your Name</DialogTitle>
                        <DialogDescription>Enter your new display name below.</DialogDescription>
                    </DialogHeader>
                    <Form {...nameForm}>
                        <form onSubmit={nameForm.handleSubmit(onNameChange)} className="space-y-4">
                            <FormField control={nameForm.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="name">Display Name</Label>
                                    <FormControl>
                                        <Input id="name" placeholder="Your new name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Your Password</DialogTitle>
                        <DialogDescription>Enter your new password below.</DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-4">
                            <FormField control={passwordForm.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="password">New Password</Label>
                                    <FormControl>
                                      <div className="relative">
                                          <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Your new password" {...field} />
                                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                          </button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Set New Password
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const SettingsItem = ({ icon: Icon, text, onClick, href }: { icon: React.ElementType, text: string, onClick?: () => void, href?: string }) => {
    const commonClassName = "flex items-center justify-between p-4 cursor-pointer hover:bg-foreground/10 transition-colors w-full group text-left first:rounded-t-lg last:rounded-b-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10 relative";

    const content = (
        <>
            <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-white">{text}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </>
    );

    if (href) {
        const isExternal = href.startsWith('http') || href.startsWith('mailto:');
        return (
            <Link
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={commonClassName}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={commonClassName}
        >
            {content}
        </button>
    );
};
