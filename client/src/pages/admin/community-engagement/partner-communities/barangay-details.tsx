import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Phone,
  Mail,
  Users2,
  History,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { partnerCommunities } from "./mock-data-partnercomms";

export default function BarangayPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const community = partnerCommunities[slug as keyof typeof partnerCommunities];

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
              <h2 className="text-xl font-semibold">Overview</h2>
            </div>
            <p className="text-gray-700 whitespace-pre-line">
              {community.description}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex gap-2 items-center mb-4">
              <Users2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Demographics</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Population</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      2020 Population
                    </p>
                    <p className="text-2xl font-bold">
                      {community.demographics.population.total2020.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {community.demographics.population.percentOfCity}% of
                      Digos City
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      Growth Rate (2015-2020)
                    </p>
                    <p className="text-2xl font-bold">
                      +{community.demographics.population.growthRate}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      Households (2015)
                    </p>
                    <p className="text-2xl font-bold">
                      {community.demographics.households.count2015.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ~{community.demographics.households.averageSize} members
                      per household
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Location & Geography</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Coordinates</p>
                    <p className="font-medium">
                      {community.summary.coordinates.dms}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Elevation</p>
                    <p className="font-medium">
                      {community.summary.elevation.meters}m (
                      {community.summary.elevation.feet}ft)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Administrative Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Region:</span>{" "}
                      {community.summary.region}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Province:</span>{" "}
                      {community.summary.province}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">City:</span>{" "}
                      {community.summary.city}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        Postal Code:
                      </span>{" "}
                      {community.summary.postalCode}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        Island Group:
                      </span>{" "}
                      {community.summary.islandGroup}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-2 items-center mb-4">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Historical Growth</h2>
            </div>
            <p className="text-gray-700">
              {community.demographics.historicalGrowth.description}
            </p>
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
