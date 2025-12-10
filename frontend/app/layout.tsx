import "./globals.css";

export const metadata = {
  title: "Picassa Music",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-purple-200 to-yellow-100">
        {children}
      </body>
    </html>
  );
}