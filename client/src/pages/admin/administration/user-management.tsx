import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addUser, getUsers, deleteUser } from "@/services/api/users.service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { UserPosition, UserRole } from "@/types/user.types";

interface Department {
  id: number;
  name: string;
  abbreviation: string;
}

interface User {
  id: number | null;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  position: UserPosition | null;
  department: Department | null;
  contactNumber: string | null;
  status: "ACTIVE" | "INACTIVE";
}

interface UsersResponse {
  users: User[];
  departments: Department[];
}

const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF"] as [UserRole, ...UserRole[]]),
  position: z
    .enum([
      "CEC_HEAD",
      "CEC_OFFICE_ASSISTANT",
      "CEC_COORDINATOR",
      "VP_DIRECTOR",
      "DEAN",
      "PROGRAM_HEAD",
      "FOCAL_PERSON",
    ] as [UserPosition, ...UserPosition[]])
    .nullable(),
  departmentId: z.number(),
  contactNumber: z.string().optional(),
});

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  type UserFormValues = z.infer<typeof userFormSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "UMDC@cec@2024",
      role: UserRole.STAFF,
      position: null,
      departmentId: 0,
      contactNumber: "",
    },
  });

  const { data, isLoading, error } = useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const users = data?.users ?? [];
  const departments = data?.departments ?? [];

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete user. Please try again."
      );
    },
  });

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete?.id) {
      deleteMutation.mutate(userToDelete.id.toString());
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-48 h-8" />
          </div>
          <Skeleton className="w-32 h-10" />
        </div>

        <div className="flex gap-4 items-center">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="w-28 h-10" />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[180px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[160px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-8 h-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading users: {error.message}
      </div>
    );
  }

  const onSubmit = async (data: UserFormValues) => {
    try {
      const { departmentId, ...restData } = data;

      await addUser({
        ...restData,
        departmentId: departmentId ?? 0,
        position: restData.position ?? undefined,
      });

      setIsDialogOpen(false);
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create user. Please try again."
      );
      console.error("Error creating user:", error);
    }
  };

  const formatPosition = (position: UserPosition): string => {
    const formats: Record<UserPosition, string> = {
      CEC_HEAD: "CEC Head",
      CEC_OFFICE_ASSISTANT: "CEC Office Assistant",
      CEC_COORDINATOR: "CEC Coordinator",
      VP_DIRECTOR: "VP Director",
      DEAN: "Dean",
      PROGRAM_HEAD: "Program Head",
      FOCAL_PERSON: "Focal Person",
    };
    return formats[position] || position;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. They will receive an email to set
                their password.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 px-3 py-2 h-full hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-500" />
                            )}
                          </Button>
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="dept-none"
                              {...field}
                              value="0"
                              checked={field.value === 0}
                              onChange={() => field.onChange(0)}
                              className="w-4 h-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor="dept-none"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              None
                            </label>
                          </div>
                          {departments.map((department) => (
                            <div
                              key={department.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                id={`dept-${department.id}`}
                                {...field}
                                value={department.id}
                                checked={field.value === department.id}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="w-4 h-4 border-gray-300 text-primary focus:ring-primary"
                              />
                              <label
                                htmlFor={`dept-${department.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {department.abbreviation}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SUPER_ADMIN">
                            Super Admin
                          </SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="STAFF">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "NONE" ? null : value)
                        }
                        value={field.value ?? "NONE"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NONE">None</SelectItem>
                          <SelectItem value="CEC_HEAD">CEC Head</SelectItem>
                          <SelectItem value="CEC_OFFICE_ASSISTANT">
                            CEC Office Assistant
                          </SelectItem>
                          <SelectItem value="CEC_COORDINATOR">
                            CEC Coordinator
                          </SelectItem>
                          <SelectItem value="VP_DIRECTOR">
                            VP Director
                          </SelectItem>
                          <SelectItem value="DEAN">Dean</SelectItem>
                          <SelectItem value="PROGRAM_HEAD">
                            Program Head
                          </SelectItem>
                          <SelectItem value="FOCAL_PERSON">
                            Focal Person
                          </SelectItem>
                          <SelectItem value="CHIEF_OPERATION_OFFICER">
                            Chief Operation Officer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-500 -translate-y-1/2" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setIsRolesDialogOpen(true)}>
          <Shield className="mr-2 w-4 h-4" />
          Roles
        </Button>
      </div>

      <Dialog open={isRolesDialogOpen} onOpenChange={setIsRolesDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center text-xl">
              <Shield className="w-5 h-5" />
              CEC System Roles & Privileges
            </DialogTitle>
            <DialogDescription>
              Detailed overview of user roles and their access levels in the
              Community Extension Center system.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Super Admin */}
            <div className="p-4 rounded-lg border transition-colors bg-card hover:bg-accent/50">
              <div className="flex gap-2 items-center mb-2">
                <div className="rounded-full bg-red-100 p-1.5">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-red-600">
                  Super Admin
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Highest level of system access with complete oversight:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full" />
                  Manage all extension programs and projects across departments
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full" />
                  Full user management and role assignment capabilities
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full" />
                  Access comprehensive analytics and generate institutional
                  reports
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full" />
                  Configure system settings and approval workflows
                </li>
              </ul>
            </div>

            {/* Admin */}
            <div className="p-4 rounded-lg border transition-colors bg-card hover:bg-accent/50">
              <div className="flex gap-2 items-center mb-2">
                <div className="rounded-full bg-blue-100 p-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-blue-600">Admin</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Department-level management and oversight:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  Manage extension programs within assigned department
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  Review and approve project proposals and reports
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  Monitor department KPIs and generate departmental reports
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  Manage department staff and focal persons
                </li>
              </ul>
            </div>

            {/* Staff */}
            <div className="p-4 rounded-lg border transition-colors bg-card hover:bg-accent/50">
              <div className="flex gap-2 items-center mb-2">
                <div className="rounded-full bg-green-100 p-1.5">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-600">Staff</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Basic access for program implementation:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-green-600 rounded-full" />
                  Submit and track extension program proposals
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-green-600 rounded-full" />
                  Document community engagement activities
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-green-600 rounded-full" />
                  Upload activity photos and supporting documents
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 bg-green-600 rounded-full" />
                  Generate basic activity reports
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRolesDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {`${user.firstName} ${user.lastName}`}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department?.name ?? "—"}</TableCell>
                <TableCell>
                  {user.position ? formatPosition(user.position) : "—"}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.contactNumber ?? "—"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0 w-8 h-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 w-4 h-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="mr-2 w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.firstName}{" "}
              {userToDelete?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
