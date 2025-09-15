import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AllocationStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');
    const fiscalYear = searchParams.get('fiscalYear');
    const status = searchParams.get('status');
    const include = searchParams.get('include');

    const whereClause: any = {};
    if (agencyId) whereClause.agencyId = agencyId;
    if (fiscalYear) whereClause.fiscalYear = parseInt(fiscalYear);
    if (status && Object.values(AllocationStatus).includes(status as AllocationStatus)) {
      whereClause.status = status as AllocationStatus;
    }

    const includeRelations: any = {
      agency: {
        select: {
          id: true,
          name: true,
          acronym: true,
          category: true,
        },
      },
    };

    if (include?.includes('releases')) {
      includeRelations.releases = {
        include: {
          expenditures: true,
        },
      };
    }

    if (include?.includes('projects')) {
      includeRelations.projects = true;
    }

    includeRelations._count = {
      select: {
        releases: true,
        projects: true,
      },
    };

    const allocations = await db.allocation.findMany({
      where: whereClause,
      include: includeRelations,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: allocations });
  } catch (error) {
    console.error('Error fetching allocations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch allocations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      agencyId,
      title,
      description,
      amount,
      fiscalYear,
      uacsCode,
    } = body;

    // Validate required fields
    if (!agencyId || !title || !amount || !fiscalYear) {
      return NextResponse.json(
        { success: false, error: 'Agency ID, title, amount, and fiscal year are required' },
        { status: 400 }
      );
    }

    // Check if agency exists
    const agency = await db.agency.findUnique({
      where: { id: agencyId },
    });
    if (!agency) {
      return NextResponse.json(
        { success: false, error: 'Agency not found' },
        { status: 404 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate fiscal year
    const currentYear = new Date().getFullYear();
    if (fiscalYear < currentYear - 1 || fiscalYear > currentYear + 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid fiscal year' },
        { status: 400 }
      );
    }

    const allocation = await db.allocation.create({
      data: {
        agencyId,
        title,
        description,
        amount: parseFloat(amount),
        fiscalYear: parseInt(fiscalYear),
        uacsCode,
      },
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            acronym: true,
          },
        },
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'CREATE_ALLOCATION',
        entityType: 'Allocation',
        entityId: allocation.id,
        newValues: JSON.stringify(allocation),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: allocation }, { status: 201 });
  } catch (error) {
    console.error('Error creating allocation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create allocation' },
      { status: 500 }
    );
  }
}