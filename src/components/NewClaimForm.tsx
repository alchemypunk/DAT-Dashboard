import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
// Removed Calendar and Popover imports to avoid timeout issues
import { CalendarIcon, Upload, X, FileText, Save, Send } from "lucide-react";
import { cn } from "./ui/utils";

interface NewClaimFormProps {
  onShowPreAuth: () => void;
  onBack: () => void;
}

export function NewClaimForm({ onShowPreAuth, onBack }: NewClaimFormProps) {
  const [formData, setFormData] = useState({
    // Patient Details
    patientName: '',
    age: '',
    gender: '',
    insuranceId: '',
    // Treatment Details  
    treatmentDate: '',
    diagnosis: '',
    hospitalName: '',
    // Claim Type
    claimType: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleSubmit = (isDraft: boolean = false) => {
    if (formData.claimType === 'pre-authorization') {
      onShowPreAuth();
    } else {
      // Handle reimbursement submission
      alert(isDraft ? 'Claim saved as draft!' : 'Claim submitted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">File New Claim</h2>
          <p className="text-slate-600 mt-1">Complete all sections to submit your claim</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← Back to Dashboard
        </Button>
      </div>

      <form className="space-y-6">
        {/* Section 1: Patient Details */}
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Patient Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full Name *</Label>
                <Input 
                  id="patientName"
                  placeholder="Enter patient's full name"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input 
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceId">Insurance ID *</Label>
                <Input 
                  id="insuranceId"
                  placeholder="Enter insurance ID"
                  value={formData.insuranceId}
                  onChange={(e) => handleInputChange('insuranceId', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Treatment Details */}
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Treatment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="treatmentDate">Treatment Date *</Label>
                <Input 
                  id="treatmentDate"
                  type="date"
                  value={formData.treatmentDate}
                  onChange={(e) => handleInputChange('treatmentDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital/Clinic Name *</Label>
                <Input 
                  id="hospitalName"
                  placeholder="Enter hospital or clinic name"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea 
                id="diagnosis"
                placeholder="Enter diagnosis details"
                rows={3}
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Claim Type */}
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Claim Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={formData.claimType} 
              onValueChange={(value) => handleInputChange('claimType', value)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg">
                <RadioGroupItem value="pre-authorization" id="pre-auth" className="mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="pre-auth" className="cursor-pointer">
                    Pre-Authorization
                  </Label>
                  <p className="text-sm text-slate-600">
                    Request approval for planned medical treatment before it occurs
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg">
                <RadioGroupItem value="reimbursement" id="reimbursement" className="mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="reimbursement" className="cursor-pointer">
                    Reimbursement
                  </Label>
                  <p className="text-sm text-slate-600">
                    Request payment for medical expenses already incurred
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Section 4: File Upload */}
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Supporting Documents</CardTitle>
            <p className="text-sm text-slate-600">Upload medical reports, bills, prescriptions, and other relevant documents</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-slate-300 hover:border-slate-400"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-slate-700">
                  Drag and drop files here
                </p>
                <p className="text-sm text-slate-500">
                  or click to browse from your computer
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="mt-4"
                >
                  Browse Files
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
              </p>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-700">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">{file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => handleSubmit(true)}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save as Draft</span>
          </Button>
          
          <Button 
            type="button"
            onClick={() => handleSubmit(false)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            disabled={!formData.patientName || !formData.claimType}
          >
            <Send className="h-4 w-4" />
            <span>Submit Claim</span>
          </Button>
        </div>
      </form>
    </div>
  );
}