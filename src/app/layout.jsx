import "./globals.css";
import Routes from "@/components/navigation";
import Provider from "@/components/provider"; 

export const metadata = {
  title: "Sleep on it!",
  description: "The best productive learning app on the market",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

      <Provider>
        {children}  
      </Provider>
      </body>
    </html>
  );
}
