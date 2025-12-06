import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";

const ProblemSolution = () => {
  const problems = [
    { icon: AlertCircle, text: "Manual notebooks for stock tracking" },
    { icon: AlertCircle, text: "Spreadsheet errors during events" },
    { icon: AlertCircle, text: "No way to predict demand" },
    { icon: AlertCircle, text: "Time-consuming sales recording" },
  ];

  const solutions = [
    { icon: CheckCircle2, text: "Digital inventory management" },
    { icon: CheckCircle2, text: "Real-time POS during events" },
    { icon: CheckCircle2, text: "AI-powered predictions" },
    { icon: CheckCircle2, text: "Instant sales reports" },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* The Challenge */}
          <div className="space-y-5 sm:space-y-8 animate-fade-in">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card">
                <TrendingDown className="text-destructive" size={14} />
                <span className="text-xs sm:text-sm font-medium">Current Challenges</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                The old way...
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="glass-card p-3 sm:p-4 rounded-lg sm:rounded-xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                      <problem.icon className="text-destructive" size={16} />
                    </div>
                    <p className="text-sm sm:text-base text-foreground font-medium">{problem.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Solution */}
          <div className="space-y-5 sm:space-y-8 animate-fade-in">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card">
                <TrendingUp className="text-accent" size={14} />
                <span className="text-xs sm:text-sm font-medium">The Solution</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                Go{" "}
                <span className="gradient-text">Digital</span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="glass-card p-3 sm:p-4 rounded-lg sm:rounded-xl border border-accent/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <solution.icon className="text-accent" size={16} />
                    </div>
                    <p className="text-sm sm:text-base text-foreground font-medium">{solution.text}</p>
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