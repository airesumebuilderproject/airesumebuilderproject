// --------------------------- TEST CODE - 3 :

"use client"; // 👈 Ensure this is here for client-side components

import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";

// Load the Inter font
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch by ensuring component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ Avoids Next.js hydration issues

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>AI Resume Builder</title> {/* ✅ Add title for SEO */}
      </head>
      <body className={inter.className}>
        {/* ✅ Wrap everything inside ClerkProvider, but inside <body> */}
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children} {/* ✅ Render main content */}
            <Toaster /> {/* ✅ Toast notifications */}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}





// --------------------------- TEST CODE - 2 :

// "use client"; // 👈 Isko Add Karo

// import { Toaster } from "@/components/ui/toaster";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "next-themes";
// import { Inter } from "next/font/google";
// import { useEffect, useState } from "react";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null; // Prevent hydration mismatch

//   return (
//     <ClerkProvider>
//       <html lang="en" suppressHydrationWarning={true}>
//         <body className={inter.className}>
//           <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >
//             {children}
//             <Toaster />
//           </ThemeProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }


// --------------------------- TEST CODE - 1 :

// import { Toaster } from "@/components/ui/toaster";
// import { ClerkProvider } from "@clerk/nextjs";
// import type { Metadata } from "next";
// import {ThemeProvider} from "next-themes"
// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: {
//     template: "%s - AI Resume Builder",
//     absolute: "AI Resume Builder",
//   },
//   description:
//     "AI Resume Builder is the easiest way to create a professional resume that will help you land your dream job.",
// };
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <ClerkProvider>
//     <html lang="en" suppressContentEditableWarning>
//       <body className={inter.className}>
//         <ThemeProvider
//         attribute="class"
//         defaultTheme="system"
//         enableSystem
//         disableTransitionOnChange
//         >
//         {children}
//         <Toaster/>
//         </ThemeProvider>
//         </body>
//     </html>
//     </ClerkProvider>
//   );
// }