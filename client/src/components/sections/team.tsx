export default function Team() {
  const team = [
    {
      name: "Heritage Oladoye",
      role: "Founder & CEO", 
      description: "Expert in AI, full-stack development, and innovative technology solutions",
      image: "https://files.catbox.moe/172avo.jpg",
      alt: "Heritage Oladoye, Founder & CEO of Cool Shot Systems"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-team-title">
            Meet the Founder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-team-description">
            Leading Cool Shot Systems with expertise in AI and cutting-edge technology solutions
          </p>
        </div>
        
        <div className="flex justify-center">
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
