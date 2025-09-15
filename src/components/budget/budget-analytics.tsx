'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface BudgetAnalyticsProps {
  stats: {
    counts: {
      agencies: number;
      allocations: number;
      releases: number;
      expenditures: number;
      projects: number;
    };
    financials: {
      totalAllocated: number;
      totalReleased: number;
      totalSpent: number;
      averageAllocation: number;
      averageRelease: number;
      averageExpenditure: number;
    };
    utilizationRates: {
      releaseRate: number;
      expenditureRate: number;
      overallUtilization: number;
    };
    breakdowns: {
      allocationStatus: Array<{
        status: string;
        _count: { status: number };
        _sum: { amount: number };
      }>;
      releaseStatus: Array<{
        status: string;
        _count: { status: number };
        _sum: { amount: number };
      }>;
      projectStatus: Array<{
        status: string;
        _count: { status: number };
        _sum: { budget: number };
      }>;
      expenditureCategory: Array<{
        category: string;
        _count: { category: number };
        _sum: { amount: number };
      }>;
    };
    topAgencies: Array<{
      id: string;
      name: string;
      acronym: string;
      category: string;
      totalAllocation: number;
      _count: {
        allocations: number;
        releases: number;
        projects: number;
      };
    }>;
  };
}

export function BudgetAnalytics({ stats }: BudgetAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PROPOSED: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-blue-100 text-blue-800',
      RELEASED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      ONGOING: 'bg-blue-100 text-blue-800',
      SPENT: 'bg-green-100 text-green-800',
      VERIFIED: 'bg-purple-100 text-purple-800',
      REJECTED: 'bg-red-100 text-red-800',
      PLANNING: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getUtilizationIndicator = (rate: number) => {
    if (rate >= 80) return { color: 'text-green-600', icon: CheckCircle, label: 'Excellent' };
    if (rate >= 60) return { color: 'text-blue-600', icon: TrendingUp, label: 'Good' };
    if (rate >= 40) return { color: 'text-yellow-600', icon: Clock, label: 'Fair' };
    return { color: 'text-red-600', icon: AlertTriangle, label: 'Needs Attention' };
  };

  const overallIndicator = getUtilizationIndicator(stats.utilizationRates.overallUtilization);
  const releaseIndicator = getUtilizationIndicator(stats.utilizationRates.releaseRate);
  const expenditureIndicator = getUtilizationIndicator(stats.utilizationRates.expenditureRate);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilizationRates.overallUtilization.toFixed(1)}%</div>
            <div className={`flex items-center gap-1 text-sm ${overallIndicator.color}`}>
              <overallIndicator.icon className="h-3 w-3" />
              <span>{overallIndicator.label}</span>
            </div>
            <Progress value={stats.utilizationRates.overallUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Release Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilizationRates.releaseRate.toFixed(1)}%</div>
            <div className={`flex items-center gap-1 text-sm ${releaseIndicator.color}`}>
              <releaseIndicator.icon className="h-3 w-3" />
              <span>{releaseIndicator.label}</span>
            </div>
            <Progress value={stats.utilizationRates.releaseRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenditure Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilizationRates.expenditureRate.toFixed(1)}%</div>
            <div className={`flex items-center gap-1 text-sm ${expenditureIndicator.color}`}>
              <expenditureIndicator.icon className="h-3 w-3" />
              <span>{expenditureIndicator.label}</span>
            </div>
            <Progress value={stats.utilizationRates.expenditureRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.counts.projects}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.counts.agencies} agencies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Overview of budget allocation and utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Allocated:</span>
                  <span className="font-semibold">{formatCurrency(stats.financials.totalAllocated)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Released:</span>
                  <span className="font-semibold">{formatCurrency(stats.financials.totalReleased)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Spent:</span>
                  <span className="font-semibold">{formatCurrency(stats.financials.totalSpent)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Allocation:</span>
                  <span className="font-semibold">{formatCurrency(stats.financials.averageAllocation)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Release:</span>
                  <span className="font-semibold">{formatCurrency(stats.financials.averageRelease)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Expenditure:</span>
                  <span className="font-semibold">{formatCurrency(stats.financials.averageExpenditure)}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Unutilized Funds:</span>
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(stats.financials.totalAllocated - stats.financials.totalSpent)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Agencies</CardTitle>
            <CardDescription>Agencies with highest budget allocations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topAgencies.slice(0, 5).map((agency, index) => (
                <div key={agency.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{agency.name}</div>
                      <div className="text-sm text-muted-foreground">{agency.acronym}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(agency.totalAllocation)}</div>
                    <div className="text-xs text-muted-foreground">
                      {agency._count.allocations} allocations
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Allocation Status</CardTitle>
            <CardDescription>Distribution of allocation statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.breakdowns.allocationStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(item.status)} variant="outline">
                      {item.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({formatNumber(item._count.status)})
                    </span>
                  </div>
                  <span className="font-semibold">{formatCurrency(item._sum.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release Status</CardTitle>
            <CardDescription>Distribution of release statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.breakdowns.releaseStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(item.status)} variant="outline">
                      {item.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({formatNumber(item._count.status)})
                    </span>
                  </div>
                  <span className="font-semibold">{formatCurrency(item._sum.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenditure Categories</CardTitle>
            <CardDescription>Breakdown by expenditure type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.breakdowns.expenditureCategory.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {item.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({formatNumber(item._count.category)})
                    </span>
                  </div>
                  <span className="font-semibold">{formatCurrency(item._sum.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}