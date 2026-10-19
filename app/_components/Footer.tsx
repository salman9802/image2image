import {
  FaGithub,
  FaLinkedinIn,
  FaTelegramPlane,
} from "react-icons/fa";

const SOCIALS = [
  {
    url: "https://github.com/salman9802/",
    icon: <FaGithub className="size-5" />,
  },
  {
    url: "https://www.linkedin.com/in/salman9802",
    icon: <FaLinkedinIn className="size-5" />,
  },
  {
    url: "https://t.me/Storm_Fortress",
    icon: <FaTelegramPlane className="size-5" />,
  },
];
export function Footer() {
  return (
    <footer className="m-4 flex flex-col items-center justify-between gap-4 md:flex-row">

      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <span>&copy;</span>
        <span>{new Date().getFullYear()} Image2Image</span>
        <span className="text-xs tabular-nums">({process.env.NEXT_PUBLIC_APP_VERSION})</span>
        <span>&mdash;</span>
        <a
          href="https://github.com/salman9802/"
          rel="noopener noreferrer"
          target="_blank"
          className="font-semibold"
        >
          @salman
        </a>
      </div>

      <span className="mt-4 inline-flex justify-center gap-4 md:justify-start">
        {SOCIALS.map((social, i) => (
          <a
            key={i}
            href={social.url}
            rel="noopener noreferrer"
            target="_blank"
            className="text-neutral-500 hover:text-neutral-800"
          >
            {social.icon}
          </a>
        ))}
      </span>

    </footer>
  );
}
