import "@/styles/globals.css";

export const metadata = {
  title: "PRISMA Manager",
  description: "CRM + Pipeline + AI Creative Studio"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark">
      <body>{children}</body>
    </html>
  );
}