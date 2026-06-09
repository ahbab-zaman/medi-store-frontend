"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";
import { createOrder } from "@/services/order.service";
import { getAddresses, AddressApiRecord } from "@/services/address.service";
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
  Check,
  Plus,
} from "lucide-react";

// Format Address representation helper
const formatAddressString = (addr: AddressApiRecord): string => {
  const parts = [
    `${addr.firstname} ${addr.lastname}`,
    addr.address_1,
    addr.address_2,
    addr.road ? `Road: ${addr.road}` : "",
    addr.area ? `Area: ${addr.area}` : "",
    addr.landmark ? `Near: ${addr.landmark}` : "",
    `Phone: +${addr.mobileCountryCode}${addr.mobile}`,
  ].filter(Boolean);
  return parts.join(", ");
};

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

  // Step wizard state
  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    { number: 1, label: "Address" },
    { number: 2, label: "Delivery Date" },
    { number: 3, label: "Payment" },
  ];

  // Form State
  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");

  // Address Book States
  const [addresses, setAddresses] = useState<AddressApiRecord[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isCustomAddress, setIsCustomAddress] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      setIsLoadingAddresses(true);
      try {
        const res = await getAddresses();
        if (res.success && res.data && res.data.length > 0) {
          setAddresses(res.data);
          // Auto-select default or first address
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setShippingAddress(formatAddressString(defaultAddr));
            setIsCustomAddress(false);
          } else {
            setIsCustomAddress(true);
          }
        } else {
          setIsCustomAddress(true);
        }
      } catch (error) {
        console.error("Failed to load addresses", error);
        setIsCustomAddress(true);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleSelectAddress = (addr: AddressApiRecord) => {
    setSelectedAddressId(addr.id);
    setShippingAddress(formatAddressString(addr));
    setIsCustomAddress(false);
  };

  const handleSelectCustomAddress = () => {
    setSelectedAddressId(null);
    setIsCustomAddress(true);
  };

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

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!shippingAddress.trim()) {
        toast.error("Please enter or select a shipping address");
        return false;
      }
    }
    if (step === 2) {
      if (!deliveryDate) {
        toast.error("Please select a delivery date");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (validateStep(1)) {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      if (validateStep(2)) {
        setActiveStep(3);
      }
    } else if (activeStep === 3) {
      handlePlaceOrder();
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      router.back();
    }
  };

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
    <div className="bg-[#FAF8F5] dark:bg-[#0a0a0a] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between bg-white dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 overflow-x-auto scrollbar-none ">
          {/* Left: Back Link */}
          <button
            onClick={handlePrevStep}
            className="flex items-center text-gray-500 dark:text-white/60 hover:text-teal-600 transition-colors text-sm font-semibold mr-4 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            {activeStep > 1 ? "Previous" : "Cart"}
          </button>

          {/* Steps Center */}
          <div className="flex items-center justify-center flex-1 mx-4 min-w-[300px]">
            {steps.map((step, idx) => {
              const isCompleted = activeStep > step.number;
              const isActive = activeStep === step.number;
              const isSelectable =
                step.number === 1 ||
                (step.number === 2 && shippingAddress) ||
                (step.number === 3 && shippingAddress && deliveryDate);

              return (
                <Fragment key={step.number}>
                  {/* Step item */}
                  <button
                    onClick={() => isSelectable && setActiveStep(step.number)}
                    disabled={!isSelectable}
                    className={`flex items-center gap-2 outline-none transition-all ${
                      isSelectable
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    {/* Circle */}
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                        isActive
                          ? "border-slate-650 bg-slate-50 text-gray-600 shadow-sm"
                          : isCompleted
                            ? "border-teal-600 bg-teal-600 text-white"
                            : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        step.number
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-slate-600 font-bold"
                          : isCompleted
                            ? "text-gray-700"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {/* Line separator between steps */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 max-w-[80px] mx-2 transition-all ${
                        activeStep > step.number ? "bg-teal-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Right: User Avatar */}
          {user && (
            <div className="flex items-center gap-2 shrink-0 border-l border-gray-150 pl-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm uppercase">
                {user.name ? user.name[0] : user.email[0]}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-750 hidden sm:inline">
                {user.name || user.email.split("@")[0]}
              </span>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            {activeStep === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in dark:bg-white/5 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3 dark:bg-blue-50/5">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Shipping Address
                    </h2>
                  </div>
                  {addresses.length > 0 && (
                    <Link
                      href="/account/address"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
                    >
                      Manage Addresses
                    </Link>
                  )}
                </div>

                {isLoadingAddresses ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse border border-gray-100 rounded-xl p-4 min-h-[120px] bg-gray-50 flex flex-col justify-between"
                      >
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-1/4 mt-2" />
                      </div>
                    ))}
                  </div>
                ) : addresses.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col justify-between transition-all relative ${
                              isSelected
                                ? "border-teal-600 bg-teal-50/30 shadow-sm"
                                : "border-gray-200 hover:border-teal-200 hover:bg-gray-50/50"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-3 right-3 bg-teal-600 text-white rounded-full p-0.5 shadow-sm">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {addr.firstname} {addr.lastname}
                                </span>
                                {addr.name && (
                                  <span className="text-[10px] bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full border border-gray-200">
                                    {addr.name}
                                  </span>
                                )}
                                {addr.isDefault && (
                                  <span className="text-[10px] bg-teal-100 text-teal-800 font-medium px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 text-ellipsis overflow-hidden">
                                {addr.address_1}, {addr.address_2}
                              </p>
                              {(addr.road || addr.area || addr.landmark) && (
                                <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                                  {[
                                    addr.road ? `Road: ${addr.road}` : "",
                                    addr.area ? `Area: ${addr.area}` : "",
                                    addr.landmark
                                      ? `Near: ${addr.landmark}`
                                      : "",
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              )}
                            </div>
                            <div className="mt-3 text-xs font-medium text-gray-500 border-t border-gray-100 pt-2 flex items-center justify-between">
                              <span>
                                +{addr.mobileCountryCode} {addr.mobile}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Custom Address Option */}
                      <div
                        onClick={handleSelectCustomAddress}
                        className={`cursor-pointer rounded-xl border-2 border-dashed p-4 flex flex-col justify-center items-center transition-all min-h-[120px] relative ${
                          isCustomAddress
                            ? "border-teal-600 bg-teal-50/30 shadow-sm"
                            : "border-gray-300 hover:border-teal-300 hover:bg-gray-50/50"
                        }`}
                      >
                        {isCustomAddress && (
                          <div className="absolute top-3 right-3 bg-teal-600 text-white rounded-full p-0.5 shadow-sm">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <Plus
                          className={`w-6 h-6 mb-1.5 ${isCustomAddress ? "text-teal-600" : "text-gray-400"}`}
                        />
                        <span className="font-semibold text-sm text-gray-800">
                          Custom Address
                        </span>
                        <span className="text-xs text-gray-400 text-center mt-0.5">
                          Enter a different delivery address
                        </span>
                      </div>
                    </div>

                    {/* Textarea for manual updates / custom address */}
                    {(isCustomAddress || !shippingAddress) && (
                      <div className="mt-4">
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                          Enter Custom Delivery Address
                        </label>
                        <textarea
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Enter your full delivery address"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-sm"
                          rows={3}
                        />
                      </div>
                    )}

                    {!isCustomAddress && shippingAddress && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-white/5 dark:border-white/10 rounded-xl border border-gray-100 flex items-start gap-2.5">
                        <div className="mt-0.5">
                          <Check className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <span className="text-xs dark:text-white font-semibold text-gray-500 dark:text-white uppercase tracking-wider block mb-0.5">
                            Selected Shipping Destination
                          </span>
                          <p className="text-xs text-gray-700 dark:text-white/60 leading-relaxed">
                            {shippingAddress}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Enter your full delivery address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 dark:text-white/60" >
                      You can save your addresses in the{" "}
                      <Link
                        href="/account/address"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 underline font-medium"
                      >
                        Address Book
                      </Link>{" "}
                      for faster checkout.
                    </p>
                  </div>
                )}

                {/* Local Nav Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer text-sm"
                  >
                    Continue to Delivery Date
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Date */}
            {activeStep === 2 && (
              <div className="bg-white dark:bg-white/5 dark:border-white/10 rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg mr-3 dark:bg-indigo-50/5">
                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delivery Date
                  </h2>
                </div>

                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-sm cursor-pointer"
                  min={new Date().toISOString().split("T")[0]}
                />

                {/* Local Nav Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border border-gray-200 text-gray-750 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-sm"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-teal-600 text-white dark:text-white font-semibold rounded-xl hover:bg-teal-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer text-sm"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {activeStep === 3 && (
              <div className="bg-white dark:bg-white/5 dark:border-white/10 rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-50 rounded-lg mr-3 dark:bg-green-50/5">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Payment Method
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex items-center transition-all ${
                      paymentMethod === "COD"
                        ? "border-teal-600 bg-teal-50/40"
                        : "border-gray-200 hover:border-teal-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        paymentMethod === "COD"
                          ? "border-teal-600"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "COD" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      )}
                    </div>
                    <Banknote className="w-6 h-6 text-gray-650 mr-3" />
                    <span className="font-semibold text-gray-800 dark:text-white/60 text-sm">
                      Cash On Delivery
                    </span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("CARD")}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex items-center transition-all ${
                      paymentMethod === "CARD"
                        ? "border-teal-600 bg-teal-50/40"
                        : "border-gray-200 hover:border-teal-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        paymentMethod === "CARD"
                          ? "border-teal-600"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "CARD" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      )}
                    </div>
                    <CreditCard className="w-6 h-6 text-gray-650 dark:text-white/60 mr-3" />
                    <span className="font-semibold text-gray-800 dark:text-white/60 text-sm">
                      Credit / Debit Card
                    </span>
                  </div>
                </div>

                {/* Local Nav Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border border-gray-200 text-gray-750 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-sm"
                  >
                    Back to Date
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm disabled:opacity-50 cursor-pointer text-sm"
                  >
                    {isLoading
                      ? "Processing..."
                      : paymentMethod === "CARD"
                        ? "Pay Now"
                        : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white/5 dark:border-white/10 rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.medicine.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">
                      ${(item.medicine.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-6 border-gray-100" />

              <div className="space-y-2">
                <div className="flex justify-between text-gray-650 dark:text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-650 dark:text-white/60 text-sm">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white mt-4 pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Selections Preview (Summary of previous steps) */}
              {(shippingAddress || deliveryDate) && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  {shippingAddress && (
                    <div className="p-3 bg-gray-50 dark:bg-white/5 dark:border-white/10 rounded-xl border border-gray-150 relative">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-white/60 uppercase tracking-wider">
                          Address
                        </span>
                        <button
                          onClick={() => setActiveStep(1)}
                          className="text-[10px] font-semibold text-teal-600 hover:underline"
                        >
                          Change
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1 leading-relaxed">
                        {shippingAddress}
                      </p>
                    </div>
                  )}

                  {deliveryDate && (
                    <div className="p-3 bg-gray-50 dark:bg-white/5 dark:border-white/10 rounded-xl border border-gray-150 relative">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-white/60 uppercase tracking-wider">
                          Delivery Date
                        </span>
                        <button
                          onClick={() => setActiveStep(2)}
                          className="text-[10px] font-semibold text-teal-600 hover:underline"
                        >
                          Change
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {new Date(deliveryDate).toLocaleDateString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleNextStep}
                disabled={isLoading}
                className="w-full mt-8 bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {isLoading
                  ? "Processing..."
                  : activeStep === 1
                    ? "Continue to Delivery"
                    : activeStep === 2
                      ? "Continue to Payment"
                      : paymentMethod === "CARD"
                        ? "Pay Now"
                        : "Place Order"}
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
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (error) {
        setError(error.message || "Payment failed");
        setProcessing(false);
      } else {
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
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[20px] bg-white dark:bg-white/5 dark:border-white/10 shadow-2xl transition-all border border-gray-100">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-teal-700 via-teal-500 to-teal-300" />

                {/* Header */}
                <div className="px-7 pt-7">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-[18px] h-[18px] text-teal-700" />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-gray-900 leading-none mb-0.5">
                          Secure payment
                        </p>
                        <p className="text-[11px] text-gray-400">
                          256-bit SSL encryption
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
                      <svg
                        className="w-3 h-3 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Stripe
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount block */}
                <div className="mx-7 mt-5 bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                      Amount due
                    </p>
                    <p className="text-[30px] font-bold text-gray-900 leading-none tracking-tight">
                      ৳{amount.toFixed(2)}
                    </p>
                  </div>
                  {/* Card brand mini-logos */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-8 h-5 bg-[#1a1f71] rounded-[3px] flex items-center justify-center">
                        <span className="text-[7px] text-white font-bold tracking-tight">
                          VISA
                        </span>
                      </div>
                      <div className="w-8 h-5 bg-white dark:bg-white/5 dark:border-white/10 border border-gray-200 rounded-[3px] flex items-center justify-center">
                        <div className="flex">
                          <div className="w-3 h-3 rounded-full bg-red-500 opacity-90" />
                          <div className="w-3 h-3 rounded-full bg-amber-400 opacity-90 -ml-1.5" />
                        </div>
                      </div>
                      <div className="w-8 h-5 bg-[#006FCF] rounded-[3px] flex items-center justify-center">
                        <span className="text-[7px] text-white font-bold">
                          AMEX
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      All cards accepted
                    </span>
                  </div>
                </div>

                {/* Card form */}
                <form onSubmit={handleSubmit}>
                  <div className="px-7 mt-5">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                      Card details
                    </p>
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white  px-4 py-3.5">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "15px",
                              color: "#111827",
                              fontFamily:
                                "ui-sans-serif, system-ui, sans-serif",
                              "::placeholder": { color: "#9ca3af" },
                              iconColor: "#6b7280",
                            },
                            invalid: {
                              color: "#dc2626",
                              iconColor: "#dc2626",
                            },
                          },
                        }}
                      />
                    </div>

                    {error && (
                      <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                        <svg
                          className="w-4 h-4 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p className="text-xs font-medium">{error}</p>
                      </div>
                    )}

                    <p className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2.5">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Your card details are encrypted and never stored.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="px-7 pt-5 pb-7 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      disabled={!stripe || processing}
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 text-[15px] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-teal-700/20 cursor-pointer"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          Pay ৳{amount.toFixed(2)} securely
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={processing}
                      className="w-full bg-transparent border border-gray-200 text-gray-500 font-medium py-3.5 rounded-xl text-sm hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
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
