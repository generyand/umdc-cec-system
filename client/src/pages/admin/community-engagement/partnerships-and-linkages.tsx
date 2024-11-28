import { Card } from "@/components/ui/card";

interface Partner {
  name: string;
  type: string;
  description?: string;
}

const partners: Partner[] = [
  {
    name: "DILG Region XI",
    type: "Government Agency",
    description: "Department of the Interior and Local Government - Region XI",
  },
  {
    name: "Goodlife Community Cares Foundation, Inc.",
    type: "Non-Profit Organization",
    description: "Community welfare and development foundation",
  },
  {
    name: "Haven of Hope Orphanage",
    type: "Non-Profit Organization",
    description: "Orphanage and child welfare center",
  },
  {
    name: "ForumZFD",
    type: "International NGO",
    description: "German civil peace service organization",
  },
  {
    name: "CDRRMC Digos",
    type: "Government Agency",
    description: "City Disaster Risk Reduction and Management Council of Digos",
  },
  {
    name: "Commission on Human Rights Region XI (CHR-XI)",
    type: "Government Agency",
    description: "Regional human rights commission",
  },
  {
    name: "DepEd Division of Digos City",
    type: "Government Agency",
    description: "Department of Education - Digos City Division",
  },
  {
    name: "Davao del Sur Katuparan Center",
    type: "Community Center",
    description: "Local community development center",
  },
];

export default function PartnershipsAndLinkagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="mb-4 text-2xl font-bold">Partnerships and Linkages</h1>

      <p className="mb-6 text-muted-foreground">
        Our institution maintains strong partnerships with various organizations
        to enhance our community engagement and service delivery.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <Card
            key={partner.name}
            className="p-4 transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">{partner.name}</h3>
            <p className="mb-2 text-sm text-muted-foreground">{partner.type}</p>
            {partner.description && (
              <p className="text-sm text-muted-foreground">
                {partner.description}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
