import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Order } from "@/types";
import { format } from "date-fns";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailModal({
  isOpen,
  onClose,
  order,
}: OrderDetailModalProps) {
  if (!order) return null;

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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-805 pb-4 mb-4 flex justify-between items-center"
                >
                  <span>Order Details</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    #{order.id.slice(0, 8)}
                  </span>
                </Dialog.Title>

                <div className="space-y-6">
                  {/* Status & Date */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-900 dark:text-gray-100">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Order Date</p>
                      <p className="font-medium">
                        {format(
                          new Date(order.createdAt),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                  ${
                                    order.status === "DELIVERED"
                                      ? "bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400"
                                      : order.status === "CANCELLED"
                                        ? "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400"
                                        : "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400"
                                  }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
                      <p className="font-medium">
                        {order.paymentMethod} ({order.paymentStatus})
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Shipping Address</p>
                      <p className="font-medium">{order.shippingAddress}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Items</h4>
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-850">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Product
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Qty
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Price
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {order.orderItems?.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                                {item.medicine?.name}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">
                                ${item.price}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">
                                ${item.price * item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-850">
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-2 text-right text-sm font-bold text-gray-900 dark:text-gray-100"
                            >
                              Total
                            </td>
                            <td className="px-4 py-2 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                              ${order.totalAmount}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:outline-none cursor-pointer"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
