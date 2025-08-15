import Hero from "@/components/sections/hero";
import Stats from "@/components/sections/stats";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      
      {/* About Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://files.catbox.moe/172avo.jpg" 
                alt="Heritage Oladoye - Founder of Cool Shot Systems" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-about-preview"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6" data-testid="text-about-title">
                Building the Future of <span className="text-primary">Technology</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed" data-testid="text-about-description">
                Founded by Heritage Oladoye, Cool Shot Systems has been at the forefront of AI and digital innovation. We combine technical expertise with creative vision to deliver cutting-edge software solutions that transform businesses and drive growth.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Heritage leads our mission to turn your ideas into powerful, scalable AI-powered solutions that give you a competitive edge in today's digital landscape, specializing in custom software development and intelligent automation.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Innovation Focus</h4>
                    <p className="text-gray-600 text-sm">Cutting-edge technology solutions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quality Delivery</h4>
                    <p className="text-gray-600 text-sm">On-time, on-budget projects</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/about" data-testid="button-learn-more">
                  <span className="inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors duration-200 cursor-pointer">
                    Learn More About Us →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-services-title">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-services-description">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Custom Software Development",
                description: "Bespoke software solutions designed specifically for your business processes and requirements.",
                icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              },
              {
                title: "Mobile App Development", 
                description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
                icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              },
              {
                title: "Web Development",
                description: "Modern, responsive websites and web applications built with the latest technologies.",
                icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200" data-testid={`card-service-${index}`}>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={service.icon}></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <span className="text-primary font-semibold hover:text-blue-700 transition-colors duration-200 cursor-pointer">
                    Learn More →
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services" data-testid="button-view-all-services">
              <span className="inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors duration-200 cursor-pointer text-lg">
                View All Services →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
