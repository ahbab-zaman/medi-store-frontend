"use client";

import React from "react";
import { Heart, Shield, Zap, Users, Award, Globe } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered",
      description:
        "Every decision we make prioritizes the wellbeing and care of patients worldwide.",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description:
        "All our medical equipment meets the highest international standards and certifications.",
    },
    {
      icon: Zap,
      title: "Innovation Driven",
      description:
        "We partner with leading manufacturers to bring cutting-edge medical technology to you.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description:
        "Our team of medical equipment specialists provides dedicated guidance and support.",
    },
  ];

  const stats = [
    { value: "15+", label: "Years of Excellence" },
    { value: "50K+", label: "Products Delivered" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "24/7", label: "Support Available" },
  ];

  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Medical Officer",
      image: "SM",
    },
    {
      name: "James Rodriguez",
      role: "Head of Operations",
      image: "JR",
    },
    {
      name: "Emily Chen",
      role: "Director of Quality",
      image: "EC",
    },
    {
      name: "Michael Kumar",
      role: "Customer Relations",
      image: "MK",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4F0]">

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-6">
              Our Mission
            </h2>
            <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
              <p>
                At MedEquip, we believe that access to quality medical equipment
                shouldn't be a privilege—it should be a standard. Since our
                founding in 2009, we've been committed to bridging the gap
                between advanced medical technology and those who need it most.
              </p>
              <p>
                Our team works tirelessly to source, verify, and deliver medical
                equipment that meets the highest standards of quality and
                safety. From small clinics to large hospitals, from home
                healthcare to professional practices, we serve everyone with the
                same dedication and care.
              </p>
              <p>
                We're more than just a supplier—we're your partner in healthcare
                excellence, providing not just equipment, but expertise,
                support, and a commitment to your success.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl shadow-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <Globe className="w-24 h-24 text-emerald-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                    Global Reach
                  </h3>
                  <p className="text-slate-700">
                    Serving healthcare providers in over 45 countries worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F6F4F0] rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 sm:p-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-light mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare providers who trust us for their
            medical equipment needs.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}
