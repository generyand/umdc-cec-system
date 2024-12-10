import React from "react";
import { AlertCircle } from "lucide-react";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <AlertCircle className="mb-4 w-16 h-16 text-red-500" />
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        Unauthorized Access
      </h1>
      <p className="text-lg text-gray-600">
        You do not have permission to view this page.
      </p>
    </div>
  );
};

export default UnauthorizedPage;
