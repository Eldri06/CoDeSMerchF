import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, ChartBar, Zap, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import codesLogo from "@/assets/codes-logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_50%,hsl(217_91%_60%/0.3)_0,transparent_50%)]" />
        
        <div className="relative z-10 max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-8 group">
            <img src={codesLogo} alt="CoDeS Logo" className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold gradient-text">CoDeSMerch</span>
          </Link>

          <h1 className="text-4xl font-bold mb-4">Manage Smarter, Sell Faster</h1>
          <p className="text-muted-foreground mb-8">
            Join the Computer Debuggers Society in revolutionizing merchandise management
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 glass-card p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="text-primary" size={20} />
              </div>
              <p className="text-sm">Track CoDeS merchandise in real-time</p>
            </div>
            <div className="flex items-center gap-3 glass-card p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <ChartBar className="text-secondary" size={20} />
              </div>
              <p className="text-sm">AI forecasting for event planning</p>
            </div>
            <div className="flex items-center gap-3 glass-card p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <DollarSign className="text-accent" size={20} />
              </div>
              <p className="text-sm">Integrated POS for school events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-3 mb-8 group">
            <img src={codesLogo} alt="CoDeS Logo" className="w-10 h-10" />
            <span className="text-xl font-bold gradient-text">CoDeSMerch</span>
          </Link>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to manage CoDeS merchandise</p>
          </div>

          <form className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@umtc.edu.ph"
                  className="pl-10 glass-card border-border/50 focus:border-primary"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 glass-card border-border/50 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white glow-primary"
              size="lg"
            >
              Sign In
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Request Access
              </Link>
              <br />
              <span className="text-xs">Only for authorized CoDeS officers</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
