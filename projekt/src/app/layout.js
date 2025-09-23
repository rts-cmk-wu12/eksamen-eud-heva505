import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header  from "@/components/Header";
import Footer from "@/components/Footer";


export const metadata = {
  title: "SwapHub",
  description: "Swap and discover items",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-gray-900 antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-2
        focus:z-50 rounded bg-black px-3 py-2 text-white">
          Skip to content
        </a>
        <AuthProvider>
          <Header />
          <main id="content" className="max-auto w-full max-w-6xl px-4 sm:px-6 py-8"
          role="main"
          aria-live="polite"
           
          >
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

