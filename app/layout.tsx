import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ClipBot AI — Stream clips, on autopilot",
  description: "Find livestream highlights and publish them to YouTube with creator permission."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
