import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, FileSpreadsheet } from "lucide-react";
import { reportsApi } from "@/services/api/reports.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

// Add this CSS either in a separate file or in your global styles
const printStyles = `
  @media print {
    @page {
      size: landscape;
      margin: 1cm;
    }

    /* Reset page breaks and sizing */
    html, body {
      height: 100%;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
    }

    /* Container adjustments */
    .print-container {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Table specific print styles */
    .print-table {
      width: 100%;
      margin-bottom: 1cm;
      page-break-inside: avoid;
      border-collapse: collapse;
    }

    .print-table th,
    .print-table td {
      padding: 4px 8px;
      border: 1px solid #000;
    }

    /* Hide non-printable elements */
    .no-print, 
    nav, 
    header,
    .header-section {
      display: none !important;
    }

    /* Footer positioning */
    .print-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      margin-top: 2cm;
      page-break-inside: avoid;
    }

    /* Colors for status */
    .print-active {
      color: #16a34a !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print-inactive {
      color: #dc2626 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Department detail tables */
    .department-detail {
      page-break-inside: avoid;
      margin-bottom: 2cm;
    }

    /* Ensure proper spacing between tables */
    .print-table + .print-table {
      margin-top: 1cm;
    }

    /* Department headers */
    .department-header {
      margin-bottom: 0.5cm;
      page-break-after: avoid;
    }
  }
`;

export default function NumberOfBannerProgramsPerDepartmentReport() {
  const navigate = useNavigate();
  const { currentSchoolYear } = useAuth();
  
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["departmentReports"],
    queryFn: reportsApi.getDepartmentReports,
  });

  if (isLoading) {
    return <div>Loading report...</div>;
  }

  if (!reportData || !currentSchoolYear) {
    return null;
  }

  return (
    <>
      {/* Inject print styles */}
      <style>{printStyles}</style>

      <div className="print-container space-y-6 max-w-[1200px] mx-auto p-6">
        {/* Mark the entire header section as no-print */}
        <div className="header-section no-print">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4 items-center">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Banner Programs per Department Report</h1>
                <p className="text-muted-foreground">
                  School Year {currentSchoolYear.year} • Generated on {new Date(reportData.data.metadata.generatedAt).toLocaleString()}
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
        </div>

        {/* Print-only header */}
        <div className="hidden print:block mb-8">
          <h1 className="text-2xl font-bold text-center">University of Mindanao</h1>
          <h2 className="text-xl font-semibold text-center">Banner Programs per Department Report</h2>
          <p className="text-center text-sm mt-2">
            School Year {currentSchoolYear.year}
          </p>
          <p className="text-center text-sm">
            Generated on {new Date(reportData.data.metadata.generatedAt).toLocaleString()}
          </p>
        </div>

        {/* Overview Table */}
        <Card className="print-content mb-8">
          <div className="p-6 print:p-0">
            <h3 className="text-lg font-semibold mb-4">Overview</h3>
            <table className="print-table w-full border-collapse">
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
                    <td className="border px-4 py-2 text-center print-active">
                      {dept.academicPrograms.active}
                    </td>
                    <td className="border px-4 py-2 text-center print-inactive">
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
                  <td className="border px-4 py-2 text-center print-active">
                    {reportData.data.totals.academicPrograms.active}
                  </td>
                  <td className="border px-4 py-2 text-center print-inactive">
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

        {/* Detailed Department Tables */}
        <div className="space-y-8">
          {reportData.data.departments.map((dept) => (
            <Card key={dept.id} className="print-content">
              <div className="p-6 print:p-0">
                <h3 className="text-lg font-semibold mb-4">{dept.name} ({dept.code})</h3>
                <table className="print-table w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th rowSpan={2} className="border px-4 py-2 text-left">Dept.</th>
                      <th colSpan={2} className="border px-4 py-2 text-center text-red-600">
                        Number of Academic Programs
                      </th>
                      <th rowSpan={2} className="border px-4 py-2 text-center">
                        Number of Banner Programs
                      </th>
                      <th colSpan={2} className="border px-4 py-2 text-center">
                        Number of Banner Projects Implemented
                      </th>
                      <th rowSpan={2} className="border px-4 py-2 text-center">Remarks</th>
                    </tr>
                    <tr className="bg-muted/50">
                      <th className="border px-4 py-2 text-center">Active</th>
                      <th className="border px-4 py-2 text-center">Inactive</th>
                      <th className="border px-4 py-2 text-center">Target</th>
                      <th className="border px-4 py-2 text-center">Actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dept.academicPrograms.programs.map((program) => (
                      <tr key={program.id}>
                        <td className="border px-4 py-2">
                          {program.abbreviation}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {program.status === "ACTIVE" ? program.abbreviation : "-"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {program.status === "INACTIVE" ? program.abbreviation : "-"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {program.bannerProgramsCount}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {/* Add target count when available */}
                          -
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {/* Add actual count when available */}
                          -
                        </td>
                        <td className="border px-4 py-2 text-center">-</td>
                      </tr>
                    ))}
                    {/* Department Total Row */}
                    <tr className="bg-muted/50 font-bold">
                      <td className="border px-4 py-2">TOTAL</td>
                      <td className="border px-4 py-2 text-center">
                        {dept.academicPrograms.active}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {dept.academicPrograms.inactive}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {dept.bannerPrograms.count}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {dept.bannerProjects.target}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {dept.bannerProjects.actual} 
                        {dept.bannerProjects.target > 0 && (
                          <span className="text-sm">
                            {' '}({dept.bannerProjects.completionRate}%)
                          </span>
                        )}
                      </td>
                      <td className="border px-4 py-2 text-center">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>

        {/* Report Metadata - Print Only */}
        <div className="print-footer hidden print:block">
          <div className="flex justify-between text-sm">
            <div>
              <p>School Year: {currentSchoolYear.year}</p>
              <p>Report Period: {new Date(reportData.data.metadata.reportPeriod.start).toLocaleDateString()} - {new Date(reportData.data.metadata.reportPeriod.end).toLocaleDateString()}</p>
            </div>
            <div>
              <p>Prepared by: _____________________</p>
              <p className="mt-4">Noted by: _____________________</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
