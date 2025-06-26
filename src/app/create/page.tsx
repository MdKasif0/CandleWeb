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
import { generateMessage, GenerateMessageInput } from '@/ai/flows/generateMessage';

const formSchema = z.object({
  toName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  fromName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  template: z.enum(['night-sky', 'premium-night-sky']),
});

function CreateWishForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toName: '',
      fromName: '',
      message: '',
      template: 'night-sky',
    },
  });

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId === 'night-sky' || templateId === 'premium-night-sky') {
      form.setValue('template', templateId);
    }
  }, [searchParams, form]);
  
  const handleGenerateMessage = async () => {
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
      const input: GenerateMessageInput = { toName, fromName };
      const result = await generateMessage(input);
      if (result.message) {
        form.setValue('message', result.message, { shouldValidate: true });
        toast({
            title: "Message Generated!",
            description: "A new message has been created for you."
        });
      }
    } catch (error) {
      console.error("Could not generate message", error);
      toast({
        variant: 'destructive',
        title: 'Message Generation Failed',
        description: 'There was an error generating your message. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        const newWish = {
            id: `wish_${Date.now()}`,
            toName: values.toName,
            fromName: values.fromName,
            message: values.message,
            template: values.template,
            status: 'Published'
        };

        try {
            const existingWishes = JSON.parse(localStorage.getItem('userWishes') || '[]');
            const updatedWishes = [newWish, ...existingWishes];
            localStorage.setItem('userWishes', JSON.stringify(updatedWishes));
        } catch (error) {
            console.error("Could not save wish to local storage", error);
            toast({
                variant: "destructive",
                title: "Could not save wish",
                description: "There was an error saving your wish. Please try again."
            })
            return;
        }

        const params = new URLSearchParams();
        params.append('toName', values.toName);
        params.append('fromName', values.fromName);
        params.append('message', values.message);

        let relativeUrl;
        if (values.template === 'premium-night-sky') {
            relativeUrl = `/premium-night-sky/index.html?${params.toString()}`;
        } else {
            params.append('template', values.template);
            relativeUrl = `/wish/${newWish.id}?${params.toString()}`;
        }
        
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

  const darkInputStyles = "dark:bg-black/20 dark:border-white/20 dark:backdrop-blur-sm dark:placeholder:text-muted-foreground/60 dark:focus:border-primary/50 dark:focus:ring-primary/50";

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 font-sans text-foreground">
      <div className="w-full max-w-md">
        <div className="relative mb-8 flex items-center justify-center py-4">
          <Link href="/templates" className="absolute left-0 flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1">Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your CandleWeb</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="toName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthday Person's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} className={`rounded-full ${darkInputStyles}`} />
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
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Smith" {...field} className={`rounded-full ${darkInputStyles}`} />
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
                    <FormLabel>Your Personal Message</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateMessage}
                      disabled={isGenerating}
                      className="rounded-full text-xs"
                    >
                      {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Generate with AI
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea placeholder="Write your heartfelt birthday message here..." className={`resize-none rounded-2xl min-h-[120px] ${darkInputStyles}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting || isGenerating} className="w-full rounded-full bg-accent py-6 text-lg font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-opacity hover:opacity-90">
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="ml-2 h-5 w-5" />}
                Generate CandleWeb
              </Button>
               <p className="mt-4 text-center text-sm text-muted-foreground">45.8k CandleWebs created</p>
            </div>
          </form>
        </Form>
      </div>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Your CandleWeb is Ready!</DialogTitle>
                <DialogDescription>
                    Share this link with the birthday person. Anyone with the link can view your CandleWeb.
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <Input value={typeof window !== 'undefined' ? window.location.origin + generatedLink : ''} readOnly />
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
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <CreateWishForm />
        </Suspense>
    );
}
