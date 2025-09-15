'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { 
  User, 
  Building2, 
  Shield, 
  LogOut, 
  Settings,
  Bell
} from 'lucide-react';

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { user, logout, hasPermission } = useAuth();

  if (!user) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'DBM_ADMIN':
        return <Shield className="h-4 w-4" />;
      case 'COA_AUDITOR':
        return <Shield className="h-4 w-4" />;
      case 'AGENCY_HEAD':
        return <Building2 className="h-4 w-4" />;
      case 'SYSTEM_ADMIN':
        return <Settings className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'DBM_ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'COA_AUDITOR':
        return 'bg-green-100 text-green-800';
      case 'AGENCY_HEAD':
        return 'bg-purple-100 text-purple-800';
      case 'SYSTEM_ADMIN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'DBM_ADMIN':
        return 'DBM Administrator';
      case 'COA_AUDITOR':
        return 'COA Auditor';
      case 'AGENCY_HEAD':
        return 'Agency Head';
      case 'SYSTEM_ADMIN':
        return 'System Administrator';
      case 'STAFF':
        return 'Staff';
      case 'PUBLIC':
        return 'Public';
      default:
        return role;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-8 w-8 rounded-full ${className}`}>
          <div className="flex items-center justify-center h-full w-full rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="flex items-center gap-2 px-2 py-1.5">
          {getRoleIcon(user.role)}
          <Badge className={getRoleColor(user.role)} variant="outline">
            {getRoleLabel(user.role)}
          </Badge>
        </div>
        
        {user.agency && (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">{user.agency.name}</div>
              <div className="text-muted-foreground">{user.agency.acronym}</div>
            </div>
          </div>
        )}
        
        <DropdownMenuSeparator />
        
        {hasPermission('view_all_transactions') && (
          <DropdownMenuItem>
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Panel</span>
          </DropdownMenuItem>
        )}
        
        {hasPermission('export_reports') && (
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem>
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}