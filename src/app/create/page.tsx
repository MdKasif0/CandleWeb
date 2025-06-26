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

const formSchema = z.object({
  toName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  fromName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const fakeId = '12345'; // This would be the ID from your database.
    
    const params = new URLSearchParams();
    params.append('toName', values.toName);
    params.append('fromName', values.fromName);
    params.append('message', values.message);
    params.append('imageUrl', values.imageUrl || '');
    params.append('template', values.template);

    toast({
      title: 'Wish Created!',
      description: 'Your personalized birthday website is ready to be shared.',
    });

    router.push(`/wish/${fakeId}?${params.toString()}`);
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
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormDescription>Add a link to a special photo for any template.</FormDescription>
                    <FormMessage />
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
