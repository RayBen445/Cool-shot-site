import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CSSLab - The Web Engineering Playground",
  description: "Write HTML, CSS, and JavaScript with instant live previews.",
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
          <Navigation />
          <main className="flex-1 overflow-auto flex flex-col">
            {children}
          </main>
          <div className="shrink-0">
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
