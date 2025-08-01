'use client'

import Link from 'next/link';
import { ChevronLeft, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react';

const yearlyPlans = [
    {
        name: 'BASIC',
        price: 35,
        description: 'Help us pay the bills continue working on improvements!',
        features: [
            'Custom domain',
            'Unlimited pages',
            'Unlimited contacts',
            '10GB per site',
            'Custom code & export site'
        ],
        save: '12%'
    },
    {
        name: 'PREMIUM',
        price: 65,
        description: 'For power users who need more features and support.',
        features: [
            'Everything in Basic',
            'Remove branding',
            'Advanced analytics',
            'Priority support',
            'Team collaboration'
        ],
        save: '15%'
    }
];

const monthlyPlans = [
    {
        name: 'BASIC',
        price: 40,
        description: 'Help us pay the bills continue working on improvements!',
        features: [
            'Custom domain',
            'Unlimited pages',
            'Unlimited contacts',
            '10GB per site',
            'Custom code & export site'
        ],
        save: null
    },
    {
        name: 'PREMIUM',
        price: 75,
        description: 'For power users who need more features and support.',
        features: [
            'Everything in Basic',
            'Remove branding',
            'Advanced analytics',
            'Priority support',
            'Team collaboration'
        ],
        save: null
    }
];

const PlanCard = ({ plan }: { plan: typeof yearlyPlans[0] }) => (
    <Card className="bg-card border-border relative overflow-hidden shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20 hover:-translate-y-1 duration-300">
        {plan.save && (
             <div className="absolute top-3 right-[-34px] transform rotate-45 bg-accent/20 text-accent text-center text-xs font-semibold py-1 w-28 shadow-md">
                Save {plan.save}
            </div>
        )}
        <CardContent className="p-6">
            <Badge variant="secondary" className="mb-4 uppercase">{plan.name}</Badge>
            <div className="mb-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground"> / per month</span>
            </div>
            <p className="text-muted-foreground mb-6 text-sm h-10">{plan.description}</p>
            <ul className="space-y-3 text-sm">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-accent" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
             <Button className="w-full mt-8 rounded-full bg-accent text-accent-foreground py-6 text-lg font-semibold shadow-lg shadow-accent/20 transition-opacity hover:opacity-90">
                Choose Plan
            </Button>
        </CardContent>
    </Card>
);

export default function UpgradePage() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-background p-4 font-sans text-foreground">
            <div className="w-full max-w-4xl">
                <div className="relative mb-8 flex items-center justify-center py-4">
                    <Link href="/" className="absolute left-0 flex items-center text-muted-foreground transition-colors hover:text-foreground">
                        <ChevronLeft className="h-5 w-5" />
                        <span className="ml-1">Back</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Upgrade Plan</h1>
                </div>
                
                <Tabs defaultValue="pro" className="w-full">
                    <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 bg-muted rounded-full mb-6 p-1 h-auto">
                        <TabsTrigger value="pro" className="rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Pro</TabsTrigger>
                        <TabsTrigger value="basic" className="rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Basic</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pro">
                        <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                            {yearlyPlans.map((plan) => <PlanCard key={plan.name} plan={plan} />)}
                        </div>
                    </TabsContent>
                    <TabsContent value="basic">
                        <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                            {monthlyPlans.map((plan) => <PlanCard key={plan.name} plan={plan} />)}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
