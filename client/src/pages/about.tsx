import Team from "@/components/sections/team";
import { CheckCircle, Target, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6" data-testid="text-about-hero-title">
            About Cool Shot Systems
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto" data-testid="text-about-hero-description">
            We're passionate about transforming businesses through innovative technology solutions. 
            Our journey began in 2015 with a simple mission: to make technology work better for everyone.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Software development team collaborating" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-company-story"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6" data-testid="text-company-story-title">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed" data-testid="text-company-story-1">
                Cool Shot Systems was founded with the vision of bridging the gap between complex technology 
                and real business needs. What started as a small team of passionate developers has grown into 
                a comprehensive technology partner for businesses of all sizes.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-company-story-2">
                Today, we're proud to have delivered over 500 successful projects, helped 250+ clients transform 
                their operations, and built a team of 50+ talented professionals who share our commitment to excellence.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Innovation First</h4>
                    <p className="text-gray-600 text-sm">Always pushing boundaries</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Client Success</h4>
                    <p className="text-gray-600 text-sm">Your success is our success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-mission-title">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-mission-description">
              We believe technology should empower, not complicate. Our values guide everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid="text-value-innovation-title">
                Innovation
              </h3>
              <p className="text-gray-600" data-testid="text-value-innovation-description">
                We stay ahead of technology trends to deliver cutting-edge solutions that give our clients a competitive advantage.
              </p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid="text-value-collaboration-title">
                Collaboration
              </h3>
              <p className="text-gray-600" data-testid="text-value-collaboration-description">
                We work closely with our clients as partners, ensuring every solution is perfectly aligned with their goals.
              </p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid="text-value-excellence-title">
                Excellence
              </h3>
              <p className="text-gray-600" data-testid="text-value-excellence-description">
                Quality is never an accident. We maintain the highest standards in every project we deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Team />
    </div>
  );
}
