import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users2,
  History,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

// Add interfaces for the new data structure
// interface BarangayOfficial {
//   name: string;
//   position: string;
//   contact: string;
//   email?: string;
// }

// interface GalleryImage {
//   url: string;
//   caption: string;
//   date: string;
//   category: "community" | "program";
// }

// Expanded community data structure
const communities = {
  "san-miguel": {
    name: "Barangay San Miguel",
    description:
      "Served as the adopted community for the academic year 2021-2022. The CEC provided educational resources, community outreach programs, and student volunteer opportunities in the barangay.",
    location: "San Miguel, Digos City",
    history: `Established in 1945, Barangay San Miguel has been a vital part of Digos City's growth. 
      The community has strong agricultural roots and has developed into a thriving residential area. 
      Over the years, it has become a model for community development programs and civic engagement.`,
    coordinates: "6.7494° N, 125.3567° E",
    officials: [
      {
        name: "Juan Dela Cruz",
        position: "Barangay Captain",
        contact: "09123456789",
        email: "juan.delacruz@digoscity.gov.ph",
      },
      {
        name: "Maria Santos",
        position: "Barangay Secretary",
        contact: "09187654321",
        email: "maria.santos@digoscity.gov.ph",
      },
      {
        name: "Pedro Reyes",
        position: "Kagawad - Education",
        contact: "09234567890",
        email: "pedro.reyes@digoscity.gov.ph",
      },
    ],
    contactInfo: {
      office: "(082) 553-2847",
      email: "sanmiguel@digoscity.gov.ph",
      address: "San Miguel Hall, National Highway, Digos City",
    },
    stats: {
      totalBeneficiaries: 150,
      activePrograms: 3,
      completedPrograms: 5,
      studentVolunteers: 45,
      totalOutcomes: 15,
      volunteerHours: 450,
    },
    currentPrograms: [
      {
        name: "Educational Support Initiative",
        description:
          "Providing educational resources and support to community members",
        status: "ongoing",
        beneficiaries: 50,
        startDate: "2024-01",
        outcomes: [
          "Distributed learning materials to 50 students",
          "Established community learning hub",
          "Weekly tutoring sessions",
        ],
      },
      {
        name: "Community Health Program",
        description: "Regular health check-ups and medical assistance",
        status: "ongoing",
        beneficiaries: 75,
        startDate: "2024-02",
        outcomes: [
          "Monthly health screenings",
          "Health education workshops",
          "Medicine distribution program",
        ],
      },
      {
        name: "Skills Training Workshop",
        description: "Vocational training for community members",
        status: "ongoing",
        beneficiaries: 25,
        startDate: "2024-03",
        outcomes: [
          "Basic computer literacy training",
          "Entrepreneurship workshops",
          "Handicraft skills development",
        ],
      },
    ],
    completedPrograms: [
      {
        name: "Literacy Campaign",
        description: "Adult literacy program for community members",
        status: "completed",
        beneficiaries: 30,
        startDate: "2023-06",
        endDate: "2023-12",
        outcomes: [
          "30 adults completed basic literacy training",
          "Established community reading club",
          "Distributed reading materials",
        ],
      },
      {
        name: "Environmental Awareness",
        description: "Community clean-up and environmental education",
        status: "completed",
        beneficiaries: 100,
        startDate: "2023-08",
        endDate: "2023-11",
        outcomes: [
          "Conducted 5 community clean-up drives",
          "Established waste segregation system",
          "Planted 200 trees",
        ],
      },
    ],
    gallery: [
      {
        url: "/images/san-miguel/community-cleanup-2024.jpg",
        caption: "Community Cleanup Drive 2024",
        date: "2024-02-15",
        category: "program",
      },
      {
        url: "/images/san-miguel/literacy-program.jpg",
        caption: "Adult Literacy Program Graduation",
        date: "2023-12-20",
        category: "program",
      },
      {
        url: "/images/san-miguel/health-mission.jpg",
        caption: "Community Health Mission",
        date: "2024-01-10",
        category: "program",
      },
    ],
  },
  dawis: {
    name: "Barangay Dawis",
    description:
      "The adopted community for the academic year 2022-2023. The CEC built upon the existing partnership, expanding its programs and services to meet the community's needs.",
    location: "Dawis, Digos City",
    history: `Barangay Dawis, established in 1952, has evolved from a small farming community into a vibrant neighborhood. 
      The barangay is known for its strong community ties and active participation in local development initiatives.`,
    coordinates: "6.7523° N, 125.3542° E",
    officials: [
      {
        name: "Roberto Luna",
        position: "Barangay Captain",
        contact: "09198765432",
        email: "roberto.luna@digoscity.gov.ph",
      },
      {
        name: "Ana Reyes",
        position: "Barangay Secretary",
        contact: "09187654323",
        email: "ana.reyes@digoscity.gov.ph",
      },
    ],
    contactInfo: {
      office: "(082) 553-2848",
      email: "dawis@digoscity.gov.ph",
      address: "Dawis Barangay Hall, Roxas Avenue, Digos City",
    },
    stats: {
      totalBeneficiaries: 200,
      activePrograms: 4,
      completedPrograms: 3,
      studentVolunteers: 55,
      totalOutcomes: 12,
      volunteerHours: 520,
    },
    currentPrograms: [
      {
        name: "Youth Development Program",
        description: "Comprehensive youth development initiatives",
        status: "ongoing",
        beneficiaries: 60,
        startDate: "2024-01",
        outcomes: [
          "Sports training programs",
          "Leadership workshops",
          "Academic tutorials",
        ],
      },
      // ... add more current programs
    ],
    completedPrograms: [
      {
        name: "Community Garden Project",
        description: "Urban gardening initiative",
        status: "completed",
        beneficiaries: 45,
        startDate: "2023-05",
        endDate: "2023-11",
        outcomes: [
          "Established 15 community gardens",
          "Conducted gardening workshops",
          "Created sustainable food source",
        ],
      },
      // ... add more completed programs
    ],
    gallery: [
      {
        url: "/images/dawis/youth-program.jpg",
        caption: "Youth Leadership Workshop",
        date: "2024-01-20",
        category: "program",
      },
      // ... add more gallery items
    ],
  },
  ruparan: {
    name: "Barangay Ruparan",
    description:
      "The CEC expanded its reach to this new community in the 2022-2023 academic year. The center implemented new initiatives to engage residents and build positive relationships.",
    location: "Ruparan, Digos City",
    history: `Barangay Ruparan, one of the newer barangays in Digos City, was established in 1975. 
      The community has shown remarkable progress in urban development while maintaining its agricultural heritage.`,
    coordinates: "6.7512° N, 125.3589° E",
    officials: [
      {
        name: "Juan Dela Cruz",
        position: "Barangay Captain",
        contact: "09123456789",
        email: "juan.delacruz@digoscity.gov.ph",
      },
      {
        name: "Maria Santos",
        position: "Barangay Secretary",
        contact: "09187654321",
        email: "maria.santos@digoscity.gov.ph",
      },
      {
        name: "Pedro Reyes",
        position: "Kagawad - Education",
        contact: "09234567890",
        email: "pedro.reyes@digoscity.gov.ph",
      },
    ],
    contactInfo: {
      office: "(082) 553-2847",
      email: "ruparan@digoscity.gov.ph",
      address: "Ruparan Barangay Hall, National Highway, Digos City",
    },
    stats: {
      totalBeneficiaries: 175,
      activePrograms: 3,
      completedPrograms: 4,
      studentVolunteers: 35,
      totalOutcomes: 14,
      volunteerHours: 380,
    },
    currentPrograms: [
      {
        name: "Educational Support Initiative",
        description:
          "Providing educational resources and support to community members",
        status: "ongoing",
        beneficiaries: 50,
        startDate: "2024-01",
        outcomes: [
          "Distributed learning materials to 50 students",
          "Established community learning hub",
          "Weekly tutoring sessions",
        ],
      },
      {
        name: "Community Health Program",
        description: "Regular health check-ups and medical assistance",
        status: "ongoing",
        beneficiaries: 75,
        startDate: "2024-02",
        outcomes: [
          "Monthly health screenings",
          "Health education workshops",
          "Medicine distribution program",
        ],
      },
      {
        name: "Skills Training Workshop",
        description: "Vocational training for community members",
        status: "ongoing",
        beneficiaries: 25,
        startDate: "2024-03",
        outcomes: [
          "Basic computer literacy training",
          "Entrepreneurship workshops",
          "Handicraft skills development",
        ],
      },
    ],
    completedPrograms: [
      {
        name: "Literacy Campaign",
        description: "Adult literacy program for community members",
        status: "completed",
        beneficiaries: 30,
        startDate: "2023-06",
        endDate: "2023-12",
        outcomes: [
          "30 adults completed basic literacy training",
          "Established community reading club",
          "Distributed reading materials",
        ],
      },
      {
        name: "Environmental Awareness",
        description: "Community clean-up and environmental education",
        status: "completed",
        beneficiaries: 100,
        startDate: "2023-08",
        endDate: "2023-11",
        outcomes: [
          "Conducted 5 community clean-up drives",
          "Established waste segregation system",
          "Planted 200 trees",
        ],
      },
    ],
    gallery: [
      {
        url: "/images/ruparan/community-cleanup-2024.jpg",
        caption: "Community Cleanup Drive 2024",
        date: "2024-02-15",
        category: "program",
      },
      {
        url: "/images/ruparan/literacy-program.jpg",
        caption: "Adult Literacy Program Graduation",
        date: "2023-12-20",
        category: "program",
      },
      {
        url: "/images/ruparan/health-mission.jpg",
        caption: "Community Health Mission",
        date: "2024-01-10",
        category: "program",
      },
    ],
  },
};

