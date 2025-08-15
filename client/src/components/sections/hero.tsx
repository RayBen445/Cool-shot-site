import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6" data-testid="text-hero-title">
              Innovative Software Solutions for <span className="text-blue-200">Modern Businesses</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed" data-testid="text-hero-description">
              Transform your business with cutting-edge technology. Cool Shot Systems delivers custom software development, digital transformation, and innovative solutions that drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" data-testid="button-start-project">
                <Button className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                  Start Your Project
                </Button>
              </Link>
              <Link href="/portfolio" data-testid="button-view-work">
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
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
              className="rounded-xl shadow-2xl w-full h-auto"
              data-testid="img-hero"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900" data-testid="text-projects-count">500+ Projects</p>
                  <p className="text-gray-600" data-testid="text-projects-status">Successfully Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
