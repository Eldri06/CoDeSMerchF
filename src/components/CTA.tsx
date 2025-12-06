import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(at_50%_50%,hsl(217_91%_60%/0.3)_0,transparent_50%)]" />
      
      {/* Floating Elements - hidden on mobile */}
      <div className="hidden sm:block absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-float" />
      <div className="hidden sm:block absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-8 animate-fade-in">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight px-2">
            Ready to Modernize{" "}
            <span className="gradient-text">CoDeS Merch?</span>
          </h2>
          
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Join the digital transformation of our organization
          </p>

          <div className="flex justify-center pt-2 sm:pt-4">
            <Link to="/login">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white glow-primary group text-base sm:text-lg px-6 sm:px-8"
              >
                Access CoDeSMerch
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-4">
            Exclusively for CoDeS Officers
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;