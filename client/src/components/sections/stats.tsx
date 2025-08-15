export default function Stats() {
  const stats = [
    { value: "500+", label: "Projects Delivered" },
    { value: "250+", label: "Happy Clients" },
    { value: "8+", label: "Years Experience" },
    { value: "50+", label: "Team Members" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid={`text-stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-gray-600" data-testid={`text-stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
