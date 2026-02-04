"use client";

import React from "react";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  AlertCircle,
  DollarSign,
  Package,
} from "lucide-react";

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: "01",
      title: "Initiate Return",
      description:
        "Contact our support team within 30 days of delivery to start the return process.",
    },
    {
      step: "02",
      title: "Receive Authorization",
      description:
        "Get your Return Authorization (RA) number and return shipping label via email.",
    },
    {
      step: "03",
      title: "Package Item",
      description:
        "Securely pack the item in its original packaging with all accessories included.",
    },
    {
      step: "04",
      title: "Ship Back",
      description:
        "Use our prepaid label or arrange return shipping to our facility.",
    },
    {
      step: "05",
      title: "Inspection",
      description:
        "Our team inspects the returned item within 3-5 business days.",
    },
    {
      step: "06",
      title: "Get Refund",
      description:
        "Receive your refund to the original payment method within 7-10 business days.",
    },
  ];

  const eligibilityCriteria = [
    {
      icon: CheckCircle,
      title: "Eligible for Return",
      items: [
        "Unused items in original packaging",
        "Defective or damaged products",
        "Items received in error",
        "Products that dont match description",
      ],
      color: "emerald",
    },
    {
      icon: XCircle,
      title: "Not Eligible for Return",
      items: [
        "Opened sterile medical supplies",
        "Custom or personalized equipment",
        "Items used or installed",
        "Clearance or final sale items",
      ],
      color: "red",
    },
  ];

  const refundOptions = [
    {
      icon: DollarSign,
      title: "Original Payment Method",
      time: "7-10 business days",
      description: "Refund processed to your original payment card or account",
    },
    {
      icon: Package,
      title: "Store Credit",
      time: "Immediate",
      description: "Receive 110% value as store credit for future purchases",
    },
    {
      icon: RotateCcw,
      title: "Exchange",
      time: "3-5 business days",
      description: "Swap for a different product of equal or greater value",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      {/* Quick Overview */}
      <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-light text-black mb-2">30 Days</div>
              <div className="text-sm text-slate-600 font-medium">
                Return Window
              </div>
            </div>
            <div>
              <div className="text-5xl font-light text-black mb-2">Free</div>
              <div className="text-sm text-slate-600 font-medium">
                Return Shipping*
              </div>
            </div>
            <div>
              <div className="text-5xl font-light text-black mb-2">100%</div>
              <div className="text-sm text-slate-600 font-medium">
                Money Back
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center mt-6">
            * Free return shipping on defective items and order errors
          </p>
        </div>
      </div>

      {/* Return Process */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-4">
            How Returns Work
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Follow these simple steps to return your medical equipment
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {returnSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF9F5] rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-6xl font-light text-black mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-4">
              Return Eligibility
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Understand what can and cannot be returned
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {eligibilityCriteria.map((criteria, index) => {
              const Icon = criteria.icon;
              const bgColor =
                criteria.color === "emerald" ? "bg-emerald-50" : "bg-red-50";
              const borderColor =
                criteria.color === "emerald"
                  ? "border-emerald-200"
                  : "border-red-200";
              const iconColor =
                criteria.color === "emerald"
                  ? "text-emerald-600"
                  : "text-red-600";
              const textColor =
                criteria.color === "emerald"
                  ? "text-emerald-900"
                  : "text-red-900";

              return (
                <div
                  key={index}
                  className={`${bgColor} ${borderColor} border-2 rounded-2xl p-8`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <Icon className={`w-8 h-8 ${iconColor} flex-shrink-0`} />
                    <h3 className={`text-2xl font-semibold ${textColor}`}>
                      {criteria.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {criteria.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${iconColor} mt-2 flex-shrink-0`}
                        ></div>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Refund Options */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-4">
            Refund Options
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the refund method that works best for you
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {refundOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-black"
              >
                <div className="w-14 h-14 bg-[#DED6CD] rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {option.title}
                </h3>
                <div className="inline-block px-3 py-1 bg-[#DED6CD] text-black rounded-full text-sm font-medium mb-4">
                  {option.time}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {option.description}
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
            Complete Return Policy
          </h2>

          <div className="space-y-8">
            <div className="bg-[#F6F4F0] rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <Clock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Return Timeframe
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    You have 30 days from the date of delivery to initiate a
                    return. For defective products, we extend this to 90 days
                    from the date of purchase.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    The return must be postmarked within the eligible return
                    period. Late returns may be rejected or subject to a
                    restocking fee.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F6F4F0] rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <Package className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Condition Requirements
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Items must be returned in their original condition, unused,
                    and in the original packaging with all accessories, manuals,
                    and documentation included.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Medical equipment must maintain its sterile packaging
                    integrity. Opened sterile items cannot be accepted for
                    safety and regulatory compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F6F4F0] rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <DollarSign className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Restocking Fees
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Returns due to customer preference may be subject to a 15%
                    restocking fee. Defective items, shipping errors, and
                    warranty returns are exempt from restocking fees.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Large equipment (over 50 lbs) may incur additional handling
                    fees. Our team will inform you of any applicable fees before
                    processing your return.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F6F4F0] rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Warranty Returns
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    All medical equipment comes with manufacturer warranties
                    ranging from 1-5 years. Warranty claims are handled directly
                    through the manufacturer or through our warranty service
                    center.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    To file a warranty claim, contact our support team with your
                    order number and description of the issue. We'll guide you
                    through the warranty process.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-amber-900 mb-3">
                    Important Notes
                  </h3>
                  <ul className="space-y-2 text-amber-800">
                    <li>
                      • Custom orders and special-order items are final sale
                    </li>
                    <li>• International returns may take longer to process</li>
                    <li>
                      • Original shipping costs are non-refundable unless the
                      return is due to our error
                    </li>
                    <li>
                      • Perishable items and hazardous materials cannot be
                      returned
                    </li>
                    <li>
                      • All returns must include the original invoice or packing
                      slip
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
