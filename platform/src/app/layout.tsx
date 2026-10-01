import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview Feedback Platform",
  description: "End-to-end platform for interview feedback generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="w-full border-b bg-white">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Whitelabel Logo Placeholder */}
            <div className="flex items-center">
              <img src="/logo.jpg" alt="Interview Report Generator Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="text-sm text-slate-500">Internal Use Only</div>
          </div>
        </header>
        <main className="flex-1 w-full container mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
