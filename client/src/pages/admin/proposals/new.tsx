import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { CalendarIcon, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const departmentPrograms: Record<string, { value: string; label: string }[]> = {
  dae: [
    { value: "bsa", label: "Bachelor of Science in Accountancy (BSA)" },
    {
      value: "bsma",
      label: "Bachelor of Science in Management Accounting (BSMA)",
    },
  ],
  dase: [
    {
      value: "ab-polsci",
      label: "Bachelor of Arts in Political Science (AB POLSCI)",
    },
    { value: "ab-com", label: "Bachelor of Arts in Communication (AB COM)" },
    { value: "bssw", label: "Bachelor of Science in Social Work (BSSW)" },
    { value: "bsp", label: "Bachelor of Science in Psychology (BSP)" },
  ],
  dba: [
    {
      value: "bsba",
      label: "Bachelor of Science in Business Administration (BSBA)",
    },
    {
      value: "bstm",
      label: "Bachelor of Science in Tourism Management (BSTM)",
    },
  ],
  dcje: [{ value: "bsc", label: "Bachelor of Science in Criminology (BSC)" }],
  dte: [
    {
      value: "bsed",
      label: "Bachelor of Science in Secondary Education (BSED)",
    },
    { value: "beed", label: "Bachelor in Elementary Education (BEED)" },
    { value: "bped", label: "Bachelor of Physical Education (BPED)" },
    {
      value: "btvted",
      label: "Bachelor of Technical Vocational Teacher Education (BTVTED)",
    },
  ],
  dtp: [
    {
      value: "bsit",
      label: "Bachelor of Science in Information Technology (BSIT)",
    },
    {
      value: "bscpe",
      label: "Bachelor of Science in Computer Engineering (BSCPE)",
    },
  ],
  shs: [
    {
      value: "stem",
      label: "Science, Technology, Engineering & Mathematics (STEM)",
    },
    { value: "abm", label: "Accountancy, Business & Management (ABM)" },
    { value: "humss", label: "Humanities & Social Sciences (HUMSS)" },
    { value: "gas", label: "General Academic Strand (GAS)" },
    { value: "tvl", label: "Technical Vocational Livelihood (TVL)" },
  ],
  ntp: [{ value: "ntp", label: "Non-teaching Personnel (NTP)" }],
  alumni: [{ value: "alumni", label: "Alumni" }],
};

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

export default function NewProposalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const navigate = useNavigate();

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
    // TODO: Add API call here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: ProposalFormValues
  ) => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Proposal created successfully", {
        description: "Your proposal has been submitted for review.",
      });
      navigate("/admin/proposals");
    } catch (error) {
      toast.error("Failed to create proposal", {
        description:
          "Please try again or contact support if the issue persists.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto max-w-5xl"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          className="gap-2 mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Proposals
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Proposal
        </h1>
        <p className="mt-2 text-muted-foreground">
          Fill out the form below to submit a new extension program proposal.
        </p>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Proposal Details</CardTitle>
          <CardDescription>
            All fields marked with an asterisk (*) are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">
                        Title of Activity
                      </FormLabel>
                      <FormDescription>
                        Provide a clear and concise title for your extension
                        program.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g., Computer Literacy Enhancement Program (CLEP)"
                          className="transition-all hover:border-primary/50 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 gap-6 max-w-2xl sm:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Department</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedDepartment(value);
                          form.setValue("program", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all hover:border-primary/50">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dae">
                            Department of Accounting Education (DAE)
                          </SelectItem>
                          <SelectItem value="dase">
                            Department of Arts & Sciences Education (DASE)
                          </SelectItem>
                          <SelectItem value="dba">
                            Department of Business Administration (DBA)
                          </SelectItem>
                          <SelectItem value="dcje">
                            Department of Criminal Justice Education (DCJE)
                          </SelectItem>
                          <SelectItem value="dte">
                            Department of Teacher Education (DTE)
                          </SelectItem>
                          <SelectItem value="dtp">
                            Department of Technical Programs (DTP)
                          </SelectItem>
                          <SelectItem value="shs">
                            Senior High School (SHS)
                          </SelectItem>
                          <SelectItem value="ntp">
                            Non-teaching Personnel (NTP)
                          </SelectItem>
                          <SelectItem value="alumni">Alumni</SelectItem>
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
                      <FormLabel className="required">Program</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedDepartment}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all hover:border-primary/50">
                            <SelectValue
                              placeholder={
                                selectedDepartment
                                  ? "Select program"
                                  : "Please select a department first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedDepartment &&
                            departmentPrograms[selectedDepartment]?.map(
                              (program) => (
                                <SelectItem
                                  key={program.value}
                                  value={program.value}
                                >
                                  {program.label}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-md"
              >
                <FormField
                  control={form.control}
                  name="bannerProgram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Banner Program</FormLabel>
                      <FormDescription>
                        Select the banner program for your extension activity.
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all hover:border-primary/50">
                            <SelectValue placeholder="Select banner program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Others/None</SelectItem>
                          <SelectItem value="1">KASUSYO</SelectItem>
                          <SelectItem value="2">KISLAP</SelectItem>
                          <SelectItem value="3">UM-HEART</SelectItem>
                          <SelectItem value="4">UMASINSO</SelectItem>
                          <SelectItem value="5">TURISMO MISMO</SelectItem>
                          <SelectItem value="6">BATUTA DEPENSA</SelectItem>
                          <SelectItem value="7">ANAK NG UM</SelectItem>
                          <SelectItem value="8">MUNTING PAARALAN</SelectItem>
                          <SelectItem value="9">PROJECT WELLNESS</SelectItem>
                          <SelectItem value="10">BUMATI KA</SelectItem>
                          <SelectItem value="11">UMUNA</SelectItem>
                          <SelectItem value="12">UM STAR</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 gap-6 max-w-2xl sm:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="targetBeneficiaries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">
                        Target Beneficiaries
                      </FormLabel>
                      <FormDescription>
                        Specify who will benefit from this activity.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g., Students, Community Members"
                          className="transition-all hover:border-primary/50 focus:border-primary"
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
                      <FormLabel className="required">Target Area</FormLabel>
                      <FormDescription>
                        Specify where this activity will take place.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g., Quezon City, Philippines"
                          className="transition-all hover:border-primary/50 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 gap-6 max-w-2xl sm:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="required">
                        Target Date of Activity
                      </FormLabel>
                      <FormDescription>
                        Select the target date for the activity.
                      </FormDescription>
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
                      <FormLabel className="required">Activity Venue</FormLabel>
                      <FormDescription>
                        Specify the specific location of the activity.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g., Quezon City, Philippines"
                          className="transition-all hover:border-primary/50 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="max-w-md"
              >
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">
                        Budget Proposal
                      </FormLabel>
                      <FormDescription>
                        Enter the estimated budget needed for this activity.
                      </FormDescription>
                      <FormControl>
                        <div className="relative max-w-[240px]">
                          <Input
                            type="number"
                            placeholder="0.00"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/[^0-9]/g, "")
                              )
                            }
                            className={cn(
                              "pl-8 pr-16 transition-all",
                              "hover:border-primary/50",
                              "focus:border-primary focus:ring-1 focus:ring-primary",
                              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            )}
                          />
                          <div className="flex absolute inset-y-0 left-3 items-center pointer-events-none text-muted-foreground">
                            ₱
                          </div>
                          <div className="flex absolute inset-y-0 right-3 items-center text-sm pointer-events-none text-muted-foreground">
                            PHP
                          </div>
                        </div>
                      </FormControl>
                      <div className="mt-1.5 text-xs text-muted-foreground">
                        Enter numbers only, without commas or decimal points.
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-4 justify-end pt-4 border-t"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="transition-all hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 min-w-[120px] transition-all text-white bg-primary hover:bg-primary/80"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Proposal"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Add this to your global CSS
