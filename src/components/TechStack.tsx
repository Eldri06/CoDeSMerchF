const TechStack = () => {
  const technologies = [
    { name: "React.js", color: "from-blue-400 to-blue-600" },
    { name: "Node.js", color: "from-green-400 to-green-600" },
    { name: "Firebase", color: "from-yellow-400 to-orange-600" },
    { name: "Python", color: "from-orange-400 to-red-600" },
    { name: "Tailwind CSS", color: "from-cyan-400 to-blue-600" },
    { name: "Express.js", color: "from-gray-400 to-gray-600" },
  ];

  return (
    <section id="technology" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">
            Built With <span className="gradient-text">Modern Tech</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Powered by industry-leading frameworks
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="glass-card p-3 sm:p-6 rounded-xl sm:rounded-2xl flex items-center justify-center hover-lift group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${tech.color} group-hover:scale-110 transition-transform`} />
                <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;