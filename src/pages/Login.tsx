
import { useState } from "react";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting login process");
      await login(formData.email, formData.password);
      console.log("Login successful");
      toast.success("Login successful!");
    } catch (err) {
      const error = err as Error;
      console.error("Login error in component:", error);
      setError(error.message || "Failed to sign in. Please check your credentials.");
      toast.error("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ShopLayout>
      <div className="container max-w-md mx-auto px-4 py-16">
        <div className="bg-card rounded-lg shadow-custom p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Log In to Your Account</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Please enter your details
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-foreground hover:underline font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default Login;
