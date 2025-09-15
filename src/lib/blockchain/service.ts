import { Allocation, Release, Expenditure } from '@/lib/db';

export interface BlockchainAllocation {
  id: number;
  agency: string;
  project: string;
  amount: number;
  timestamp: number;
  exists: boolean;
}

export interface BlockchainRelease {
  id: number;
  allocationId: number;
  amount: number;
  timestamp: number;
  description: string;
}

export interface BlockchainExpenditure {
  id: number;
  releaseId: number;
  amount: number;
  beneficiary: string;
  documentHash: string;
  timestamp: number;
}

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  fromAddress: string;
  toAddress?: string;
  amount?: number;
  gasUsed: number;
  gasPrice: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  dataType: 'ALLOCATION' | 'RELEASE' | 'EXPENDITURE';
  dataId: string;
  metadata?: string;
  timestamp: number;
}

// Simulated blockchain service for demonstration
// In a real implementation, this would interact with actual blockchain network
export class BlockchainService {
  private static instance: BlockchainService;
  private allocations: Map<number, BlockchainAllocation> = new Map();
  private releases: Map<number, BlockchainRelease> = new Map();
  private expenditures: Map<number, BlockchainExpenditure> = new Map();
  private transactions: BlockchainTransaction[] = [];
  private allocationCounter = 0;
  private releaseCounter = 0;
  private expenditureCounter = 0;
  private blockCounter = 1;

  private constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  private initializeSampleData() {
    // Add some sample blockchain data
    this.allocations.set(1, {
      id: 1,
      agency: 'Department of Public Works and Highways',
      project: 'Flood Control Management System',
      amount: 1500000000,
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 30,
      exists: true,
    });

    this.allocations.set(2, {
      id: 2,
      agency: 'Department of Health',
      project: 'Health Facility Enhancement Program',
      amount: 800000000,
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 25,
      exists: true,
    });

    this.releases.set(1, {
      id: 1,
      allocationId: 1,
      amount: 600000000,
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 20,
      description: 'Initial release for flood control projects',
    });

    this.releases.set(2, {
      id: 2,
      allocationId: 2,
      amount: 300000000,
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 15,
      description: 'First release for health facility upgrades',
    });

    this.expenditures.set(1, {
      id: 1,
      releaseId: 1,
      amount: 45000000,
      beneficiary: 'XYZ Engineering Services',
      documentHash: 'QmNkWk8v8z4J7Y6t5r4e3w2q1p9o8i7u6y5t4r3e2w1q',
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 10,
    });

    this.allocationCounter = 2;
    this.releaseCounter = 2;
    this.expenditureCounter = 1;
  }

  private generateTxHash(): string {
    return '0x' + Math.random().toString(16).substr(2, 64);
  }

