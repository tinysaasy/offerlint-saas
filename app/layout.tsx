export const metadata = { title: "OfferLint", description: "Instant offer teardown that increases conversion clarity." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#070b14", color: "#eaf0ff" }}>{children}</body>
    </html>
  );
}
