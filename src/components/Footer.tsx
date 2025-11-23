import { Github, Instagram, Facebook } from "lucide-react";
import codesLogo from "@/assets/codes-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 glass-card">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
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
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="CoDeS Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
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
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Legal & Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About CoDeS
                </a>
              </li>
              <li>
                <a href="mailto:codes@umtc.edu.ph" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact: codes@umtc.edu.ph
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© 2025 Computer Debuggers Society - UM Tagum College. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
