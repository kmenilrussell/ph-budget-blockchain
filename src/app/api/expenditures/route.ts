import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ExpenditureStatus, ExpenditureCategory } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const releaseId = searchParams.get('releaseId');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const whereClause: any = {};
    if (releaseId) whereClause.releaseId = releaseId;
    if (projectId) whereClause.projectId = projectId;
    if (status && Object.values(ExpenditureStatus).includes(status as ExpenditureStatus)) {
      whereClause.status = status as ExpenditureStatus;
    }
    if (category && Object.values(ExpenditureCategory).includes(category as ExpenditureCategory)) {
      whereClause.category = category as ExpenditureCategory;
    }

    const expenditures = await db.expenditure.findMany({
      where: whereClause,
      include: {
        release: {
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
        },
        project: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: expenditures });
  } catch (error) {
    console.error('Error fetching expenditures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expenditures' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      releaseId,
      projectId,
      amount,
      beneficiary,
      description,
      documentHash,
      category,
    } = body;

    // Validate required fields
    if (!releaseId || !amount || !beneficiary || !category) {
      return NextResponse.json(
        { success: false, error: 'Release ID, amount, beneficiary, and category are required' },
        { status: 400 }
      );
    }

    // Check if release exists
    const release = await db.release.findUnique({
      where: { id: releaseId },
      include: {
        expenditures: true,
      },
    });
    if (!release) {
      return NextResponse.json(
        { success: false, error: 'Release not found' },
        { status: 404 }
      );
    }

    // Check if project exists if provided
    if (projectId) {
      const project = await db.project.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(ExpenditureCategory).includes(category as ExpenditureCategory)) {
      return NextResponse.json(
        { success: false, error: 'Invalid expenditure category' },
        { status: 400 }
      );
    }

    // Check if release has enough remaining budget
    const totalSpent = release.expenditures.reduce((sum, expenditure) => sum + expenditure.amount, 0);
    if (totalSpent + parseFloat(amount) > release.amount) {
      return NextResponse.json(
        { success: false, error: 'Expenditure amount exceeds remaining release budget' },
        { status: 400 }
      );
    }

    const expenditure = await db.expenditure.create({
      data: {
        releaseId,
        projectId,
        amount: parseFloat(amount),
        beneficiary,
        description,
        documentHash,
        category: category as ExpenditureCategory,
      },
      include: {
        release: {
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
        },
        project: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'CREATE_EXPENDITURE',
        entityType: 'Expenditure',
        entityId: expenditure.id,
        newValues: JSON.stringify(expenditure),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: expenditure }, { status: 201 });
  } catch (error) {
    console.error('Error creating expenditure:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create expenditure' },
      { status: 500 }
    );
  }
}