import { Brain, Calendar, ChartBar, CreditCard, FileText, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Real-Time POS System",
      description: "Process sales in seconds with automatic inventory updates and seamless transaction management",
      gradient: "from-primary to-primary-glow",
    },
    {
      icon: Brain,
      title: "AI Demand Forecasting",
      description: "Predict merchandise demand for upcoming CoDeS events using advanced analytics",
      gradient: "from-secondary to-purple-400",
    },
    {
      icon: ChartBar,
      title: "Smart Analytics Dashboard",
      description: "Visual insights into CoDeS merchandise sales, revenue, and product performance at a glance",
      gradient: "from-accent to-green-400",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden -mt-16">
      <div className="container mx-auto px-6">
      <div className="text-center space-y-4 mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-6xl font-bold">
          Powerful <span className="gradient-text">Features</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage merchandise efficiently and intelligently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-card/80 backdrop-blur-sm rounded-3xl p-10 shadow-elegant hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-border/30 animate-fade-in group relative overflow-hidden ${
              index === 1 ? 'md:-translate-y-12' : 'md:translate-y-8'
            }`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg mx-auto`}>
                <feature.icon className="text-white" size={44} />
              </div>
              <h3 className="text-2xl font-bold mb-5 text-center group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed text-center">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Features;