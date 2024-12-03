import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const proposalFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  department: z.string().min(1, "Please select a department"),
  program: z.string().min(1, "Please select a program"),
  bannerProgram: z.string().min(1, "Please select a banner program"),
  targetBeneficiaries: z.string().min(5, "Please specify target beneficiaries"),
  targetArea: z.string().min(5, "Please specify target area"),
  targetDate: z.date({
    required_error: "Please select a target date",
  }),
  venue: z.string().min(5, "Please specify activity venue"),
  budget: z.string().regex(/^\d+$/, "Must be a valid number"),
});

type ProposalFormValues = z.infer<typeof proposalFormSchema>;

interface CreateProposalModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateProposalModal({
  trigger,
  onSuccess,
}: CreateProposalModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      title: "",
      department: "",
      program: "",
      bannerProgram: "",
      targetBeneficiaries: "",
      targetArea: "",
      venue: "",
      budget: "",
    },
  });

  const onSubmit = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: ProposalFormValues
  ) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement API call to create proposal
      // const response = await proposalsApi.create(data);

      // Simulated success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Proposal created successfully");
      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create proposal");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Create Proposal</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
          <DialogDescription>
            Fill out the form below to submit a new extension program proposal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title of Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter activity title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ccs">
                          College of Computing Studies
                        </SelectItem>
                        <SelectItem value="coe">
                          College of Engineering
                        </SelectItem>
                        <SelectItem value="con">College of Nursing</SelectItem>
                        {/* Add more departments as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bsit">
                          BS Information Technology
                        </SelectItem>
                        <SelectItem value="bscs">
                          BS Computer Science
                        </SelectItem>
                        {/* Add more programs as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bannerProgram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Program</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select banner program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      {/* Add more banner programs as needed */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="targetBeneficiaries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Beneficiaries</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Who will benefit from this activity?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Area</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Where will this activity take place?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Target Date of Activity</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto w-4 h-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
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
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Venue</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Specific location of the activity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Budget Proposal</FormLabel>
                  <FormDescription>
                    Enter the estimated budget needed for this activity (in
                    PHP).
                  </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        {...field}
                        className={cn(
                          "pr-16 pl-8 transition-all",
                          "hover:border-primary/50",
                          "focus:border-primary focus:ring-1 focus:ring-primary",
                          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        )}
                      />
                      <div className="flex absolute inset-y-0 left-3 items-center pointer-events-none">
                        ₱
                      </div>
                      <div className="flex absolute inset-y-0 right-3 items-center text-sm pointer-events-none text-muted-foreground">
                        PHP
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Proposal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
