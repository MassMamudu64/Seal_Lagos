import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950 px-gutter pb-16 pt-24 text-cloud-100">
      <div className="mx-auto w-full max-w-shell">{children}</div>
    </div>
  );
}
