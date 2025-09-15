import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BlockchainService } from '@/lib/blockchain/service';

const blockchainService = BlockchainService.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const allocationId = searchParams.get('allocationId');

    if (allocationId) {
      // Verify specific allocation
      const dbAllocation = await db.allocation.findUnique({
        where: { id: allocationId },
        include: {
          agency: true,
        },
      });

      if (!dbAllocation) {
        return NextResponse.json(
          { success: false, error: 'Allocation not found in database' },
          { status: 404 }
        );
      }

      const verification = await blockchainService.verifyAllocation(dbAllocation);
      return NextResponse.json({ success: true, data: verification });
    } else {
      // Verify all allocations
      const dbAllocations = await db.allocation.findMany({
        include: {
          agency: true,
        },
      });

      const verifications = await Promise.all(
        dbAllocations.map(allocation => blockchainService.verifyAllocation(allocation))
      );

      const summary = {
        total: verifications.length,
        valid: verifications.filter(v => v.isValid).length,
        invalid: verifications.filter(v => !v.isValid).length,
        issues: verifications.flatMap(v => v.differences),
      };

      return NextResponse.json({
        success: true,
        data: {
          verifications,
          summary,
        },
      });
    }
  } catch (error) {
    console.error('Error verifying blockchain data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify blockchain data' },
      { status: 500 }
    );
  }
}