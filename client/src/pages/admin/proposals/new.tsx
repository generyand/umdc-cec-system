import { useState, useCallback } from "react";
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
import {
  CalendarIcon,
  ArrowLeft,
  Loader2,
  FileText,
  Upload,
  X,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/use-auth";
import { projectProposalsService } from "@/services/api/project-proposals.service";

interface Program {
  id: number;
  name: string;
  abbreviation: string;
}

interface DepartmentWithPrograms {
  id: number;
  name: string;
  abbreviation: string;
  academicPrograms: Program[];
  bannerPrograms: Program[];
}

const proposalFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  department: z.string().min(1, "Please select a department"),
  program: z.string().min(1, "Please select a program"),
  bannerProgram: z.string().min(1, "Please select a banner program"),
  partnerCommunity: z.string().min(1, "Please select a partner community"),
  targetBeneficiaries: z.string().min(5, "Please specify target beneficiaries"),
  targetArea: z.string().min(5, "Please specify target area"),
  targetDate: z.date({
    required_error: "Please select a target date",
  }),
  venue: z.string().min(5, "Please specify activity venue"),
  budget: z.string().regex(/^\d+$/, "Must be a valid number"),
  attachments: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Please upload at least one document")
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => file.type === "application/pdf"),
      "Only PDF files are allowed"
    ),
});

type ProposalFormValues = z.infer<typeof proposalFormSchema>;

const partnerCommunities = [
  {
    value: "1",
    label: "Barangay San Miguel",
  },
  {
    value: "2",
    label: "Barangay Dawis",
  },
  {
    value: "3",
    label: "Barangay Ruparan",
  },
];

