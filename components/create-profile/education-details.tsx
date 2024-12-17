"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  school: z.string().min(1, "School name is required"),
  degree: z.string().optional(),
  field: z.string().optional(),
  percentage: z.string().optional(),
  cgpa: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  description: z.string().optional(),
});

type Education = z.infer<typeof formSchema>;

export function EducationDetails() {
  const [educations, setEducations] = React.useState<Education[]>([]);
  const [open, setOpen] = React.useState(false);

  const form = useForm<Education>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: "",
      degree: "",
      field: "",
      percentage: "",
      cgpa: "",
      description: "",
    },
  });

  function onSubmit(values: Education) {
    setEducations([...educations, values]);
    setOpen(false);
    form.reset();
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white border border-primary text-primary">
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Education Details</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/Institution</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter school or institution name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your degree" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="field"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your field of study"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Percentage (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cgpa"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>CGPA (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter CGPA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Leave blank if you&apos;re currently studying here
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your studies, achievements, or any other relevant information"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save Education</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {educations.map((edu, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{edu.school}</h3>
            {edu.degree && (
              <p>
                {edu.degree}
                {edu.field && ` in ${edu.field}`}
              </p>
            )}
            {(edu.percentage || edu.cgpa) && (
              <p className="text-sm text-gray-500">
                {edu.percentage && `Percentage: ${edu.percentage}`}
                {edu.percentage && edu.cgpa && " | "}
                {edu.cgpa && `CGPA: ${edu.cgpa}`}
              </p>
            )}
            {(edu.startDate || edu.endDate) && (
              <p className="text-sm text-gray-500">
                {edu.startDate && format(edu.startDate, "MMM yyyy")}
                {edu.startDate && edu.endDate && " - "}
                {edu.endDate ? format(edu.endDate, "MMM yyyy") : "Present"}
              </p>
            )}
            {edu.description && <p className="mt-2">{edu.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
