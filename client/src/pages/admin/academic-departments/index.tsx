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
} from "lucide-react";
import { Link } from "react-router-dom";
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
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentsApi } from "@/services/api/departments.services";
import { AddDepartmentModal } from "@/components/admin/academic-departments/add-department-modal";
import { AcademicProgram, Department } from "@/types/department.types";
import daeLogoUrl from "@/assets/images/department-logos/DAE.png";
import shsLogoUrl from "@/assets/images/department-logos/SHS.png";
import dtpLogoUrl from "@/assets/images/department-logos/DTP.png";
import dteLogoUrl from "@/assets/images/department-logos/DTE.png";
import dcjeLogoUrl from "@/assets/images/department-logos/DCJE.png";
import dbaLogoUrl from "@/assets/images/department-logos/DBA.png";
import daseLogoUrl from "@/assets/images/department-logos/DASE.png";

// Types
interface DepartmentCardProps {
  id: string;
  name: string;
  slug: string;
  abbreviation: string;
  description: string;
  totalStudents: number;
  totalPrograms: number;
  academicPrograms: AcademicProgram[];
  onDepartmentDeleted?: () => void;
}

// Create a type for department abbreviations to ensure type safety
//

// Map logos to department abbreviations using imported URLs
const departmentLogos: Record<string, string> = {
  DAE: daeLogoUrl,
  SHS: shsLogoUrl,
  DTP: dtpLogoUrl,
  DTE: dteLogoUrl,
  DCJE: dcjeLogoUrl,
  DBA: dbaLogoUrl,
  DASE: daseLogoUrl,
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

function DepartmentCard({
  id,
  name,
  abbreviation,
  slug,
  totalStudents = 0,
  totalPrograms = 0,
  description,
  onDepartmentDeleted,
}: DepartmentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    // TODO: Implement edit functionality

    toast.info("Edit functionality coming soon");
  };

  const handleDelete = async () => {
    try {
      // TODO: Implement delete functionality
      const response = await departmentsApi.delete(id);
      if (response.success) {
        toast.success(`${name} department deleted successfully`);
        setShowDeleteDialog(false);
        onDepartmentDeleted?.();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`Failed to delete ${name} department: ${error}`);
    }
  };

  return (
    <div className="block p-6 rounded-lg border transition-all duration-200 group bg-card hover:shadow-lg hover:border-primary/20">
      <div className="flex gap-4 items-start">
        <Link
          to={`/admin/academic-departments/${slug}`}
          className="flex flex-1 gap-4 items-start"
        >
          <div className="p-3 rounded-lg transition-colors bg-primary/10 group-hover:bg-primary/20 outline outline-1 outline-primary/20">
            <div className="w-8 h-8">{getLogoByAbbreviation(abbreviation)}</div>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 w-8 h-8 text-muted-foreground"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
              <Pencil className="mr-2 w-4 h-4" />
              Edit
            </DropdownMenuItem>
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// Format departments data
function formatDepartments(departments: Department[]) {
  return departments.map((department) => ({
    id: department.id,
    name: department.name,
    abbreviation: department.abbreviation,
    description: department.description || "",
    slug: department.slug || department.abbreviation.toLowerCase(),
    totalStudents: department.totalStudents,
    totalPrograms: department.totalPrograms,
    academicPrograms: department.academicPrograms,
  }));
}

export default function DepartmentsPage() {
  const { data: departmentsData, refetch } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.getAll,
  });

  const formattedDepartments = departmentsData?.data
    ? formatDepartments(departmentsData.data)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Academic Departments
            </h2>
            <p className="text-muted-foreground">
              Manage your institution's academic departments
            </p>
          </div>
          <AddDepartmentModal onDepartmentCreated={() => refetch()} />
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              className="pl-9"
              // value={}
              // onChange={(e) => setSearch(e.target.value)}
            />
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
      </div>

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
      <AddDepartmentModal />
    </div>
  );
}
