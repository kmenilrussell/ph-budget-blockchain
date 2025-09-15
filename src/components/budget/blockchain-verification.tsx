'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Hash,
  Database,
  Link
} from 'lucide-react';

interface VerificationResult {
  isValid: boolean;
  differences: string[];
  blockchainData?: any;
}

interface BlockchainTransaction {
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

interface BlockchainVerificationProps {
  allocations?: Array<{
    id: string;
    title: string;
    amount: number;
    agency: {
      name: string;
      acronym: string;
    };
  }>;
}

export function BlockchainVerification({ allocations = [] }: BlockchainVerificationProps) {
  const [verifications, setVerifications] = useState<Record<string, VerificationResult>>({});
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [globalStats, setGlobalStats] = useState<{
    total: number;
    valid: number;
    invalid: number;
    pending: number;
  }>({ total: 0, valid: 0, invalid: 0, pending: 0 });

  useEffect(() => {
    fetchTransactions();
    if (allocations.length > 0) {
      verifyAllAllocations();
    }
  }, [allocations]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/blockchain/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const verifyAllAllocations = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/blockchain/verify');
      if (response.ok) {
        const data = await response.json();
        const verificationMap: Record<string, VerificationResult> = {};
        
        data.data.verifications.forEach((verification: VerificationResult, index: number) => {
          const allocationId = allocations[index]?.id || `allocation-${index}`;
          verificationMap[allocationId] = verification;
        });
        
        setVerifications(verificationMap);
        setGlobalStats(data.data.summary);
      }
    } catch (error) {
      console.error('Error verifying allocations:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const verifySingleAllocation = async (allocationId: string) => {
    try {
      const response = await fetch(`/api/blockchain/verify?allocationId=${allocationId}`);
      if (response.ok) {
        const data = await response.json();
        setVerifications(prev => ({
          ...prev,
          [allocationId]: data.data
        }));
      }
    } catch (error) {
      console.error('Error verifying allocation:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getVerificationIcon = (isValid?: boolean) => {
    if (isValid === undefined) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    if (isValid) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getVerificationColor = (isValid?: boolean) => {
    if (isValid === undefined) return 'bg-yellow-100 text-yellow-800';
    if (isValid) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getVerificationText = (isValid?: boolean) => {
    if (isValid === undefined) return 'Pending Verification';
    if (isValid) return 'Verified';
    return 'Verification Failed';
  };

  const validPercentage = globalStats.total > 0 ? (globalStats.valid / globalStats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Verification Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Blockchain Verification Status
              </CardTitle>
              <CardDescription>
                Integrity verification of budget data on the blockchain
              </CardDescription>
            </div>
            <Button 
              onClick={verifyAllAllocations} 
              disabled={isVerifying}
              variant="outline"
              size="sm"
            >
              {isVerifying ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Verify All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{globalStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{globalStats.valid}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{globalStats.invalid}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{globalStats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Integrity Score</span>
              <span>{validPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={validPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{globalStats.valid} verified records</span>
              <span>{globalStats.total - globalStats.valid} issues found</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocation Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Allocation Verification Details</CardTitle>
          <CardDescription>
            Verification status for individual budget allocations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allocations.map((allocation) => {
              const verification = verifications[allocation.id];
              const isValid = verification?.isValid;
              
              return (
                <div key={allocation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getVerificationIcon(isValid)}
                      <div>
                        <h3 className="font-semibold">{allocation.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {allocation.agency.name} ({allocation.agency.acronym}) • {formatCurrency(allocation.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getVerificationColor(isValid)}>
                        {getVerificationText(isValid)}
                      </Badge>
                      <Button 
                        onClick={() => verifySingleAllocation(allocation.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {verification && verification.differences.length > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <div className="font-medium mb-1">Verification Issues Found:</div>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {verification.differences.map((diff, index) => (
                            <li key={index}>{diff}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {verification && verification.blockchainData && (
                    <div className="mt-3 p-3 bg-muted rounded text-sm">
                      <div className="font-medium mb-2">Blockchain Data:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Agency: {verification.blockchainData.agency}</div>
                        <div>Project: {verification.blockchainData.project}</div>
                        <div>Amount: {formatCurrency(verification.blockchainData.amount)}</div>
                        <div>Timestamp: {formatTimestamp(verification.blockchainData.timestamp)}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {allocations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No allocations to verify</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Blockchain Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Recent Blockchain Transactions
          </CardTitle>
          <CardDescription>
            Latest transactions recorded on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx.txHash} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    tx.status === 'SUCCESS' ? 'bg-green-500' :
                    tx.status === 'FAILED' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <div className="font-medium text-sm">{tx.dataType}</div>
                    <div className="text-xs text-muted-foreground">
                      Block #{tx.blockNumber} • {formatTimestamp(tx.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {tx.amount && (
                    <div className="font-semibold text-sm">{formatCurrency(tx.amount)}</div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {formatAddress(tx.fromAddress)} → {formatAddress(tx.toAddress || '')}
                  </div>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No blockchain transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}