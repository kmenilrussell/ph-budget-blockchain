import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProjectStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const allocationId = searchParams.get('allocationId');
    const agencyId = searchParams.get('agencyId');
    const releaseId = searchParams.get('releaseId');
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (allocationId) whereClause.allocationId = allocationId;
    if (agencyId) whereClause.agencyId = agencyId;
    if (releaseId) whereClause.releaseId = releaseId;
    if (status && Object.values(ProjectStatus).includes(status as ProjectStatus)) {
      whereClause.status = status as ProjectStatus;
    }

    const projects = await db.project.findMany({
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
        release: {
          select: {
            id: true,
            referenceNo: true,
            amount: true,
            status: true,
          },
        },
        expenditures: true,
        _count: {
          select: {
            expenditures: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
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
      releaseId,
      name,
      description,
      budget,
      location,
      startDate,
      endDate,
    } = body;

    // Validate required fields
    if (!allocationId || !agencyId || !name || !budget) {
      return NextResponse.json(
        { success: false, error: 'Allocation ID, agency ID, name, and budget are required' },
        { status: 400 }
      );
    }

    // Check if allocation exists
    const allocation = await db.allocation.findUnique({
      where: { id: allocationId },
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

    // Check if release exists if provided
    if (releaseId) {
      const release = await db.release.findUnique({
        where: { id: releaseId },
      });
      if (!release) {
        return NextResponse.json(
          { success: false, error: 'Release not found' },
          { status: 404 }
        );
      }
    }

    // Validate budget
    if (budget <= 0) {
      return NextResponse.json(
        { success: false, error: 'Budget must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return NextResponse.json(
          { success: false, error: 'Start date must be before end date' },
          { status: 400 }
        );
      }
    }

    const project = await db.project.create({
      data: {
        allocationId,
        agencyId,
        releaseId,
        name,
        description,
        budget: parseFloat(budget),
        location,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
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
        release: {
          select: {
            id: true,
            referenceNo: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'CREATE_PROJECT',
        entityType: 'Project',
        entityId: project.id,
        newValues: JSON.stringify(project),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}