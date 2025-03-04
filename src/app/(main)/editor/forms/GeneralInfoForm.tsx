// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { generalInforSchema, GeneralInfoValues } from "@/lib/validation";
// import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
// import { EditorFormProps } from "@/lib/types";
// import { useEffect } from "react";

// export default function GeneralInfoForm({resumeData,setResumeData}:EditorFormProps) {
//   const form = useForm<GeneralInfoValues>({
//     resolver: zodResolver(generalInforSchema),
//     defaultValues: {
//       title: resumeData.title || "",
//       description: resumeData.description || "",
//     },
//   });

//     useEffect(() => {
//       const { unsubscribe } = form.watch(async (values) => {
//         const inValid = await form.trigger();
//         if (!inValid) return;
//         setResumeData({ ...resumeData, ...values });
//       });
//       return unsubscribe;
//     }, [form, resumeData, setResumeData]);


//   return (
//     <div className="max-w-x1 mx-auto space-y-6">
//       <div className="space-y-1.5 text-center">
//         <h2 className="text-2x1 font-semibold">General Info</h2>
//         <p className="text-sm text-muted-foreground">
//           This Will Not Appear On Your Resume.
//         </p>
//       </div>
//       <Form {...form}>
//         <form className="space-y-3">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Prjoect Name :</FormLabel>
//                 <FormControl>
//                   <input {...field} placeholder=" My Cool Resume" autoFocus />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Description  :</FormLabel>
//                 <FormControl>
//                   <input {...field} placeholder=" A Resume For My Next Job"/>
//                 </FormControl>
//                 <FormDescription>Write About This Resume Is For.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </form>
//       </Form>
//     </div>
//   );
// }


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function GeneralInfoForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData.title || "",
      description: resumeData.description || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">General info</h2>
        <p className="text-sm text-muted-foreground">
          This will not appear on your resume.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My cool resume" autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="A resume for my next job" />
                </FormControl>
                <FormDescription>
                  Describe what this resume is for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}