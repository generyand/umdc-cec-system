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
import { bannerProgramsService } from "@/services/api/banner-programs.service";

const BannerProgramsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["bannerPrograms"],
    queryFn: bannerProgramsService.getBannerPrograms,
  });

  console.log(data);

  const programs = data?.data ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.fullTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.shortTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || program.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || program.department === departmentFilter;
    const matchesYear =
      yearFilter === "all" || program.year.toString() === yearFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesYear;
  });

  return (
    <div className="container space-y-8">
      {/* Header Section - Enhanced with action button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Programs</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and monitor University of Mindanao's flagship extension
            programs
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 w-4 h-4" />
          Add New Program
        </Button>
      </div>

      {/* Filters Section - Enhanced with better layout and search icon */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Community Extension">
                Community Extension
              </SelectItem>
              {/* Add more departments */}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Programs Grid - Enhanced with better spacing and hover effects */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">
              No programs found matching your criteria
            </p>
          </div>
        ) : (
          filteredPrograms.map((program) => (
            <Card key={program.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex gap-4 justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">
                      {program.shortTitle}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {program.fullTitle}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("shrink-0", getStatusColor(program.status))}
                  >
                    {program.status}
                  </Badge>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="font-medium min-w-24">Department:</span>
                    <span>{program.department}</span>
                  </div>
                  <p className="text-sm">{program.description}</p>
                </div>

                <div className="flex flex-col gap-4 justify-between mt-4 sm:flex-row">
                  <div className="text-sm">
                    <span className="font-medium">Active Projects: </span>
                    <Badge variant="secondary" className="ml-1">
                      {program.activeProjects}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {program.partnerCommunities.map((community) => (
                      <Badge
                        key={community}
                        variant="outline"
                        className="text-xs"
                      >
                        {community}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BannerProgramsPage;
