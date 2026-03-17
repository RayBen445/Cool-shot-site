import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CSSLab - Code Editor & Web Deployment Platform",
  description: "Create, code, and deploy web projects instantly. Like GitHub meets Vercel, designed for web developers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-950 text-white flex flex-col`}>
        <ThemeProvider defaultTheme="dark" storageKey="csslab-theme">
          <LayoutWrapper>
            <main className="flex-1 overflow-auto flex flex-col">
              {children}
            </main>
          </LayoutWrapper>
          <div className="shrink-0">
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
