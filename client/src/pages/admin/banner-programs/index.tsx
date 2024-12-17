import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
// import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { bannerProgramsApi } from "@/services/api/banner-programs.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface Department {
  id: number;
  name: string;
}

interface BannerProgram {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  department: {
    name: string;
  };
  activeProjects: number;
  completedProjects: number;
}

const BannerProgramSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="grid gap-6 p-6">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-20 h-5" />
            </div>
            <Skeleton className="w-48 h-4" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2.5">
        <Skeleton className="w-24 h-4" />
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-muted/50">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-24 h-4" />
          </div>
          <div className="pl-8">
            <Skeleton className="w-16 h-8" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="pl-8">
            <Skeleton className="w-16 h-8" />
          </div>
        </div>
      </div>

      {/* Action Button Skeleton */}
      <Skeleton className="w-full h-10" />
    </CardContent>
  </Card>
);

const BannerProgramsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["banner-programs"],
    queryFn: bannerProgramsApi.getBannerPrograms,
  });

  const programs = response?.data.bannerPrograms ?? [];
  const departments = response?.data.departments ?? [];

  const filteredPrograms = programs.filter((program: BannerProgram) => {
    const matchesSearch =
      program.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || program.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" ||
      program.department.name === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // const getStatusColor = (status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
  //   switch (status) {
  //     case "ACTIVE":
  //       return "bg-emerald-100 text-emerald-800";
  //     case "INACTIVE":
  //       return "bg-slate-100 text-slate-800";
  //     case "SUSPENDED":
  //       return "bg-amber-100 text-amber-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <Skeleton className="w-48 h-8" />
            <Skeleton className="mt-2 w-96 h-4" />
          </div>
          <Skeleton className="w-32 h-10" />
        </div>

        {/* Search and Filters Card */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <Skeleton className="w-full h-10" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <BannerProgramSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading banner programs</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Banner Programs
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage and monitor University of Mindanao's flagship extension
            programs
          </p>
        </div>
      </div>

      {/* Search and Filters Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((department: Department) => (
                      <SelectItem key={department.id} value={department.name}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programs Grid */}
      {filteredPrograms.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No programs found matching your criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program: BannerProgram) => (
            <Card
              key={program.name}
              className="transition-all group hover:shadow-md hover:border-primary/20"
            >
              <CardContent className="grid gap-6 p-6">
                {/* Program Header - Improved hierarchy and accessibility */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                      <div className="flex gap-3 items-center">
                        <h3 className="text-xl font-semibold tracking-tight">
                          {program.abbreviation}
                        </h3>
                        {/* <Badge
                          variant="secondary"
                          className={cn(
                            "shrink-0",
                            getStatusColor(program.status)
                          )}
                        >
                          {program.status}
                        </Badge> */}
                      </div>
                      <p className="text-base text-muted-foreground">
                        {program.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center text-sm">
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="font-medium text-muted-foreground">
                      {program.department.name}
                    </span>
                  </div>
                </div>

                {/* Description - Added expandable functionality */}
                <div className="space-y-2.5">
                  <h4 className="flex gap-2 items-center text-sm font-medium">
                    About the Program
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 h-6 text-xs"
                      title="Show more"
                    >
                      Read more
                    </Button> */}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {program.description}
                  </p>
                </div>

                {/* Stats - Enhanced visual presentation */}
                <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <div className="flex justify-center items-center w-6 h-6 bg-emerald-100 rounded-full">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">
                        Active Projects
                      </span>
                    </div>
                    <div className="flex gap-2 items-baseline pl-8">
                      <span className="text-2xl font-semibold tabular-nums">
                        {program.activeProjects}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        upcoming/ongoing
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <div className="flex justify-center items-center w-6 h-6 bg-blue-100 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <div className="flex gap-2 items-baseline pl-8">
                      <span className="text-2xl font-semibold tabular-nums">
                        {program.completedProjects}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        total
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button - Enhanced interaction */}
                <Button
                  variant="ghost"
                  className="w-full font-medium group-hover:bg-primary/5"
                  aria-label={`View details for ${program.name}`}
                  onClick={() => {
                    navigate(
                      `/admin/community-engagement/banner-programs/${program.id}`
                    );
                  }}
                >
                  View Program Details
                  <svg
                    className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerProgramsPage;
