import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UserRole, AgencyCategory } from '@prisma/client';

export async function GET() {
  try {
    const agencies = await db.agency.findMany({
      include: {
        parentAgency: true,
        subAgencies: true,
        _count: {
          select: {
            allocations: true,
            releases: true,
            projects: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: agencies });
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agencies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      acronym,
      category,
      description,
      parentAgencyId,
      address,
      contactEmail,
      contactPhone,
      website,
    } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(AgencyCategory).includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid agency category' },
        { status: 400 }
      );
    }

    // Check if parent agency exists if provided
    if (parentAgencyId) {
      const parentAgency = await db.agency.findUnique({
        where: { id: parentAgencyId },
      });
      if (!parentAgency) {
        return NextResponse.json(
          { success: false, error: 'Parent agency not found' },
          { status: 404 }
        );
      }
    }

    const agency = await db.agency.create({
      data: {
        name,
        acronym,
        category,
        description,
        parentAgencyId,
        address,
        contactEmail,
        contactPhone,
        website,
      },
      include: {
        parentAgency: true,
        subAgencies: true,
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'CREATE_AGENCY',
        entityType: 'Agency',
        entityId: agency.id,
        newValues: JSON.stringify(agency),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: agency }, { status: 201 });
  } catch (error) {
    console.error('Error creating agency:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create agency' },
      { status: 500 }
    );
  }
}