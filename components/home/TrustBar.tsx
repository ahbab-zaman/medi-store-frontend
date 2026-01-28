import { Truck, ShieldCheck, Clock, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Secure Delivery",
    desc: "Safe and fast shipping",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Meds",
    desc: "100% verified products",
  },
  {
    icon: Clock,
    title: "Quick Support",
    desc: "24/7 online assistance",
  },
  {
    icon: Headphones,
    title: "Expert Advice",
    desc: "Professional guidance",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-black py-4 dark:bg-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <feature.icon className="text-blue-500" size={24} />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-[10px] text-white/50">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
