import Summarizer from "@/components/summarizer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-12 sm:p-24">
      <div className="z-10 w-full max-w-4xl items-center justify-between text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-primary font-headline">
          Kasif Summarizer
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Paste any URL or text below to get a quick, AI-powered summary.
          Discover key themes and entities in seconds.
        </p>
      </div>

      <div className="mt-12 w-full max-w-2xl">
        <Summarizer />
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Kasif Summarizer. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
