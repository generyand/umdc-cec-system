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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { bannerProgramsApi } from "@/services/api/banner-programs.service";

interface BannerProgram {
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

const BannerProgramsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["banner-programs"],
    queryFn: bannerProgramsApi.getBannerPrograms,
  });

  const programs = response?.data ?? [];

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

  const getStatusColor = (status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-800";
      case "INACTIVE":
        return "bg-slate-100 text-slate-800";
      case "SUSPENDED":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
        <Button size="sm" className="w-full md:w-auto">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Program
        </Button>
      </div>

      {/* Search and Filters Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or abbreviation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Community Extension">
                    Community Extension
                  </SelectItem>
                </SelectContent>
              </Select>
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
            <Card key={program.name} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                {/* Program Header */}
                <div className="flex gap-4 justify-between items-start">
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold tracking-tight leading-none">
                      {program.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {program.abbreviation}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("shrink-0", getStatusColor(program.status))}
                  >
                    {program.status}
                  </Badge>
                </div>

                {/* Department */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {program.department.name}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm line-clamp-2">
                  {program.description}
                </p>

                {/* Stats */}
                <div className="flex gap-4 justify-between items-center mt-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Active</span>
                    <Badge variant="outline" className="mt-1">
                      {program.activeProjects}
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Completed</span>
                    <Badge variant="outline" className="mt-1">
                      {program.completedProjects}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerProgramsPage;
