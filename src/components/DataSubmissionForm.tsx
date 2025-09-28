import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function DataSubmissionForm({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [submissionType, setSubmissionType] = useState('holding');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    // 模拟 API 提交和延迟
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(`您的${submissionType === 'holding' ? '资产持有更新' : '新闻快讯'}已提交成功，等待管理员审核。`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center space-x-2"><Send className="h-6 w-6" /> <span className="dark:text-gray-100">{t('nav.submitData')}</span></h1>
          <p className="text-muted-foreground">Contribute new or updated treasury data to the dashboard.</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('nav.backToDashboard')}
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 text-green-800 dark:text-green-400 rounded-xl">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submission Type Selector */}
        <Card className="dark:bg-card dark:border-border">
          <CardHeader>
            <CardTitle className="text-lg">提交类型</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={submissionType} onValueChange={setSubmissionType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select submission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="holding">公司资产持有更新</SelectItem>
                <SelectItem value="news">新闻快讯/市场更新</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Dynamic Form Content */}
        {submissionType === 'holding' ? (
          <Card className="dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="text-lg">资产持有更新详情</CardTitle>
              <p className="text-sm text-muted-foreground">请提供数据来源链接和最新的资产持有数据。</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">公司股票代码/名称 *</Label>
                  <Input id="company" required placeholder="例如：MSTR 或 MicroStrategy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset">资产 (代币) *</Label>
                  <Select name="asset" defaultValue="BTC">
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">新资产持有量 *</Label>
                <Input id="amount" type="number" required placeholder="例如：158,245" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">来源/官方公告链接 *</Label>
                <Input id="source" type="url" required placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2"><MessageSquare className="h-5 w-5" /> <span>新闻快讯提交</span></CardTitle>
              <p className="text-sm text-muted-foreground">提交简短新闻快讯，以便展示。</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newsTitle">新闻标题 *</Label>
                <Input id="newsTitle" required placeholder="例如：MicroStrategy 再次购买 3,000 BTC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsSource">来源链接 *</Label>
                <Input id="newsSource" type="url" required placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsSummary">简短摘要 *</Label>
                <Textarea id="newsSummary" rows={3} required placeholder="简要概括新闻内容..." />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex justify-end">
          <Button 
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? '正在提交...' : (
              <>
                <Send className="h-4 w-4" />
                <span>提交审核</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}