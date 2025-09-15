import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get basic counts
    const [
      agencyCount,
      allocationCount,
      releaseCount,
      expenditureCount,
      projectCount,
    ] = await Promise.all([
      db.agency.count(),
      db.allocation.count(),
      db.release.count(),
      db.expenditure.count(),
      db.project.count(),
    ]);

    // Get total budget amounts
    const budgetStats = await db.allocation.aggregate({
      _sum: {
        amount: true,
      },
      _avg: {
        amount: true,
      },
    });

    const releaseStats = await db.release.aggregate({
      _sum: {
        amount: true,
      },
      _avg: {
        amount: true,
      },
    });

    const expenditureStats = await db.expenditure.aggregate({
      _sum: {
        amount: true,
      },
      _avg: {
        amount: true,
      },
    });

    // Get status breakdowns
    const allocationStatusBreakdown = await db.allocation.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      _sum: {
        amount: true,
      },
    });

    const releaseStatusBreakdown = await db.release.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      _sum: {
        amount: true,
      },
    });

    const projectStatusBreakdown = await db.project.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      _sum: {
        budget: true,
      },
    });

    const expenditureCategoryBreakdown = await db.expenditure.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      _sum: {
        amount: true,
      },
    });

    // Get top agencies by allocation
    const topAgencies = await db.agency.findMany({
      select: {
        id: true,
        name: true,
        acronym: true,
        category: true,
        _count: {
          select: {
            allocations: true,
            releases: true,
            projects: true,
          },
        },
        allocations: {
          select: {
            amount: true,
          },
        },
      },
      orderBy: {
        allocations: {
          _sum: {
            amount: 'desc',
          },
        },
      },
      take: 10,
    });

    // Calculate utilization rates
    const totalAllocated = budgetStats._sum.amount || 0;
    const totalReleased = releaseStats._sum.amount || 0;
    const totalSpent = expenditureStats._sum.amount || 0;

    const utilizationRates = {
      releaseRate: totalAllocated > 0 ? (totalReleased / totalAllocated) * 100 : 0,
      expenditureRate: totalReleased > 0 ? (totalSpent / totalReleased) * 100 : 0,
      overallUtilization: totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0,
    };

    // Get recent activity
    const recentActivity = await db.auditLog.findMany({
      select: {
        id: true,
        action: true,
        entityType: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Get monthly trends for the current year
    const currentYear = new Date().getFullYear();
    const monthlyTrends = await db.$queryRaw`
      SELECT 
        strftime('%m', createdAt) as month,
        SUM(CASE WHEN entityType = 'Allocation' THEN 1 ELSE 0 END) as allocations,
        SUM(CASE WHEN entityType = 'Release' THEN 1 ELSE 0 END) as releases,
        SUM(CASE WHEN entityType = 'Expenditure' THEN 1 ELSE 0 END) as expenditures,
        SUM(CASE WHEN entityType = 'Project' THEN 1 ELSE 0 END) as projects
      FROM audit_log
      WHERE strftime('%Y', createdAt) = ${currentYear.toString()}
      GROUP BY strftime('%m', createdAt)
      ORDER BY month
    ` as Array<{
      month: string;
      allocations: number;
      releases: number;
      expenditures: number;
      projects: number;
    }>;

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          agencies: agencyCount,
          allocations: allocationCount,
          releases: releaseCount,
          expenditures: expenditureCount,
          projects: projectCount,
        },
        financials: {
          totalAllocated: budgetStats._sum.amount || 0,
          totalReleased: releaseStats._sum.amount || 0,
          totalSpent: expenditureStats._sum.amount || 0,
          averageAllocation: budgetStats._avg.amount || 0,
          averageRelease: releaseStats._avg.amount || 0,
          averageExpenditure: expenditureStats._avg.amount || 0,
        },
        utilizationRates,
        breakdowns: {
          allocationStatus: allocationStatusBreakdown,
          releaseStatus: releaseStatusBreakdown,
          projectStatus: projectStatusBreakdown,
          expenditureCategory: expenditureCategoryBreakdown,
        },
        topAgencies: topAgencies.map(agency => ({
          ...agency,
          totalAllocation: agency.allocations.reduce((sum, alloc) => sum + alloc.amount, 0),
        })),
        recentActivity,
        monthlyTrends,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}