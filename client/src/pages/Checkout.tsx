import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [loading, setLoading] = useState(false);

  const { data: cartItems } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const createOrderMutation = trpc.orders.create.useMutation();

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: "",
    shippingAddress: "",
  });

  const total = cartItems?.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || "0");
    return sum + price * item.quantity;
  }, 0) || 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const items = cartItems?.map((item) => ({
        productId: item.productId,
        productName: item.product?.name || "",
        quantity: item.quantity,
        price: item.product?.price || "0",
      })) || [];

      const order = await createOrderMutation.mutateAsync({
        totalAmount: (total * 1.1).toFixed(2),
        paymentMethod,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        items,
      });

      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      alert("Error creating order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please log in to checkout</h1>
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

          <div className="flex items-center gap-4">
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
          <h1 className="text-4xl font-bold text-foreground mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg p-6 border border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, customerEmail: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, customerPhone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Shipping Address
                      </label>
                      <textarea
                        value={formData.shippingAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, shippingAddress: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg p-6 border border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Payment Method</h2>

                  <div className="space-y-4">
                    {/* Cash on Delivery */}
                    <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition" style={{ borderColor: paymentMethod === "cod" ? "var(--accent)" : undefined }}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value as "cod" | "card")}
                        className="w-4 h-4"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when your order arrives
                        </p>
                      </div>
                    </label>

                    {/* Card Payment */}
                    <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition" style={{ borderColor: paymentMethod === "card" ? "var(--accent)" : undefined }}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value as "cod" | "card")}
                        className="w-4 h-4"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-foreground">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">
                          Secure payment with your card
                        </p>
                      </div>
                    </label>

                    {/* Card Details (shown when card is selected) */}
                    {paymentMethod === "card" && (
                      <div className="mt-6 p-4 bg-secondary rounded-lg space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          This is a demo form. In production, use a secure payment gateway like Stripe.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-lg"
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-96 overflow-y-auto">
                  {cartItems?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product?.name} x {item.quantity}
                      </span>
                      <span className="text-foreground font-medium">
                        ${(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

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
                    <span>Tax (10%)</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-accent">
                    ${(total * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
