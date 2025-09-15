import { NextRequest, NextResponse } from 'next/server';
import { BlockchainService } from '@/lib/blockchain/service';

const blockchainService = BlockchainService.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txHash = searchParams.get('txHash');
    const dataType = searchParams.get('dataType');

    if (txHash) {
      // Get specific transaction
      const transaction = await blockchainService.getTransaction(txHash);
      if (!transaction) {
        return NextResponse.json(
          { success: false, error: 'Transaction not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: transaction });
    } else {
      // Get all transactions, optionally filtered by type
      const transactions = await blockchainService.getTransactions(
        dataType as any || undefined
      );

      return NextResponse.json({ success: true, data: transactions });
    }
  } catch (error) {
    console.error('Error fetching blockchain transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blockchain transactions' },
      { status: 500 }
    );
  }
}