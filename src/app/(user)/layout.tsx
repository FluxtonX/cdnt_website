import type { Metadata } from "next";
import { UserShell } from "@/components/dashboard/user-shell";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Client Portal & Dashboard",
  noIndex: true,
});

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserShell>{children}</UserShell>;
}
