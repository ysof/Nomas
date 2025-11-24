import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Menu, X, LogOut, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function OrderConfirmation({ params }: { params: { id: string } }) {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const orderId = parseInt(params.id);
  const { data: order } = trpc.orders.getById.useQuery(orderId, {
    enabled: isAuthenticated && !!orderId,
  });
  const { data: items } = trpc.orders.getItems.useQuery(orderId, {
    enabled: isAuthenticated && !!orderId,
  });

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

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
                  <button onClick={handleLogout} className="p-2 hover:bg-secondary rounded-lg transition">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {order ? (
            <div className="max-w-2xl mx-auto">
              {/* Success Message */}
              <div className="text-center mb-12">
                <CheckCircle className="w-20 h-20 text-accent mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Order Confirmed!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Thank you for your purchase. Your order has been received.
                </p>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-lg p-8 border border-border mb-8">
                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-foreground">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                    <p className="text-2xl font-bold text-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                    <p className="text-lg font-semibold text-foreground">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit Card"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="text-lg font-semibold text-accent capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="mb-8 pb-8 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">Shipping To</h2>
                  <p className="text-foreground font-medium">{order.customerName}</p>
                  <p className="text-muted-foreground">{order.customerEmail}</p>
                  <p className="text-muted-foreground">{order.customerPhone}</p>
                  <p className="text-muted-foreground mt-2">{order.shippingAddress}</p>
                </div>

                {/* Order Items */}
                <div className="mb-8 pb-8 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-foreground font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-accent">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${(parseFloat(order.totalAmount) * 0.909).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>${(parseFloat(order.totalAmount) * 0.091).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-accent">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-secondary rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">What's Next?</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">1.</span>
                    <span>You will receive a confirmation email shortly with tracking information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">2.</span>
                    <span>Your order will be processed and shipped within 2-3 business days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">3.</span>
                    <span>Track your package using the tracking number provided in your email</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-col sm:flex-row">
                <Button
                  onClick={() => navigate("/orders")}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-lg"
                >
                  View All Orders
                </Button>
                <Button
                  onClick={() => navigate("/products")}
                  variant="outline"
                  className="flex-1 border-accent text-accent hover:bg-accent/10 py-6 text-lg"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">Loading order details...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
