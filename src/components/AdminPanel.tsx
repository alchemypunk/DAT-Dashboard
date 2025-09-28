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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center space-x-2"><Wrench className="h-6 w-6" /> <span className="dark:text-gray-100">管理后台 (Admin Panel)</span></h1>
          <p className="text-muted-foreground">Manage data, users, and global settings.</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 dark:bg-card dark:border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2"><Database className="h-5 w-5" /> <span>数据管理</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">审批、编辑或删除用户提交的公司资产和新闻数据。</p>
            <Separator className="my-2" />
            <Button variant="secondary" className="w-full dark:bg-secondary/50 dark:hover:bg-secondary">审查待处理提交 (5)</Button>
            <Button variant="secondary" className="w-full dark:bg-secondary/50 dark:hover:bg-secondary">编辑现有公司数据</Button>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1 dark:bg-card dark:border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2"><User className="h-5 w-5" /> <span>用户控制</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">管理用户账户和角色（访客、注册用户、管理员）。</p>
            <Separator className="my-2" />
            <Button variant="secondary" className="w-full dark:bg-secondary/50 dark:hover:bg-secondary">查看所有用户</Button>
            <Button variant="secondary" className="w-full dark:bg-secondary/50 dark:hover:bg-secondary">设置权限等级</Button>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1 dark:bg-card dark:border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2"><AlertTriangle className="h-5 w-5" /> <span>系统配置</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">更新加密货币列表、市场状态和全局设置。</p>
            <Separator className="my-2" />
            <Button variant="secondary" className="w-full dark:bg-secondary/50 dark:hover:bg-secondary">编辑资产列表</Button>
            <Button variant="secondary" className="w-full dark:bg-secondary/50 dark:hover:bg-secondary">清空缓存/重建索引</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}