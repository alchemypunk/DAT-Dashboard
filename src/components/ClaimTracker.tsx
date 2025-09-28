import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Search, Download, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ClaimTrackerProps {
  onViewClaim: (claimId: string) => void;
  onBack: () => void;
}

interface ClaimStatus {
  id: string;
  patientName: string;
  claimType: string;
  status: 'filed' | 'under-review' | 'approved' | 'rejected';
  dateFiled: string;
  amount: number;
  estimatedCompletionDate?: string;
  lastUpdated: string;
}

const mockTrackingClaims: ClaimStatus[] = [
  {
    id: 'CLM-001',
    patientName: 'Sarah Johnson',
    claimType: 'Pre-Authorization',
    status: 'under-review',
    dateFiled: '2024-01-15',
    amount: 2500,
    estimatedCompletionDate: '2024-01-18',
    lastUpdated: '2024-01-16'
  },
  {
    id: 'CLM-002',
    patientName: 'Michael Chen',
    claimType: 'Reimbursement',
    status: 'approved',
    dateFiled: '2024-01-14',
    amount: 1800,
    lastUpdated: '2024-01-16'
  },
  {
    id: 'CLM-005',
    patientName: 'Lisa Anderson',
    claimType: 'Pre-Authorization',
    status: 'filed',
    dateFiled: '2024-01-11',
    amount: 4100,
    estimatedCompletionDate: '2024-01-14',
    lastUpdated: '2024-01-11'
  },
];

export function ClaimTracker({ onViewClaim, onBack }: ClaimTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<ClaimStatus | null>(mockTrackingClaims[0]);

  const filteredClaims = mockTrackingClaims.filter(claim => 
    claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string, isActive: boolean = false) => {
    const iconProps = { className: `h-5 w-5 ${isActive ? 'text-current' : 'text-gray-400'}` };
    
    switch (status) {
      case 'filed': return <FileText {...iconProps} />;
      case 'under-review': return <Clock {...iconProps} />;
      case 'approved': return <CheckCircle {...iconProps} />;
      case 'rejected': return <XCircle {...iconProps} />;
      default: return <AlertCircle {...iconProps} />;
    }
  };

  const getStepperData = (claim: ClaimStatus) => {
    const steps = [
      {
        id: 'filed',
        title: 'Filed',
        description: 'Claim submitted successfully',
        date: claim.dateFiled,
        status: 'completed'
      },
      {
        id: 'under-review',
        title: 'Under Review',
        description: 'Medical team is reviewing your claim',
        date: claim.status === 'under-review' || claim.status === 'approved' || claim.status === 'rejected' ? claim.lastUpdated : undefined,
        status: claim.status === 'filed' ? 'pending' : claim.status === 'under-review' ? 'active' : 'completed'
      },
      {
        id: 'decision',
        title: claim.status === 'approved' ? 'Approved' : claim.status === 'rejected' ? 'Rejected' : 'Decision Pending',
        description: claim.status === 'approved' ? 'Claim approved, processing payment' : 
                    claim.status === 'rejected' ? 'Claim rejected, review required' : 
                    'Awaiting final decision',
        date: claim.status === 'approved' || claim.status === 'rejected' ? claim.lastUpdated : undefined,
        status: claim.status === 'approved' ? 'completed' : 
                claim.status === 'rejected' ? 'error' : 
                claim.status === 'under-review' ? 'pending' : 'pending'
      }
    ];
    
    return steps;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Claim Tracker</h2>
          <p className="text-slate-600 mt-1">Track the status of your submitted claims</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims List */}
        <div className="lg:col-span-1">
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Your Claims</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              {filteredClaims.map((claim) => (
                <div 
                  key={claim.id} 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedClaim?.id === claim.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedClaim(claim)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-blue-600">{claim.id}</span>
                        <Badge className={`${getStatusColor(claim.status)} border font-medium text-xs`}>
                          {claim.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                      <p className="font-medium text-slate-900">{claim.patientName}</p>
                      <p className="text-sm text-slate-600">{claim.claimType}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Filed: {new Date(claim.dateFiled).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">${claim.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Claim Details and Status */}
        <div className="lg:col-span-2 space-y-6">
          {selectedClaim && (
            <>
              {/* Claim Summary */}
              <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-900">Claim {selectedClaim.id}</CardTitle>
                      <p className="text-slate-600 mt-1">{selectedClaim.patientName} • {selectedClaim.claimType}</p>
                    </div>
                    <Badge className={`${getStatusColor(selectedClaim.status)} border font-medium`}>
                      {selectedClaim.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Claim Amount</p>
                      <p className="text-lg font-semibold text-slate-900">${selectedClaim.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Date Filed</p>
                      <p className="font-medium text-slate-900">{new Date(selectedClaim.dateFiled).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {selectedClaim.estimatedCompletionDate && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Estimated completion: {new Date(selectedClaim.estimatedCompletionDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewClaim(selectedClaim.id)}
                      className="flex items-center space-x-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Status Stepper */}
              <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">Claim Progress</CardTitle>
                  <p className="text-sm text-slate-600">Last updated: {new Date(selectedClaim.lastUpdated).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {getStepperData(selectedClaim).map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-4">
                        {/* Step Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                          step.status === 'active' ? 'bg-blue-500 border-blue-500 text-white' :
                          step.status === 'error' ? 'bg-red-500 border-red-500 text-white' :
                          'bg-white border-slate-300 text-slate-400'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : step.status === 'error' ? (
                            <XCircle className="h-5 w-5" />
                          ) : step.status === 'active' ? (
                            <Clock className="h-5 w-5" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              step.status === 'completed' || step.status === 'active' || step.status === 'error' 
                                ? 'text-slate-900' : 'text-slate-500'
                            }`}>
                              {step.title}
                            </h4>
                            {step.date && (
                              <span className="text-sm text-slate-500">
                                {new Date(step.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${
                            step.status === 'completed' || step.status === 'active' || step.status === 'error' 
                              ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            {step.description}
                          </p>
                          
                          {index < getStepperData(selectedClaim).length - 1 && (
                            <div className={`w-px h-6 ml-4 mt-2 ${
                              step.status === 'completed' ? 'bg-green-300' : 'bg-slate-300'
                            }`}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Medical Report.pdf',
                      'Hospital Bill.pdf',
                      'Prescription.jpg',
                      'Lab Results.pdf'
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="font-medium text-slate-700">{doc}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedClaim.status === 'rejected' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Resubmission Required</h5>
                      <p className="text-sm text-red-700 mb-3">
                        Additional documentation needed. Please upload the requested documents and resubmit your claim.
                      </p>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Upload Additional Documents
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}