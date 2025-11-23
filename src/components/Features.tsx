import { Brain, Calendar, ChartBar, CreditCard, FileText, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Real-Time POS System",
      description: "Process sales in seconds with automatic inventory updates",
      gradient: "from-primary to-primary-glow",
    },
    {
      icon: Brain,
      title: "AI Demand Forecasting",
      description: "Predict merchandise demand for upcoming CoDeS events",
      gradient: "from-secondary to-purple-400",
    },
    {
      icon: Calendar,
      title: "Event-Based Management",
      description: "Track inventory across intramurals, foundation week, and department events",
      gradient: "from-accent to-green-400",
    },
    {
      icon: ChartBar,
      title: "Smart Analytics Dashboard",
      description: "Visual insights into CoDeS merchandise sales, revenue, and product performance",
      gradient: "from-primary to-accent",
    },
    {
      icon: Users,
      title: "Multi-User Access",
      description: "Role-based access for CoDeS officers, inventory managers, and cashiers",
      gradient: "from-secondary to-accent",
    },
    {
      icon: FileText,
      title: "Automated Reports",
      description: "Generate sales and inventory reports for CoDeS events instantly",
      gradient: "from-accent to-primary",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage merchandise efficiently and intelligently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-8 rounded-2xl hover-lift group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform glow-primary`}>
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
