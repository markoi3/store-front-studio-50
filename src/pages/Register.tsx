
import { useState } from "react";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData.email, formData.password, formData.name);
      setRegistered(true);
      // Don't navigate immediately to allow the user to see the verification message
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to create account. Please try again.");
      setRegistered(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ShopLayout>
      <div className="container max-w-md mx-auto px-4 py-16">
        <div className="bg-card rounded-lg shadow-custom p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-2">
              Sign up to start managing your store
            </p>
          </div>
          
          {registered && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verify Your Email</AlertTitle>
              <AlertDescription>
                We've sent a verification link to {formData.email}. Please check your inbox and verify your email before logging in.
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {!registered && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Password should be at least 8 characters with a mix of letters,
                  numbers, and symbols.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {registered ? (
                <>
                  Ready to sign in? {" "}
                  <Link
                    to="/login"
                    className="text-foreground hover:underline font-medium"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-foreground hover:underline font-medium"
                  >
                    Login
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default Register;
