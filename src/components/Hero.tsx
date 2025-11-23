import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardMockup from "@/assets/dashboard-mockup.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,hsl(217_91%_60%/0.3)_0,transparent_50%),radial-gradient(at_100%_0%,hsl(263_70%_60%/0.3)_0,transparent_50%),radial-gradient(at_100%_100%,hsl(160_84%_39%/0.3)_0,transparent_50%)]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_33%_17%/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_33%_17%/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-muted-foreground">Built for CoDeS • Real-time tracking • AI-Powered</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              CoDeS Merchandise.{" "}
              <span className="gradient-text">Simplified.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              The official inventory and sales management system for Computer Debuggers Society merchandise operations
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white glow-primary group text-lg px-8"
                >
                  Sign In
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border/50 hover:border-primary hover:text-primary group text-lg px-8"
              >
                Learn More
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="relative animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl animate-pulse-glow" />
            <div className="relative glass-card p-2 rounded-2xl hover-lift">
              <img
                src={dashboardMockup}
                alt="CoDeSMerch Dashboard Preview"
                className="rounded-xl w-full shadow-2xl"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 glass-card px-6 py-3 rounded-xl border border-accent/50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse-glow" />
                  <div>
                    <p className="text-xs text-muted-foreground">Live Tracking</p>
                    <p className="text-sm font-bold text-accent">1,234 Items</p>
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
