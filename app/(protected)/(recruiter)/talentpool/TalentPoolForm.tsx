"use client";
import { createTalentPool } from "@/actions/talentPoolActions";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  talentPoolSchema,
  TalentPoolFormData,
} from "@/schemas/talentPoolSchema";
import { Button } from "@/components/ui/button";
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
import { useUserStore } from "@/utils/userStore";
import { ArrayInput } from "@/components/misc/ArrayInput";

export default function TalentPoolForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userData } = useUserStore();

  const form = useForm<TalentPoolFormData>({
    resolver: zodResolver(talentPoolSchema),
    defaultValues: {
      skills: [],
      profiles: [],
      salary: "",
      locationPref: "",
    },
  });

  const onSubmit = async (data: TalentPoolFormData) => {
    setIsSubmitting(true);
    try {
      if (!userData) return;

      const res = await createTalentPool({
        ...data,
        userId: userData.id,
      });

      if (res === "success") {
        toast.success("Successfully created talent pool");
      } else {
        toast.error("Failed to create talent pool");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl m-auto space-y-8"
      >
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <ArrayInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter skills required"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profiles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profiles</FormLabel>
              <FormControl>
                <ArrayInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter targeting profiles"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input placeholder="Enter salary range" {...field} />
              </FormControl>
              <FormDescription>
                Specify the salary range for the talent pool.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationPref"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Preference</FormLabel>
              <FormControl>
                <Input placeholder="Enter location preference" {...field} />
              </FormControl>
              <FormDescription>
                Specify the preferred location for the talent pool.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
