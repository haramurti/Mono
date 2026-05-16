"use client";

import {
   BookMarkedIcon,
   CalendarDaysIcon,
   SparklesIcon,
   UserIcon,
} from 'lucide-react';
import Link from "next/link";
import type { ReactNode } from "react";

import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from "@/shared/lib/utils";
import type { AppSection } from "@/shared/types/app";

type NavItem = {
  key: AppSection;
  label: string;
  icon: ReactNode;
  href?: string;
};

function getNavItems(journalHref?: string): NavItem[] {
  return [
     {
        key: 'capture',
        label: 'Capture',
        href: '/capture',
        icon: <SparklesIcon className="size-4" aria-hidden="true" />,
     },
     {
        key: 'history',
        label: 'History',
        href: '/history',
        icon: <CalendarDaysIcon className="size-4" aria-hidden="true" />,
     },
     {
        key: 'journal',
        label: 'Journal',
        href: journalHref,
        icon: <BookMarkedIcon className="size-4" aria-hidden="true" />,
     },
     {
        key: 'profile',
        label: 'Profile',
        href: '/profile',
        icon: <UserIcon className="size-4" aria-hidden="true" />,
     },
  ];
}

function AppNav({
  items,
  activeSection,
  direction,
}: {
  items: NavItem[];
  activeSection: AppSection;
  direction: "row" | "column";
}) {
  const isDesktopNav = direction === 'column';

  return (
     <TooltipProvider delayDuration={120}>
        <nav
           aria-label="Primary"
           className={cn(
              'flex gap-2',
              direction === 'column' ? 'flex-col' : 'flex-row items-center',
           )}
        >
           {items.map((item) => {
              const isActive = item.key === activeSection;

              const baseClass = cn(
                 'min-h-11 rounded-xl border px-3 py-2 text-xs font-medium transition-colors',
                 direction === 'column'
                    ? 'size-11 items-center justify-center'
                    : 'flex-1 flex-row items-center justify-center gap-2',
                 isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-[var(--surface-strong)] text-card-foreground',
              );

              const label = (
                 <span
                    className={cn(
                       direction === 'column' ? 'sr-only' : 'text-xs',
                    )}
                 >
                    {item.label}
                 </span>
              );

              const navContent = (
                 <>
                    {item.icon}
                    {label}
                 </>
              );

              if (!item.href) {
                 const disabledItem = (
                    <span
                       key={item.key}
                       title={isDesktopNav ? undefined : item.label}
                       className={cn(
                          baseClass,
                          'flex cursor-not-allowed opacity-45',
                       )}
                       aria-disabled="true"
                    >
                       {navContent}
                    </span>
                 );

                 if (!isDesktopNav) {
                    return disabledItem;
                 }

                 return (
                    <Tooltip key={item.key}>
                       <TooltipTrigger asChild>{disabledItem}</TooltipTrigger>
                       <TooltipContent side="right">
                          {item.label}
                       </TooltipContent>
                    </Tooltip>
                 );
              }

              const linkedItem = (
                 <Link
                    key={item.key}
                    href={item.href}
                    aria-label={item.label}
                    title={isDesktopNav ? undefined : item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                       baseClass,
                       'flex',
                       !isActive && 'hover:bg-secondary',
                    )}
                 >
                    {navContent}
                 </Link>
              );

              if (!isDesktopNav) {
                 return linkedItem;
              }

              return (
                 <Tooltip key={item.key}>
                    <TooltipTrigger asChild>{linkedItem}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                 </Tooltip>
              );
           })}
        </nav>
     </TooltipProvider>
  );
}

export function AppShellLayout({
  activeSection,
  journalHref,
  children,
}: {
  activeSection: AppSection;
  journalHref?: string;
  children: ReactNode;
}) {
  const navItems = getNavItems(journalHref);

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-0">
      <div className="mx-auto flex w-full max-w-7xl gap-4 px-3 py-4 md:px-6 md:py-6">
        <aside className="sticky top-6 hidden h-[calc(100dvh-3rem)] w-20 self-start flex-col items-center rounded-2xl border border-border/80 bg-[var(--surface-glass-strong)] py-5 md:flex">
          <div className="mb-6 size-10 rounded-full bg-secondary" />

          <AppNav
            items={navItems}
            activeSection={activeSection}
            direction="column"
          />

          <div className="mt-auto text-[10px] text-muted-foreground">Mono</div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-3 pb-3 md:hidden">
        <div className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-border/80 bg-[var(--surface-glass-solid)] p-2 shadow-[0_16px_40px_rgba(12,10,9,0.08)] backdrop-blur-md">
          <AppNav
            items={navItems}
            activeSection={activeSection}
            direction="row"
          />
        </div>
      </div>
    </div>
  );
}

export function AppShellCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
   const upperPadding = 'pt-5 md:pl-7 md:pr-7 md:pt-7';
   const lowerPadding = 'pb-5 md:pl-7 md:pr-7 md:pb-7';

  return (
     <section
        className={cn(
           `min-h-[94dvh] rounded-2xl  border border-border/79 bg-[var(--surface-glass)]`,
           className,
        )}
     >
        <header
           className={`rounded-tl-2xl rounded-tr-2xl mb-6 border-border/80 pb-4 sticky top-0 z-10 bg-[var(--surface-glass)] backdrop-blur-xl pt-5 shadow-xl shadow-card ${upperPadding}`}
        >
           <div className="flex items-start justify-between gap-4">
              <div>
                 <h1 className="display-lg">{title}</h1>
                 <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {description}
                 </p>
              </div>

              {action}
           </div>
        </header>
        <div className={lowerPadding}>{children}</div>
     </section>
  );
}
