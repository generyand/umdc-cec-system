import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { departmentsApi } from "@/services/api/departments.service";

interface DepartmentReportProps {
  trigger?: React.ReactNode;
}

export function DepartmentReportModal({ trigger }: DepartmentReportProps) {
  const { data: response, isLoading } = useQuery({
    queryKey: ["departments-report"],
    queryFn: departmentsApi.getDepartmentsReport,
  });

  const defaultTrigger = (
    <Button variant="outline">
      <FileText className="mr-2 w-4 h-4" />
      Generate Report
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Department Statistics Report</DialogTitle>
          <DialogDescription>
            Overview of academic programs and banner projects across departments
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-0 right-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  /* Add export logic */
                }}
              >
                <Download className="mr-2 w-4 h-4" />
                Export
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2}>Dept.</TableHead>
                  <TableHead colSpan={3} className="text-center border">
                    Number of Academic Programs
                  </TableHead>
                  <TableHead rowSpan={2} className="text-center">
                    Number of Banner Programs
                  </TableHead>
                  <TableHead colSpan={2} className="text-center border">
                    Number of Banner Projects Implemented
                  </TableHead>
                  <TableHead rowSpan={2}>Remarks</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-center">Inactive</TableHead>
                  <TableHead className="text-center">Target</TableHead>
                  <TableHead className="text-center">Actual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {response?.data.map((dept) => (
                  <TableRow key={dept.abbreviation}>
                    <TableCell>{dept.abbreviation}</TableCell>
                    <TableCell className="text-center">
                      {dept.totalPrograms}
                    </TableCell>
                    <TableCell className="text-center">
                      {dept.activePrograms}
                    </TableCell>
                    <TableCell className="text-center">
                      {dept.inactivePrograms}
                    </TableCell>
                    <TableCell className="text-center">
                      {dept.bannerPrograms}
                    </TableCell>
                    <TableCell className="text-center">
                      {dept.targetProjects}
                    </TableCell>
                    <TableCell className="text-center">
                      {dept.actualProjects} (
                      {(
                        (dept.actualProjects / dept.targetProjects) *
                        100
                      ).toFixed(0)}
                      %)
                    </TableCell>
                    <TableCell>{dept.remarks}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-medium">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-center">
                    {response?.data.reduce(
                      (acc, dept) => acc + dept.totalPrograms,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {response?.data.reduce(
                      (acc, dept) => acc + dept.activePrograms,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {response?.data.reduce(
                      (acc, dept) => acc + dept.inactivePrograms,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {response?.data.reduce(
                      (acc, dept) => acc + dept.bannerPrograms,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {response?.data.reduce(
                      (acc, dept) => acc + dept.targetProjects,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {response?.data.reduce(
                      (acc, dept) => acc + dept.actualProjects,
                      0
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
