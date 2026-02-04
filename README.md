# 💊 MediStore - Frontend

![MediStore Banner](https://img.shields.io/badge/MediStore-Frontend-teal?style=for-the-badge&logo=medistory)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)

**MediStore** is a state-of-the-art pharmaceutical e-commerce interface designed for speed, beauty, and reliability. It provides a seamless experience for customers, a powerful control center for sellers, and a comprehensive oversight panel for administrators.

---

## ✨ Features

### 🏢 Dashboards (Premium UI)

- **Admin Center**: Real-time stats on users, revenue, and inventory. Features interactive sales charts powered by **Recharts**.
- **Seller Workspace**: Manage products, track orders, and monitor personal earnings with a focused, minimal interface.
- **Dynamic Analytics**: 7-day revenue visualization and KPI tracking.

### 🛍️ Shopping Experience

- **Fluid Browsing**: Fast, interactive product listings with category filtering and smart search.
- **Persistent Cart**: Client-side state management ensuring your items stay with you.
- **Secure Checkout**: Integrated multi-step checkout with support for multiple payment methods.

### 🛡️ Secure Infrastructure

- **Token Management**: Automatic access token refreshing using Axios interceptors.
- **Responsive Layouts**: Fully adaptive design that looks stunning on mobile, tablet, and desktop.
- **Glassmorphism Design**: Modern aesthetic with subtle micro-animations and smooth transitions.

---

## 🎨 Design System

We believe in **Rich Aesthetics**. The application utilizes:

- **Curated Color Palettes**: Harmonious HSL colors tailored for a premium medical feel.
- **Modern Typography**: Inter and Outfit families for maximum readability.
- **Interactive Elements**: Subtle hover effects and fadeInUp animations for a "living" interface.

---

## 🚀 Installation

### Setup

1. **Dependency Orchestration**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Configure `.env.local`:

   ```env
   NEXT_PUBLIC_BACKEND_API_BASE_URL="http://localhost:5000/api"
   ```

3. **Development Mode**
   ```bash
   npm run dev
   ```

---

## 🛠️ Technology Highlights

- **Next.js (App Router)**: Hybrid rendering and efficient routing.
- **TanStack Query (v5)**: Sophisticated server state management and caching.
- **Zustand**: Lightweight, boilerplate-free client state.
- **Lucide React**: Beautifully consistent iconography.
- **Sonner**: High-performance toast notifications for user feedback.

---

## 📁 Project Structure

```text
app/
├── admin/          # Governance pages
├── seller/         # Vendor pages
├── products/       # Public marketplace
├── checkout/       # Transaction flow
└── layout.tsx      # Global shell
components/         # Atomic UI & Shared logic
hooks/              # Custom query & mutation logic
services/           # API orchestration layer
store/              # Zustand state definitions
```

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Designed with precision for the modern web.</p>
