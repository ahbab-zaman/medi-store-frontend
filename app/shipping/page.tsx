"use client";

import React from "react";
import {
  Truck,
  Package,
  Clock,
  Shield,
  MapPin,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function Shipping() {
  const shippingOptions = [
    {
      icon: Truck,
      name: "Standard Shipping",
      time: "5-7 Business Days",
      price: "Free on orders over $500",
      description: "Reliable delivery for non-urgent orders",
    },
    {
      icon: Zap,
      name: "Express Shipping",
      time: "2-3 Business Days",
      price: "Starting at $49.99",
      description: "Faster delivery for time-sensitive equipment",
    },
    {
      icon: Package,
      name: "Overnight Shipping",
      time: "Next Business Day",
      price: "Starting at $99.99",
      description: "Emergency delivery for critical medical supplies",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Packaging",
      description:
        "All medical equipment is packaged with industry-standard protective materials to ensure safe delivery.",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description:
        "Track your shipment from our warehouse to your door with live updates and notifications.",
    },
    {
      icon: MapPin,
      title: "Worldwide Delivery",
      description:
        "We ship to over 45 countries with specialized handling for international regulations.",
    },
    {
      icon: CheckCircle2,
      title: "Signature Required",
      description:
        "For your security, all orders require signature confirmation upon delivery.",
    },
  ];

  const regions = [
    {
      name: "United States",
      time: "3-7 business days",
      shipping: "Free over $500",
    },
    { name: "Canada", time: "5-10 business days", shipping: "Free over $750" },
    {
      name: "Europe",
      time: "7-14 business days",
      shipping: "Free over $1,000",
    },
    {
      name: "Asia-Pacific",
      time: "10-15 business days",
      shipping: "Free over $1,000",
    },
    {
      name: "Latin America",
      time: "12-18 business days",
      shipping: "Free over $1,200",
    },
    {
      name: "Middle East",
      time: "10-16 business days",
      shipping: "Free over $1,000",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      {/* Shipping Options */}
      <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {shippingOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#DED6CD] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                  {option.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-light text-[#DED6CD]">
                    {option.time}
                  </span>
                </div>
                <p className="text-sm font-medium text-emerald-600 mb-3">
                  {option.price}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-4">
            Shipping Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We ensure your medical equipment arrives safely and on time
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-[#DED6CD] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                  <Icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Policy */}
      <div className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-light text-slate-900 mb-12 text-center">
            Detailed Shipping Information
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Processing Time
              </h3>
              <div className="bg-[#F6F4F0] rounded-2xl p-6 space-y-3">
                <p className="text-slate-700 leading-relaxed">
                  Orders are typically processed within 1-2 business days after
                  payment confirmation. During peak seasons or for specialized
                  equipment, processing may take up to 3-4 business days.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  You will receive an email notification with tracking
                  information once your order has been shipped.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                International Shipping
              </h3>
              <div className="bg-[#F6F4F0] rounded-2xl p-6 space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  We partner with leading international carriers to deliver
                  medical equipment worldwide. All shipments comply with
                  international medical device regulations.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {regions.map((region, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 border border-slate-200"
                    >
                      <h4 className="font-semibold text-slate-900 mb-2">
                        {region.name}
                      </h4>
                      <p className="text-sm text-slate-600 mb-1">
                        Delivery: {region.time}
                      </p>
                      <p className="text-sm text-emerald-600 font-medium">
                        {region.shipping}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-4">
                  * Customs duties and taxes are the responsibility of the
                  recipient and are not included in the shipping cost.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Shipping Restrictions
              </h3>
              <div className="bg-[#F6F4F0] rounded-2xl p-6 space-y-3">
                <p className="text-slate-700 leading-relaxed">
                  Certain medical equipment may have shipping restrictions based
                  on local regulations. These include:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="text-slate-700">
                    • Controlled substances and prescription medications
                  </li>
                  <li className="text-slate-700">
                    • High-value diagnostic equipment requiring special permits
                  </li>
                  <li className="text-slate-700">
                    • Items restricted by international aviation safety
                    regulations
                  </li>
                  <li className="text-slate-700">
                    • Equipment requiring cold chain shipping
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-4">
                  Our team will contact you if your order contains restricted
                  items to discuss alternative shipping arrangements.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Damaged or Lost Shipments
              </h3>
              <div className="bg-[#F6F4F0] rounded-2xl p-6 space-y-3">
                <p className="text-slate-700 leading-relaxed">
                  All shipments are fully insured. If your package arrives
                  damaged or is lost in transit:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="text-slate-700">
                    • Contact our support team within 48 hours of delivery
                  </li>
                  <li className="text-slate-700">
                    • Provide photos of damaged packaging and items
                  </li>
                  <li className="text-slate-700">
                    • We'll arrange for replacement or refund within 5 business
                    days
                  </li>
                  <li className="text-slate-700">
                    • No need to return damaged items until we provide
                    instructions
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Special Handling
              </h3>
              <div className="bg-[#F6F4F0] rounded-2xl p-6 space-y-3">
                <p className="text-slate-700 leading-relaxed">
                  Fragile or sensitive medical equipment receives special
                  handling protocols including temperature-controlled shipping,
                  custom crating, and white-glove delivery service when
                  necessary.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Additional fees may apply for oversized or heavy equipment.
                  Our team will provide a detailed quote before processing your
                  order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
