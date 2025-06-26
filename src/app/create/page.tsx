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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { generateMessage, GenerateMessageInput } from '@/ai/flows/generateMessage';

const formSchema = z.object({
  toName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  fromName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  imageUrl: z.string().optional(),
  template: z.literal('funky'),
});

export default function CreateWishPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toName: '',
      fromName: '',
      message: '',
      imageUrl: '',
      template: 'funky',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      form.setValue('imageUrl', '');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload an image file (e.g., PNG, JPG, GIF).',
      });
      e.target.value = ''; // Reset file input
      form.setValue('imageUrl', '');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(file.type);
        form.setValue('imageUrl', dataUrl, { shouldValidate: true });
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };
  
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


  function onSubmit(values: z.infer<typeof formSchema>) {
    const newWish = {
        id: `wish_${Date.now()}`,
        toName: values.toName,
        fromName: values.fromName,
        message: values.message,
        imageUrl: values.imageUrl || '',
        template: values.template,
        status: 'Unpublished'
    };

    try {
        const existingWishes = JSON.parse(localStorage.getItem('userWishes') || '[]');
        const updatedWishes = [...existingWishes, newWish];
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
    params.append('imageUrl', values.imageUrl || '');
    params.append('template', values.template);

    const url = `/wish/${newWish.id}?${params.toString()}`;

    if (url.length > 4096) { // Check for reasonable URL length
      toast({
        variant: 'destructive',
        title: 'Image Too Large',
        description: 'The uploaded image is too large to share via a link. Please choose a smaller image.',
      });
      return;
    }

    toast({
      title: 'Wish Created!',
      description: 'Your personalized birthday website is ready to be shared.',
    });

    router.push(url);
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
          <h1 className="text-2xl font-bold">Create your Wish</h1>
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
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                      className={`rounded-full file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-accent-foreground hover:file:bg-accent/90 ${darkInputStyles}`}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-4 flex flex-col items-center rounded-md p-4">
                       <p className="mb-2 text-sm font-medium">Image Preview</p>
                       <Image
                        data-ai-hint="birthday person"
                        src={field.value}
                        alt="Image preview"
                        width={150}
                        height={150}
                        className="rounded-md object-contain"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <Button type="submit" className="w-full rounded-full bg-accent py-6 text-lg font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-opacity hover:opacity-90">
                Generate Website
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
               <p className="mt-4 text-center text-sm text-muted-foreground">45.8k wishes created</p>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
