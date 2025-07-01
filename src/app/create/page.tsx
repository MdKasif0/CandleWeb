
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Loader2, Copy, QrCode, Share2, Calendar as CalendarIcon, SendHorizonal, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { generateWishContent, GenerateWishContentInput } from '@/ai/flows/generateWishContent';
import { cn } from '@/lib/utils';
import { useRequireAuth } from '@/hooks/use-auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

declare global {
  interface Window {
    OneSignal: any;
  }
}

const friendMessageSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    message: z.string().min(1, 'Message is required.'),
});

const memorySchema = z.object({
  src: z.string(),
});

const formSchema = z.object({
  toName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  fromName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  template: z.enum(['night-sky', 'premium-night-sky', 'celestial-wishes']),
  
  // Premium Fields
  closingMessages: z.string().optional(),
  secretMessage: z.string().optional(),
  blowCandlesInstruction: z.string().optional(),
  wishYouTheBestMessage: z.string().optional(),
  letsBlowCandlesTitle: z.string().optional(),
  thanksForWatchingTitle: z.string().optional(),
  didYouLikeItMessage: z.string().optional(),
  endMessage: z.string().optional(),

  // Celestial Wishes Fields
  profilePhoto: z.string().optional(),
  beautifulMemories: z.array(memorySchema).optional(),
  specialGiftMessage: z.string().optional(),
  friendsMessages: z.array(friendMessageSchema).optional(),
  saveKeepsakeMessage: z.string().optional(),
});

