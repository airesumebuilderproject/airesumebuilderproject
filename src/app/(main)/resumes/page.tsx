import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { PlusSquare } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ResumeItem from "./ResumeItem";

export const metadata: Metadata = {
  title: "Your resumes",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [resumes, totalCount] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataInclude,
    }),
    prisma.resume.count({
      where: {
        userId,
      },
    }),
  ]);

  // TODO: Check quota for non-premium users

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-5" />
          New resume
        </Link>
      </Button>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your resumes</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))}
      </div>
    </main>
  );
}
// import { Button } from "@/components/ui/button";
// import prisma from "@/lib/prisma";
// import { resumeDataInclude } from "@/lib/types";
// import { auth } from "@clerk/nextjs/server";
// import { PlusSquare } from "lucide-react";
// import { Metadata } from "next";
// import Link from "next/link";
// import ResumeItem from "./ResumeItem";

// export const metadata: Metadata = {
//   title: "Your resumes",
// };

// export default async function Page() {
//   const { userId } = await auth();

//   if (!userId) {
//     return null;
//   }

//   // **[Change 1: Fetch Timeout Controller Added]**
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 10000); // 10 sec timeout

//   try {
//     const [resumes, totalCount] = await Promise.all([
//       prisma.resume.findMany({
//         where: {
//           userId,
//         },
//         orderBy: {
//           updatedAt: "desc",
//         },
//         include: resumeDataInclude,
//         take: 10, // **[Change 2: Pagination - Fetch only 10 records]**
//         skip: 0,
//       }),
//       prisma.resume.count({
//         where: {
//           userId,
//         },
//       }),
//     ]);

//     clearTimeout(timeout); // **Timeout clear kar raha hoon agar data aa gaya**
    
//     return (
//       <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
//         <Button asChild className="mx-auto flex w-fit gap-2">
//           <Link href="/editor">
//             <PlusSquare className="size-5" />
//             New resume
//           </Link>
//         </Button>
//         <div className="space-y-1">
//           <h1 className="text-3xl font-bold">Your resumes</h1>
//           <p>Total: {totalCount}</p>
//         </div>
//         <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
//           {resumes.map((resume) => (
//             <ResumeItem key={resume.id} resume={resume} />
//           ))}
//         </div>
//       </main>
//     );
//   } catch (error) {
//     console.error("Database Fetch Error:", error); // **[Change 3: Error Logging]**
    
//     if (error instanceof Error && error.name === "AbortError") {
//       console.error("Fetch request timed out!"); // **[Change 4: Timeout Error Handling]**
//     }

//     return (
//       <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
//         <h1 className="text-3xl font-bold text-red-600">Error loading resumes</h1>
//         <p>Please try again later.</p>
//       </main>
//     );
//   }
// }
