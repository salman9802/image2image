import { Metadata } from "next";

export const SITE = {
  name: "Image2Image",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description: "Convert images between formats entirely in your browser. No uploads, no server. JPEG, PNG, WebP, AVIF, HEIC and more.",
  ogImage: "/og.png", // 
}

// Shared so child pages can reuse the image
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  siteName: SITE.name,
  title: SITE.name,
  description: SITE.description,
  images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
};
