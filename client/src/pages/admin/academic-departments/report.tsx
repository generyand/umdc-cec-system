import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, FileSpreadsheet, Clock, Calendar } from "lucide-react";
import { reportsApi } from "@/services/api/reports.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { 
  DAELogo, 
  DASELogo, 
  DBALogo, 
  DCJELogo, 
  DTELogo, 
  DTPLogo, 
  SHSLogo 
} from "@/assets/images/department-logos";

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

// Add a logo mapping object
const departmentLogos: { [key: string]: string } = {
  DAE: DAELogo,
  DASE: DASELogo,
  DBA: DBALogo,
  DCJE: DCJELogo,
  DTE: DTELogo,
  DTP: DTPLogo,
  SHS: SHSLogo,
};

export default function NumberOfBannerProgramsPerDepartmentReport() {
  const navigate = useNavigate();
  const { currentSchoolYear } = useAuth();
  
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["departmentReports"],
    queryFn: reportsApi.getDepartmentReports,
  });

  alert("Wassup");

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
        {/* Header Section */}
        <div className="header-section no-print space-y-8">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-base font-medium">Back</span>
            </Button>

            {/* Logos */}
            <div className="flex items-center gap-4">
              <img 
                src="/src/assets/images/cec-logo.webp" 
                alt="UM Logo" 
                className="h-12 w-auto"
              />
              <img 
                src="/src/assets/images/umdc-logo.png" 
                alt="CE Logo" 
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Report Title and Actions Row */}
          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-2xl font-bold">
              Banner Programs per Department Report
            </h1>

            {/* Metadata and Actions */}
            <div className="flex items-center justify-between">
              {/* Report Metadata */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  School Year {currentSchoolYear.year}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Generated on {new Date(reportData.data.metadata.generatedAt).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  onClick={() => window.print()}
                  className="hover:bg-yellow-500 text-black font-medium"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Report
                </Button>
                <Button 
                  variant="default"
                  className="bg-primary hover:bg-primary/90 text-white font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
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
                  <th className="border px-4 py-2 text-left text-primary font-bold">Dept.</th>
                  <th className="border px-4 py-2 text-center text-primary font-bold" colSpan={3}>
                    Number of Academic Programs
                  </th>
                  <th className="border px-4 py-2 text-center text-primary font-bold">
                    Number of Banner Programs
                  </th>
                  <th className="border px-4 py-2 text-center text-primary font-bold" colSpan={2}>
                    Number of Banner Projects Implemented
                  </th>
                  <th className="border px-4 py-2 text-center text-primary font-bold">Remarks</th>
                </tr>
                <tr className="bg-muted/30">
                  <th className="border px-4 py-2 text-primary font-bold"></th>
                  <th className="border px-4 py-2 text-center text-primary font-bold">Total</th>
                  <th className="border px-4 py-2 text-center text-primary font-bold">Active</th>
                  <th className="border px-4 py-2 text-center text-primary font-bold">Inactive</th>
                  <th className="border px-4 py-2 text-primary font-bold"></th>
                  <th className="border px-4 py-2 text-center text-primary font-bold">Target</th>
                  <th className="border px-4 py-2 text-center text-primary font-bold">Actual</th>
                  <th className="border px-4 py-2 text-primary font-bold"></th>
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
                {/* Department Header with Logo */}
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={departmentLogos[dept.code]} 
                    alt={`${dept.code} Logo`} 
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground">{dept.code}</p>
                  </div>
                </div>

                <table className="print-table w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th rowSpan={2} className="border px-4 py-2 text-left text-primary font-bold">
                        Dept.
                      </th>
                      <th colSpan={2} className="border px-4 py-2 text-center text-primary font-bold">
                        Number of Academic Programs
                      </th>
                      <th rowSpan={2} className="border px-4 py-2 text-center text-primary font-bold">
                        Number of Banner Programs
                      </th>
                      <th colSpan={2} className="border px-4 py-2 text-center text-primary font-bold">
                        Number of Banner Projects Implemented
                      </th>
                      <th rowSpan={2} className="border px-4 py-2 text-center text-primary font-bold">
                        Remarks
                      </th>
                    </tr>
                    <tr className="bg-muted/50">
                      <th className="border px-4 py-2 text-center text-primary font-bold">
                        Active
                      </th>
                      <th className="border px-4 py-2 text-center text-primary font-bold">
                        Inactive
                      </th>
                      <th className="border px-4 py-2 text-center text-primary font-bold">
                        Target
                      </th>
                      <th className="border px-4 py-2 text-center text-primary font-bold">
                        Actual
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dept.academicPrograms.programs.map((program, index) => (
                      <tr key={program.id}>
                        {/* Only show department code in first row of the group */}
                        {index === 0 ? (
                          <td className="border px-4 py-2" rowSpan={dept.academicPrograms.programs.length}>
                            {dept.code}
                          </td>
                        ) : null}
                        <td className="border px-4 py-2 text-center">
                          {program.status === "ACTIVE" ? program.abbreviation : "-"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {program.status === "INACTIVE" ? program.abbreviation : "-"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {program.bannerProgramsCount}
                        </td>
                        <td className="border px-4 py-2 text-center">-</td>
                        <td className="border px-4 py-2 text-center">-</td>
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
