'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  Clock,
  Settings,
  Filter,
  Search
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
  category: 'BUDGET' | 'BLOCKCHAIN' | 'SYSTEM' | 'SECURITY' | 'COMPLIANCE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface NotificationSystemProps {
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationSystem({ onNotificationClick }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'SUCCESS',
      title: 'Budget Allocation Approved',
      message: 'Flood Control Management System allocation has been approved by DBM',
      data: { allocationId: 'alloc-1', amount: 1500000000 },
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      category: 'BUDGET',
      priority: 'HIGH',
    },
    {
      id: '2',
      type: 'INFO',
      title: 'Blockchain Verification Complete',
      message: 'All blockchain transactions have been verified successfully',
      data: { verifiedCount: 25, failedCount: 0 },
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: false,
      category: 'BLOCKCHAIN',
      priority: 'MEDIUM',
    },
    {
      id: '3',
      type: 'WARNING',
      title: 'Delayed Fund Release',
      message: 'Health Facility Enhancement Program release is 3 days behind schedule',
      data: { releaseId: 'release-2', delay: 3 },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: true,
      category: 'BUDGET',
      priority: 'MEDIUM',
    },
    {
      id: '4',
      type: 'ERROR',
      title: 'Document Upload Failed',
      message: 'Failed to upload contract document for Marikina River project',
      data: { documentId: 'doc-1', error: 'IPFS upload timeout' },
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      read: false,
      category: 'SYSTEM',
      priority: 'HIGH',
    },
    {
      id: '5',
      type: 'SUCCESS',
      title: 'Expenditure Verified',
      message: 'Construction expenditure for ABC Construction has been verified and recorded',
      data: { expenditureId: 'exp-1', amount: 25000000 },
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: true,
      category: 'COMPLIANCE',
      priority: 'LOW',
    },
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    updateUnreadCount(mockNotifications);
  }, []);

  const updateUnreadCount = (notifs: Notification[]) => {
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    updateUnreadCount(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    updateUnreadCount(updated);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'ERROR':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'INFO':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-50 border-green-200';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200';
      case 'ERROR':
        return 'bg-red-50 border-red-200';
      case 'INFO':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BUDGET':
        return '💰';
      case 'BLOCKCHAIN':
        return '⛓️';
      case 'SYSTEM':
        return '🖥️';
      case 'SECURITY':
        return '🔒';
      case 'COMPLIANCE':
        return '✅';
      default:
        return '📢';
    }
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

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'read' && notification.read) || 
      (filter === 'unread' && !notification.read);
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    return matchesFilter && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        {/* Notification Dropdown */}
        {isOpen && (
          <Card className="absolute right-0 top-full mt-2 w-96 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      className="w-full pl-10 pr-3 py-1 text-sm border rounded-md"
                    />
                  </div>
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-sm border rounded-md px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-sm border rounded-md px-2 py-1"
                >
                  <option value="all">All Categories</option>
                  <option value="BUDGET">Budget</option>
                  <option value="BLOCKCHAIN">Blockchain</option>
                  <option value="SYSTEM">System</option>
                  <option value="SECURITY">Security</option>
                  <option value="COMPLIANCE">Compliance</option>
                </select>
              </div>
            </CardHeader>
            
            <CardContent className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      } ${getNotificationColor(notification.type)}`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        onNotificationClick?.(notification);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(notification.category)}</span>
                            <Badge className={getPriorityColor(notification.priority)} variant="outline">
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Budget approvals</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Blockchain verifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">System alerts</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Compliance issues</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">High priority alerts</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Real-time updates</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Daily summaries</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Notification Frequency</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Immediate</Button>
                <Button variant="outline" size="sm">Hourly</Button>
                <Button variant="outline" size="sm">Daily</Button>
                <Button variant="outline" size="sm">Weekly</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription>
          <strong>Notification System:</strong> Real-time notifications are delivered through WebSocket connections 
          and email. Critical alerts are sent immediately, while regular updates are batched for optimal performance. 
          All notifications are logged for audit purposes.
        </AlertDescription>
      </Alert>
    </div>
  );
}