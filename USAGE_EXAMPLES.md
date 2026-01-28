# Frontend Architecture - Usage Examples

This document provides practical examples of how to use the new frontend architecture.

## Table of Contents

1. [Authentication](#authentication)
2. [Medicine Management](#medicine-management)
3. [Shopping Cart](#shopping-cart)
4. [Orders](#orders)
5. [Reviews](#reviews)
6. [Notifications](#notifications)

---

## Authentication

### Login Form

```tsx
"use client";

import { useAuth } from "@/hooks";
import { useState } from "react";

export default function LoginPage() {
  const { login, isLoading, loginError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {loginError && <p className="error">{loginError.message}</p>}
    </form>
  );
}
```

### Protected Component

```tsx
"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Medicine Management

### Medicine List with Filters

```tsx
"use client";

import { useMedicines } from "@/hooks";
import { useState } from "react";

export default function MedicineList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    categoryId: "",
  });

  const { data, isLoading, error } = useMedicines(filters);

  if (isLoading) return <div>Loading medicines...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search medicines..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <div className="medicine-grid">
        {data?.data.map((medicine) => (
          <div key={medicine.id} className="medicine-card">
            <img
              src={medicine.imageUrl || "/placeholder.png"}
              alt={medicine.name}
            />
            <h3>{medicine.name}</h3>
            <p>{medicine.description}</p>
            <p className="price">${medicine.price}</p>
            <p className="stock">Stock: {medicine.stock}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.meta && (
        <div className="pagination">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Previous
          </button>
          <span>
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === data.meta.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

### Create Medicine Form (Seller)

```tsx
"use client";

import { useCreateMedicine } from "@/hooks";
import { useState } from "react";

export default function CreateMedicineForm() {
  const { mutate: createMedicine, isPending } = useCreateMedicine();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    manufacturer: "",
    categoryId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMedicine(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Medicine Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) =>
          setFormData({ ...formData, price: Number(e.target.value) })
        }
      />
      <input
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={(e) =>
          setFormData({ ...formData, stock: Number(e.target.value) })
        }
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Medicine"}
      </button>
    </form>
  );
}
```

---

## Shopping Cart

### Add to Cart Button

```tsx
"use client";

import { useCart } from "@/hooks";
import { Medicine } from "@/types";

export function AddToCartButton({ medicine }: { medicine: Medicine }) {
  const { addToCart, isInCart, getCartItem } = useCart();
  const cartItem = getCartItem(medicine.id);

  return (
    <button onClick={() => addToCart(medicine, 1)}>
      {isInCart(medicine.id)
        ? `In Cart (${cartItem?.quantity})`
        : "Add to Cart"}
    </button>
  );
}
```

### Cart Page

```tsx
"use client";

import { useCart } from "@/hooks";

export default function CartPage() {
  const {
    items,
    totalAmount,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    isEmpty,
  } = useCart();

  if (isEmpty) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div>
      <h1>Shopping Cart</h1>

      {items.map((item) => (
        <div key={item.medicineId} className="cart-item">
          <img
            src={item.medicine.imageUrl || "/placeholder.png"}
            alt={item.medicine.name}
          />
          <div>
            <h3>{item.medicine.name}</h3>
            <p>${item.medicine.price} each</p>
          </div>

          <div className="quantity-controls">
            <button
              onClick={() =>
                updateItemQuantity(item.medicineId, item.quantity - 1)
              }
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() =>
                updateItemQuantity(item.medicineId, item.quantity + 1)
              }
            >
              +
            </button>
          </div>

          <p className="subtotal">${item.medicine.price * item.quantity}</p>

          <button onClick={() => removeFromCart(item.medicineId)}>
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <h2>Total: ${totalAmount.toFixed(2)}</h2>
        <button onClick={clearCart}>Clear Cart</button>
        <button>Proceed to Checkout</button>
      </div>
    </div>
  );
}
```

---

## Orders

### Checkout Page

```tsx
"use client";

import { useCreateOrder, useCart } from "@/hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [shippingAddress, setShippingAddress] = useState("");

  const handleCheckout = () => {
    createOrder(
      {
        shippingAddress,
        items: items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.medicine.price,
        })),
      },
      {
        onSuccess: () => {
          router.push("/customer/orders");
        },
      },
    );
  };

  return (
    <div>
      <h1>Checkout</h1>

      <div className="order-summary">
        <h2>Order Summary</h2>
        {items.map((item) => (
          <div key={item.medicineId}>
            <span>
              {item.medicine.name} x {item.quantity}
            </span>
            <span>${item.medicine.price * item.quantity}</span>
          </div>
        ))}
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
      </div>

      <div className="shipping-form">
        <h2>Shipping Address</h2>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your shipping address"
        />
      </div>

      <button onClick={handleCheckout} disabled={isPending || !shippingAddress}>
        {isPending ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
```

### Order History

```tsx
"use client";

import { useOrders } from "@/hooks";

export default function OrderHistory() {
  const { data, isLoading, error } = useOrders();

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div>
      <h1>Order History</h1>

      {data?.data.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Order #{order.id.slice(0, 8)}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.totalAmount}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Shipping: {order.shippingAddress}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Reviews

### Review Form

```tsx
"use client";

import { useCreateReview } from "@/hooks";
import { useState } from "react";

export function ReviewForm({ medicineId }: { medicineId: string }) {
  const { mutate: createReview, isPending } = useCreateReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReview(
      { medicineId, rating, comment },
      {
        onSuccess: () => {
          setRating(5);
          setComment("");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
```

### Display Reviews

```tsx
"use client";

import { useReviews } from "@/hooks";

export function ReviewList({ medicineId }: { medicineId: string }) {
  const { data, isLoading } = useReviews(medicineId);

  if (isLoading) return <div>Loading reviews...</div>;

  return (
    <div>
      <h2>Reviews</h2>
      {data?.data?.map((review) => (
        <div key={review.id} className="review">
          <div className="rating">{"⭐".repeat(review.rating)}</div>
          <p>{review.comment}</p>
          <small>
            By {review.user?.name} on{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}
```

---

## Notifications

### Using Notifications

```tsx
"use client";

import { useUIStore } from "@/store";

export function SomeComponent() {
  const { addNotification } = useUIStore();

  const handleAction = () => {
    // Success notification
    addNotification({
      type: "success",
      message: "Action completed successfully!",
      duration: 3000,
    });

    // Error notification
    addNotification({
      type: "error",
      message: "Something went wrong!",
      duration: 5000,
    });

    // Info notification
    addNotification({
      type: "info",
      message: "Here is some information",
    });
  };

  return <button onClick={handleAction}>Trigger Notification</button>;
}
```

### Notification Display Component

```tsx
"use client";

import { useUIStore } from "@/store";

export function NotificationContainer() {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <p>{notification.message}</p>
          <button onClick={() => removeNotification(notification.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Key Benefits

### ✅ No More useEffect for API Calls

Before:

```tsx
const [data, setData] = useState([]);
useEffect(() => {
  fetch("/api/medicines")
    .then((res) => res.json())
    .then(setData);
}, []);
```

After:

```tsx
const { data } = useMedicines();
```

### ✅ Automatic Loading States

```tsx
const { data, isLoading, error } = useMedicines();
```

### ✅ Automatic Caching

TanStack Query caches data automatically. If you navigate away and come back, data is instantly available.

### ✅ Optimistic Updates

```tsx
const { mutate } = useUpdateMedicine();
mutate(payload); // UI updates immediately, syncs with server in background
```

### ✅ Type Safety

All data is fully typed. TypeScript will catch errors at compile time.
