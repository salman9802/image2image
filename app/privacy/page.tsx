export default function page() {
  return (
    <div className="p-6 min-h-screen flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl lg:text-4xl">Privacy</h1>
      <p>This website uses Umami Analytics to measure feature usage and improve the experience. We don't intentionally collect personal information through analytics.</p>
      <p>For details, see <a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary font-semibold">Umami's Privacy Policy</a>.</p>
    </div>
  );
}

