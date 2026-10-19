import { Metadata } from "next";
import { baseOpenGraph, SITE } from "@/lib/site";
import { ConvertView } from "../_components/ConvertView";

const description = "Convert JPEG, PNG, WebP, AVIF and HEIC images right in your browser. Your files never leave your device.";

export const metadata: Metadata = {
  title: "Convert images", // renders as "Convert images | Image2Image"
  description,
  alternates: { canonical: "/convert" },
  openGraph: {
    ...baseOpenGraph,
    title: "Convert images",
    description,
    url: "/convert",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert images",
    description,
    images: [SITE.ogImage],
  },
};

export default function Page() {
  return <ConvertView />;
}
