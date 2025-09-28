import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Newspaper, Send, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

const mockNews = [
    { id: 1, title: "MicroStrategy Acquires Additional 3,000 BTC", date: "2024-09-28", source: "Press Release", impact: "高", category: "持仓" },
    { id: 2, title: "Bitcoin Mining Hash Rate Hits New All-Time High", date: "2024-09-27", source: "CoinDesk", impact: "中", category: "市场" },
    { id: 3, title: "Block Inc. to integrate Lightning Network payments in Q4", date: "2024-09-26", source: "SEC Filing", impact: "高", category: "技术" },
    { id: 4, title: "South Korean regulators hint at crypto treasury clarity", date: "2024-09-25", source: "The Korea Herald", impact: "低", category: "监管" }
];

export function NewsFeed({ onShowSubmit }: { onShowSubmit: () => void }) {
  return (
    <Card className="dark:bg-card dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2 text-lg dark:text-gray-100">
            <Newspaper className="w-5 h-5" /> 
            <span>新闻快讯 & 更新</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onShowSubmit} className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary-foreground">
            <Send className="w-4 h-4 mr-1" />
            提交新闻
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockNews.map(news => (
            <div key={news.id} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3 last:border-b-0 last:pb-0">
                <div className="flex-1 space-y-1 pr-4">
                    <p className="font-medium text-slate-900 dark:text-gray-100 leading-snug">{news.title}</p>
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">{news.category}</Badge>
                        <Badge 
                            variant={news.impact === '高' ? 'default' : news.impact === '中' ? 'secondary' : 'outline'}
                            className="text-xs"
                        >
                            影响: {news.impact}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {news.date}
                        </span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" target="_blank">
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                    </a>
                </Button>
            </div>
        ))}
        {mockNews.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No recent news updates found.</p>
        )}
      </CardContent>
    </Card>
  );
}