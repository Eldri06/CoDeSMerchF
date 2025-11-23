import { CalendarPlus, Package, ShoppingCart, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: CalendarPlus,
      title: "Set Up Your Event",
      description: "CoDeS officers create events (Intramurals, Foundation Week, etc.)",
      color: "text-primary",
    },
    {
      icon: Package,
      title: "Add Merchandise",
      description: "Upload CoDeS products: shirts, lanyards, keychains with stock levels",
      color: "text-secondary",
    },
    {
      icon: ShoppingCart,
      title: "Process Sales",
      description: "Use the POS system during events to record sales in real-time",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: "Review & Forecast",
      description: "Analyze CoDeS event performance and predict future merchandise needs",
      color: "text-primary",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_33%_17%/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_33%_17%/0.1)_1px,transparent_1px)] bg-[size:6rem_6rem]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center space-y-4 mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple 4-step process
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent transform -translate-x-1/2" />

            <div className="space-y-16">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="glass-card p-8 rounded-2xl hover-lift inline-block">
                      <div className={`inline-flex items-center gap-3 mb-4 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center ${step.color}`}>
                          <step.icon size={24} />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">STEP {index + 1}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-full glass-card border-4 border-background z-10 relative">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${index % 2 === 0 ? 'from-primary to-secondary' : 'from-accent to-primary'} animate-pulse-glow`} />
                  </div>

                  {/* Spacer */}
                  <div className="hidden lg:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
