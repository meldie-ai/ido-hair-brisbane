import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ido Hair Brisbane — Korean & Japanese Hair Salon",
  description:
    "Government-certified Korean and Japanese hair salon at Level 2, 187 George St, Brisbane CBD. Digital perm, colour, nanoplasty, keratin, and precision cuts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&family=Noto+Serif+KR:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