function CreateWishForm() {
  const auth = useRequireAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showSharePage, setShowSharePage] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [submittedWish, setSubmittedWish] = useState<any>(null);
  const [template, setTemplate] = useState('night-sky');
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toName: '',
      fromName: '',
      message: '',
      template: 'night-sky',
      closingMessages: '',
      secretMessage: '',
      blowCandlesInstruction: '',
      wishYouTheBestMessage: '',
      letsBlowCandlesTitle: '',
      thanksForWatchingTitle: '',
      didYouLikeItMessage: '',
      endMessage: '',
      profilePhoto: '',
      beautifulMemories: [],
      specialGiftMessage: '',
      friendsMessages: [],
      saveKeepsakeMessage: '',
    },
  });

    const { fields: memoryFields, append: appendMemory, remove: removeMemory } = useFieldArray({
        control: form.control,
        name: "beautifulMemories",
    });

    const { fields: friendFields, append: appendFriend, remove: removeFriend } = useFieldArray({
        control: form.control,
        name: "friendsMessages",
    });

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId === 'night-sky' || templateId === 'premium-night-sky' || templateId === 'celestial-wishes') {
      form.setValue('template', templateId);
      setTemplate(templateId);
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
        form.setValue('blowCandlesInstruction', result.blowCandlesInstruction, { shouldValidate: true });
        form.setValue('wishYouTheBestMessage', result.wishYouTheBestMessage, { shouldValidate: true });
        form.setValue('letsBlowCandlesTitle', result.letsBlowCandlesTitle, { shouldValidate: true });
        form.setValue('thanksForWatchingTitle', result.thanksForWatchingTitle, { shouldValidate: true });
        form.setValue('didYouLikeItMessage', result.didYouLikeItMessage, { shouldValidate: true });
        form.setValue('endMessage', result.endMessage, { shouldValidate: true });
      }

      if (form.getValues('template') === 'celestial-wishes') {
        form.setValue('specialGiftMessage', result.specialGiftMessage, { shouldValidate: true });
        form.setValue('saveKeepsakeMessage', result.saveKeepsakeMessage, { shouldValidate: true });
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

  const getOneSignalSubscriptionId = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.OneSignal) {
        console.error("OneSignal SDK not loaded.");
        resolve(null);
        return;
      }
      
      window.OneSignal.push(function() {
        window.OneSignal.getUserId(function(userId: string | null) {
          resolve(userId);
        }).catch(function(error: any) {
          console.error('Error getting subscription ID:', error);
          resolve(null);
        });
      });
    });
  };

    const handleImageUpload = (file: File, field: 'profilePhoto' | 'beautifulMemories', index?: number) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result as string;
            if (field === 'profilePhoto') {
                form.setValue('profilePhoto', base64, { shouldValidate: true });
            } else if (field === 'beautifulMemories' && index !== undefined) {
                 const currentMemories = form.getValues('beautifulMemories') || [];
                 const updatedMemories = [...currentMemories];
                 updatedMemories[index] = { src: base64 };
                 form.setValue('beautifulMemories', updatedMemories, { shouldValidate: true });
            } else if (field === 'beautifulMemories') {
                appendMemory({ src: base64 });
            }
        };
        reader.onerror = (error) => {
            console.error('Error converting file to base64', error);
            toast({ variant: 'destructive', title: 'Image Upload Failed' });
        };
    };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        const fullWishData = {
            id: `wish_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'Published',
            ...values
        };

        const { beautifulMemories, friendsMessages, profilePhoto, ...wishMetadata } = fullWishData;

        try {
            const existingWishes = JSON.parse(localStorage.getItem('userWishes') || '[]');
            const updatedWishes = [wishMetadata, ...existingWishes];
            localStorage.setItem('userWishes', JSON.stringify(updatedWishes));

            // Store large data separately
            const additionalData = { 
                profilePhoto: values.profilePhoto,
                beautifulMemories: values.beautifulMemories,
                friendsMessages 
            };
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
        
        setSubmittedWish(fullWishData);
        setGeneratedLink(relativeUrl);
        setShowSharePage(true);
        form.reset();
        
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

  const fullUrl = typeof window !== 'undefined' ? window.location.origin + generatedLink : '';

  const handleCopyToClipboard = () => {
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

  const handleShare = async () => {
    const toName = submittedWish?.toName || 'a friend';
    const text = `Check out this special birthday wish I made for ${toName} on CandleWeb!`;
    const title = `A birthday wish from CandleWeb`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text,
                url: fullUrl,
            });
        } catch (error) {
            console.error('Error sharing:', error);
            toast({ variant: 'destructive', title: 'Could not share', description: 'There was an error trying to use the share feature.' });
        }
    } else {
        navigator.clipboard.writeText(fullUrl);
        toast({ title: 'Link Copied!', description: 'The wish page link has been copied to your clipboard.' });
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
        toast({ variant: 'destructive', title: 'No date selected', description: 'Please select a date to schedule the wish.'});
        return;
    }
    if (!scheduleTime) {
      toast({ variant: 'destructive', title: 'No time selected', description: 'Please select a time to schedule the wish.'});
      return;
    }
    if (!submittedWish) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find wish data to schedule.' });
        return;
    }
    
    setIsScheduling(true);

    try {
        const playerId = await getOneSignalSubscriptionId();
        if (!playerId) {
            toast({
                variant: 'destructive',
                title: 'Could not get notification ID',
                description: 'Please ensure you have enabled notifications for this site.'
            });
            setIsScheduling(false);
            return;
        }

        const [hours, minutes] = scheduleTime.split(':').map(Number);
        const combinedDate = new Date(scheduleDate);
        combinedDate.setHours(hours, minutes, 0, 0);

        const response = await fetch('/api/schedule-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                scheduleAt: combinedDate.toISOString(),
                toName: submittedWish.toName,
                wishId: submittedWish.id,
                playerId: playerId,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to schedule notification.');
        }

        // Update the status of the wish in the main list
        const existingWishes = JSON.parse(localStorage.getItem('userWishes') || '[]');
        const wishIndex = existingWishes.findIndex((w: any) => w.id === submittedWish.id);
        if (wishIndex > -1) {
            existingWishes[wishIndex].status = 'Scheduled';
            localStorage.setItem('userWishes', JSON.stringify(existingWishes));
        }

        toast({
            title: 'Wish Scheduled!',
            description: `Your wish for ${submittedWish.toName} is scheduled for ${format(combinedDate, 'PPP p')}. A notification will be sent.`
        });
        
        router.push('/'); // Go back to dashboard after scheduling.

    } catch (error: any) {
        console.error("Could not schedule wish", error);
        toast({ variant: 'destructive', title: 'Scheduling Failed', description: error.message });
    } finally {
        setIsScheduling(false);
    }
  };
  
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
    <main className="flex min-h-screen flex-col items-center bg-background p-4 font-sans text-foreground">
      <div className="w-full max-w-md relative z-10 pb-24">
        <div className="relative mb-6 flex items-center justify-center py-4">
          <Link href="/templates" className="absolute left-0 flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1 text-sm">Back to templates</span>
          </Link>
          <h1 className="w-full text-center text-2xl font-bold">Create Wish</h1>
        </div>
        
        <div className="mb-6">
            <Button
                type="button"
                variant="outline"
                onClick={handleGenerateAllContent}
                disabled={isGenerating}
                className="w-full rounded-full py-5 text-base font-semibold transition-all group border-primary/30 text-primary hover:bg-primary/10 bg-primary/5"
            >
                {isGenerating ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
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
                  <FormLabel>To (Recipient's Name)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
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
                  <FormLabel>From (Your Name)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Smith" {...field} />
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
                  </div>
                  <FormControl>
                    <Textarea placeholder="Write your heartfelt birthday message here..." className="resize-none min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isPremium || isCelestial) && (
              <>
                <FormField
                  control={form.control}
                  name="closingMessages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closing Messages (one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={"Wishing you all the best!\nMay all your dreams come true!"}
                          {...field}
                          className="resize-none min-h-[100px]"
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
                      <FormLabel>Final Secret Message</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A little secret just for you..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

             {isCelestial && (
              <div className='space-y-6'>
                <FormField control={form.control} name="profilePhoto" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Birthday Person's Photo</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-4">
                                {field.value ? (
                                    <Image src={field.value} alt="Profile preview" width={64} height={64} className="rounded-full w-16 h-16 object-cover" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                )}
                                <Input type="file" accept="image/*" className='flex-1' onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'profilePhoto')} />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex justify-between items-center">
                            Beautiful Memories
                             <Button type='button' size="sm" onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if(file) handleImageUpload(file, 'beautifulMemories');
                                };
                                input.click();
                            }}>
                                <Plus className='mr-2 h-4 w-4' /> Add Image
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        {memoryFields.map((field, index) => (
                             <div key={field.id} className="flex items-center gap-2">
                                <Image src={field.src} alt={`Memory ${index + 1}`} width={40} height={40} className="w-10 h-10 rounded-md object-cover" />
                                <span className='text-sm text-muted-foreground truncate flex-1'>Memory #{index+1}</span>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeMemory(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                         {memoryFields.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No memories added yet.</p>}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex justify-between items-center">
                            Messages from Friends
                             <Button type='button' size="sm" onClick={() => appendFriend({ name: '', message: '' })}>
                                <Plus className='mr-2 h-4 w-4' /> Add Friend
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {friendFields.map((field, index) => (
                             <div key={field.id} className="flex flex-col gap-2 p-3 rounded-lg bg-muted/50 relative border">
                                <FormField control={form.control} name={`friendsMessages.${index}.name`} render={({ field }) => (
                                    <FormItem><FormControl><Input placeholder="Friend's Name" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name={`friendsMessages.${index}.message`} render={({ field }) => (
                                    <FormItem><FormControl><Textarea placeholder="Friend's Message" {...field} className='min-h-[60px]' /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeFriend(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                         {friendFields.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No friend messages added.</p>}
                    </CardContent>
                </Card>
                
                 <FormField control={form.control} name="specialGiftMessage" render={({ field }) => (
                    <FormItem><FormLabel>Special Gift Message</FormLabel><FormControl><Textarea placeholder="Your special gift message..." {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="saveKeepsakeMessage" render={({ field }) => (
                    <FormItem><FormLabel>Save Keepsake Button Text</FormLabel><FormControl><Input placeholder="e.g. Save this memory" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
            )}
            
            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting || isGenerating} className="w-full rounded-full py-6 text-lg font-semibold shadow-lg shadow-primary/20 transition-opacity hover:opacity-90">
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Generate CandleWeb
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      {showSharePage && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm text-foreground overflow-y-auto font-sans">
            <div className="relative z-10 mx-auto max-w-md p-4 text-center h-full flex flex-col justify-center">
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Wish Page is Ready!</h1>
            <p className="text-muted-foreground mb-8">Your personalized birthday wish page is now live and ready to be shared.</p>

            <div className="text-left mb-6">
                <Label className="font-semibold text-foreground mb-2 block">Webpage Link</Label>
                <div className="flex items-center space-x-2 bg-muted rounded-lg p-3 border">
                <input value={fullUrl} readOnly className="bg-transparent w-full text-foreground outline-none text-sm" />
                <Button onClick={handleCopyToClipboard} variant="ghost" size="icon"><Copy className="h-5 w-5 text-muted-foreground" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <Button onClick={() => setIsQrDialogOpen(true)} variant="outline" className="w-full h-12">
                    <QrCode className="mr-2 h-5 w-5" />
                    <span>QR Code</span>
                </Button>
                <Button onClick={handleShare} variant="outline" className="w-full h-12">
                    <Share2 className="mr-2 h-5 w-5" />
                    <span>Share</span>
                </Button>
            </div>

            <Card className="text-left mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Schedule Send</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-12",
                                        !scheduleDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {scheduleDate ? format(scheduleDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={scheduleDate}
                                    onSelect={setScheduleDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="h-12"
                        />
                    </div>
                     <Button onClick={handleSchedule} disabled={isScheduling} className="w-full mt-4 h-12 text-base">
                        {isScheduling ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <SendHorizonal className="mr-2 h-5 w-5" />}
                        Schedule Wish
                    </Button>
                </CardContent>
            </Card>
            
            <Button variant="ghost" onClick={() => router.push('/')} className="text-muted-foreground hover:text-foreground">
                Back to Dashboard
            </Button>
            </div>
        </div>
      )}

      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogDescription>
                    Scan this with a phone to open the wish page.
                </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-white rounded-lg mx-auto">
                <QRCode value={fullUrl} size={256} fgColor="#000" bgColor="#fff" />
            </div>
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

    