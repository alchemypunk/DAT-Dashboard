import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowLeft, Download, FileText, Calendar, User, MapPin, DollarSign, Clock, CheckCircle2 } from "lucide-react";

interface ClaimDetailsProps {
  claimId: string;
  onBack: () => void;
}

// Mock claim data - in a real app this would be fetched based on claimId
const mockClaimDetails = {
  id: 'CLM-001',
  status: 'approved',
  patientName: 'Sarah Johnson',
  age: 32,
  gender: 'Female',
  insuranceId: 'INS-789456123',
  dateFiled: '2024-01-15',
  dateApproved: '2024-01-17',
  claimType: 'Pre-Authorization',
  treatmentDate: '2024-01-20',
  diagnosis: 'Arthroscopic knee surgery for meniscal tear',
  hospitalName: 'St. Mary\'s Medical Center',
  hospitalAddress: '1234 Health St, Medical City, MC 12345',
  doctorName: 'Dr. Michael Rodriguez',
  doctorRegistration: 'MR987654321',
  specialization: 'Orthopedic Surgery',
  estimatedCost: 2500,
  approvedAmount: 2250,
  diagnosisNotes: [
    'ICD-10: M23.201 - Derangement of unspecified meniscus due to old tear',
    'Patient experiencing pain and limited mobility',
    'Conservative treatment unsuccessful',
    'Surgical intervention recommended'
  ],
  documents: [
    { name: 'MRI Scan Results.pdf', uploadDate: '2024-01-15', size: '2.3 MB' },
    { name: 'Doctor Consultation Report.pdf', uploadDate: '2024-01-15', size: '1.1 MB' },
    { name: 'Treatment Plan.pdf', uploadDate: '2024-01-15', size: '856 KB' },
    { name: 'Patient X-ray.jpg', uploadDate: '2024-01-14', size: '1.8 MB' }
  ],
  statusHistory: [
    { status: 'Filed', date: '2024-01-15 10:30 AM', description: 'Claim submitted successfully' },
    { status: 'Under Review', date: '2024-01-16 02:15 PM', description: 'Medical team review initiated' },
    { status: 'Additional Info Requested', date: '2024-01-16 04:45 PM', description: 'Requested additional MRI scan' },
    { status: 'Under Review', date: '2024-01-17 09:00 AM', description: 'Review resumed with additional documentation' },
    { status: 'Approved', date: '2024-01-17 03:30 PM', description: 'Pre-authorization approved for $2,250' }
  ]
};

export function ClaimDetails({ claimId, onBack }: ClaimDetailsProps) {
  const claim = mockClaimDetails;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Claim {claim.id}</h2>
            <p className="text-slate-600 mt-1">Detailed claim information and status</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={`${getStatusColor(claim.status)} border font-medium px-3 py-1`}>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
          </Badge>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Overview */}
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Claim Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Claim Type</p>
                  <p className="font-medium text-slate-900">{claim.claimType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Date Filed</p>
                  <p className="font-medium text-slate-900">{new Date(claim.dateFiled).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Estimated Cost</p>
                  <p className="text-lg font-semibold text-slate-900">${claim.estimatedCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Approved Amount</p>
                  <p className="text-lg font-semibold text-green-600">${claim.approvedAmount.toLocaleString()}</p>
                </div>
              </div>

              {claim.status === 'approved' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Pre-Authorization Approved</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your pre-authorization has been approved for ${claim.approvedAmount.toLocaleString()}. 
                        You can now proceed with the treatment.
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Approved on: {new Date(claim.dateApproved!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Full Name</p>
                    <p className="font-medium text-slate-900">{claim.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Age</p>
                    <p className="font-medium text-slate-900">{claim.age} years</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Gender</p>
                    <p className="font-medium text-slate-900">{claim.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Insurance ID</p>
                    <p className="font-medium text-slate-900">{claim.insuranceId}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Information */}
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Treatment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Treatment Date</p>
                <p className="font-medium text-slate-900">{new Date(claim.treatmentDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Diagnosis</p>
                <p className="font-medium text-slate-900">{claim.diagnosis}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-slate-600">Hospital/Clinic</p>
                <p className="font-medium text-slate-900">{claim.hospitalName}</p>
                <p className="text-sm text-slate-500 mt-1 flex items-start space-x-1">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{claim.hospitalAddress}</span>
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-slate-600">Attending Doctor</p>
                <p className="font-medium text-slate-900">{claim.doctorName}</p>
                <p className="text-sm text-slate-500">
                  {claim.specialization} • Registration: {claim.doctorRegistration}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis Notes */}
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Diagnosis Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {claim.diagnosisNotes.map((note, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-700">{note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {claim.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-slate-700">{doc.name}</p>
                        <p className="text-sm text-slate-500">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Status History */}
        <div className="lg:col-span-1">
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Status History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claim.statusHistory.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                      index === 0 ? 'bg-green-500' : 'bg-slate-300'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{entry.status}</p>
                      <p className="text-sm text-slate-600">{entry.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{entry.date}</p>
                      {index < claim.statusHistory.length - 1 && (
                        <div className="w-px h-4 bg-slate-200 ml-1.5 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}