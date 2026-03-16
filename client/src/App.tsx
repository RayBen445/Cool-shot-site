import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AudioPlayer from "@/components/ui/audio-player";
import ChatWidget from "@/components/ui/chat-widget";
import Home from "@/pages/csslab/home";
import Lab from "@/pages/csslab/lab";
import Templates from "@/pages/csslab/templates";
import ProjectViewer from "@/pages/csslab/project";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navigation />
      <main className="flex-1 overflow-auto flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/lab" component={Lab} />
          <Route path="/templates" component={Templates} />
          <Route path="/p/:id" component={ProjectViewer} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="csslab-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
          <AudioPlayer 
            src="https://files.catbox.moe/lnx9jf.mp3"
            autoplay={true}
            loop={true}
            volume={0.9}
          />
          <ChatWidget />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
