import { NextRequest, NextResponse } from 'next/server';
import { BlockchainService } from '@/lib/blockchain/service';

const blockchainService = BlockchainService.getInstance();

export async function GET() {
  try {
    const [allocations, releases, expenditures, transactions, stats] = await Promise.all([
      blockchainService.getAllAllocations(),
      blockchainService.getAllReleases(),
      blockchainService.getAllExpenditures(),
      blockchainService.getTransactions(),
      blockchainService.getStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        allocations,
        releases,
        expenditures,
        transactions,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blockchain data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    let result;

    switch (action) {
      case 'createAllocation':
        const { agency, project, amount } = data;
        if (!agency || !project || !amount) {
          return NextResponse.json(
            { success: false, error: 'Agency, project, and amount are required' },
            { status: 400 }
          );
        }
        result = await blockchainService.createAllocation(agency, project, amount);
        break;

      case 'createRelease':
        const { allocationId, releaseAmount, description } = data;
        if (!allocationId || !releaseAmount || !description) {
          return NextResponse.json(
            { success: false, error: 'Allocation ID, amount, and description are required' },
            { status: 400 }
          );
        }
        result = await blockchainService.createRelease(allocationId, releaseAmount, description);
        break;

      case 'createExpenditure':
        const { releaseId, expenditureAmount, beneficiary, documentHash } = data;
        if (!releaseId || !expenditureAmount || !beneficiary || !documentHash) {
          return NextResponse.json(
            { success: false, error: 'Release ID, amount, beneficiary, and document hash are required' },
            { status: 400 }
          );
        }
        result = await blockchainService.createExpenditure(releaseId, expenditureAmount, beneficiary, documentHash);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error processing blockchain action:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process action' },
      { status: 500 }
    );
  }
}