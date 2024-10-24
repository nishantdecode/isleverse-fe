import { Inter } from "next/font/google";

import "./globals.css";

import { Toaster } from "sonner";
import { AppBar } from "@/components/app-bar";
import UserProvider from "@/context/UserProvider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IsleVerse",
  description: "Build your Island.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <div className="flex justify-center items-center w-full h-screen">
              <div className="flex flex-col justify-center items-center w-full 2xl:max-w-[100rem] h-screen p-0 m-0 overflow-clip">
                <Toaster />
                <AppBar />
                <div className="flex justify-center items-center w-full h-[100vh]">
                  {children}
                </div>
              </div>
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
