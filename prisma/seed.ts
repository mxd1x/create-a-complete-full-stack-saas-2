import { PrismaClient, LeadPriority, LeadStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const passwordHash = await hash("password123", 12);
  const adminEmail = process.env.ADMIN_EMAIL ?? "founder@pipelinecrm.test";

  const org = await prisma.organization.upsert({
    where: { slug: "acme-sales" },
    update: {},
    create: {
      name: "Acme Sales",
      slug: "acme-sales",
      industry: "Technology"
    }
  });

  const users = await Promise.all(
    [
      { name: "Alex Morgan", email: adminEmail, role: "ADMIN" as const, title: "Sales Director" },
      { name: "Jordan Lee", email: "jordan@pipelinecrm.test", role: "USER" as const, title: "Account Executive" },
      { name: "Sam Rivera", email: "sam@pipelinecrm.test", role: "USER" as const, title: "SDR" }
    ].map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { organizationId: org.id, title: u.title },
        create: {
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
          title: u.title,
          organizationId: org.id,
          subscriptions: {
            create: {
              plan: "Pro",
              status: "active",
              monthlyPriceCents: 9900,
              currentPeriodEnds: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
            }
          }
        }
      })
    )
  );

  const [alex, jordan, sam] = users;

  const companies = await Promise.all(
    [
      { name: "Northwind Systems", website: "https://northwind.example", industry: "SaaS", size: "51-200" },
      { name: "Summit Logistics", website: "https://summit.example", industry: "Logistics", size: "201-500" },
      { name: "Bright Dental Group", website: "https://brightdental.example", industry: "Healthcare", size: "11-50" },
      { name: "Atlas Manufacturing", website: "https://atlas.example", industry: "Manufacturing", size: "500+" },
      { name: "Harbor Finance", website: "https://harbor.example", industry: "Finance", size: "51-200" },
      { name: "Pixel Studio", website: "https://pixel.example", industry: "Creative", size: "1-10" }
    ].map((c) =>
      prisma.company.upsert({
        where: { id: `seed_${slugify(c.name)}` },
        update: c,
        create: { id: `seed_${slugify(c.name)}`, organizationId: org.id, ...c }
      })
    )
  );

  const leadsData: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    companyId: string;
    companyName: string;
    status: LeadStatus;
    priority: LeadPriority;
    assignedToId: string;
    createdById: string;
    followUpAt: Date;
    tags: string[];
    notes?: string;
  }> = [
    {
      id: "seed_lead_1",
      name: "Morgan Chen",
      email: "morgan@northwind.example",
      phone: "(415) 555-0101",
      companyId: companies[0].id,
      companyName: companies[0].name,
      status: "NEW",
      priority: "HIGH",
      assignedToId: sam.id,
      createdById: alex.id,
      followUpAt: new Date(Date.now() + 86400000),
      tags: ["inbound"]
    },
    {
      id: "seed_lead_2",
      name: "Taylor Brooks",
      email: "taylor@summit.example",
      phone: "(602) 555-0102",
      companyId: companies[1].id,
      companyName: companies[1].name,
      status: "CONTACTED",
      priority: "MEDIUM",
      assignedToId: jordan.id,
      createdById: alex.id,
      followUpAt: new Date(Date.now() + 172800000),
      tags: ["enterprise"]
    },
    {
      id: "seed_lead_3",
      name: "Dr. Riley Park",
      email: "riley@brightdental.example",
      phone: "(512) 555-0103",
      companyId: companies[2].id,
      companyName: companies[2].name,
      status: "QUALIFIED",
      priority: "URGENT",
      assignedToId: jordan.id,
      createdById: sam.id,
      followUpAt: new Date(Date.now() + 259200000),
      tags: ["healthcare"]
    },
    {
      id: "seed_lead_4",
      name: "Casey Ortiz",
      email: "casey@atlas.example",
      phone: "(313) 555-0104",
      companyId: companies[3].id,
      companyName: companies[3].name,
      status: "PROPOSAL_SENT",
      priority: "HIGH",
      assignedToId: alex.id,
      createdById: jordan.id,
      followUpAt: new Date(Date.now() + 432000000),
      tags: ["enterprise", "q2"]
    },
    {
      id: "seed_lead_5",
      name: "Jamie Walsh",
      email: "jamie@harbor.example",
      phone: "(212) 555-0105",
      companyId: companies[4].id,
      companyName: companies[4].name,
      status: "WON",
      priority: "MEDIUM",
      assignedToId: jordan.id,
      createdById: alex.id,
      followUpAt: new Date(Date.now() - 86400000),
      tags: ["won"]
    },
    {
      id: "seed_lead_6",
      name: "Alex Kim",
      email: "alex@pixel.example",
      phone: "(503) 555-0106",
      companyId: companies[5].id,
      companyName: companies[5].name,
      status: "LOST",
      priority: "LOW",
      assignedToId: sam.id,
      createdById: sam.id,
      followUpAt: new Date(Date.now() - 604800000),
      tags: ["churned"]
    },
    {
      id: "seed_lead_7",
      name: "Pat Nguyen",
      email: "pat@northwind.example",
      phone: "(415) 555-0107",
      companyId: companies[0].id,
      companyName: companies[0].name,
      status: "CONTACTED",
      priority: "HIGH",
      assignedToId: sam.id,
      createdById: jordan.id,
      followUpAt: new Date(Date.now() + 86400000 * 3),
      tags: ["upsell"]
    },
    {
      id: "seed_lead_8",
      name: "Dana Ellis",
      email: "dana@summit.example",
      phone: "(602) 555-0108",
      companyId: companies[1].id,
      companyName: companies[1].name,
      status: "NEW",
      priority: "MEDIUM",
      assignedToId: jordan.id,
      createdById: sam.id,
      followUpAt: new Date(Date.now() + 86400000 * 2),
      tags: []
    },
    {
      id: "seed_lead_9",
      name: "Chris Holt",
      email: "chris@harbor.example",
      phone: "(212) 555-0109",
      companyId: companies[4].id,
      companyName: companies[4].name,
      status: "QUALIFIED",
      priority: "HIGH",
      assignedToId: alex.id,
      createdById: alex.id,
      followUpAt: new Date(Date.now() + 86400000 * 5),
      tags: ["finance"]
    },
    {
      id: "seed_lead_10",
      name: "Robin Shaw",
      email: "robin@atlas.example",
      phone: "(313) 555-0110",
      companyId: companies[3].id,
      companyName: companies[3].name,
      status: "PROPOSAL_SENT",
      priority: "URGENT",
      assignedToId: jordan.id,
      createdById: alex.id,
      followUpAt: new Date(Date.now() + 86400000),
      tags: ["manufacturing"]
    },
    {
      id: "seed_lead_11",
      name: "Lee Martinez",
      email: "lee@brightdental.example",
      phone: "(512) 555-0111",
      companyId: companies[2].id,
      companyName: companies[2].name,
      status: "WON",
      priority: "MEDIUM",
      assignedToId: sam.id,
      createdById: jordan.id,
      followUpAt: new Date(Date.now() - 172800000),
      tags: []
    },
    {
      id: "seed_lead_12",
      name: "Quinn Reed",
      email: "quinn@pixel.example",
      phone: "(503) 555-0112",
      companyId: companies[5].id,
      companyName: companies[5].name,
      status: "NEW",
      priority: "LOW",
      assignedToId: sam.id,
      createdById: sam.id,
      followUpAt: new Date(Date.now() + 86400000 * 7),
      tags: ["starter"]
    },
    {
      id: "seed_lead_13",
      name: "Jordan Price",
      email: "jordan.price@northwind.example",
      phone: "(415) 555-0113",
      companyId: companies[0].id,
      companyName: companies[0].name,
      status: "CONTACTED",
      priority: "MEDIUM",
      assignedToId: jordan.id,
      createdById: alex.id,
      followUpAt: new Date(Date.now() + 86400000 * 4),
      tags: []
    },
    {
      id: "seed_lead_14",
      name: "Morgan Blake",
      email: "morgan.blake@harbor.example",
      phone: "(212) 555-0114",
      companyId: companies[4].id,
      companyName: companies[4].name,
      status: "LOST",
      priority: "LOW",
      assignedToId: alex.id,
      createdById: jordan.id,
      followUpAt: new Date(Date.now() - 1209600000),
      tags: []
    },
    {
      id: "seed_lead_15",
      name: "Sydney Cole",
      email: "sydney@summit.example",
      phone: "(602) 555-0115",
      companyId: companies[1].id,
      companyName: companies[1].name,
      status: "WON",
      priority: "HIGH",
      assignedToId: alex.id,
      createdById: alex.id,
      followUpAt: new Date(Date.now() - 259200000),
      tags: ["expansion"]
    }
  ];

  for (const lead of leadsData) {
    await prisma.lead.upsert({
      where: { id: lead.id },
      update: lead,
      create: { ...lead, organizationId: org.id }
    });
  }

  await prisma.activityLog.create({
    data: {
      userId: alex.id,
      action: "CRM seed data created",
      metadata: { organizationId: org.id, leadCount: leadsData.length }
    }
  });

  console.log("Seed complete:", { org: org.slug, users: users.length, companies: companies.length, leads: leadsData.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
