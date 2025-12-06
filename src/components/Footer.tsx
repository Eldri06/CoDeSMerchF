import { Github, Instagram, Facebook } from "lucide-react";
import codesLogo from "@/assets/codes-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8 sm:py-12 glass-card">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Mobile: Simple stacked layout */}
        <div className="lg:hidden space-y-6">
          {/* Brand */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <img src={codesLogo} alt="CoDeS Logo" className="w-8 h-8" />
              <span className="text-lg font-bold gradient-text">CoDeSMerch</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Official CoDeS Merchandise Management
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="#"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links - Horizontal on mobile */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#technology" className="text-muted-foreground hover:text-primary transition-colors">
              Technology
            </a>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={codesLogo} alt="CoDeS Logo" className="w-10 h-10" />
              <span className="text-xl font-bold gradient-text">CoDeSMerch</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Official CoDeS Merchandise Management System
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="CoDeS Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="CoDeS Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="CoDeS GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#technology" className="text-muted-foreground hover:text-primary transition-colors">
                  Technology
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About CoDeS
                </a>
              </li>
              <li>
                <a href="mailto:codes@umtc.edu.ph" className="text-muted-foreground hover:text-primary transition-colors">
                  codes@umtc.edu.ph
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border/50 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 Computer Debuggers Society - UM Tagum College</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;