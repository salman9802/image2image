type TUmami = {
  track: (event: string, data?: Record<string, string | number | boolean>) => void;
}

declare global {
  interface Window {
    umami?: TUmami;
  }
}

export function trackEvent(event: string, data?: Record<string, string | number | boolean>) {
  if (process.env.NODE_ENV !== "production") return;

  window.umami?.track(event, data);
}
