
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-bold mb-6">Welcome to Your Web Application</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Navigate to your dashboard or browse the store
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/dashboard">Admin Dashboard</Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Login</Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link to="/register">Register</Link>
          </Button>
          
          <Button asChild size="lg" variant="secondary">
            <Link to="/store/demo-store">View Demo Store</Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>Additional pages:</p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
