import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const profileContent = `LOHANRAJO INDUSTRIES AND TECHNOLOGIES PRIVATE LIMITED (LIAT) is an ISO 9001:2015 certified engineering and manufacturing company specializing in the design, manufacturing IP rated enclosures, assembly & wiring of control panels, and customized engineering solutions conforming to IP standards.

The company traces its origins to Lohanrajo Metal Arts, Estd in 1992 by visionary entrepreneurs Mr.L.L.Baskar & Mr.L.L.Sekar. Backed by more than three decades of manufacturing excellence and extensive industry expertise, the organization has built a strong reputation for quality, reliability, innovation and on-time delivery.

As a part of strategic growth and expansion, the business has been incorporated as Lohanrajo Industries And Technologies Private Limited, strengthening our capabilities to serve OEMs, System integrators, Industrial automation companies, infrastructure projects, and data center industries with enhanced engineering expertise and organizational excellence.

Today, LIAT continues the legacy of Lohanrajo Metal Arts while embracing advanced manufacturing technologies, modern quality systems, and customer-focused engineering solutions.`;

  const infrastructureContent = `Operating from a modern manufacturing facility spread across 7,200 sq.ft at Perungudi, Chennai, TamilNadu, India, the company has consistently expanded its capabilities to meet the evolving needs of its customers.`;

  const visionContent = `To become one of India's most trusted engineering manufacturing companies by delivering innovative, high-quality products with world-class customer service.`;

  const missionContent = `Deliver quality products on time\nProvide value engineering solutions\nContinuously improve technology and manufacturing capability\nBuild long-term customer relationships\nEnsure customer satisfaction through quality, reliability, and service`;

  // We'll update the AboutContent singleton
  await prisma.aboutContent.upsert({
    where: { id: 'singleton' },
    update: {
      title: 'LOHANRAJO INDUSTRIES AND TECHNOLOGIES',
      subtitle: 'Precision engineering and manufacturing excellence.',
      profileContent: profileContent,
      infrastructureContent: infrastructureContent,
      visionContent: visionContent,
      // Accreditation can hold the mission since there's no mission field
      accreditationContent: missionContent,
      establishedText: 'Estd in 1992',
      founderNames: 'Mr.L.L.Baskar & Mr.L.L.Sekar',
    },
    create: {
      id: 'singleton',
      title: 'LOHANRAJO INDUSTRIES AND TECHNOLOGIES',
      subtitle: 'Precision engineering and manufacturing excellence.',
      profileContent: profileContent,
      infrastructureContent: infrastructureContent,
      visionContent: visionContent,
      accreditationContent: missionContent,
      establishedText: 'Estd in 1992',
      founderNames: 'Mr.L.L.Baskar & Mr.L.L.Sekar',
    }
  });

  console.log("Database updated successfully");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
