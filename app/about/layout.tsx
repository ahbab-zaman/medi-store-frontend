import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Medi-Store's mission to make quality medicines accessible to everyone. Meet our team and discover our commitment to patient-centered healthcare.",
  openGraph: {
    title: "About Us | Medi-Store",
    description:
      "Learn about Medi-Store's mission to make quality medicines accessible to everyone.",
    url: "/about",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
