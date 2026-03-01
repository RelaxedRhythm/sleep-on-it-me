import "./globals.css";
import Routes from "@/components/navigation";

export const metadata = {
  title: "Sleep on it!",
  description: "The best productive learning app on the market",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-248 flex-col">
        <div className="h-7.5">
          <Routes />
        </div>
        <main className="h-240.5">{children}</main>
      </body>
    </html>
  );
}
