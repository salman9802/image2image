import { ConvertContextProvider } from "@/contexts/convert";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConvertContextProvider>
      <div className="bg-white dark:bg-neutral-950">
        {children}
      </div>
    </ConvertContextProvider>
  )
}

