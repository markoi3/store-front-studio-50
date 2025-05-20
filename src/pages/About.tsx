
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <ShopLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Store</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Curated products for modern living, delivered with exceptional service.
            </p>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Our Story"
                className="rounded-lg shadow-custom"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Founded in 2020, our e-commerce shop began with a simple mission: to provide quality products that enhance everyday living.
              </p>
              <p className="text-muted-foreground mb-6">
                What started as a small online store has grown into a curated marketplace of minimalist home goods, carefully selected for their quality, functionality, and aesthetic appeal.
              </p>
              <p className="text-muted-foreground">
                We believe that well-designed products can transform spaces and improve daily life. Every item in our collection is chosen with this philosophy in mind.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-custom">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality</h3>
              <p className="text-muted-foreground">
                We carefully select products that meet our high standards for durability, craftsmanship, and materials.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-custom">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Simplicity</h3>
              <p className="text-muted-foreground">
                We believe in the beauty of minimalism and the power of well-designed, functional products.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-custom">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainability</h3>
              <p className="text-muted-foreground">
                We prioritize environmentally responsible products and practices throughout our business.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="aspect-square mb-4 bg-accent rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-muted-foreground">Founder & CEO</p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square mb-4 bg-accent rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="Michael Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Michael Chen</h3>
              <p className="text-muted-foreground">Creative Director</p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square mb-4 bg-accent rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="Emily Rodriguez"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Emily Rodriguez</h3>
              <p className="text-muted-foreground">Product Manager</p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square mb-4 bg-accent rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="David Kim"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">David Kim</h3>
              <p className="text-muted-foreground">Customer Success</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our curated collection of quality products designed to enhance your everyday living.
          </p>
          <Link to="/shop">
            <Button size="lg">Browse Our Collection</Button>
          </Link>
        </div>
      </section>
    </ShopLayout>
  );
};

export default About;
