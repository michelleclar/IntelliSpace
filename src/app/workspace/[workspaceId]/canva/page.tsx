import { Loader } from "lucide-react";
import dynamic from "next/dynamic";

export default function Home() {
  const Canva = dynamic(
    async () => (await import("@/components/canva")).default,
    {
      ssr: false,
    },
  );
  return <Canva />;
}
