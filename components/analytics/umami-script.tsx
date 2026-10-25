import Script from "next/script";

export default function UmamiScript() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

  if (process.env.NODE_ENV !== "production" || websiteId == undefined || scriptUrl == undefined) return null;

  return (
    <Script
      defer
      src={scriptUrl}
      data-website-id={websiteId}
    />
  )
}

