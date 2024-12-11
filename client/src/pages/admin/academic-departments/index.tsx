import {
  Users,
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  School,
  Building2,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentsApi } from "@/services/api/departments.service";
import { DepartmentFormModal } from "@/components/admin/academic-departments/department-form-modal";
import { AcademicProgram } from "@/types/department.types";

import {
  DASELogo,
  DAELogo,
  DCJELogo,
  DBALogo,
  DTPLogo,
  DTELogo,
  SHSLogo,
} from "@/assets/images/department-logos";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

// Map logos to department abbreviations using imported URLs
const departmentLogos: Record<string, string> = {
  DAE: DAELogo,
  SHS: SHSLogo,
  DTP: DTPLogo,
  DTE: DTELogo,
  DCJE: DCJELogo,
  DBA: DBALogo,
  DASE: DASELogo,
};

// Map fallback icons to department types
const departmentIcons: Record<string, React.ReactNode> = {
  DAE: <GraduationCap className="w-full h-full text-primary" />,
  SHS: <School className="w-full h-full text-primary" />,
  DTP: <Building2 className="w-full h-full text-primary" />,
  // Add more department-specific icons as needed
};

// Helper function to get logo by abbreviation
function getLogoByAbbreviation(abbreviation: string): React.ReactNode {
  const normalizedAbbreviation = abbreviation.toUpperCase();
  const logoUrl = departmentLogos[normalizedAbbreviation];
  const fallbackIcon = departmentIcons[normalizedAbbreviation];

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${abbreviation} logo`}
        className="object-contain w-full h-full"
        onError={() => {
          // If image fails to load, we'll show the fallback icon or default
          return (
            fallbackIcon || (
              <GraduationCap className="w-full h-full text-primary" />
            )
          );
        }}
      />
    );
  }

  // Return department-specific icon or default icon
  return (
    <div className="flex justify-center items-center w-full h-full">
      {fallbackIcon || <GraduationCap className="w-full h-full text-primary" />}
    </div>
  );
}

interface DepartmentCardProps {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  slug: string;
  totalStudents: number;
  totalPrograms: number;
  academicPrograms: {
    active: AcademicProgram[];
    inactive: AcademicProgram[];
  };
  onDepartmentDeleted?: () => void;
}

interface Department {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  logoUrl: string | null;
  totalStudents: number;
  totalPrograms: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  academicPrograms: {
    id: number;
    name: string;
    abbreviation: string;
    description: string;
    totalStudents: number;
    status: "ACTIVE" | "INACTIVE";
  }[];
}

function DepartmentCard({
  id,
  name,
  abbreviation,
  totalStudents = 0,
  totalPrograms = 0,
  description,
  onDepartmentDeleted,
}: DepartmentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await departmentsApi.delete(id.toString());

      if (response.success) {
        toast.success(`${name} department deleted successfully`);
        setShowDeleteDialog(false);
        onDepartmentDeleted?.(); // Call the refetch callback
      } else {
        toast.error(response.message || "Failed to delete department");
      }
    } catch (error) {
      toast.error("Failed to delete department");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      className="block rounded-lg border cursor-pointer group bg-card hover:shadow-lg hover:border-primary/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex relative gap-4 items-start">
        <Link
          to={`/admin/academic-departments/${id}`}
          className="flex flex-1 gap-4 items-start p-4"
        >
          <div className="p-2 rounded-lg transition-colors bg-primary/10 group-hover:bg-primary/20 outline outline-1 outline-primary/20">
            <div className="w-10 aspect-square">
              {getLogoByAbbreviation(abbreviation)}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
              {name}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex gap-2 items-center">
                <Users className="w-4 h-4" />
                <span>{totalStudents} Students</span>
              </div>
              <div className="flex gap-2 items-center">
                <BookOpen className="w-4 h-4" />
                <span>{totalPrograms} Academic Programs</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Menu Button */}
        <div
          className="absolute top-0 right-0"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 w-8 h-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DepartmentFormModal
                mode="edit"
                department={{
                  id: id.toString(),
                  name,
                  abbreviation,
                  description,
                }}
                onSuccess={onDepartmentDeleted}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 w-4 h-4" />
                    Edit
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the{" "}
                <span className="font-semibold">{name}</span> department and all
                associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}

// Format departments data
function formatDepartments(departments: Department[]): DepartmentCardProps[] {
  if (!departments) return [];

  return departments
    .map((dept) => ({
      id: dept.id,
      name: dept.name,
      abbreviation: dept.abbreviation,
      description: dept.description || "",
      slug: dept.abbreviation.toLowerCase(),
      totalStudents: dept.totalStudents,
      totalPrograms: dept.totalPrograms,
      academicPrograms: {
        // If academicPrograms is an array, split it by status
        active:
          dept.academicPrograms?.filter((p) => p.status === "ACTIVE") || [],
        inactive:
          dept.academicPrograms?.filter((p) => p.status === "INACTIVE") || [],
      },
    }))
    .filter((dept): dept is DepartmentCardProps => dept !== null);
}

// Add this new component for loading state
function DepartmentCardSkeleton() {
  return (
    <div className="block rounded-lg border bg-card">
      <div className="flex gap-4 items-start p-6">
        <Skeleton className="w-14 h-14" />
        <div className="flex-1 space-y-4">
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-full h-16" />
          <div className="space-y-2">
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-1/3 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this new component for loading stats
function StatsCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <Skeleton className="mb-2 w-1/2 h-4" />
      <Skeleton className="w-1/3 h-8" />
    </div>
  );
}

export default function DepartmentsPage() {
  const {
    data: departmentsData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.getAll,
  });

  const formattedDepartments = departmentsData?.data
    ? // @ts-expect-error - TODO: Fix this type
      formatDepartments(departmentsData.data)
    : [];

  // Render loading state
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          {/* Stats Loading */}
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>

          {/* Cards Loading */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <DepartmentCardSkeleton key={i} />
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm font-medium text-muted-foreground">
              Total Departments
            </p>
            <p className="text-2xl font-bold">
              {departmentsData?.data?.length || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm font-medium text-muted-foreground">
              Total Students
            </p>
            <p className="text-2xl font-bold">
              {formattedDepartments?.reduce(
                (acc, dept) => acc + (dept.totalStudents || 0),
                0
              )}
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm font-medium text-muted-foreground">
              Total Programs
            </p>
            <p className="text-2xl font-bold">
              {formattedDepartments?.reduce(
                (acc, dept) => acc + (dept.totalPrograms || 0),
                0
              )}
            </p>
          </div>
        </div>

        {/* Department Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {formattedDepartments.length ? (
            formattedDepartments.map((department) => (
              <DepartmentCard
                key={department.id}
                {...department}
                onDepartmentDeleted={() => refetch()}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link to="/admin" className="transition-colors hover:text-foreground">
            Admin
          </Link>
          <ChevronRight className="mx-2 w-4 h-4" />
          <span className="font-medium text-foreground">
            Academic Departments
          </span>
        </nav>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Academic Departments
            </h2>
            <p className="text-muted-foreground">
              Manage your institution's academic departments
            </p>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex gap-4 justify-between items-center">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search departments..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions Group */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                /* Add your report generation logic here */
              }}
            >
              <FileText className="mr-2 w-4 h-4" />
              Generate Report
            </Button>

            <DepartmentFormModal
              mode="create"
              onSuccess={() => refetch()}
              trigger={
                <Button>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Department
                </Button>
              }
            />
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col col-span-full justify-center items-center p-8 text-center rounded-lg border bg-muted/10">
      <Users className="mb-4 w-10 h-10 text-muted-foreground" />
      <h3 className="mb-1 text-lg font-semibold">No departments found</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Get started by creating your first academic department.
      </p>
      <DepartmentFormModal mode="create" />
    </div>
  );
}
