import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Search, Filter, Eye, Download } from "lucide-react";

interface Claim {
  id: string;
  patientName: string;
  claimType: string;
  status: 'pending' | 'approved' | 'rejected';
  dateFiled: string;
  amount: number;
}

const mockClaims: Claim[] = [
  { id: 'CLM-001', patientName: 'Sarah Johnson', claimType: 'Pre-Authorization', status: 'pending', dateFiled: '2024-01-15', amount: 2500 },
  { id: 'CLM-002', patientName: 'Michael Chen', claimType: 'Reimbursement', status: 'approved', dateFiled: '2024-01-14', amount: 1800 },
  { id: 'CLM-003', patientName: 'Emily Davis', claimType: 'Pre-Authorization', status: 'rejected', dateFiled: '2024-01-13', amount: 3200 },
  { id: 'CLM-004', patientName: 'Robert Wilson', claimType: 'Reimbursement', status: 'approved', dateFiled: '2024-01-12', amount: 950 },
  { id: 'CLM-005', patientName: 'Lisa Anderson', claimType: 'Pre-Authorization', status: 'pending', dateFiled: '2024-01-11', amount: 4100 },
];

export function ClaimsDashboard({ onViewClaim }: { onViewClaim: (claimId: string) => void }) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClaims = mockClaims.filter(claim => {
    const matchesTab = activeTab === 'all' || claim.status === activeTab;
    const matchesSearch = claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalClaims = mockClaims.length;
  const pendingClaims = mockClaims.filter(c => c.status === 'pending').length;
  const approvedClaims = mockClaims.filter(c => c.status === 'approved').length;
  const rejectedClaims = mockClaims.filter(c => c.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">{totalClaims}</div>
            <p className="text-sm text-slate-600 mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-yellow-600">{pendingClaims}</div>
            <p className="text-sm text-slate-600 mt-1">Under review</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">{approvedClaims}</div>
            <p className="text-sm text-slate-600 mt-1">Processing payment</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">{rejectedClaims}</div>
            <p className="text-sm text-slate-600 mt-1">Requires action</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <CardHeader className="border-b border-slate-100">
          {/* Tab Navigation */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'All Claims' },
                { key: 'pending', label: 'Pending' },
                { key: 'approved', label: 'Approved' },
                { key: 'rejected', label: 'Rejected' },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.key 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Claim Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-auth">Pre-Authorization</SelectItem>
                  <SelectItem value="reimbursement">Reimbursement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
                <TableHead className="font-medium text-slate-700 py-4 px-6">Claim ID</TableHead>
                <TableHead className="font-medium text-slate-700 py-4 px-6">Patient Name</TableHead>
                <TableHead className="font-medium text-slate-700 py-4 px-6">Claim Type</TableHead>
                <TableHead className="font-medium text-slate-700 py-4 px-6">Status</TableHead>
                <TableHead className="font-medium text-slate-700 py-4 px-6">Date Filed</TableHead>
                <TableHead className="font-medium text-slate-700 py-4 px-6">Amount</TableHead>
                <TableHead className="font-medium text-slate-700 py-4 px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <TableCell className="py-4 px-6 font-medium text-blue-600">{claim.id}</TableCell>
                  <TableCell className="py-4 px-6">{claim.patientName}</TableCell>
                  <TableCell className="py-4 px-6">{claim.claimType}</TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge className={`${getStatusBadge(claim.status)} border font-medium`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-slate-600">{claim.dateFiled}</TableCell>
                  <TableCell className="py-4 px-6 font-medium">${claim.amount.toLocaleString()}</TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onViewClaim(claim.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Showing {filteredClaims.length} of {totalClaims} claims
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}