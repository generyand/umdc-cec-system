import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const communities = {
  "san-miguel": {
    name: "Barangay San Miguel",
    description: "Served as the adopted community for the academic year 2021-2022. The CEC provided educational resources, community outreach programs, and student volunteer opportunities in the barangay.",
    beneficiaries: 150,
    programs: 3,
    location: "San Miguel, Digos City"
  },
  "dawis": {
    name: "Barangay Dawis",
    description: "The adopted community for the academic year 2022-2023. The CEC built upon the existing partnership, expanding its programs and services to meet the community's needs.",
    beneficiaries: 200,
    programs: 4,
    location: "Dawis, Digos City"
  },
  "ruparan": {
    name: "Barangay Ruparan",
    description: "The CEC expanded its reach to this new community in the 2022-2023 academic year. The center implemented new initiatives to engage residents and build positive relationships.",
    beneficiaries: 175,
    programs: 3,
    location: "Ruparan, Digos City"
  },
};

export default function BarangayPage() {
  const { slug } = useParams();
  const community = communities[slug as keyof typeof communities];

  if (!community) return <div>{slug ? "Community not found" : "Loading..."}</div>;

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-4 pb-6 border-b">
        <Link
          to="/admin/community-engagement/partner-communities"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
          <p className="text-gray-500">{community.location}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Stats Cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Total Beneficiaries</h3>
            <p className="text-3xl font-bold text-primary">{community.beneficiaries}</p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Active Programs</h3>
            <p className="text-3xl font-bold text-primary">{community.programs}</p>
          </div>
        </div>

        {/* Description and Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">About the Community</h2>
            <p className="text-gray-700 leading-relaxed">{community.description}</p>
          </div>

          {/* Programs Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Current Programs</h2>
            <div className="space-y-4">
              {/* Placeholder for programs - you can map through actual program data */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Educational Support</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Providing educational resources and support to community members
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Community Outreach</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Regular community engagement activities and support programs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}