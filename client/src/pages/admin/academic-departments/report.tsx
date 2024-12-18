import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, FileSpreadsheet } from "lucide-react";
import { reportsApi } from "@/services/api/reports.service";
import { useQuery } from "@tanstack/react-query";

export default function NumberOfBannerProgramsPerDepartmentReport() {
  const navigate = useNavigate();
  
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["departmentReports"],
    queryFn: reportsApi.getDepartmentReports,
  });

  if (isLoading) {
    return <div>Loading report...</div>;
  }

  if (!reportData) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Banner Programs per Department Report</h1>
            <p className="text-muted-foreground">
              Generated on {new Date(reportData.data.metadata.generatedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 w-4 h-4" />
            Print
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 w-4 h-4" />
            Export to Excel
          </Button>
          <Button>
            <Download className="mr-2 w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Main Report Table */}
      <Card>
        <div className="p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border px-4 py-2 text-left">Dept.</th>
                <th className="border px-4 py-2 text-center" colSpan={3}>
                  Number of Academic Programs
                </th>
                <th className="border px-4 py-2 text-center">
                  Number of Banner Programs
                </th>
                <th className="border px-4 py-2 text-center" colSpan={2}>
                  Number of Banner Projects Implemented
                </th>
                <th className="border px-4 py-2 text-center">Remarks</th>
              </tr>
              <tr className="bg-muted/30">
                <th className="border px-4 py-2"></th>
                <th className="border px-4 py-2 text-center">Total</th>
                <th className="border px-4 py-2 text-center">Active</th>
                <th className="border px-4 py-2 text-center">Inactive</th>
                <th className="border px-4 py-2"></th>
                <th className="border px-4 py-2 text-center">Target</th>
                <th className="border px-4 py-2 text-center">Actual</th>
                <th className="border px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {reportData.data.departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-muted/50">
                  <td className="border px-4 py-2 font-medium">{dept.code}</td>
                  <td className="border px-4 py-2 text-center">{dept.academicPrograms.total}</td>
                  <td className="border px-4 py-2 text-center text-green-600">
                    {dept.academicPrograms.active}
                  </td>
                  <td className="border px-4 py-2 text-center text-red-600">
                    {dept.academicPrograms.inactive}
                  </td>
                  <td className="border px-4 py-2 text-center">{dept.bannerPrograms.count}</td>
                  <td className="border px-4 py-2 text-center">{dept.bannerProjects.target}</td>
                  <td className="border px-4 py-2 text-center">
                    {dept.bannerProjects.actual} 
                    {dept.bannerProjects.target > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {' '}({dept.bannerProjects.completionRate}%)
                      </span>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">-</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50 font-bold">
                <td className="border px-4 py-2">TOTAL</td>
                <td className="border px-4 py-2 text-center">
                  {reportData.data.totals.academicPrograms.total}
                </td>
                <td className="border px-4 py-2 text-center text-green-600">
                  {reportData.data.totals.academicPrograms.active}
                </td>
                <td className="border px-4 py-2 text-center text-red-600">
                  {reportData.data.totals.academicPrograms.inactive}
                </td>
                <td className="border px-4 py-2 text-center">
                  {reportData.data.totals.bannerPrograms.count}
                </td>
                <td className="border px-4 py-2 text-center">
                  {reportData.data.totals.bannerProjects.target}
                </td>
                <td className="border px-4 py-2 text-center">
                  {reportData.data.totals.bannerProjects.actual}
                </td>
                <td className="border px-4 py-2 text-center">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Report Metadata */}
      <div className="text-sm text-muted-foreground">
        <p>Report Period: {new Date(reportData.data.metadata.reportPeriod.start).toLocaleDateString()} - {new Date(reportData.data.metadata.reportPeriod.end).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
