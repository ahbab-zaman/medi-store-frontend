import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  CheckCircle,
  XCircle,
  ShoppingBag,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

export function OrderSuccessModal({
  isOpen,
  onClose,
  orderId,
}: SuccessModalProps) {
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-0 text-left align-middle shadow-2xl transition-all border border-gray-100">
                {/* Success Header Background */}
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 flex justify-center items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />

                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="bg-white rounded-full p-4 shadow-xl z-10"
                  >
                    <CheckCircle className="h-16 w-16 text-emerald-500" />
                  </motion.div>
                </div>

                <div className="p-8 pb-10">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900 text-center mb-2"
                  >
                    Order Successful!
                  </Dialog.Title>
                  <p className="text-center text-gray-500 mb-6">
                    Thank you for your purchase. We've received your order and
                    will begin processing it right away.
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100 flex flex-col items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Order ID
                    </span>
                    <span className="text-lg font-mono font-bold text-gray-800 tracking-wide">
                      #{orderId ? orderId.slice(0, 8).toUpperCase() : "PENDING"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      href="/account/orders"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      View My Orders
                    </Link>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      onClick={onClose}
                    >
                      Continue Shopping
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function OrderFailureModal({
  isOpen,
  onClose,
  message,
}: FailureModalProps) {
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-0 text-left align-middle shadow-2xl transition-all border border-gray-100">
                {/* Failure Header Background */}
                <div className="bg-gradient-to-br from-red-500 to-pink-600 p-8 flex justify-center items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="bg-white rounded-full p-4 shadow-xl z-10"
                  >
                    <XCircle className="h-16 w-16 text-red-500" />
                  </motion.div>
                </div>

                <div className="p-8 pb-10">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900 text-center mb-2"
                  >
                    Payment Failed
                  </Dialog.Title>
                  <p className="text-center text-gray-500 mb-6">
                    {message ||
                      "We couldn't process your payment. Please check your details and try again."}
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      onClick={onClose}
                    >
                      <RefreshCcw className="w-5 h-5" />
                      Try Again
                    </button>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      onClick={onClose} // Or link to support
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
