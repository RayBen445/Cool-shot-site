import { Code, Smartphone, Globe, BarChart3, Cloud, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      icon: Code,
      title: "Custom Software Development",
      description: "Bespoke software solutions designed specifically for your business processes and requirements.",
      features: ["Requirements Analysis", "Custom Architecture", "Agile Development", "Quality Assurance", "Ongoing Support"],
      technologies: ["React", "Node.js", "Python", "Java", ".NET"]
    },
    {
      icon: Smartphone,
      title: "Mobile App Development", 
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
      features: ["iOS & Android", "Cross-platform", "UI/UX Design", "App Store Publishing", "Maintenance"],
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"]
    },
    {
      icon: Globe,
      title: "Web Development",
      description: "Modern, responsive websites and web applications built with the latest technologies.",
      features: ["Responsive Design", "SEO Optimization", "Performance", "Security", "CMS Integration"],
      technologies: ["React", "Vue.js", "Angular", "PHP", "WordPress"]
    },
    {
      icon: BarChart3,
      title: "Data Analytics",
      description: "Transform your data into actionable insights with advanced analytics and reporting solutions.",
      features: ["Data Visualization", "Business Intelligence", "Predictive Analytics", "Real-time Dashboards", "Custom Reports"],
      technologies: ["Power BI", "Tableau", "Python", "R", "SQL"]
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and migration services for enhanced performance and reliability.",
      features: ["Cloud Migration", "Infrastructure Setup", "Security", "Monitoring", "Cost Optimization"],
      technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"]
    },
    {
      icon: Zap,
      title: "Digital Transformation",
      description: "Comprehensive digital transformation strategies to modernize your business operations.",
      features: ["Strategy Planning", "Process Automation", "System Integration", "Change Management", "Training"],
      technologies: ["AI/ML", "IoT", "Blockchain", "RPA", "API Integration"]
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6" data-testid="text-services-hero-title">
            Our Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto" data-testid="text-services-hero-description">
            Comprehensive technology solutions designed to transform your business and drive growth. 
            From custom software to cloud migration, we have the expertise to deliver results.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-200" data-testid={`card-service-${index}`}>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid={`text-service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6" data-testid={`text-service-description-${index}`}>
                    {service.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          data-testid={`tag-technology-${index}-${techIndex}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link href="/contact" data-testid={`button-learn-more-${index}`}>
                    <Button className="w-full bg-primary text-white hover:bg-blue-700 transition-colors duration-200">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-process-title">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-process-description">
              We follow a proven methodology to ensure your project is delivered on time, on budget, and exceeds expectations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "Understanding your needs and goals" },
              { step: "02", title: "Planning", description: "Detailed project roadmap and timeline" },
              { step: "03", title: "Development", description: "Agile development with regular updates" },
              { step: "04", title: "Delivery", description: "Testing, deployment, and ongoing support" }
            ].map((phase, index) => (
              <div key={index} className="text-center" data-testid={`card-process-${index}`}>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{phase.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid={`text-process-phase-title-${index}`}>
                  {phase.title}
                </h3>
                <p className="text-gray-600" data-testid={`text-process-phase-description-${index}`}>
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8" data-testid="text-cta-description">
            Let's discuss your project and create a solution that drives real results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" data-testid="button-get-started-cta">
              <Button className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Get Started Today
              </Button>
            </Link>
            <Link href="/portfolio" data-testid="button-view-portfolio-cta">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
              >
                View Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
