"use client";
import {
  Shield,
  UserCheck,
  Truck,
  Lock,
  Award,
  HeartPulse,
} from "lucide-react";
import { motion } from "framer-motion";

const trustFeatures = [
  {
    icon: Shield,
    title: "100% Certified Medicines",
    description:
      "All products are sourced from licensed manufacturers and verified for authenticity.",
  },
  {
    icon: UserCheck,
    title: "Licensed Pharmacists",
    description:
      "Our team of certified pharmacists reviews every order for safety and accuracy.",
  },
  {
    icon: Truck,
    title: "Fast & Secure Delivery",
    description:
      "Temperature-controlled shipping ensures your medicines arrive in perfect condition.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description:
      "Bank-level encryption protects your personal and payment information.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description:
      "We stand behind every product with our satisfaction guarantee.",
  },
  {
    icon: HeartPulse,
    title: "24/7 Health Support",
    description:
      "Access to healthcare professionals whenever you need guidance.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-start mb-14"
        >
          <p className="text-sm text-[#D2A88A] font-medium uppercase tracking-wider mb-2">
            Why MediCare
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Trust & Safety First
          </h2>
          <p className="text-muted-foreground">
            Your health deserves the highest standards. Here's why thousands
            choose us.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group p-6 lg:p-8 rounded-2xl border border-gray-200 bg-accent/5 shadow-sm hover:shadow-lg hover:border-gray-100 hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-accent/10 flex items-center justify-center mb-5 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-gray-500 group-hover:text-accent transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
