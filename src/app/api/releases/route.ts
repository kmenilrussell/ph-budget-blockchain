import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ReleaseStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const allocationId = searchParams.get('allocationId');
    const agencyId = searchParams.get('agencyId');
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (allocationId) whereClause.allocationId = allocationId;
    if (agencyId) whereClause.agencyId = agencyId;
    if (status && Object.values(ReleaseStatus).includes(status as ReleaseStatus)) {
      whereClause.status = status as ReleaseStatus;
    }

    const releases = await db.release.findMany({
      where: whereClause,
      include: {
        allocation: {
          include: {
            agency: {
              select: {
                id: true,
                name: true,
                acronym: true,
              },
            },
          },
        },
        agency: {
          select: {
            id: true,
            name: true,
            acronym: true,
          },
        },
        expenditures: true,
        projects: true,
        _count: {
          select: {
            expenditures: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: releases });
  } catch (error) {
    console.error('Error fetching releases:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch releases' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      allocationId,
      agencyId,
      amount,
      description,
      referenceNo,
    } = body;

    // Validate required fields
    if (!allocationId || !agencyId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Allocation ID, agency ID, and amount are required' },
        { status: 400 }
      );
    }

    // Check if allocation exists
    const allocation = await db.allocation.findUnique({
      where: { id: allocationId },
      include: {
        releases: true,
      },
    });
    if (!allocation) {
      return NextResponse.json(
        { success: false, error: 'Allocation not found' },
        { status: 404 }
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

    // Check if allocation has enough remaining budget
    const totalReleased = allocation.releases.reduce((sum, release) => sum + release.amount, 0);
    if (totalReleased + parseFloat(amount) > allocation.amount) {
      return NextResponse.json(
        { success: false, error: 'Release amount exceeds remaining allocation budget' },
        { status: 400 }
      );
    }

    const release = await db.release.create({
      data: {
        allocationId,
        agencyId,
        amount: parseFloat(amount),
        description,
        referenceNo,
      },
      include: {
        allocation: {
          include: {
            agency: {
              select: {
                id: true,
                name: true,
                acronym: true,
              },
            },
          },
        },
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
        action: 'CREATE_RELEASE',
        entityType: 'Release',
        entityId: release.id,
        newValues: JSON.stringify(release),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: release }, { status: 201 });
  } catch (error) {
    console.error('Error creating release:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create release' },
      { status: 500 }
    );
  }
}