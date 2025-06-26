"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Clipboard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { handleTextSummarization, handleUrlSummarization } from "@/app/actions";
import { Skeleton } from "./ui/skeleton";

const urlSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

const textSchema = z.object({
  text: z.string().min(50, {
    message: "Text must be at least 50 characters.",
  }).max(20000, {
    message: "Text must not be longer than 20,000 characters."
  }),
});


export default function Summarizer() {
  const [summary, setSummary] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: "" },
  });

  const textForm = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues: { text: "" },
  });

  const onUrlSubmit = (values: z.infer<typeof urlSchema>) => {
    setSummary("");
    startTransition(async () => {
      const result = await handleUrlSummarization(values.url);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error Summarizing URL",
          description: result.error,
        });
      } else {
        setSummary(result.summary ?? "");
      }
    });
  };

  const onTextSubmit = (values: z.infer<typeof textSchema>) => {
    setSummary("");
    startTransition(async () => {
      const result = await handleTextSummarization(values.text);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error Summarizing Text",
          description: result.error,
        });
      } else {
        setSummary(result.summary ?? "");
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="w-full">
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Summarize URL</TabsTrigger>
          <TabsTrigger value="text">Summarize Text</TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Website URL</CardTitle>
              <CardDescription>
                Enter a URL to summarize its content.
              </CardDescription>
            </CardHeader>
            <Form {...urlForm}>
              <form onSubmit={urlForm.handleSubmit(onUrlSubmit)}>
                <CardContent>
                  <FormField
                    control={urlForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Summarize
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Your Text</CardTitle>
              <CardDescription>
                Paste your text here to get a summary.
              </CardDescription>
            </CardHeader>
             <Form {...textForm}>
              <form onSubmit={textForm.handleSubmit(onTextSubmit)}>
                <CardContent>
                  <FormField
                    control={textForm.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Text</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your text here..."
                            className="resize-y min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isPending} className="w-full">
                     {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Summarize
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>

      {isPending && (
         <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </CardContent>
          </Card>
      )}

      {summary && !isPending && (
        <Card className="mt-6 animate-in fade-in-50">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Your AI-generated summary is ready.</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy summary to clipboard"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Clipboard className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-card-foreground/90">
              {summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
