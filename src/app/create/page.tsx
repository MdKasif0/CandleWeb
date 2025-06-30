
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Loader2, Copy, ArrowRight } from 'lucide-react';
import { generateWishContent, GenerateWishContentInput } from '@/ai/flows/generateWishContent';
import { cn } from '@/lib/utils';
import { useRequireAuth } from '@/hooks/use-auth';

export const dynamic = 'force-dynamic';

const formSchema = z.object({
  toName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  fromName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  template: z.enum(['night-sky', 'premium-night-sky', 'celestial-wishes']),
  closingMessages: z.string().optional(),
  secretMessage: z.string().optional(),
});

const defaultClosingMessages = "Wishing you all the best!\nMay all your dreams come true!\nMay your whole life be healthy and peaceful";
const defaultSecretMessage = "Here's to another amazing year! 🤫";


function CreateWishForm() {
  const auth = useRequireAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [template, setTemplate] = useState('night-sky');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toName: '',
      fromName: '',
      message: '',
      template: 'night-sky',
      closingMessages: '',
      secretMessage: '',
    },
  });

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId === 'night-sky' || templateId === 'premium-night-sky' || templateId === 'celestial-wishes') {
      form.setValue('template', templateId);
      setTemplate(templateId);
      if (templateId === 'premium-night-sky') {
        form.setValue('closingMessages', defaultClosingMessages);
        form.setValue('secretMessage', defaultSecretMessage);
      } else {
        form.setValue('closingMessages', '');
        form.setValue('secretMessage', '');
      }
    } else {
      form.setValue('template', 'night-sky');
      setTemplate('night-sky');
    }
  }, [searchParams, form]);
  
  const handleGenerateAllContent = async () => {
    const toName = form.getValues('toName');
    const fromName = form.getValues('fromName');

    if (!toName || !fromName) {
      toast({
        variant: 'destructive',
        title: 'Please fill in names',
        description: "We need both names to generate a personalized message.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const input: GenerateWishContentInput = { toName, fromName };
      const result = await generateWishContent(input);
      
      form.setValue('message', result.message, { shouldValidate: true });

      if (form.getValues('template') === 'premium-night-sky' || form.getValues('template') === 'celestial-wishes') {
        form.setValue('closingMessages', result.closingMessages.join('\n'), { shouldValidate: true });
        form.setValue('secretMessage', result.secretMessage, { shouldValidate: true });
      }

      toast({
          title: "Content Generated!",
          description: "All fields have been filled with AI magic."
      });
    } catch (error) {
      console.error("Could not generate content", error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was an error generating content. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        const fullWishData = {
            id: `wish_${Date.now()}`,
            createdAt: new Date().toISOString(),
            toName: values.toName,
            fromName: values.fromName,
            message: values.message,
            template: values.template,
            status: 'Published',
            closingMessages: values.closingMessages,
            secretMessage: values.secretMessage,
        };

        const { closingMessages, secretMessage, ...wishMetadata } = fullWishData;

        try {
            const existingWishes = JSON.parse(localStorage.getItem('userWishes') || '[]');
            const updatedWishes = [wishMetadata, ...existingWishes];
            localStorage.setItem('userWishes', JSON.stringify(updatedWishes));

            // Store large data separately
            const additionalData = { closingMessages, secretMessage };
            localStorage.setItem(`wish_data_${fullWishData.id}`, JSON.stringify(additionalData));

        } catch (error) {
            console.error("Could not save wish to local storage", error);
            toast({
                variant: "destructive",
                title: "Could not save wish",
                description: "There was an error saving your wish. Please try again."
            })
            return;
        }
        
        const relativeUrl = `/wish/${fullWishData.id}`;
        
        setGeneratedLink(relativeUrl);
        setShowShareDialog(true);
        form.reset();

        toast({
          title: 'CandleWeb Created!',
          description: 'Your personalized CandleWeb is ready to be shared.',
        });
        
    } catch (error) {
        console.error("Could not create wish", error);
        toast({
            variant: "destructive",
            title: "Could not create wish",
            description: "There was an error creating your wish. Please try again."
        })
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleCopyToClipboard = () => {
    const fullUrl = window.location.origin + generatedLink;
    navigator.clipboard.writeText(fullUrl).then(() => {
        toast({
            title: "Link Copied!",
            description: "The link has been copied to your clipboard."
        });
    }).catch(err => {
        console.error("Failed to copy", err);
        toast({
            variant: "destructive",
            title: "Copy Failed",
            description: "Could not copy the link to the clipboard."
        })
    })
  }
  
  const isPremium = template === 'premium-night-sky';
  const isCelestial = template === 'celestial-wishes';

  if (auth.loading || !auth.user) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <main className={cn(
        "flex min-h-screen flex-col items-center p-4 font-sans",
        isPremium ? 'bg-gradient-to-b from-[#0c0c2c] to-[#1d1d4e] text-white' : 
        isCelestial ? 'bg-gradient-to-br from-indigo-100 via-rose-100 to-amber-100 text-gray-800' :
        'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white'
    )}>
        {(isPremium || template === 'night-sky') && (
            <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} data-ai-hint="twinkling stars"></div>
        )}
      <div className="w-full max-w-md relative z-10">
        <div className="relative mb-8 flex items-center py-4">
          <Link href="/templates" className={cn("absolute left-0 flex items-center transition-colors", isCelestial ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white")}>
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1">Back</span>
          </Link>
          <h1 className="w-full text-center text-2xl font-bold">Create your CandleWeb</h1>
        </div>
        
        <div className="mb-6">
            <Button
                type="button"
                variant="outline"
                onClick={handleGenerateAllContent}
                disabled={isGenerating}
                className={cn(
                    "w-full rounded-full py-5 text-base font-semibold transition-all group",
                    isPremium || !isCelestial ? "bg-white/10 border-white/20 hover:bg-white/20 text-white" :
                    "bg-white/60 border-rose-200 text-rose-600 hover:bg-white/80"
                )}
            >
                {isGenerating ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-300" />
                )}
                Auto-fill with AI Magic
            </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="toName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isCelestial && 'text-gray-700')}>Birthday Person's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} className={cn(
                        "rounded-full",
                        isPremium || !isCelestial ? "bg-black/20 border-white/20 placeholder:text-gray-400/80 focus:border-primary/50 focus:ring-primary/50" : 
                        "bg-white/60 border-rose-200 text-gray-800 placeholder:text-gray-500/80 focus:border-rose-400 focus:ring-rose-400"
                    )} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isCelestial && 'text-gray-700')}>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Smith" {...field} className={cn(
                        "rounded-full",
                        isPremium || !isCelestial ? "bg-black/20 border-white/20 placeholder:text-gray-400/80 focus:border-primary/50 focus:ring-primary/50" : 
                        "bg-white/60 border-rose-200 text-gray-800 placeholder:text-gray-500/80 focus:border-rose-400 focus:ring-rose-400"
                    )} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                   <div className="flex items-center justify-between">
                    <FormLabel className={cn(isCelestial && 'text-gray-700')}>Your Personal Message</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea placeholder="Write your heartfelt birthday message here..." className={cn(
                        "resize-none rounded-2xl min-h-[120px]",
                        isPremium || !isCelestial ? "bg-black/20 border-white/20 placeholder:text-gray-400/80 focus:border-primary/50 focus:ring-primary/50" : 
                        "bg-white/60 border-rose-200 text-gray-800 placeholder:text-gray-500/80 focus:border-rose-400 focus:ring-rose-400"
                    )} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(template === 'premium-night-sky' || template === 'celestial-wishes') && (
              <>
                <FormField
                  control={form.control}
                  name="closingMessages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(isCelestial && 'text-gray-700')}>Closing Messages (one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={"Wishing you all the best!\nMay all your dreams come true!"}
                          {...field}
                          className={cn(
                              "resize-none rounded-2xl min-h-[100px]",
                              isPremium || !isCelestial ? "bg-black/20 border-white/20 placeholder:text-gray-400/80 focus:border-primary/50 focus:ring-primary/50" : 
                              "bg-white/60 border-rose-200 text-gray-800 placeholder:text-gray-500/80 focus:border-rose-400 focus:ring-rose-400"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secretMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(isCelestial && 'text-gray-700')}>Final Secret Message</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A little secret just for you..."
                          {...field}
                          className={cn(
                              "rounded-full",
                              isPremium || !isCelestial ? "bg-black/20 border-white/20 placeholder:text-gray-400/80 focus:border-primary/50 focus:ring-primary/50" : 
                              "bg-white/60 border-rose-200 text-gray-800 placeholder:text-gray-500/80 focus:border-rose-400 focus:ring-rose-400"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting || isGenerating} className={cn(
                  "w-full rounded-full py-6 text-lg font-semibold shadow-lg transition-opacity hover:opacity-90",
                  isCelestial ? "bg-gradient-to-r from-rose-400 to-orange-300 text-white shadow-rose-500/20" :
                  "bg-primary text-primary-foreground shadow-primary/20"
              )}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Generate CandleWeb
              </Button>
               <p className={cn("mt-4 text-center text-sm", isCelestial ? "text-gray-600" : "text-gray-400")}>45.8k CandleWebs created</p>
            </div>
          </form>
        </Form>
      </div>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md dark">
            <DialogHeader>
                <DialogTitle>Your CandleWeb is Ready!</DialogTitle>
                <DialogDescription>
                    Share this link with the birthday person. Anyone with the link can view your CandleWeb.
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <Input value={typeof window !== 'undefined' ? window.location.origin + generatedLink : ''} readOnly className="bg-muted border-border" />
                <Button type="button" size="icon" onClick={handleCopyToClipboard}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <DialogFooter className="sm:justify-between gap-2 mt-4">
                <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={() => router.push('/')}>
                        Back to Dashboard
                    </Button>
                </DialogClose>
                <Button asChild>
                    <Link href={generatedLink} target="_blank" rel="noopener noreferrer">
                        Preview CandleWeb <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function CreateWishPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <CreateWishForm />
        </Suspense>
    );
}