export default function NewProposalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const navigate = useNavigate();
  const { token } = useAuth();

  // Fetch departments data
  const { data: departmentsData, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ["departmentPrograms"],
    queryFn: () => projectProposalsService.getDepartmentPrograms(),
  });

  const departments = departmentsData?.data || [];
  const selectedDepartmentData = departments.find(
    (dept: DepartmentWithPrograms) => dept.id.toString() === selectedDepartment
  );

  const handleFileDrop = useCallback(
    (
      e: React.DragEvent<HTMLDivElement>,
      onChange: (files: FileList) => void
    ) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      if (files.length > 0) {
        const dt = new DataTransfer();
        files.forEach((file) => dt.items.add(file));
        onChange(dt.files);
      }
    },
    []
  );

  const removeFile = useCallback(
    (
      files: FileList | null,
      indexToRemove: number,
      onChange: (files: FileList) => void
    ) => {
      if (!files) return;
      const dt = new DataTransfer();
      Array.from(files)
        .filter((_, index) => index !== indexToRemove)
        .forEach((file) => dt.items.add(file));
      onChange(dt.files);
    },
    []
  );

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      department: "",
      program: "",
      bannerProgram: "",
      partnerCommunity: "",
      targetBeneficiaries: "",
      targetArea: "",
      targetDate: undefined,
      venue: "",
      budget: "0",
      attachments: undefined,
    },
  });

  const onSubmit = async (data: ProposalFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = {
        ...data,
        bannerProgram: {
          connect: {
            id: Number(data.bannerProgram),
          },
        },
        budget: data.budget.toString(),
        files: data.attachments ? Array.from(data.attachments) : [],
      };

      console.log("Form Data being sent:", formData);

      const form = new FormData();
      form.append("data", JSON.stringify(formData));
      if (data.attachments) {
        Array.from(data.attachments).forEach((file) => {
          form.append("files", file);
        });
      }

      await projectProposalsService.createProposal(formData, token || "");

      toast.success("Proposal created successfully");
      navigate("/admin/community-engagement/proposals");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Failed to create proposal", {
          description:
            error.response?.data?.message ||
            "Please try again or contact support if the issue persists.",
        });
      } else {
        toast.error("Failed to create proposal", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
      console.error("Submission error:", error);
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
              {/* Basic Information Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                {/* Title - Full width */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="transition-all hover:border-primary/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description - Full width */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[120px] transition-all hover:border-primary/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Department and Program - Side by side */}
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
                          // Reset dependent fields
                          form.setValue("program", "");
                          form.setValue("bannerProgram", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all hover:border-primary/50">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isDepartmentsLoading ? (
                            <div className="p-2">
                              <Skeleton className="w-full h-8" />
                              <Skeleton className="mt-2 w-full h-8" />
                            </div>
                          ) : (
                            departments.map((dept: DepartmentWithPrograms) => (
                              <SelectItem
                                key={dept.id}
                                value={dept.id.toString()}
                              >
                                {dept.name} ({dept.abbreviation})
                              </SelectItem>
                            ))
                          )}
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
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isDepartmentsLoading ? (
                            <div className="p-2">
                              <Skeleton className="w-full h-8" />
                            </div>
                          ) : (
                            selectedDepartmentData?.academicPrograms.map(
                              (program: Program) => (
                                <SelectItem
                                  key={program.id}
                                  value={program.id.toString()}
                                >
                                  {program.name} ({program.abbreviation})
                                </SelectItem>
                              )
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Banner Program and Partner Community - Side by side */}
                <FormField
                  control={form.control}
                  name="bannerProgram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Banner Program</FormLabel>
                      <FormDescription>
                        Select the banner program for this proposal.
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedDepartment}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all hover:border-primary/50">
                            <SelectValue placeholder="Select banner program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isDepartmentsLoading ? (
                            <div className="p-2">
                              <Skeleton className="w-full h-8" />
                            </div>
                          ) : (
                            selectedDepartmentData?.bannerPrograms.map(
                              (program: Program) => (
                                <SelectItem
                                  key={program.id}
                                  value={program.id.toString()}
                                >
                                  {program.name} ({program.abbreviation})
                                </SelectItem>
                              )
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partnerCommunity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">
                        Partner Community
                      </FormLabel>
                      <FormDescription>
                        Select the partner community for this proposal.
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all hover:border-primary/50">
                            <SelectValue placeholder="Select partner community" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {partnerCommunities.map((community) => (
                            <SelectItem
                              key={community.value}
                              value={community.value}
                            >
                              {community.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target Beneficiaries and Target Area - Side by side */}
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

                {/* Target Date and Venue - Side by side */}
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

                {/* Budget - Half width */}
                <div>
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">
                          Budget Proposal
                        </FormLabel>
                        <FormControl>
                          <div className="relative max-w-[240px]">
                            <Input
                              type="text"
                              placeholder="0"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                // Allow leading zeros and only numbers
                                const value = e.target.value.replace(
                                  /[^\d]/g,
                                  ""
                                );

                                // If empty, set to empty string instead of "0"
                                field.onChange(value);
                              }}
                              className={cn(
                                "pr-16 pl-8 transition-all",
                                "hover:border-primary/50",
                                "focus:border-primary"
                              )}
                            />
                            <div className="flex absolute inset-y-0 left-3 items-center pointer-events-none">
                              ₱
                            </div>
                            <div className="flex absolute inset-y-0 right-3 items-center pointer-events-none">
                              PHP
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Attachments - Full width */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel className="required">Attachments</FormLabel>
                        <FormDescription>
                          Upload the soft copy or scanned documents of your
                          proposal (PDF files only, max 5MB each).
                        </FormDescription>
                        <FormControl>
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleFileDrop(e, onChange)}
                            className="space-y-4"
                          >
                            <div
                              className={cn(
                                "flex flex-col justify-center items-center p-6 w-full rounded-lg border-2 border-dashed",
                                "transition-colors duration-200 ease-in-out",
                                "hover:border-primary/50",
                                "cursor-pointer"
                              )}
                              onClick={() =>
                                document.getElementById("file-upload")?.click()
                              }
                            >
                              <Upload className="mb-4 w-10 h-10 text-muted-foreground" />
                              <div className="space-y-1 text-center">
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold text-foreground">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PDF files only (max 5MB each)
                                </p>
                              </div>
                              <Input
                                id="file-upload"
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={(e) => onChange(e.target.files)}
                                className="hidden"
                                {...field}
                              />
                            </div>

                            {value && value.length > 0 && (
                              <div className="grid gap-3">
                                {Array.from(value).map((file, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "flex justify-between items-center",
                                      "p-3 rounded-lg border bg-muted/30",
                                      "text-sm text-muted-foreground"
                                    )}
                                  >
                                    <div className="flex gap-3 items-center">
                                      <FileText className="w-4 h-4 shrink-0" />
                                      <div className="min-w-0">
                                        <p className="font-medium truncate">
                                          {file.name}
                                        </p>
                                        <p className="text-xs">
                                          {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                          MB
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="w-8 h-8 text-muted-foreground hover:text-foreground"
                                      onClick={() =>
                                        removeFile(value, i, onChange)
                                      }
                                    >
                                      <X className="w-4 h-4" />
                                      <span className="sr-only">
                                        Remove file
                                      </span>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* Submit Buttons - Full width */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex gap-4 justify-end pt-6 mt-6 border-t"
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
