import { PrismaClient, Role, LeadStage, Priority, ProjectStatus, CollaboratorStatus, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function rand<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scoreLead(input: { sector: string; source: string; phone?: string | null; email?: string | null; budget?: number; followUpAt?: Date | null }) {
  let score = 0;
  const sector = input.sector.toLowerCase();
  const source = input.source.toLowerCase();

  if (sector.includes("edil") || sector.includes("showroom")) score += 25;
  if (input.phone && input.email) score += 15;
  if (source.includes("referral") || source.includes("google")) score += 10;
  if ((input.budget ?? 0) >= 8000) score += 20;
  if (input.followUpAt && input.followUpAt.getTime() < Date.now()) score += 10;

  return Math.max(0, Math.min(100, score));
}

async function main() {
  await prisma.aiVariant.deleteMany();
  await prisma.aiProject.deleteMany();
  await prisma.brandPreset.deleteMany();
  await prisma.task.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.project.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash("admin123", 10);
  const salesPass = await bcrypt.hash("sales123", 10);

  const admin = await prisma.user.create({
    data: { name: "Admin Prisma", email: "admin@prisma.local", role: Role.ADMIN, passwordHash: adminPass }
  });

  const sales = await prisma.user.create({
    data: { name: "Sales Prisma", email: "sales@prisma.local", role: Role.SALES, passwordHash: salesPass }
  });

  const preset = await prisma.brandPreset.create({
    data: {
      name: "PRISMA Default",
      isDefault: true,
      logoUrl: "/prisma-logo.svg",
      paletteJson: { bg: "#0B0F1A", surface: "#121A2E", primary: "#7C3AED", accent: "#22D3EE" },
      typographyJson: { font: "Inter", headline: "700", body: "400" },
      layoutJson: { radius: "2xl", shadow: "soft", safeMargins: true }
    }
  });

  const sectors = ["Edilizia", "Showroom Casa", "Estetica", "Palestra", "Ristrutturazioni", "Impianti"];
  const sources = ["Facebook", "Instagram", "Google", "Referral", "Subito", "PagineGialle"];
  const stages = [LeadStage.NEW, LeadStage.CONTACTED, LeadStage.QUALIFIED, LeadStage.APPOINTMENT, LeadStage.PROPOSAL, LeadStage.WON, LeadStage.LOST];

  for (let i = 0; i < 6; i++) {
    await prisma.company.create({
      data: {
        name: `Azienda ${i + 1} SRL`,
        sector: rand(sectors),
        vat: `IT00${Math.floor(100000000 + Math.random() * 899999999)}`,
        address: `Via ${rand(["Roma", "Milano", "Verdi", "Garibaldi"])} ${10 + i}, Crema`,
        notes: "Cliente potenziale con presenza social discontinua."
      }
    });
  }

  const companyList = await prisma.company.findMany();

  for (let i = 0; i < 15; i++) {
    const sector = rand(sectors);
    const source = rand(sources);
    const followUpAt = Math.random() > 0.6 ? new Date(Date.now() - 864e5 * rand([1, 2, 3, 5])) : new Date(Date.now() + 864e5 * rand([1, 2, 4, 7]));
    const budget = rand([3000, 5000, 8000, 12000, 20000]);

    const phone = "3" + Math.floor(100000000 + Math.random() * 899999999);
    const email = `lead${i + 1}@mail.it`;

    const score = scoreLead({ sector, source, phone, email, budget, followUpAt });

    await prisma.lead.create({
      data: {
        name: `Lead ${i + 1}`,
        phone,
        email,
        sector,
        source,
        stage: rand(stages),
        priority: rand([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
        score,
        tags: rand([["hot"], ["preventivo"], ["followup"], ["promo"], ["recruiting"]]),
        followUpAt,
        notes: "Note rapide: richiede preventivo e vuole vedere esempi.",
        assignedToId: Math.random() > 0.4 ? sales.id : admin.id,
        companyId: Math.random() > 0.5 ? rand(companyList).id : null
      }
    });
  }

  for (let i = 0; i < 6; i++) {
    await prisma.project.create({
      data: {
        name: `Cantiere ${i + 1} - ${rand(["Bagno", "Cucina", "Facciata", "Impianto", "Ristrutturazione"])}`,
        status: rand([ProjectStatus.KICKOFF, ProjectStatus.ACTIVE, ProjectStatus.PAUSED, ProjectStatus.CLOSED]),
        valueEstimate: rand([5000, 12000, 18000, 25000]),
        startAt: new Date(Date.now() - 864e5 * rand([7, 14, 30])),
        endAt: new Date(Date.now() + 864e5 * rand([14, 30, 60])),
        companyId: rand(companyList).id,
        notes: "Milestone: sopralluogo, preventivo, approvazione."
      }
    });
  }

  const roles = ["Muratore", "Idraulico", "Elettricista", "Posatore", "Video Maker", "Ads Specialist"];
  for (let i = 0; i < 10; i++) {
    await prisma.collaborator.create({
      data: {
        name: `Collaboratore ${i + 1}`,
        role: rand(roles),
        location: rand(["Crema", "Cremona", "Lodi", "Brescia"]),
        rate: rand([120, 180, 250, 350]),
        status: rand([CollaboratorStatus.NEW, CollaboratorStatus.REVIEW, CollaboratorStatus.CONTACTED, CollaboratorStatus.ACTIVE]),
        availability: rand(["Subito", "2 settimane", "Weekend"]),
        notes: "Valutare affidabilità e portfolio."
      }
    });
  }

  const leads = await prisma.lead.findMany();
  for (let i = 0; i < 12; i++) {
    const due = Math.random() > 0.5 ? new Date(Date.now() - 864e5 * rand([1, 2, 4])) : new Date(Date.now() + 864e5 * rand([1, 2, 5]));
    await prisma.task.create({
      data: {
        title: rand(["Chiamata follow-up", "Invia preventivo", "Brief creatività", "Aggiorna pipeline", "Sopralluogo", "Invia proposta"]),
        description: "Task generata dal sistema / manuale.",
        status: rand([TaskStatus.TODO, TaskStatus.DOING, TaskStatus.DONE]),
        dueAt: due,
        priority: rand([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
        assignedToId: rand([admin.id, sales.id]),
        leadId: Math.random() > 0.4 ? rand(leads).id : null
      }
    });
  }

  for (let i = 0; i < 3; i++) {
    const ap = await prisma.aiProject.create({
      data: {
        title: `Campagna ${i + 1} - ${rand(["Promo", "Recruiting", "Autorità"])}`,
        description: "Creatività per PMI locale: stile PRISMA, minimal, leggibile.",
        platform: rand(["Facebook", "Instagram", "Stories", "LinkedIn"]),
        objective: rand(["Awareness", "Lead", "Promo", "Recruiting", "Autorità"]),
        tone: rand(["Professionale", "Diretto", "Premium"]),
        language: "IT",
        formats: ["1080x1080", "1200x628"],
        brandPresetId: preset.id,
        createdById: admin.id
      }
    });

    await prisma.aiVariant.create({
      data: {
        aiProjectId: ap.id,
        type: "copy",
        promptUsed: "MOCK",
        copyJson: {
          headline: "Più clienti, meno stress",
          primary: "Sistema lead, follow-up e campagne in un unico posto. Zero caos.",
          cta: "Scrivici su WhatsApp",
          hooks: ["Nuovi clienti ogni settimana", "Seguìti i follow-up", "Creatività pronte in 1 click", "Pipeline chiara", "Risultati misurabili"]
        }
      }
    });

    await prisma.aiVariant.create({
      data: {
        aiProjectId: ap.id,
        type: "image",
        format: "1080x1080",
        imageUrl: "https://placehold.co/1080x1080/png?text=PRISMA+Creative+Mock",
        promptUsed: "MOCK"
      }
    });
  }

  console.log("✅ Seed completato.");
  console.log("Admin: admin@prisma.local / admin123");
  console.log("Sales: sales@prisma.local / sales123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
