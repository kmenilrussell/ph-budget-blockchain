'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface AdvancedAnalyticsProps {
  stats?: any;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface TimeSeriesData {
  date: string;
  allocations: number;
  releases: number;
  expenditures: number;
}

export function AdvancedAnalytics({ stats }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('bar');
  const [isLoading, setIsLoading] = useState(false);

  // Mock chart data - in a real app, this would come from API
  const budgetTrendsData: ChartData[] = [
    { name: 'Jan', value: 1200000000, color: '#3b82f6' },
    { name: 'Feb', value: 1800000000, color: '#3b82f6' },
    { name: 'Mar', value: 1500000000, color: '#3b82f6' },
    { name: 'Apr', value: 2200000000, color: '#3b82f6' },
    { name: 'May', value: 1900000000, color: '#3b82f6' },
    { name: 'Jun', value: 2500000000, color: '#3b82f6' },
  ];

  const agencyDistributionData: ChartData[] = [
    { name: 'DPWH', value: 35, color: '#ef4444' },
    { name: 'DOH', value: 25, color: '#22c55e' },
    { name: 'DepEd', value: 20, color: '#3b82f6' },
    { name: 'DICT', value: 12, color: '#f59e0b' },
    { name: 'Others', value: 8, color: '#8b5cf6' },
  ];

  const expenditureCategoriesData: ChartData[] = [
    { name: 'Personnel', value: 40, color: '#06b6d4' },
    { name: 'MOOE', value: 30, color: '#84cc16' },
    { name: 'Capital', value: 20, color: '#f97316' },
    { name: 'Financial', value: 7, color: '#ec4899' },
    { name: 'Others', value: 3, color: '#64748b' },
  ];

  const timeSeriesData: TimeSeriesData[] = [
    { date: '2024-01', allocations: 12, releases: 8, expenditures: 15 },
    { date: '2024-02', allocations: 18, releases: 12, expenditures: 20 },
    { date: '2024-03', allocations: 15, releases: 10, expenditures: 18 },
    { date: '2024-04', allocations: 22, releases: 15, expenditures: 25 },
    { date: '2024-05', allocations: 19, releases: 13, expenditures: 22 },
    { date: '2024-06', allocations: 25, releases: 18, expenditures: 28 },
  ];

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

  const renderSimpleBarChart = (data: ChartData[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-medium">
                  {item.value >= 1000000 ? formatCurrency(item.value) : `${item.value}%`}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((item.value / Math.max(...data.map(d => d.value))) * 100, 100)}%`,
                      backgroundColor: item.color || '#3b82f6',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSimplePieChart = (data: ChartData[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color || '#3b82f6' }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{item.value}%</div>
                <div className="text-xs text-muted-foreground">
                  {item.value >= 1000000 ? formatCurrency(item.value) : `${item.value}% of total`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderTimeSeriesChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Budget Activity Over Time
        </CardTitle>
        <CardDescription>
          Monthly trends in allocations, releases, and expenditures
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeSeriesData.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.date}</span>
                <div className="flex gap-4 text-xs">
                  <span className="text-blue-600">Allocations: {item.allocations}</span>
                  <span className="text-green-600">Releases: {item.releases}</span>
                  <span className="text-purple-600">Expenditures: {item.expenditures}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Allocations</div>
                  <div className="bg-blue-100 rounded h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800">{item.allocations}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Releases</div>
                  <div className="bg-green-100 rounded h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-green-800">{item.releases}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Expenditures</div>
                  <div className="bg-purple-100 rounded h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-800">{item.expenditures}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Advanced Analytics Dashboard</CardTitle>
              <CardDescription>
                Comprehensive budget analysis with interactive charts and insights
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+5.2%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <span className="text-green-600">-0.8 days</span>
              <span className="text-muted-foreground">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+2.1%</span>
              <span className="text-muted-foreground">vs target</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center gap-1 text-sm">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Medium Priority
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Budget Trends</TabsTrigger>
          <TabsTrigger value="distribution">Agency Distribution</TabsTrigger>
          <TabsTrigger value="categories">Expenditure Categories</TabsTrigger>
          <TabsTrigger value="timeseries">Time Series</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          {renderSimpleBarChart(budgetTrendsData, 'Budget Allocation Trends')}
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          {renderSimplePieChart(agencyDistributionData, 'Budget Distribution by Agency')}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {renderSimplePieChart(expenditureCategoriesData, 'Expenditure by Category')}
        </TabsContent>

        <TabsContent value="timeseries" className="space-y-4">
          {renderTimeSeriesChart()}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Positive Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Increased Budget Utilization</div>
                      <div className="text-sm text-muted-foreground">
                        Overall utilization rate increased by 8.3% compared to last quarter
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Faster Processing Times</div>
                      <div className="text-sm text-muted-foreground">
                        Average allocation processing time reduced by 2.1 days
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Improved Compliance</div>
                      <div className="text-sm text-muted-foreground">
                        94.7% of transactions compliant with regulations
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Delayed Releases</div>
                      <div className="text-sm text-muted-foreground">
                        15% of releases experiencing delays beyond SLA
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Documentation Gaps</div>
                      <div className="text-sm text-muted-foreground">
                        8% of expenditures missing supporting documents
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Agency Performance Variance</div>
                      <div className="text-sm text-muted-foreground">
                        Significant performance differences between agencies
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription>
                Intelligent insights based on budget patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Optimize Release Schedule</div>
                  <div className="text-sm text-muted-foreground">
                    Based on historical data, consider quarterly release patterns to improve cash flow management
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Enhance Monitoring</div>
                  <div className="text-sm text-muted-foreground">
                    Focus monitoring on agencies with utilization rates below 70%
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Process Automation</div>
                  <div className="text-sm text-muted-foreground">
                    Automate verification for high-value, low-risk transactions
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Training Programs</div>
                  <div className="text-sm text-muted-foreground">
                    Provide additional training for agencies with high error rates
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}