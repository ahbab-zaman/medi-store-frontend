// Re-export all hooks from a single entry point
export { useAuth } from "./useAuth";
export {
  useMedicines,
  useMedicine,
  useSearchMedicines,
  useCreateMedicine,
  useUpdateMedicine,
  useDeleteMedicine,
} from "./useMedicines";
export {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./useCategories";
export { useCart } from "./useCart";
export {
  useOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrderStatus,
  useCancelOrder,
} from "./useOrders";
export {
  useMedicineReviews,
  useCreateReview,
  useAdminReviews,
  useUpdateReviewStatus,
  useDeleteReview,
} from "./useReviews";
export { useUsers, useUpdateUserBanStatus, useDeleteUser } from "./useUsers";

// Admin hooks
export {
  useAdminUsers,
  useUpdateUserBanStatus as useAdminUpdateUserBanStatus,
  useUpdateUserRole as useAdminUpdateUserRole,
  useDeleteUser as useAdminDeleteUser,
} from "./useAdminUsers";

export {
  useAdminOrders,
  useUpdateOrderStatus as useAdminUpdateOrderStatus,
  useDeleteOrder as useAdminDeleteOrder,
} from "./useAdminOrders";

export {
  useAdminCategories,
  useCreateCategory as useAdminCreateCategory,
  useUpdateCategory as useAdminUpdateCategory,
  useDeleteCategory as useAdminDeleteCategory,
} from "./useAdminCategories";

export { useAdminMedicines, useDeleteAdminMedicine } from "./useAdminMedicines";
