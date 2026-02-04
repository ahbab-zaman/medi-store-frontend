"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";
import { createOrder } from "@/services/order.service";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  OrderSuccessModal,
  OrderFailureModal,
} from "@/components/order/OrderModals";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Calendar as CalendarIcon,
  MapPin,
  Loader2,
} from "lucide-react";

// Stripe setup
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const {
    items,
    totalAmount,
    clearCart: clearCartHook,
    isEmpty,
    isLoading: isCartLoading,
  } = useCart();
  const { user } = useAuthStore();

  // Form State
  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");

  // Modal State
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [failureMessage, setFailureMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600 mb-4" />
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (isEmpty && !isSuccessModalOpen) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push("/medicine")}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Browse Medicines
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Please enter a shipping address");
      return;
    }
    if (!deliveryDate) {
      toast.error("Please select a delivery date");
      return;
    }

    if (paymentMethod === "CARD") {
      setIsStripeModalOpen(true);
      return;
    }

    // COD Flow
    await submitOrder("COD");
  };

  const submitOrder = async (
    method: "COD" | "CARD",
    transactionId?: string,
  ) => {
    setIsLoading(true);
    try {
      const payloadItems = items.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
      }));

      const result = await createOrder({
        shippingAddress,
        items: payloadItems,
        paymentMethod: method,
        transactionId,
      });

      if (result.success && result.data) {
        setCreatedOrderId(result.data.id);
        setIsSuccessModalOpen(true);
        // Clear cart in background
        clearCartHook();
      } else {
        throw new Error(result.message || "Order failed");
      }
    } catch (error: any) {
      console.error("Order Error:", error);
      setFailureMessage(
        error.response?.data?.message || "Failed to place order",
      );
      setIsFailureModalOpen(true);
    } finally {
      setIsLoading(false);
      setIsStripeModalOpen(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-teal-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your full delivery address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                rows={3}
              />
            </div>

            {/* Delivery Date */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                  <CalendarIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold">Delivery Date</h2>
              </div>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-50 rounded-lg mr-3">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`cursor-pointer rounded-xl border-2 p-4 flex items-center transition-all ${paymentMethod === "COD" ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-teal-200"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === "COD" ? "border-teal-600" : "border-gray-400"}`}
                  >
                    {paymentMethod === "COD" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    )}
                  </div>
                  <Banknote className="w-6 h-6 text-gray-600 mr-3" />
                  <span className="font-medium">Cash On Delivery</span>
                </div>

                <div
                  onClick={() => setPaymentMethod("CARD")}
                  className={`cursor-pointer rounded-xl border-2 p-4 flex items-center transition-all ${paymentMethod === "CARD" ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-teal-200"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === "CARD" ? "border-teal-600" : "border-gray-400"}`}
                  >
                    {paymentMethod === "CARD" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    )}
                  </div>
                  <CreditCard className="w-6 h-6 text-gray-600 mr-3" />
                  <span className="font-medium">Credit / Debit Card</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.medicine.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.medicine.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-6 border-gray-100" />

              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full mt-8 bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/account/orders");
        }}
        orderId={createdOrderId}
      />

      <OrderFailureModal
        isOpen={isFailureModalOpen}
        onClose={() => setIsFailureModalOpen(false)}
        message={failureMessage}
      />

      <StripePaymentModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        onSubmit={(token) => submitOrder("CARD", token)}
        amount={totalAmount}
      />
    </div>
  );
}

function StripePaymentModal({
  isOpen,
  onClose,
  onSubmit,
  amount,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string) => void;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // In a real flow, you would verify intent on backend and confirm here.
    // For this assignment, we might default to creating a token or using a simplified mock if backend isn't full Stripe connected.
    // Use createPaymentMethod for a more robust flow

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message || "Payment failed");
        setProcessing(false);
      } else {
        // Return payment method ID to be sent to backend
        onSubmit(paymentMethod.id);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setProcessing(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Pay with Card
                </Dialog.Title>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Total Amount:{" "}
                      <span className="font-bold text-gray-900">
                        ${amount.toFixed(2)}
                      </span>
                    </p>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#424770",
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                            },
                            invalid: {
                              color: "#9e2146",
                            },
                          },
                        }}
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={onClose}
                      disabled={processing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none disabled:opacity-50"
                      disabled={!stripe || processing}
                    >
                      {processing ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
