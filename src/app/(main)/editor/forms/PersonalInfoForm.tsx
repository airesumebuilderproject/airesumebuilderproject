import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { personalInfoSchema, PersonalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form"; 
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { EditorFormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function PersonalInfoForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      photo: undefined,
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      jobTitle: resumeData.jobTitle || "",
      city: resumeData.city || "",
      country: resumeData.country || "",
      phone: resumeData.phone||"",
      email: resumeData.email || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const inValid = await form.trigger();
      if (!inValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

const photoInputRef = useRef<HTMLInputElement>(null)

  return (
    <FormProvider {...form}>
      {" "}
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-1.5 text-center">
          <h2 className="text-2xl font-semibold">Personal Info</h2>
          <p className="text-sm text-muted-foreground">
            Tell Us About Yourself.
          </p>
        </div>

        <form className="space-y-3">
          {" "}
          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, ...FieldValues } }) => (
              <FormItem>
                <FormLabel>Your Photo:</FormLabel>
                <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    {...FieldValues}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      FieldValues.onChange(file);
                    }}
                    ref={photoInputRef}
                  />
                </FormControl>
                
                <Button variant="secondary"
                type="button"
                onClick={() =>{
                  FieldValues.onChange(null);
                  if (photoInputRef.current)
                  {
                    photoInputRef.current.value="";
                  }
                }}>Remove</Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField // ✅ FormField For FirstName
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name : </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField // ✅ FormField For LastName
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name : </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField // ✅ FormField For jobTitle
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title : </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField // ✅ FormField For city
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City : </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField // ✅ FormField For Country
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country : </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField // ✅ FormField For Phone
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone No : </FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField // ✅ FormField For E-mail
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail : </FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </div>
    </FormProvider>
  );
}
