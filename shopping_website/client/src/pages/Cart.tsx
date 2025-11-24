import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Menu, X, LogOut, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: cartItems, refetch } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const removeItemMutation = trpc.cart.removeItem.useMutation();
  const updateItemMutation = trpc.cart.updateItem.useMutation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleRemove = async (id: number) => {
    await removeItemMutation.mutateAsync(id);
    refetch();
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity > 0) {
      await updateItemMutation.mutateAsync({ id, quantity });
      refetch();
    }
  };

  const total = cartItems?.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || "0");
    return sum + price * item.quantity;
  }, 0) || 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please log in to view your cart</h1>
          <Button
            onClick={() => window.location.href = "https://api.manus.im/oauth/authorize"}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

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
            <button onClick={() => navigate("/products")} className="text-foreground hover:text-accent transition">
              Products
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/cart")} className="p-2 hover:bg-secondary rounded-lg transition">
              <ShoppingCart className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
              <button onClick={handleLogout} className="p-2 hover:bg-secondary rounded-lg transition">
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-12">Shopping Cart</h1>

          {cartItems && cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-6 border border-border flex gap-6">
                      <div className="w-24 h-24 bg-secondary rounded-lg flex-shrink-0">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            📦
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.product?.name}
                        </h3>
                        <p className="text-accent font-bold text-lg mt-2">
                          ${parseFloat(item.product?.price || "0").toFixed(2)}
                        </p>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-secondary transition"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 border-l border-r border-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-secondary transition"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">Subtotal</p>
                        <p className="text-xl font-bold text-accent">
                          ${(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-secondary rounded-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>${(total * 0.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-accent">
                      ${(total * 1.1).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    onClick={() => navigate("/products")}
                    variant="outline"
                    className="w-full mt-4 border-accent text-accent hover:bg-accent/10"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Start shopping to add items to your cart
              </p>
              <Button
                onClick={() => navigate("/products")}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