  private async createTransaction(
    dataType: BlockchainTransaction['dataType'],
    dataId: string,
    amount?: number,
    metadata?: string
  ): Promise<BlockchainTransaction> {
    const txHash = this.generateTxHash();
    const transaction: BlockchainTransaction = {
      txHash,
      blockNumber: this.blockCounter++,
      fromAddress: '0x' + Math.random().toString(16).substr(2, 40),
      toAddress: '0x' + Math.random().toString(16).substr(2, 40),
      amount,
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      gasPrice: Math.floor(Math.random() * 100) + 20,
      status: 'SUCCESS',
      dataType,
      dataId,
      metadata,
      timestamp: Math.floor(Date.now() / 1000),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  async createAllocation(
    agency: string,
    project: string,
    amount: number
  ): Promise<{ allocation: BlockchainAllocation; transaction: BlockchainTransaction }> {
    this.allocationCounter++;
    const allocation: BlockchainAllocation = {
      id: this.allocationCounter,
      agency,
      project,
      amount,
      timestamp: Math.floor(Date.now() / 1000),
      exists: true,
    };

    this.allocations.set(this.allocationCounter, allocation);
    
    const transaction = await this.createTransaction(
      'ALLOCATION',
      this.allocationCounter.toString(),
      amount,
      JSON.stringify({ agency, project })
    );

    return { allocation, transaction };
  }

  async createRelease(
    allocationId: number,
    amount: number,
    description: string
  ): Promise<{ release: BlockchainRelease; transaction: BlockchainTransaction }> {
    const allocation = this.allocations.get(allocationId);
    if (!allocation || !allocation.exists) {
      throw new Error('Allocation does not exist');
    }

    this.releaseCounter++;
    const release: BlockchainRelease = {
      id: this.releaseCounter,
      allocationId,
      amount,
      timestamp: Math.floor(Date.now() / 1000),
      description,
    };

    this.releases.set(this.releaseCounter, release);
    
    const transaction = await this.createTransaction(
      'RELEASE',
      this.releaseCounter.toString(),
      amount,
      JSON.stringify({ allocationId, description })
    );

    return { release, transaction };
  }

  async createExpenditure(
    releaseId: number,
    amount: number,
    beneficiary: string,
    documentHash: string
  ): Promise<{ expenditure: BlockchainExpenditure; transaction: BlockchainTransaction }> {
    const release = this.releases.get(releaseId);
    if (!release) {
      throw new Error('Release does not exist');
    }

    this.expenditureCounter++;
    const expenditure: BlockchainExpenditure = {
      id: this.expenditureCounter,
      releaseId,
      amount,
      beneficiary,
      documentHash,
      timestamp: Math.floor(Date.now() / 1000),
    };

    this.expenditures.set(this.expenditureCounter, expenditure);
    
    const transaction = await this.createTransaction(
      'EXPENDITURE',
      this.expenditureCounter.toString(),
      amount,
      JSON.stringify({ releaseId, beneficiary, documentHash })
    );

    return { expenditure, transaction };
  }

  async getAllocation(id: number): Promise<BlockchainAllocation | null> {
    return this.allocations.get(id) || null;
  }

  async getRelease(id: number): Promise<BlockchainRelease | null> {
    return this.releases.get(id) || null;
  }

  async getExpenditure(id: number): Promise<BlockchainExpenditure | null> {
    return this.expenditures.get(id) || null;
  }

  async getAllAllocations(): Promise<BlockchainAllocation[]> {
    return Array.from(this.allocations.values()).filter(a => a.exists);
  }

  async getAllReleases(): Promise<BlockchainRelease[]> {
    return Array.from(this.releases.values());
  }

  async getAllExpenditures(): Promise<BlockchainExpenditure[]> {
    return Array.from(this.expenditures.values());
  }

  async getTransactions(dataType?: BlockchainTransaction['dataType']): Promise<BlockchainTransaction[]> {
    if (dataType) {
      return this.transactions.filter(tx => tx.dataType === dataType);
    }
    return this.transactions;
  }

  async getTransaction(txHash: string): Promise<BlockchainTransaction | null> {
    return this.transactions.find(tx => tx.txHash === txHash) || null;
  }

  // Verify data integrity by comparing blockchain data with database data
  async verifyAllocation(dbAllocation: Allocation): Promise<{
    isValid: boolean;
    differences: string[];
    blockchainData?: BlockchainAllocation;
  }> {
    const bcAllocation = await this.getAllocation(parseInt(dbAllocation.id));
    
    if (!bcAllocation) {
      return {
        isValid: false,
        differences: ['Allocation not found on blockchain'],
      };
    }

    const differences: string[] = [];
    
    if (bcAllocation.agency !== dbAllocation.agency?.name) {
      differences.push(`Agency mismatch: blockchain=${bcAllocation.agency}, database=${dbAllocation.agency?.name}`);
    }
    
    if (bcAllocation.project !== dbAllocation.title) {
      differences.push(`Project mismatch: blockchain=${bcAllocation.project}, database=${dbAllocation.title}`);
    }
    
    if (bcAllocation.amount !== dbAllocation.amount) {
      differences.push(`Amount mismatch: blockchain=${bcAllocation.amount}, database=${dbAllocation.amount}`);
    }

    return {
      isValid: differences.length === 0,
      differences,
      blockchainData: bcAllocation,
    };
  }

  // Get blockchain statistics
  async getStats() {
    return {
      totalAllocations: this.allocations.size,
      totalReleases: this.releases.size,
      totalExpenditures: this.expenditures.size,
      totalTransactions: this.transactions.length,
      latestBlock: this.blockCounter,
      totalValue: this.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0),
    };
  }
}