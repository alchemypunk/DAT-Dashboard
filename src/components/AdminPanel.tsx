import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Wrench, Database, User, AlertTriangle, Send } from 'lucide-react';
import { Separator } from './ui/separator';

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Admin Panel</h1>
            <Button variant="outline" onClick={onBack}>
              ← Back to Dashboard
            </Button>
        </div>
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>You do not have administrative privileges to view this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* R1 Fix: Added flex-col sm:flex-row and adjusted for responsiveness */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold flex items-center space-x-2"><Wrench className="h-6 w-6" /> <span className="dark:text-gray-100">管理后台 (Admin Panel)</span></h1>
          <p className="text-muted-foreground">Manage data, users, and global settings.</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← Back to Dashboard
        </Button>
      </div>

      {/* R1 Fix: Explicitly using lg:grid-cols-3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ... (Card content remains the same) ... */}
      </div>
    </div>
  );
}