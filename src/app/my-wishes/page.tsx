
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Copy, MoreHorizontal, Trash2, Loader2, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRequireAuth } from '@/hooks/use-auth';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Wish {
    id: string;
    toName: string;
    fromName: string;
    message: string;
    template: string;
    status: string;
    createdAt: string;
}

export default function MyWishesPage() {
    const auth = useRequireAuth();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [wishToDelete, setWishToDelete] = useState<Wish | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedWishes = JSON.parse(localStorage.getItem('userWishes') || '[]');
            setWishes(storedWishes);
        } catch (error) {
            console.error("Could not parse wishes from local storage", error);
            setWishes([]);
        }
    }, []);

    const handleCopyLink = (wish: Wish) => {
        if (typeof window === 'undefined') return;
        const relativeUrl = `/wish/${wish.id}`;
        const fullUrl = window.location.origin + relativeUrl;

        navigator.clipboard.writeText(fullUrl).then(() => {
            toast({
                title: "Link Copied!",
                description: "The wish link has been copied to your clipboard."
            });
        }).catch(err => {
            console.error("Failed to copy link", err);
            toast({
                variant: "destructive",
                title: "Copy Failed",
                description: "Could not copy the link."
            });
        });
    };

    const handleDeleteClick = (wish: Wish) => {
        setWishToDelete(wish);
        setIsAlertOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!wishToDelete) return;

        try {
            // Update metadata in localStorage
            const storedWishes: Wish[] = JSON.parse(localStorage.getItem('userWishes') || '[]');
            const updatedWishes = storedWishes.filter(w => w.id !== wishToDelete.id);
            localStorage.setItem('userWishes', JSON.stringify(updatedWishes));
            
            // Remove associated data
            localStorage.removeItem(`wish_data_${wishToDelete.id}`);

            // Update component state
            setWishes(updatedWishes);

            toast({
                title: "Wish Deleted",
                description: `The wish for ${wishToDelete.toName} has been removed.`,
            });
        } catch (error) {
            console.error("Could not delete wish from local storage", error);
            toast({
                variant: "destructive",
                title: "Could not delete wish",
                description: "There was an error deleting your wish. Please try again."
            });
        } finally {
            setIsAlertOpen(false);
            setWishToDelete(null);
        }
    };
    
    if (auth.loading || !auth.user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const templateImages: { [key: string]: string } = {
        'night-sky': '/night-sky-cover.png',
        'premium-night-sky': '/premium-night-sky-cover.png',
        'celestial-wishes': '/celestial-wishes-cover.png',
    };

    return (
        <div className="bg-background text-foreground min-h-screen font-sans">
             <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} data-ai-hint="twinkling stars"></div>
            <div className="relative z-10 p-4 md:p-6 max-w-2xl mx-auto pb-24">
                <div className="relative mb-8 flex items-center justify-center py-4">
                    <h1 className="text-2xl font-bold text-white">My CandleWebs</h1>
                </div>

                <section>
                    {wishes.length > 0 ? (
                        <div className="space-y-3">
                            {wishes.map((wish) => {
                                const isValidDate = wish.createdAt && !isNaN(new Date(wish.createdAt).getTime());
                                const imageUrl = templateImages[wish.template] || 'https://placehold.co/80x80.png';
                                return (
                                 <Card key={wish.id} className="bg-foreground/5 p-3 border-transparent">
                                    <CardContent className="flex items-center justify-between p-0">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={imageUrl}
                                                alt={wish.toName}
                                                width={56}
                                                height={56}
                                                className="w-14 h-14 object-cover rounded-lg"
                                            />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-white text-lg">{wish.toName}</h3>
                                                <p className="text-sm text-muted-foreground">{isValidDate ? format(new Date(wish.createdAt), "MMM d, yyyy") : 'Date not available'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn(
                                                "capitalize border-none",
                                                wish.status === 'Published' ? "bg-yellow-900/50 text-yellow-300" :
                                                wish.status === 'Scheduled' ? "bg-blue-900/50 text-blue-300" :
                                                "bg-purple-900/50 text-purple-300"
                                            )}>{wish.status}</Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => window.open(`/wish/${wish.id}`, '_blank')}>
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        <span>Preview</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleCopyLink(wish)}>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        <span>Copy Link</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
                                                        onSelect={() => handleDeleteClick(wish)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                    ) : (
                         <Card className="bg-foreground/5 p-6 border-transparent text-center">
                            <CardContent className="p-0 flex flex-col items-center">
                                <h3 className="font-semibold text-white mb-2">No CandleWebs Built Yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">Get started by choosing a template and creating your first CandleWeb!</p>
                                <Link href="/templates" passHref>
                                    <Button>Create a CandleWeb</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>
            
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the birthday wish for {wishToDelete?.toName}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setWishToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className={buttonVariants({ variant: "destructive" })}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <BottomNavBar />
        </div>
    );
}
