import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Playbook",
  description: "Personal playbook — agent, RAG, and workflow patterns",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
