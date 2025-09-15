'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface BudgetFlowProps {
  allocations: Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    agency: {
      name: string;
      acronym: string;
    };
    releases: Array<{
      id: string;
      amount: number;
      status: string;
      expenditures: Array<{
        id: string;
        amount: number;
        status: string;
        beneficiary: string;
      }>;
    }>;
  }>;
}

export function BudgetFlow({ allocations }: BudgetFlowProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PROPOSED: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-blue-100 text-blue-800',
      RELEASED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      SPENT: 'bg-green-100 text-green-800',
      VERIFIED: 'bg-purple-100 text-purple-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'COMPLETED' || status === 'VERIFIED') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (status === 'PENDING' || status === 'PROPOSED') {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
    if (status === 'CANCELLED' || status === 'REJECTED') {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
    return <TrendingUp className="h-4 w-4 text-blue-600" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateUtilization = (allocation: any) => {
    const totalReleased = allocation.releases.reduce((sum: number, release: any) => sum + release.amount, 0);
    const totalSpent = allocation.releases.reduce((sum: number, release: any) => 
      sum + release.expenditures.reduce((expenditureSum: number, expenditure: any) => expenditureSum + expenditure.amount, 0), 0
    );
    
    return {
      releaseRate: allocation.amount > 0 ? (totalReleased / allocation.amount) * 100 : 0,
      expenditureRate: totalReleased > 0 ? (totalSpent / totalReleased) * 100 : 0,
      overallUtilization: allocation.amount > 0 ? (totalSpent / allocation.amount) * 100 : 0,
      totalReleased,
      totalSpent,
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Budget Flow Visualization
          </CardTitle>
          <CardDescription>
            Track the flow of funds from allocations through releases to expenditures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {allocations.map((allocation) => {
              const utilization = calculateUtilization(allocation);
              
              return (
                <div key={allocation.id} className="border rounded-lg p-6 space-y-4">
                  {/* Allocation Header */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(allocation.status)}
                        <h3 className="text-lg font-semibold">{allocation.title}</h3>
                        <Badge className={getStatusColor(allocation.status)}>
                          {allocation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {allocation.agency.name} ({allocation.agency.acronym})
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatCurrency(allocation.amount)}</div>
                      <div className="text-sm text-muted-foreground">Allocated</div>
                    </div>
                  </div>

                  {/* Utilization Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Release Rate</span>
                        <span>{utilization.releaseRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={utilization.releaseRate} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(utilization.totalReleased)} released
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Expenditure Rate</span>
                        <span>{utilization.expenditureRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={utilization.expenditureRate} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(utilization.totalSpent)} spent
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Utilization</span>
                        <span>{utilization.overallUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={utilization.overallUtilization} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(allocation.amount - utilization.totalSpent)} remaining
                      </div>
                    </div>
                  </div>

                  {/* Releases */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <ArrowRight className="h-4 w-4" />
                      Fund Releases
                    </div>
                    
                    <div className="grid gap-3">
                      {allocation.releases.map((release) => {
                        const releaseSpent = release.expenditures.reduce((sum, expenditure) => sum + expenditure.amount, 0);
                        const releaseUtilization = release.amount > 0 ? (releaseSpent / release.amount) * 100 : 0;
                        
                        return (
                          <div key={release.id} className="border rounded p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(release.status)}
                                <span className="font-medium">Release #{release.id.slice(-6)}</span>
                                <Badge className={getStatusColor(release.status)} variant="outline">
                                  {release.status}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{formatCurrency(release.amount)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatCurrency(releaseSpent)} spent ({releaseUtilization.toFixed(1)}%)
                                </div>
                              </div>
                            </div>

                            {/* Expenditures */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-4">
                                <ArrowRight className="h-3 w-3" />
                                Expenditures
                              </div>
                              
                              <div className="grid gap-2 ml-8">
                                {release.expenditures.map((expenditure) => (
                                  <div key={expenditure.id} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(expenditure.status)}
                                      <div>
                                        <div className="text-sm font-medium">{expenditure.beneficiary}</div>
                                        <div className="text-xs text-muted-foreground">
                                          Expenditure #{expenditure.id.slice(-6)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold">{formatCurrency(expenditure.amount)}</div>
                                      <Badge className={getStatusColor(expenditure.status)} variant="outline" size="sm">
                                        {expenditure.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                                
                                {release.expenditures.length === 0 && (
                                  <div className="text-sm text-muted-foreground ml-4">
                                    No expenditures recorded yet
                                  </div>
                                )}
                              </div>
                            </div>

                            <Progress value={releaseUtilization} className="h-1" />
                          </div>
                        );
                      })}
                      
                      {allocation.releases.length === 0 && (
                        <div className="text-sm text-muted-foreground ml-4">
                          No releases recorded yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {allocations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No budget allocations found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}