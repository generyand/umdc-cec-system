import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { User as LucideUser, Mail, KeyRound, Phone } from "lucide-react";
// import { User, ProfileUpdateData } from "@/types/user.types";

// type Department = {
//   id: number;
//   name: string;
//   abbreviation: string;
// };

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not be longer than 30 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not be longer than 30 characters"),
  email: z.string().email("Invalid email address"),
  departmentId: z.number().min(1, "Department is required"),
  contactNumber: z.string().optional(),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not be longer than 100 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const formatRole = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "FOCAL_PERSON":
      return "Focal Person";
    default:
      return "Unknown";
  }
};

export default function AdminProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateProfile } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      departmentId: 0,
      contactNumber: "",
    },
    mode: "onChange",
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.setValue("firstName", user.firstName);
      form.setValue("lastName", user.lastName);
      form.setValue("email", user.email);
      form.setValue("departmentId", user.departmentId);
      form.setValue("contactNumber", user.contactNumber || "");
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        departmentId: data.departmentId,
        contactNumber: data.contactNumber,
      });

      form.setValue("firstName", data.firstName);
      form.setValue("lastName", data.lastName);
      form.setValue("email", data.email);
      form.setValue("departmentId", data.departmentId);
      form.setValue("contactNumber", data.contactNumber || "");

      toast.success("Profile updated", {
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    values: z.infer<typeof passwordFormSchema>
  ) {
    setIsLoading(true);
    try {
      // Implement password update logic here

      passwordForm.setValue("currentPassword", "");
      passwordForm.setValue("newPassword", "");
      passwordForm.setValue("confirmPassword", "");

      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Form state for profile form
  const isProfileFormDirty = form.formState.isDirty;
  const isProfileFormValid = form.formState.isValid;

  // Form state for password form
  const isPasswordFormDirty = passwordForm.formState.isDirty;
  const isPasswordFormValid = passwordForm.formState.isValid;

  if (!user) {
    return (
      <div className="container py-6 max-w-4xl">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="w-20 h-20 rounded-full bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded bg-muted" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6 max-w-4xl">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set your preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex gap-4 items-start">
              <div className="relative group">
                <Avatar className="w-16 h-16 border-2 border-background">
                  <AvatarFallback className="text-lg bg-primary/10">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -right-1 -bottom-1 p-1 rounded-full border shadow-sm transition-colors bg-background group-hover:border-primary/50">
                  <LucideUser className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <CardTitle>{`${user.firstName} ${user.lastName}`}</CardTitle>
                <CardDescription className="space-x-2">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span className="capitalize">
                    {user.role ? formatRole(user.role) : "Unknown"}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LucideUser className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-background"
                            placeholder="Your first name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LucideUser className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-background"
                            placeholder="Your last name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={() => (
                    // ignore field
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LucideUser className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-background"
                            value={user?.department?.name || ""}
                            disabled
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-background"
                            placeholder="Your contact number"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-background"
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isLoading || !isProfileFormDirty}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isLoading || !isProfileFormDirty || !isProfileFormValid
                    }
                    size="sm"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Security Settings</CardTitle>
              <div className="text-xs text-muted-foreground">
                Last changed: Never
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-background"
                            type="password"
                            placeholder="Enter current password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-background"
                            type="password"
                            placeholder="Enter new password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-background"
                            type="password"
                            placeholder="Confirm new password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={
                      isLoading || !isPasswordFormDirty || !isPasswordFormValid
                    }
                    size="sm"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
