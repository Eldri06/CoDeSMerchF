import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, User, ChartBar, Zap, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import codesLogo from "@/assets/codes-logo.png";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    studentId: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.role || !formData.studentId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.email.endsWith("@umtc.edu.ph")) {
      toast.error("Please use your UMTC email address");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        studentId: formData.studentId,
        phone: formData.phone,
        organization: "Computer Debuggers Society",
        department: "Department of Computing Education",
      });

      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Right Side - Signup Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-3 mb-8 group">
            <img src={codesLogo} alt="CoDeS Logo" className="w-10 h-10" />
            <span className="text-xl font-bold gradient-text">CoDeSMerch</span>
          </Link>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Join CoDeSMerch</h2>
            <p className="text-muted-foreground">Create your account to manage CoDeS merchandise</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className="pl-10 glass-card border-border/50 focus:border-primary"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@umtc.edu.ph"
                  className="pl-10 glass-card border-border/50 focus:border-primary"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 glass-card border-border/50 focus:border-primary"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 glass-card border-border/50 focus:border-primary"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role/Position in CoDeS *</Label>
              <Select onValueChange={handleRoleChange} required>
                <SelectTrigger className="glass-card border-border/50 focus:border-primary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="president">President</SelectItem>
                  <SelectItem value="vp">Vice President</SelectItem>
                  <SelectItem value="secretary">Secretary</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                  <SelectItem value="pio">PIO</SelectItem>
                  <SelectItem value="business">Business Manager</SelectItem>
                  <SelectItem value="officer">Officer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student ID */}
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="2021-XXXX"
                className="glass-card border-border/50 focus:border-primary"
                value={formData.studentId}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09123456789"
                className="glass-card border-border/50 focus:border-primary"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                className="mt-1" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white glow-primary"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;