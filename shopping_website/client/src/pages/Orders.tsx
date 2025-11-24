import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Menu, X, LogOut, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function Orders() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: orders } = trpc.orders.getMyOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please log in to view your orders</h1>
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
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your orders
            </p>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg p-6 border border-border hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/order-confirmation/${order.id}`)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                      <p className="text-lg font-bold text-foreground">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                      <p className="text-lg font-semibold text-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <p className={`text-lg font-semibold capitalize ${
                        order.status === "delivered" ? "text-green-600" :
                        order.status === "shipped" ? "text-blue-600" :
                        order.status === "cancelled" ? "text-red-600" :
                        "text-yellow-600"
                      }`}>
                        {order.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total</p>
                      <p className="text-lg font-bold text-accent">
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping To</p>
                      <p className="text-foreground font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <p className="text-foreground font-medium">
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit Card"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-8">
                Start shopping to place your first order
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
