import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardMockup from "@/assets/dashboard-mockup.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-0">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,hsl(217_91%_60%/0.3)_0,transparent_50%),radial-gradient(at_100%_0%,hsl(263_70%_60%/0.3)_0,transparent_50%),radial-gradient(at_100%_100%,hsl(160_84%_39%/0.3)_0,transparent_50%)]" />
      
      {/* Grid Pattern - hidden on mobile for cleaner look */}
      <div className="hidden sm:block absolute inset-0 bg-[linear-gradient(to_right,hsl(217_33%_17%/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_33%_17%/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-card text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-muted-foreground">Built for CoDeS • AI-Powered</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
              CoDeS Merchandise.{" "}
              <span className="gradient-text">Simplified.</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              The official inventory and sales management system for Computer Debuggers Society
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white glow-primary group text-base sm:text-lg px-6 sm:px-8"
                >
                  Sign In
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#features">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-border/50 hover:border-primary hover:text-primary group text-base sm:text-lg px-6 sm:px-8"
                >
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="relative animate-slide-in-right mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl animate-pulse-glow" />
            <div className="relative glass-card p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover-lift">
              <img
                src={dashboardMockup}
                alt="CoDeSMerch Dashboard Preview"
                className="rounded-lg sm:rounded-xl w-full shadow-2xl"
              />
              {/* Floating Badge - hidden on small mobile */}
              <div className="hidden sm:block absolute -bottom-4 -left-4 glass-card px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-accent/50 animate-float">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent animate-pulse-glow" />
                  <div>
                    <p className="text-xs text-muted-foreground">Live Tracking</p>
                    <p className="text-xs sm:text-sm font-bold text-accent">1,234 Items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;