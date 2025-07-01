
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Archive, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/templates', label: 'Templates', icon: Layers },
  { href: '/my-wishes', label: 'CandleWeb', icon: Archive },
  { href: '/account', label: 'Settings', icon: Settings },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 h-24 bg-transparent pointer-events-none z-50">
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="mx-auto max-w-sm h-16 bg-black/30 backdrop-blur-md shadow-lg rounded-3xl flex justify-around items-center border border-white/10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-full h-full rounded-full transition-colors duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary/80'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
