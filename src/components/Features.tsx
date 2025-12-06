import { Brain, ChartBar, CreditCard } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Real-Time POS",
      description: "Process sales with automatic inventory updates",
      gradient: "from-primary to-primary-glow",
    },
    {
      icon: Brain,
      title: "AI Forecasting",
      description: "Predict demand for upcoming events",
      gradient: "from-secondary to-purple-400",
    },
    {
      icon: ChartBar,
      title: "Smart Analytics",
      description: "Visual insights into sales and performance",
      gradient: "from-accent to-green-400",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Everything you need to manage merchandise efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 items-stretch sm:items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-3xl p-6 sm:p-10 shadow-elegant hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-border/30 animate-fade-in group relative overflow-hidden ${
                index === 1 ? 'sm:-translate-y-12' : 'sm:translate-y-8'
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg mx-auto`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-5 text-center group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center">
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