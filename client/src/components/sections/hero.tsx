import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background text-foreground py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" data-testid="text-hero-title">
              Innovative Software Solutions for <span className="text-primary">Modern Businesses</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-hero-description">
              Transform your business with cutting-edge technology. Cool Shot Systems delivers custom software development, digital transformation, and innovative solutions that drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" data-testid="button-start-project">
                <Button className="bg-primary text-primary-foreground px-8 py-4 text-lg font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Start Your Project
                </Button>
              </Link>
              <Link href="/portfolio" data-testid="button-view-work">
                <Button 
                  variant="outline" 
                  className="border-2 border-primary text-primary px-8 py-4 text-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://files.catbox.moe/172avo.jpg" 
              alt="Heritage Oladoye - Founder of Cool Shot Systems" 
              className="rounded-2xl shadow-2xl w-full h-auto"
              data-testid="img-hero"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground" data-testid="text-projects-count">500+ Projects</p>
                  <p className="text-muted-foreground" data-testid="text-projects-status">Successfully Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
