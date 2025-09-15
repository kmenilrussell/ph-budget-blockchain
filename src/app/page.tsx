'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText, 
  Search,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { BudgetFlow } from '@/components/budget/budget-flow';
import { BudgetAnalytics } from '@/components/budget/budget-analytics';
import { BlockchainVerification } from '@/components/budget/blockchain-verification';

interface DashboardStats {
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
    _count: {
      allocations: number;
      releases: number;
      projects: number;
    };
    totalAllocation: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    createdAt: string;
  }>;
  monthlyTrends: Array<{
    month: string;
    allocations: number;
    releases: number;
    expenditures: number;
    projects: number;
  }>;
}

interface Agency {
  id: string;
  name: string;
  acronym: string;
  category: string;
  description?: string;
  isActive: boolean;
  _count: {
    allocations: number;
    releases: number;
    projects: number;
  };
}

interface Allocation {
  id: string;
  title: string;
  description?: string;
  amount: number;
  fiscalYear: number;
  status: string;
  uacsCode?: string;
  agency: {
    id: string;
    name: string;
    acronym: string;
  };
  _count: {
    releases: number;
    projects: number;
  };
}

export default function Home() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, agenciesRes, allocationsRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/agencies'),
        fetch('/api/allocations?include=releases,expenditures'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDashboardStats(statsData.data);
      }

      if (agenciesRes.ok) {
        const agenciesData = await agenciesRes.json();
        setAgencies(agenciesData.data);
      }

      if (allocationsRes.ok) {
        const allocationsData = await allocationsRes.json();
        setAllocations(allocationsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = allocation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allocation.agency.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || allocation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading Budget Transparency System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Budget Coordination System</h1>
          <p className="text-muted-foreground">
            Blockchain-based fiscal transparency for the Philippine government
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Placeholder for export functionality
              alert('Export functionality will be implemented in the next phase');
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            size="sm"
            onClick={() => {
              // Placeholder for new allocation functionality
              alert('New allocation form will be implemented in the next phase');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Allocation
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Allocations</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.counts.allocations}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(dashboardStats.financials.totalAllocated)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fund Releases</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.counts.releases}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(dashboardStats.financials.totalReleased)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenditures</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.counts.expenditures}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(dashboardStats.financials.totalSpent)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agencies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.counts.agencies}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.counts.projects} active projects
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Utilization Rates */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Release Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.utilizationRates.releaseRate.toFixed(1)}%
              </div>
              <Progress value={dashboardStats.utilizationRates.releaseRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                of allocated funds released
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Expenditure Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.utilizationRates.expenditureRate.toFixed(1)}%
              </div>
              <Progress value={dashboardStats.utilizationRates.expenditureRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                of released funds spent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Overall Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.utilizationRates.overallUtilization.toFixed(1)}%
              </div>
              <Progress value={dashboardStats.utilizationRates.overallUtilization} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                of allocated funds utilized
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="allocations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allocations">Budget Allocations</TabsTrigger>
          <TabsTrigger value="flow">Budget Flow</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
          <TabsTrigger value="releases">Fund Releases</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocations</CardTitle>
              <CardDescription>
                Track and monitor budget allocations across government agencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search allocations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PROPOSED">Proposed</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="RELEASED">Released</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fiscal Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllocations.map((allocation) => (
                    <TableRow key={allocation.id}>
                      <TableCell className="font-medium">{allocation.title}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{allocation.agency.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {allocation.agency.acronym}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(allocation.amount)}</TableCell>
                      <TableCell>{allocation.fiscalYear}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(allocation.status)}>
                          {allocation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Placeholder for view allocation details
                            alert(`Viewing details for allocation: ${allocation.title}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <BudgetFlow allocations={allocations} />
        </TabsContent>

        <TabsContent value="agencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Government Agencies</CardTitle>
              <CardDescription>
                Manage and monitor government agencies participating in the budget system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agencies.map((agency) => (
                  <Card key={agency.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{agency.name}</CardTitle>
                      <CardDescription>{agency.acronym}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Category:</span>
                          <Badge variant="outline">{agency.category}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Allocations:</span>
                          <span>{agency._count.allocations}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Releases:</span>
                          <span>{agency._count.releases}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Projects:</span>
                          <span>{agency._count.projects}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="releases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fund Releases</CardTitle>
              <CardDescription>
                Monitor fund releases from budget allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Detailed fund releases tracking will be implemented in the next phase. This section will show comprehensive information about fund releases from allocations to agencies with full blockchain verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {dashboardStats && <BudgetAnalytics stats={dashboardStats} />}
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainVerification allocations={allocations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}