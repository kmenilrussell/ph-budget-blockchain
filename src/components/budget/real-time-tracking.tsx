'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  RefreshCw, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Users,
  Zap
} from 'lucide-react';

interface RealTimeEvent {
  id: string;
  event: string;
  data: any;
  room?: string;
  timestamp: string;
}

interface RealTimeTrackingProps {
  allocations?: Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    agency: {
      name: string;
      acronym: string;
    };
  }>;
}

export function RealTimeTracking({ allocations = [] }: RealTimeTrackingProps) {
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Simulate real-time connection
    setIsConnected(true);
    fetchRealTimeEvents();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchRealTimeEvents();
      updateActiveUsers();
    }, 5000);

    // Simulate random events
    const eventInterval = setInterval(() => {
      generateRandomEvent();
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(eventInterval);
    };
  }, []);

  const fetchRealTimeEvents = async () => {
    try {
      const response = await fetch('/api/realtime');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching real-time events:', error);
    }
  };

  const updateActiveUsers = () => {
    // Simulate active users count
    setActiveUsers(Math.floor(Math.random() * 50) + 10);
  };

  const generateRandomEvent = () => {
    const eventTypes = [
      'ALLOCATION_CREATED',
      'RELEASE_APPROVED',
      'EXPENDITURE_RECORDED',
      'BLOCKCHAIN_VERIFIED',
      'AGENCY_UPDATED',
      'PROJECT_COMPLETED',
    ];

    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomAllocation = allocations[Math.floor(Math.random() * allocations.length)];

    if (randomAllocation) {
      const newEvent: RealTimeEvent = {
        id: Math.random().toString(36).substr(2, 9),
        event: randomEvent,
        data: {
          allocationId: randomAllocation.id,
          title: randomAllocation.title,
          amount: randomAllocation.amount,
          agency: randomAllocation.agency.name,
          timestamp: new Date().toISOString(),
        },
        room: `allocation-${randomAllocation.id}`,
        timestamp: new Date().toISOString(),
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
      setLastUpdate(new Date());
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

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'ALLOCATION_CREATED':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'RELEASE_APPROVED':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'EXPENDITURE_RECORDED':
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'BLOCKCHAIN_VERIFIED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'AGENCY_UPDATED':
        return <Users className="h-4 w-4 text-orange-600" />;
      case 'PROJECT_COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'ALLOCATION_CREATED':
        return 'bg-green-100 text-green-800';
      case 'RELEASE_APPROVED':
        return 'bg-blue-100 text-blue-800';
      case 'EXPENDITURE_RECORDED':
        return 'bg-purple-100 text-purple-800';
      case 'BLOCKCHAIN_VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'AGENCY_UPDATED':
        return 'bg-orange-100 text-orange-800';
      case 'PROJECT_COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventDescription = (event: string, data: any) => {
    switch (event) {
      case 'ALLOCATION_CREATED':
        return `New allocation: ${data.title} (${formatCurrency(data.amount)})`;
      case 'RELEASE_APPROVED':
        return `Fund release approved for ${data.title}`;
      case 'EXPENDITURE_RECORDED':
        return `Expenditure recorded: ${formatCurrency(data.amount)}`;
      case 'BLOCKCHAIN_VERIFIED':
        return `Blockchain verification completed for ${data.title}`;
      case 'AGENCY_UPDATED':
        return `Agency information updated: ${data.agency}`;
      case 'PROJECT_COMPLETED':
        return `Project completed: ${data.title}`;
      default:
        return `System event: ${event}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Real-Time Budget Tracking
              </CardTitle>
              <CardDescription>
                Live updates and monitoring of budget activities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={fetchRealTimeEvents}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{events.length}</div>
              <div className="text-sm text-muted-foreground">Events Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{allocations.length}</div>
              <div className="text-sm text-muted-foreground">Active Allocations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {lastUpdate ? formatTimeAgo(lastUpdate.toISOString()) : 'Never'}
              </div>
              <div className="text-sm text-muted-foreground">Last Update</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Activity Feed
          </CardTitle>
          <CardDescription>
            Real-time updates from across the budget system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded hover:bg-muted/50 transition-colors">
                  {getEventIcon(event.event)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getEventColor(event.event)} variant="outline">
                        {event.event.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">
                      {getEventDescription(event.event, event.data)}
                    </p>
                    {event.data.agency && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.data.agency}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Blockchain Connection</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Database Performance</span>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Response Time</span>
                  <span className="text-sm">45ms</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Real-time Updates</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Data Synchronization</span>
                  <Badge className="bg-blue-100 text-blue-800">Syncing</Badge>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Security Status</span>
                  <Badge className="bg-green-100 text-green-800">Secure</Badge>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </div>
          
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              System is operating normally. All blockchain verifications are completing successfully. 
              Real-time updates are being processed with an average latency of 2.3 seconds.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}