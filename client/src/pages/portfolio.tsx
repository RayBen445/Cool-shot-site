import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

export default function Portfolio() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Complete e-commerce solution with advanced analytics and inventory management for a retail chain.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "Web Application",
      client: "RetailMax Inc.",
      results: ["40% increase in online sales", "60% reduction in cart abandonment", "Real-time inventory tracking"]
    },
    {
      title: "Healthcare Management System",
      description: "Comprehensive patient management system with real-time analytics for a healthcare provider.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["Vue.js", "Python", "PostgreSQL", "Docker"],
      category: "Healthcare",
      client: "MediCare Solutions",
      results: ["50% faster patient processing", "Improved data accuracy", "HIPAA compliant infrastructure"]
    },
    {
      title: "FinTech Mobile App",
      description: "Secure mobile banking application with advanced security features and real-time transactions.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["React Native", "Java", "AWS", "Blockchain"],
      category: "Mobile Application",
      client: "SecureBank",
      results: ["500K+ active users", "99.9% uptime", "Bank-grade security"]
    },
    {
      title: "Supply Chain Analytics",
      description: "Advanced analytics platform for supply chain optimization with predictive insights.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["Python", "TensorFlow", "Tableau", "Azure"],
      category: "Data Analytics",
      client: "LogiFlow Corp.",
      results: ["30% cost reduction", "Predictive maintenance", "Real-time tracking"]
    },
    {
      title: "Smart City IoT Platform",
      description: "IoT platform for smart city infrastructure monitoring and management.",
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["Angular", "Node.js", "IoT Core", "Google Cloud"],
      category: "IoT Solution",
      client: "City of Innovation",
      results: ["25% energy savings", "Improved traffic flow", "Environmental monitoring"]
    },
    {
      title: "AI-Powered CRM",
      description: "Customer relationship management system with AI-driven insights and automation.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["React", "Python", "TensorFlow", "MySQL"],
      category: "AI/ML",
      client: "SalesForce Pro",
      results: ["45% increase in lead conversion", "Automated workflows", "Predictive analytics"]
    }
  ];

  const categories = ["All", "Web Application", "Mobile Application", "Data Analytics", "IoT Solution", "AI/ML", "Healthcare"];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background text-foreground overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6" data-testid="text-portfolio-hero-title">
            Our Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-portfolio-hero-description">
            Explore our successful projects that have transformed businesses across various industries. 
            Each project showcases our commitment to innovation and excellence.
          </p>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="outline"
                className="hover:bg-primary hover:text-white transition-colors duration-200"
                data-testid={`button-filter-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow duration-200 overflow-hidden" data-testid={`card-project-${index}`}>
                <div className="relative">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                    data-testid={`img-project-${index}`}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-primary text-white text-sm rounded-full" data-testid={`tag-category-${index}`}>
                      {project.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid={`text-project-title-${index}`}>
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4" data-testid={`text-project-description-${index}`}>
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">Client:</p>
                    <p className="text-sm text-gray-600" data-testid={`text-project-client-${index}`}>{project.client}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Key Results:</p>
                    <ul className="space-y-1">
                      {project.results.map((result, resultIndex) => (
                        <li key={resultIndex} className="text-sm text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-900 mb-2">Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          data-testid={`tag-technology-${index}-${techIndex}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary text-white hover:bg-blue-700"
                      data-testid={`button-view-case-study-${index}`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Case Study
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      data-testid={`button-view-demo-${index}`}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-stat-projects">500+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-stat-clients">250+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-stat-industries">15+</div>
              <div className="text-gray-600">Industries Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-stat-success">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-portfolio-cta-title">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8" data-testid="text-portfolio-cta-description">
            Join our portfolio of successful clients. Let's discuss how we can help transform your business.
          </p>
          <Button 
            className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            data-testid="button-start-project-cta"
          >
            Start Your Project
          </Button>
        </div>
      </section>
    </div>
  );
}
