import type { Metadata } from "next";

import { QueryProvider } from "@/shared/components/providers/query-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { cn } from "@/shared/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "Mono",
  description:
    "Mono is an AI-guided journaling companion that helps you start from a feeling and reflect with more clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" className={cn('h-full scroll-smooth')}>
        <body className="min-h-full bg-background text-foreground antialiased overflow-y-scroll">
           <QueryProvider>{children}</QueryProvider>
           <Toaster />
        </body>
     </html>
  );
}
