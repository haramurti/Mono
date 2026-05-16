"use client";

import { BookMarkedIcon, CalendarDaysIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

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
      key: "capture",
      label: "Capture",
      href: "/capture",
      icon: <SparklesIcon className="size-4" aria-hidden="true" />,
    },
    {
      key: "history",
      label: "History",
      href: "/history",
      icon: <CalendarDaysIcon className="size-4" aria-hidden="true" />,
    },
    {
      key: "journal",
      label: "Journal",
      href: journalHref,
      icon: <BookMarkedIcon className="size-4" aria-hidden="true" />,
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
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex gap-2",
        direction === "column" ? "flex-col" : "flex-row items-center",
      )}
    >
      {items.map((item) => {
        const isActive = item.key === activeSection;
        const baseClass = cn(
          "min-h-11 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
          direction === "column"
            ? "w-14 flex-col items-center justify-center gap-1"
            : "flex-1 flex-row items-center justify-center gap-2",
          isActive
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-[var(--surface-strong)] text-card-foreground",
        );

        if (!item.href) {
          return (
            <span
              key={item.key}
              title={item.label}
              className={cn(baseClass, "flex cursor-not-allowed opacity-45")}
              aria-disabled="true"
            >
              {item.icon}
              <span
                className={cn(
                  direction === "column" ? "text-[0.62rem]" : "text-xs",
                )}
              >
                {item.label}
              </span>
            </span>
          );
        }

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-label={item.label}
            title={item.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(baseClass, "flex", !isActive && "hover:bg-secondary")}
          >
            {item.icon}
            <span
              className={cn(
                direction === "column" ? "text-[0.62rem]" : "text-xs",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
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
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-[var(--surface-glass)] p-5 md:p-7",
        className,
      )}
    >
      <header className="mb-6 border-b border-border/80 pb-4">
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
      {children}
    </section>
  );
}
