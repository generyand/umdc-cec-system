import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";

export default function DepartmentReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportOptions = location.state?.options;

  if (!reportOptions) {
    navigate("/admin/academic-departments");
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Departments
          </Button>
          <h1 className="text-2xl font-bold">Department Report</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 w-4 h-4" />
            Print
          </Button>
          <Button>
            <Download className="mr-2 w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6 rounded-lg border bg-card">
        {/* Add your report content here based on reportOptions */}
      </div>
    </div>
  );
}
