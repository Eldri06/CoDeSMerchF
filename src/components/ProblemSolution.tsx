import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";

const ProblemSolution = () => {
  const problems = [
    { icon: AlertCircle, text: "Manual notebooks for stock tracking" },
    { icon: AlertCircle, text: "Spreadsheet errors during busy events" },
    { icon: AlertCircle, text: "No way to predict merchandise demand" },
    { icon: AlertCircle, text: "Time-consuming manual sales recording" },
  ];

  const solutions = [
    { icon: CheckCircle2, text: "Digital inventory for all CoDeS merchandise" },
    { icon: CheckCircle2, text: "Real-time POS during events" },
    { icon: CheckCircle2, text: "AI-powered demand predictions" },
    { icon: CheckCircle2, text: "Instant sales reports and analytics" },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* The Challenge */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                <TrendingDown className="text-destructive" size={16} />
                <span className="text-sm font-medium">Current Challenges</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Managing CoDeS merchandise the old way...
              </h2>
            </div>

            <div className="space-y-4">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="glass-card p-4 rounded-xl hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <problem.icon className="text-destructive" size={20} />
                    </div>
                    <p className="text-foreground font-medium">{problem.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Solution */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                <TrendingUp className="text-accent" size={16} />
                <span className="text-sm font-medium">The CoDeSMerch Solution</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Go from{" "}
                <span className="text-destructive line-through">Manual</span>
                {" "}to{" "}
                <span className="gradient-text">Digital</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Built specifically for CoDeS operations
              </p>
            </div>

            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="glass-card p-4 rounded-xl hover-lift border border-accent/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <solution.icon className="text-accent" size={20} />
                    </div>
                    <p className="text-foreground font-medium">{solution.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
