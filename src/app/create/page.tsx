'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

const formSchema = z.object({
  toName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  fromName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  imageUrl: z.string().optional(),
  template: z.enum(['modern', 'classic', 'funky'], {
    required_error: 'You need to select a template.',
  }),
});

export default function CreateWishPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toName: '',
      fromName: '',
      message: '',
      imageUrl: '',
      template: 'modern',
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const fakeId = '12345'; // This would be the ID from your database.
    
    const params = new URLSearchParams();
    params.append('toName', values.toName);
    params.append('fromName', values.fromName);
    params.append('message', values.message);
    params.append('imageUrl', values.imageUrl || '');
    params.append('template', values.template);

    const url = `/wish/${fakeId}?${params.toString()}`;

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a Birthday Wish</CardTitle>
          <CardDescription>Fill out the form below to create a personalized birthday webpage.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="toName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday Person's Name</FormLabel>
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
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Personal Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your heartfelt birthday message here..." className="resize-y" {...field} />
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
                      />
                    </FormControl>
                    <FormDescription>Add a special photo. It will be resized for sharing.</FormDescription>
                    <FormMessage />
                    {field.value && (
                        <div className="mt-4 rounded-md border p-4 flex flex-col items-center">
                            <p className="text-sm font-medium mb-2">Image Preview</p>
                            <Image
                                data-ai-hint="birthday person"
                                src={field.value}
                                alt="Image preview"
                                width={200}
                                height={200}
                                className="rounded-md object-contain"
                            />
                        </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Choose a Template</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="modern" />
                          </FormControl>
                          <FormLabel className="font-normal">Modern</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="classic" />
                          </FormControl>
                          <FormLabel className="font-normal">Classic</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="funky" />
                          </FormControl>
                          <FormLabel className="font-normal">Funky (Animated)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Generate Birthday Wish</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
