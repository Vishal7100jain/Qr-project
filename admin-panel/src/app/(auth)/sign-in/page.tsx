import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In | Bridal Mehndi Dashboard",
  description:
    "Sign in to access the Bridal Mehndi Admin Dashboard and manage your platform securely.",
  keywords: [
    "bridal mehndi",
    "mehndi booking",
    "bridal dashboard",
    "sign in",
    "henna services",
    "bridal henna",
  ],
  openGraph: {
    title: "Sign In | Bridal Mehndi Booking Dashboard",
    description:
      "Login to manage your bridal mehndi appointments, designs, and preferences.",
    url: "https://your-domain.com/signin", // replace with actual domain
    type: "website",
    siteName: "Bridal Mehndi Booking",
    images: [
      {
        url: "https://your-domain.com/images/og-signin.jpg", // optional: OG image
        width: 1200,
        height: 630,
        alt: "Bridal Mehndi Sign In",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Bridal Mehndi Booking Dashboard",
    description:
      "Log in to your account and manage bridal mehndi bookings easily.",
    images: ["https://your-domain.com/images/twitter-signin.jpg"], // optional: Twitter image
  },
};

export default function SignIn() {
  return <SignInForm />;
}
