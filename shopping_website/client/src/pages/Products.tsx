import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export default function Products() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data: products } = trpc.products.list.useQuery({ category: selectedCategory });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-accent cursor-pointer" onClick={() => navigate("/")}>
            NOMAS
          </div>

          <nav className="hidden md:flex gap-8">
            <button onClick={() => navigate("/")} className="text-foreground hover:text-accent transition">
              Home
            </button>
            <button onClick={() => { setSelectedCategory("men"); }} className="text-foreground hover:text-accent transition">
              Men
            </button>
            <button onClick={() => { setSelectedCategory("women"); }} className="text-foreground hover:text-accent transition">
              Women
            </button>
            <button onClick={() => { setSelectedCategory(undefined); }} className="text-foreground hover:text-accent transition">
              All Products
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/cart")} className="p-2 hover:bg-secondary rounded-lg transition">
              <ShoppingCart className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
                <button onClick={handleLogout} className="p-2 hover:bg-secondary rounded-lg transition">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = "https://api.manus.im/oauth/authorize"}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Login
              </Button>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <button onClick={() => { navigate("/"); setMobileMenuOpen(false); }} className="text-left text-foreground hover:text-accent transition">
                Home
              </button>
              <button onClick={() => { setSelectedCategory("men"); setMobileMenuOpen(false); }} className="text-left text-foreground hover:text-accent transition">
                Men
              </button>
              <button onClick={() => { setSelectedCategory("women"); setMobileMenuOpen(false); }} className="text-left text-foreground hover:text-accent transition">
                Women
              </button>
              <button onClick={() => { setSelectedCategory(undefined); setMobileMenuOpen(false); }} className="text-left text-foreground hover:text-accent transition">
                All Products
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}'s Collection` : "All Products"}
            </h1>
            <p className="text-muted-foreground">
              Explore our curated selection of luxury items
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-4 mb-12 flex-wrap">
            <Button
              onClick={() => setSelectedCategory(undefined)}
              variant={selectedCategory === undefined ? "default" : "outline"}
              className={selectedCategory === undefined ? "bg-accent text-accent-foreground" : ""}
            >
              All Products
            </Button>
            <Button
              onClick={() => setSelectedCategory("men")}
              variant={selectedCategory === "men" ? "default" : "outline"}
              className={selectedCategory === "men" ? "bg-accent text-accent-foreground" : ""}
            >
              Men
            </Button>
            <Button
              onClick={() => setSelectedCategory("women")}
              variant={selectedCategory === "women" ? "default" : "outline"}
              className={selectedCategory === "women" ? "bg-accent text-accent-foreground" : ""}
            >
              Women
            </Button>
            <Button
              onClick={() => setSelectedCategory("accessories")}
              variant={selectedCategory === "accessories" ? "default" : "outline"}
              className={selectedCategory === "accessories" ? "bg-accent text-accent-foreground" : ""}
            >
              Accessories
            </Button>
          </div>

          {/* Products Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative h-80 bg-secondary rounded-lg overflow-hidden mb-4">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-6xl">
                        📦
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground mb-4">
                No products found in this category
              </p>
              <Button
                onClick={() => setSelectedCategory(undefined)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
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
                <li><button onClick={() => setSelectedCategory("men")} className="hover:text-accent transition">Men</button></li>
                <li><button onClick={() => setSelectedCategory("women")} className="hover:text-accent transition">Women</button></li>
                <li><button onClick={() => setSelectedCategory(undefined)} className="hover:text-accent transition">All Products</button></li>
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