export default function BarangayPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const community = communities[slug as keyof typeof communities];

  if (!community)
    return <div>{slug ? "Community not found" : "Loading..."}</div>;

  return (
    <div className="mx-auto space-y-8 w-full">
      {/* Header Section - Same as before */}
      <div className="flex gap-4 items-center">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="cursor-pointer hover:text-primary"
        />
        <h1 className="text-2xl font-semibold">{community.name}</h1>
      </div>

      {/* Simplified Stats Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex gap-4 items-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Active Programs
              </span>
              <div className="flex gap-1 items-baseline">
                <span className="text-2xl font-bold text-primary">
                  {community.stats.activePrograms}
                </span>
                <span className="text-sm text-muted-foreground">ongoing</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {community.currentPrograms.slice(0, 2).map((program) => (
              <div
                key={program.name}
                className="flex gap-2 items-center text-sm text-muted-foreground"
              >
                <div className="w-2 h-2 rounded-full bg-primary/60" />
                <span>{program.name}</span>
              </div>
            ))}
            {community.currentPrograms.length > 2 && (
              <div className="text-sm font-medium text-primary">
                +{community.currentPrograms.length - 2} more programs
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Completed Programs
              </span>
              <div className="flex gap-1 items-baseline">
                <span className="text-2xl font-bold text-green-600">
                  {community.stats.completedPrograms}
                </span>
                <span className="text-sm text-muted-foreground">completed</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {community.completedPrograms.slice(0, 2).map((program) => (
              <div
                key={program.name}
                className="flex gap-2 items-center text-sm text-muted-foreground"
              >
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span>{program.name}</span>
              </div>
            ))}
            {community.completedPrograms.length > 2 && (
              <div className="text-sm font-medium text-green-600">
                +{community.completedPrograms.length - 2} more programs
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="basic-info" className="space-y-6">
        <TabsList className="justify-start w-full">
          <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="contact">Contact & Officials</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic-info" className="space-y-6">
          <Card className="p-6">
            <div className="flex gap-2 items-center mb-4">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">History</h2>
            </div>
            <p className="leading-relaxed text-gray-700">{community.history}</p>
          </Card>

          <Card className="p-6">
            <div className="flex gap-2 items-center mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Location Details</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                Address: {community.contactInfo.address}
              </p>
              <p className="text-gray-700">
                Coordinates: {community.coordinates}
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-6">
          <Tabs defaultValue="ongoing" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ongoing">Ongoing Programs</TabsTrigger>
              <TabsTrigger value="completed">Completed Programs</TabsTrigger>
            </TabsList>

            <TabsContent value="ongoing" className="space-y-4">
              {community.currentPrograms?.map((program) => (
                <Card key={program.name} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{program.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Started: {program.startDate}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                      {program.beneficiaries} beneficiaries
                    </span>
                  </div>

                  <p className="mb-4 text-gray-600">{program.description}</p>

                  {program.outcomes && (
                    <div className="mt-4">
                      <h4 className="mb-2 font-medium">Current Progress:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {program.outcomes.map((outcome, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 mt-4 border-t">
                    <div className="flex gap-2 items-center">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        Started {program.startDate}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {program.beneficiaries} participants
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {community.completedPrograms?.map((program) => (
                <Card key={program.name} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{program.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {program.startDate} - {program.endDate}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm text-green-600 bg-green-50 rounded-full">
                      Completed
                    </span>
                  </div>

                  <p className="mb-4 text-gray-600">{program.description}</p>

                  {program.outcomes && (
                    <div className="mt-4">
                      <h4 className="mb-2 font-medium">Outcomes Achieved:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {program.outcomes.map((outcome, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 mt-4 border-t">
                    <div className="flex gap-2 items-center">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        Duration: {program.startDate} - {program.endDate}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {program.beneficiaries} beneficiaries
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {community.gallery.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium">{image.caption}</p>
                  <p className="text-sm text-gray-500">{image.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact & Officials Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="p-6">
            <div className="flex gap-2 items-center mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Contact Information</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                Office: {community.contactInfo.office}
              </p>
              <p className="text-gray-700">
                Email: {community.contactInfo.email}
              </p>
              <p className="text-gray-700">
                Address: {community.contactInfo.address}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-2 items-center mb-4">
              <Users2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Barangay Officials</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {community.officials.map((official) => (
                <div
                  key={official.name}
                  className="p-4 rounded-lg border border-gray-100"
                >
                  <h3 className="font-semibold">{official.name}</h3>
                  <p className="text-sm text-gray-500">{official.position}</p>
                  <div className="mt-2 space-y-1">
                    <p className="flex gap-2 items-center text-sm">
                      <Phone className="w-4 h-4" />
                      {official.contact}
                    </p>
                    {official.email && (
                      <p className="flex gap-2 items-center text-sm">
                        <Mail className="w-4 h-4" />
                        {official.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
