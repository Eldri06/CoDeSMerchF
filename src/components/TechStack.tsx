const TechStack = () => {
    const technologies = [
      { name: "React.js", color: "from-blue-400 to-blue-600" },
      { name: "Node.js", color: "from-green-400 to-green-600" },
      { name: "Firebase", color: "from-yellow-400 to-orange-600" },
      { name: "TensorFlow", color: "from-orange-400 to-red-600" },
      { name: "Tailwind CSS", color: "from-cyan-400 to-blue-600" },
      { name: "Express.js", color: "from-gray-400 to-gray-600" },
    ];
  
    return (
      <section id="technology" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold">
              Built With <span className="gradient-text">Modern Technology</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by industry-leading frameworks and tools
            </p>
          </div>
  
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-2xl flex items-center justify-center hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${tech.color} group-hover:scale-110 transition-transform glow-primary`} />
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
  