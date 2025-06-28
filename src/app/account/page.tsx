
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRequireAuth, useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChevronRight, Edit2, KeyRound, Loader2, LogOut, Mail, Palette, Share2, Shield, User as UserIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function AccountPage() {
    const auth = useRequireAuth();
    const { user, signOut } = useAuth();
    const { toast } = useToast();

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'CandleWeb',
                    text: 'Create beautiful, personalized AI-powered birthday websites with CandleWeb!',
                    url: window.location.origin,
                });
            } catch (error) {
                console.error('Error sharing:', error);
                toast({ variant: 'destructive', title: 'Could not share', description: 'There was an error trying to share the app.' });
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(window.location.origin);
            toast({ title: 'Link Copied!', description: 'App link copied to clipboard.' });
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
        <div className="bg-background text-foreground min-h-screen">
            <div className="p-4 md:p-6 max-w-2xl mx-auto pb-24">
                <h1 className="text-3xl font-bold mb-6">My Account</h1>

                {/* Profile Section */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-4">
                        <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-lg">
                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                            <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 bg-background h-8 w-8 rounded-full shadow-md">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <h2 className="text-2xl font-bold">{user.displayName || 'CandleWeb User'}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                
                {/* Invite Friends Card */}
                <Card className="mb-8 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground shadow-xl shadow-primary/20">
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

                {/* Settings List */}
                <div className="space-y-2">
                    <h3 className="px-4 text-sm font-medium text-muted-foreground">Account Settings</h3>
                    <div className="bg-card rounded-lg border">
                        <SettingsItem icon={UserIcon} text="Change Name" />
                        <SettingsItem icon={KeyRound} text="Change Password" />
                    </div>

                    <h3 className="px-4 pt-4 text-sm font-medium text-muted-foreground">Preferences</h3>
                     <div className="bg-card rounded-lg border">
                       <div className="flex items-center p-4">
                            <div className="flex items-center gap-4">
                                <Palette className="h-5 w-5 text-muted-foreground" />
                                <span className="flex-1">Theme</span>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                    
                    <h3 className="px-4 pt-4 text-sm font-medium text-muted-foreground">Support & Legal</h3>
                    <div className="bg-card rounded-lg border">
                        <SettingsItem icon={FileText} text="Terms of Use" href="#" />
                        <SettingsItem icon={Shield} text="Privacy Policy" href="#" />
                        <SettingsItem icon={Mail} text="Contact" href="mailto:mdkasifuddin123@gmail.com" />
                    </div>

                    <div className="pt-6">
                        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={signOut}>
                            <LogOut className="mr-2 h-5 w-5" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
            <BottomNavBar />
        </div>
    );
}

const SettingsItem = ({ icon: Icon, text, onClick, href }: { icon: React.ElementType, text: string, onClick?: () => void, href?: string }) => {
    const content = (
        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50 transition-colors w-full group">
            <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span>{text}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
    );

    const Wrapper = href ? 'a' : 'button';
    const props = href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined } : { onClick };

    return (
        <Wrapper {...props} className="w-full text-left first:rounded-t-lg last:rounded-b-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10 relative">
            {content}
        </Wrapper>
    );
};
