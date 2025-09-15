import { PrismaClient, AgencyCategory, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Philippine government agencies and sample data...');

  // Create Philippine Government Agencies
  const agencies = await Promise.all([
    // Executive Departments
    prisma.agency.create({
      data: {
        name: 'Department of Budget and Management',
        acronym: 'DBM',
        category: AgencyCategory.NATIONAL,
        description: 'Central government agency responsible for the formulation and implementation of the National Budget',
        contactEmail: 'info@dbm.gov.ph',
        website: 'https://www.dbm.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Department of Finance',
        acronym: 'DOF',
        category: AgencyCategory.NATIONAL,
        description: 'Executive department of the Philippine government responsible for the formulation of sound fiscal policies',
        contactEmail: 'info@dof.gov.ph',
        website: 'https://www.dof.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Bureau of Internal Revenue',
        acronym: 'BIR',
        category: AgencyCategory.NATIONAL,
        description: 'Largest revenue collection agency under the Department of Finance',
        contactEmail: 'contactus@bir.gov.ph',
        website: 'https://www.bir.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Department of Public Works and Highways',
        acronym: 'DPWH',
        category: AgencyCategory.NATIONAL,
        description: 'Executive department of the Philippine government responsible for public works',
        contactEmail: 'dpwh.secretary@gmail.com',
        website: 'https://www.dpwh.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Department of Education',
        acronym: 'DepEd',
        category: AgencyCategory.NATIONAL,
        description: 'Executive department of the Philippine government responsible for ensuring access to quality basic education',
        contactEmail: 'action@deped.gov.ph',
        website: 'https://www.deped.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Department of Health',
        acronym: 'DOH',
        category: AgencyCategory.NATIONAL,
        description: 'Executive department of the Philippine government responsible for ensuring access to basic public health services',
        contactEmail: 'secretary@doh.gov.ph',
        website: 'https://www.doh.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Department of Information and Communications Technology',
        acronym: 'DICT',
        category: AgencyCategory.NATIONAL,
        description: 'Executive department of the Philippine government responsible for the planning, development and promotion of the ICT agenda',
        contactEmail: 'osec@dict.gov.ph',
        website: 'https://www.dict.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Department of the Interior and Local Government',
        acronym: 'DILG',
        category: AgencyCategory.NATIONAL,
        description: 'Executive department of the Philippine government responsible for promoting peace and order, ensuring public safety',
        contactEmail: 'dilg.secretary@gmail.com',
        website: 'https://www.dilg.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Department of National Defense',
        acronym: 'DND',
        category: AgencyCategory.NATIONAL,
        description: 'Executive department of the Philippine government responsible for guarding against external and internal threats',
        contactEmail: 'dnd.oaffairs@gmail.com',
        website: 'https://www.dnd.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Department of Foreign Affairs',
        acronym: 'DFA',
        category: AgencyCategory.NATIONAL,
        description: 'Executive department of the Philippine government tasked to contribute to the enhancement of national security',
        contactEmail: 'dfa.official@gmail.com',
        website: 'https://www.dfa.gov.ph',
      },
    }),
    // Constitutional Commissions
    prisma.agency.create({
      data: {
        name: 'Commission on Audit',
        acronym: 'COA',
        category: AgencyCategory.CONSTITUTIONAL,
        description: 'Independent constitutional commission responsible for auditing government agencies',
        contactEmail: 'coa@coa.gov.ph',
        website: 'https://www.coa.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Commission on Elections',
        acronym: 'COMELEC',
        category: AgencyCategory.CONSTITUTIONAL,
        description: 'Constitutional commission responsible for enforcing and administering all laws and regulations relative to elections',
        contactEmail: 'info@comelec.gov.ph',
        website: 'https://www.comelec.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Civil Service Commission',
        acronym: 'CSC',
        category: AgencyCategory.CONSTITUTIONAL,
        description: 'Constitutional commission responsible for the civil service system',
        contactEmail: 'contact@csc.gov.ph',
        website: 'https://www.csc.gov.ph',
      },
    }),
    // Sectoral Agencies
    prisma.agency.create({
      data: {
        name: 'National Economic and Development Authority',
        acronym: 'NEDA',
        category: AgencyCategory.SECTORAL,
        description: 'Independent cabinet-level agency responsible for economic development and planning',
        contactEmail: 'info@neda.gov.ph',
        website: 'https://www.neda.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Philippine Statistics Authority',
        acronym: 'PSA',
        category: AgencyCategory.SECTORAL,
        description: 'Central statistical authority of the Philippine government',
        contactEmail: 'info@psa.gov.ph',
        website: 'https://www.psa.gov.ph',
      },
    }),
    prisma.agency.create({
      data: {
        name: 'Technical Education and Skills Development Authority',
        acronym: 'TESDA',
        category: AgencyCategory.SECTORAL,
        description: 'Agency responsible for managing and supervising technical education and skills development',
        contactEmail: 'contact@tesda.gov.ph',
        website: 'https://www.tesda.gov.ph',
      },
    }),
    // Local Government
    prisma.agency.create({
      data: {
        name: 'Metropolitan Manila Development Authority',
        acronym: 'MMDA',
        category: AgencyCategory.LOCAL,
        description: 'Agency responsible for the delivery of basic services in Metro Manila',
        contactEmail: 'mmda@mmda.gov.ph',
        website: 'https://www.mmda.gov.ph',
      },
    }),
  ]);

  console.log(`Created ${agencies.length} government agencies`);

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'dbm.admin@ph.gov.ph',
        name: 'DBM Administrator',
        role: UserRole.DBM_ADMIN,
        agencyId: agencies.find(a => a.acronym === 'DBM')?.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'coa.auditor@ph.gov.ph',
        name: 'COA Auditor',
        role: UserRole.COA_AUDITOR,
        agencyId: agencies.find(a => a.acronym === 'COA')?.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'dpwh.head@ph.gov.ph',
        name: 'DPWH Department Head',
        role: UserRole.AGENCY_HEAD,
        agencyId: agencies.find(a => a.acronym === 'DPWH')?.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'doh.head@ph.gov.ph',
        name: 'DOH Department Head',
        role: UserRole.AGENCY_HEAD,
        agencyId: agencies.find(a => a.acronym === 'DOH')?.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'dict.admin@ph.gov.ph',
        name: 'DICT System Administrator',
        role: UserRole.SYSTEM_ADMIN,
        agencyId: agencies.find(a => a.acronym === 'DICT')?.id,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create sample budget allocations
  const allocations = await Promise.all([
    prisma.allocation.create({
      data: {
        agencyId: agencies.find(a => a.acronym === 'DPWH')!.id,
        title: 'Flood Control Management System',
        description: 'Construction and improvement of flood control systems in Metro Manila',
        amount: 1500000000, // 1.5 billion PHP
        fiscalYear: 2024,
        uacsCode: '45010000',
        status: 'APPROVED',
      },
    }),
    prisma.allocation.create({
      data: {
        agencyId: agencies.find(a => a.acronym === 'DOH')!.id,
        title: 'Health Facility Enhancement Program',
        description: 'Upgrading of public hospitals and rural health units',
        amount: 800000000, // 800 million PHP
        fiscalYear: 2024,
        uacsCode: '55010000',
        status: 'APPROVED',
      },
    }),
    prisma.allocation.create({
      data: {
        agencyId: agencies.find(a => a.acronym === 'DepEd')!.id,
        title: 'School Building Program',
        description: 'Construction of new classrooms and school facilities',
        amount: 1200000000, // 1.2 billion PHP
        fiscalYear: 2024,
        uacsCode: '41010000',
        status: 'RELEASED',
      },
    }),
    prisma.allocation.create({
      data: {
        agencyId: agencies.find(a => a.acronym === 'DICT')!.id,
        title: 'National Broadband Program',
        description: 'Expansion of national broadband infrastructure',
        amount: 500000000, // 500 million PHP
        fiscalYear: 2024,
        uacsCode: '83010000',
        status: 'PROPOSED',
      },
    }),
    prisma.allocation.create({
      data: {
        agencyId: agencies.find(a => a.acronym === 'DPWH')!.id,
        title: 'Road Network Development',
        description: 'Construction and rehabilitation of national roads',
        amount: 2000000000, // 2 billion PHP
        fiscalYear: 2024,
        uacsCode: '45020000',
        status: 'APPROVED',
      },
    }),
  ]);

  console.log(`Created ${allocations.length} budget allocations`);

  // Create sample fund releases
  const releases = await Promise.all([
    prisma.release.create({
      data: {
        allocationId: allocations.find(a => a.title.includes('School Building'))!.id,
        agencyId: agencies.find(a => a.acronym === 'DepEd')!.id,
        amount: 400000000, // 400 million PHP
        description: 'First tranche for school building construction',
        referenceNo: 'RELEASE-2024-001',
        status: 'RELEASED',
        releasedAt: new Date('2024-01-15'),
      },
    }),
    prisma.release.create({
      data: {
        allocationId: allocations.find(a => a.title.includes('Flood Control'))!.id,
        agencyId: agencies.find(a => a.acronym === 'DPWH')!.id,
        amount: 600000000, // 600 million PHP
        description: 'Initial release for flood control projects',
        referenceNo: 'RELEASE-2024-002',
        status: 'RELEASED',
        releasedAt: new Date('2024-02-01'),
      },
    }),
    prisma.release.create({
      data: {
        allocationId: allocations.find(a => a.title.includes('Health Facility'))!.id,
        agencyId: agencies.find(a => a.acronym === 'DOH')!.id,
        amount: 300000000, // 300 million PHP
        description: 'First release for health facility upgrades',
        referenceNo: 'RELEASE-2024-003',
        status: 'APPROVED',
      },
    }),
  ]);

  console.log(`Created ${releases.length} fund releases`);

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        allocationId: allocations.find(a => a.title.includes('School Building'))!.id,
        agencyId: agencies.find(a => a.acronym === 'DepEd')!.id,
        releaseId: releases.find(r => r.referenceNo === 'RELEASE-2024-001')?.id,
        name: 'Classroom Construction - Region I',
        description: 'Construction of 50 new classrooms in Region I',
        budget: 100000000, // 100 million PHP
        location: 'Region I (Ilocos Region)',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-31'),
        status: 'ONGOING',
      },
    }),
    prisma.project.create({
      data: {
        allocationId: allocations.find(a => a.title.includes('Flood Control'))!.id,
        agencyId: agencies.find(a => a.acronym === 'DPWH')!.id,
        releaseId: releases.find(r => r.referenceNo === 'RELEASE-2024-002')?.id,
        name: 'Marikina River Flood Control',
        description: 'Improvement of flood control systems along Marikina River',
        budget: 250000000, // 250 million PHP
        location: 'Marikina City, Metro Manila',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-06-30'),
        status: 'ONGOING',
      },
    }),
    prisma.project.create({
      data: {
        allocationId: allocations.find(a => a.title.includes('Health Facility'))!.id,
        agencyId: agencies.find(a => a.acronym === 'DOH')!.id,
        releaseId: releases.find(r => r.referenceNo === 'RELEASE-2024-003')?.id,
        name: 'Rural Health Unit Upgrading - Bicol',
        description: 'Upgrading of 20 rural health units in Bicol Region',
        budget: 80000000, // 80 million PHP
        location: 'Bicol Region',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-11-30'),
        status: 'PLANNING',
      },
    }),
  ]);

  console.log(`Created ${projects.length} projects`);

  // Create sample expenditures
  const expenditures = await Promise.all([
    prisma.expenditure.create({
      data: {
        releaseId: releases.find(r => r.referenceNo === 'RELEASE-2024-001')!.id,
        projectId: projects.find(p => p.name.includes('Classroom Construction'))?.id,
        amount: 25000000, // 25 million PHP
        beneficiary: 'ABC Construction Corp',
        description: 'Payment for construction materials and labor',
        documentHash: 'QmT78zSuBmuS4z925WFZdy2k7Qpf9UKYbH9v8gKzWqgG9d',
        category: 'CAPITAL_OUTLAY',
        status: 'SPENT',
        spentAt: new Date('2024-03-15'),
      },
    }),
    prisma.expenditure.create({
      data: {
        releaseId: releases.find(r => r.referenceNo === 'RELEASE-2024-002')!.id,
        projectId: projects.find(p => p.name.includes('Marikina River'))?.id,
        amount: 45000000, // 45 million PHP
        beneficiary: 'XYZ Engineering Services',
        description: 'Design and engineering services for flood control system',
        documentHash: 'QmNkWk8v8z4J7Y6t5r4e3w2q1p9o8i7u6y5t4r3e2w1q',
        category: 'MOOE',
        status: 'VERIFIED',
        spentAt: new Date('2024-04-10'),
      },
    }),
    prisma.expenditure.create({
      data: {
        releaseId: releases.find(r => r.referenceNo === 'RELEASE-2024-001')!.id,
        projectId: projects.find(p => p.name.includes('Classroom Construction'))?.id,
        amount: 15000000, // 15 million PHP
        beneficiary: 'Department of Education - Region I',
        description: 'Salaries of project supervisors and technical staff',
        documentHash: 'QmX9v8n7m6k5j4h3g2f1d2s3a4q5w6e7r8t9y0u1i2o3p',
        category: 'PERSONNEL',
        status: 'SPENT',
        spentAt: new Date('2024-03-30'),
      },
    }),
  ]);

  console.log(`Created ${expenditures.length} expenditures`);

  // Create sample audit logs
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        action: 'CREATE_ALLOCATION',
        entityType: 'Allocation',
        entityId: allocations[0].id,
        newValues: JSON.stringify({
          title: allocations[0].title,
          amount: allocations[0].amount,
          agencyId: allocations[0].agencyId,
        }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Budget Transparency System)',
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'CREATE_RELEASE',
        entityType: 'Release',
        entityId: releases[0].id,
        newValues: JSON.stringify({
          amount: releases[0].amount,
          allocationId: releases[0].allocationId,
        }),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Budget Transparency System)',
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'CREATE_EXPENDITURE',
        entityType: 'Expenditure',
        entityId: expenditures[0].id,
        newValues: JSON.stringify({
          amount: expenditures[0].amount,
          beneficiary: expenditures[0].beneficiary,
        }),
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Budget Transparency System)',
      },
    }),
  ]);

  console.log(`Created ${auditLogs.length} audit logs`);

  console.log('Database seeding completed successfully!');
  console.log('Summary:');
  console.log(`- ${agencies.length} government agencies`);
  console.log(`- ${users.length} users`);
  console.log(`- ${allocations.length} budget allocations`);
  console.log(`- ${releases.length} fund releases`);
  console.log(`- ${projects.length} projects`);
  console.log(`- ${expenditures.length} expenditures`);
  console.log(`- ${auditLogs.length} audit logs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });