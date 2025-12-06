import { CalendarPlus, Package, ShoppingCart, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: CalendarPlus,
      title: "Set Up Event",
      description: "Create events like Intramurals or Foundation Week",
      color: "text-primary",
    },
    {
      icon: Package,
      title: "Add Products",
      description: "Upload merchandise with stock levels",
      color: "text-secondary",
    },
    {
      icon: ShoppingCart,
      title: "Process Sales",
      description: "Use POS to record sales in real-time",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: "Analyze & Forecast",
      description: "Review performance and predict needs",
      color: "text-primary",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background Pattern - hidden on mobile */}
      <div className="hidden sm:block absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_33%_17%/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_33%_17%/0.1)_1px,transparent_1px)] bg-[size:6rem_6rem]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-20 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Get started with our simple 4-step process
          </p>
        </div>

        {/* Mobile Layout - Simple vertical list */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card p-4 rounded-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <step.icon size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground">STEP {index + 1}</span>
                  </div>
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout - Alternating with timeline */}
        <div className="hidden lg:block max-w-5xl mx-auto">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent transform -translate-x-1/2" />

            <div className="space-y-16">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="glass-card p-8 rounded-2xl hover-lift inline-block">
                      <div className={`inline-flex items-center gap-3 mb-4 ${index % 2 === 0 ? "flex-row-reverse" : ""}`}>
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
                  <div className="flex items-center justify-center w-16 h-16 rounded-full glass-card border-4 border-background z-10 relative">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${index % 2 === 0 ? 'from-primary to-secondary' : 'from-accent to-primary'} animate-pulse-glow`} />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />
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