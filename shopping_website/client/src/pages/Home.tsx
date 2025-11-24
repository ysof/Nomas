import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: products } = trpc.products.list.useQuery({});

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-accent">NOMAS</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <button onClick={() => navigate("/")} className="text-foreground hover:text-accent transition">
              Home
            </button>
            <button onClick={() => navigate("/products?category=men")} className="text-foreground hover:text-accent transition">
              Men
            </button>
            <button onClick={() => navigate("/products?category=women")} className="text-foreground hover:text-accent transition">
              Women
            </button>
            <button onClick={() => navigate("/products")} className="text-foreground hover:text-accent transition">
              All Products
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-secondary rounded-lg transition"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user?.name || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-secondary rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <button onClick={() => { navigate("/"); setMobileMenuOpen(false); }} className="text-left text-foreground hover:text-accent transition">
                Home
              </button>
              <button onClick={() => { navigate("/products?category=men"); setMobileMenuOpen(false); }} className="text-left text-foreground hover:text-accent transition">
                Men
              </button>
              <button onClick={() => { navigate("/products?category=women"); setMobileMenuOpen(false); }} className="text-left text-foreground hover:text-accent transition">
                Women
              </button>
              <button onClick={() => { navigate("/products"); setMobileMenuOpen(false); }} className="text-left text-foreground hover:text-accent transition">
                All Products
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-background overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Timeless. Distinct. NOMAS.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Where modern sophistication meets heritage craftsmanship — designed for those who embody understated luxury.
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg"
            >
              Discover the Collection
            </Button>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-foreground mb-16">
              Featured Collections
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Men's Collection */}
              <div
                onClick={() => navigate("/products?category=men")}
                className="group cursor-pointer"
              >
                <div className="relative h-96 bg-secondary rounded-lg overflow-hidden mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <span className="text-6xl">👔</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground group-hover:text-accent transition">
                  Men's Attire
                </h3>
                <p className="text-muted-foreground mt-2">
                  Sophisticated tailoring for the modern gentleman
                </p>
              </div>

              {/* Women's Collection */}
              <div
                onClick={() => navigate("/products?category=women")}
                className="group cursor-pointer"
              >
                <div className="relative h-96 bg-secondary rounded-lg overflow-hidden mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <span className="text-6xl">👗</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground group-hover:text-accent transition">
                  Women's Couture
                </h3>
                <p className="text-muted-foreground mt-2">
                  Elegant designs that celebrate refined femininity
                </p>
              </div>

              {/* Accessories */}
              <div
                onClick={() => navigate("/products?category=accessories")}
                className="group cursor-pointer"
              >
                <div className="relative h-96 bg-secondary rounded-lg overflow-hidden mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <span className="text-6xl">✨</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground group-hover:text-accent transition">
                  Signature Line
                </h3>
                <p className="text-muted-foreground mt-2">
                  Curated accessories that complete the look
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold text-foreground mb-8">
              The Essence of NOMAS
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              NOMAS redefines modern luxury — merging European tailoring with timeless minimalism.
              Every creation tells a story of refinement, craftsmanship, and confidence.
              We believe true sophistication lies not in excess, but in quiet perfection.
            </p>
            <Button
              onClick={() => navigate("/products")}
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10"
            >
              Explore Our Collections
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg text-accent mb-4">NOMAS</h3>
              <p className="text-muted-foreground text-sm">
                Timeless luxury for the discerning individual.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate("/products?category=men")} className="hover:text-accent transition">Men</button></li>
                <li><button onClick={() => navigate("/products?category=women")} className="hover:text-accent transition">Women</button></li>
                <li><button onClick={() => navigate("/products")} className="hover:text-accent transition">All Products</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate("/orders")} className="hover:text-accent transition">Orders</button></li>
                <li><button onClick={() => navigate("/cart")} className="hover:text-accent transition">Cart</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                support@nomas.com<br />
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 NOMAS Luxury. Crafted with precision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
