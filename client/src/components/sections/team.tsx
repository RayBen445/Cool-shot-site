export default function Team() {
  const team = [
    {
      name: "John Smith",
      role: "CEO & Founder", 
      description: "15+ years in technology leadership",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      alt: "John Smith, CEO"
    },
    {
      name: "Sarah Johnson",
      role: "Chief Technology Officer",
      description: "Expert in cloud architecture and AI",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b7e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      alt: "Sarah Johnson, CTO"
    },
    {
      name: "Michael Chen", 
      role: "Lead Developer",
      description: "Full-stack development specialist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      alt: "Michael Chen, Lead Developer"
    },
    {
      name: "Emily Rodriguez",
      role: "UX/UI Designer", 
      description: "User experience and design expert",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      alt: "Emily Rodriguez, UX Designer"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-team-title">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-team-description">
            Talented professionals dedicated to delivering exceptional technology solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <img 
                src={member.image}
                alt={member.alt}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                data-testid={`img-team-member-${index}`}
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-1" data-testid={`text-team-name-${index}`}>
                {member.name}
              </h3>
              <p className="text-primary font-medium mb-2" data-testid={`text-team-role-${index}`}>
                {member.role}
              </p>
              <p className="text-gray-600 text-sm" data-testid={`text-team-description-${index}`}>
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
