"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 lg:p-16"
        >
          <div className="text-center max-w-xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ rotate: 5 }}
              className="w-16 h-16 rounded-2xl bg-[#CEA07E]/10 flex items-center justify-center mx-auto mb-6"
            >
              <Mail className="w-8 h-8 text-[#CEA07E]" />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Stay Informed About Your Health
            </h2>

            <p className="text-muted-foreground mb-8">
              Subscribe to receive health tips, exclusive offers, and updates on
              new products. No spam, just valuable healthcare insights.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-4 pr-4 rounded-xl bg-[#EEEBE8] border-0 focus-visible:ring-[#CEA07E]"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-xl gap-2 bg-black text-white hover:bg-black/80 cursor-pointer"
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Subscribed
                  </motion.span>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-[#D2C7BC] mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe
              anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
