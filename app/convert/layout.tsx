import { ConvertContextProvider } from "@/contexts/convert";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConvertContextProvider>
      {children}
    </ConvertContextProvider>
  )
}

